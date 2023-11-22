import express from "express";
import Mongodb from "mongodb";
import multer from "multer";
import {dbo} from "./connection.mjs";
import Users from "./models/User.mjs";
import Budget from "./models/Budget.mjs";
import Expense from "./models/Expense.mjs";
import Notification from "./models/Notification.mjs";
import UpcomingPayment from "./models/UpcomingPayment.mjs";
import { getData } from './excel.mjs';
import { MongoClient } from "mongodb"
import cron from 'node-cron';
import { rmSync } from "fs";
import session from "express-session";
import { parse, serialize } from "cookie";
import { compare, genSalt, hash } from "bcrypt";


//const upload = multer({ dest: ("uploads") });

import { createServer } from "http";
import User from "./models/User.mjs";

const PORT = 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("static"));
app.use(
  session({
    secret: "changed",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(function (req, res, next) {
  req.username = req.session.username ? req.session.username : null;
  // console.log("This is the reqqqq.session", req.session);
  console.log("HTTPS request", req.username, req.method, req.url, req.body);
  next();
});

function isAuthenticated(req, res, next) {
  if (!req.session.username) return res.status(401).end("access denied");
  next();
}
// ---------------- User ------------------
async function addUser(username, email, password, monthly_income, picture) {
  try {
    const user = new User({
      username: username,
      email: email,
      password: password,
      monthly_income: monthly_income,
      picture: picture
    });

    const result = await user.save();
    return result;
  } catch (error) {
    throw error;
  }
}

app.post("/signup/", async function (req, res, next) {
  try {
    const { username, password, email, monthly_income, picture } = req.body;

    // Check if the username or email already exists
    const existingUser = await Users.findOne({ $or: [{ username: username }, { email: email }] });

    if (existingUser) {
      const conflictField = existingUser.username.toLowerCase === username.toLowerCase ? 'Username' : 'Email';
      const conflictValue = existingUser.username.toLowerCase === username.toLowerCase ? existingUser.username : existingUser.email;
      return res.status(409).end(`${conflictField} '${conflictValue}' already in use.`);
    }    

    // Generate a new salt and hash
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Use the addUser function to add the new user
    const savedUser = await addUser(username, email, hashedPassword, monthly_income, picture);

    // Start a session
    req.session.username = savedUser.username;

    // Initialize cookie
    res.setHeader(
      "Set-Cookie",
      serialize("username", savedUser.username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );
    return res.json(savedUser.username);
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/signin/", async function (req, res, next) {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const user = await Users.findOne({ username: username });

    if (!user) {
      return res.status(401).end("Invalid username or password");
    }

    // Check if the password is correct
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).end("Invalid username or password");
    }

    // Start a session
    req.session.username = user.username;

    // Initialize cookie
    res.setHeader(
      "Set-Cookie",
      serialize("username", user.username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return res.json(user.username);
  } catch (error) {
    console.error("Error during signin:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/signout/", function (req, res) {
  try {
    // Clear the session
    req.session.destroy();

    // Clear the username cookie
    res.clearCookie("username", { path: "/" });

    return res.status(200).end("Signed out successfully");
  } catch (error) {
    console.error("Error during sign-out:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/signout/", function (req, res, next) {
  try {
    // Clear the session
    req.session.destroy();

    // Clear the username cookie
    res.setHeader(
      "Set-Cookie",
      serialize("username", "", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week in number of seconds
      })
    );

    res.redirect("/");
  } catch (error) {
    console.error("Error during sign-out:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------- Budget ----------------

async function addBudget(userId, category, amt) {
  try {
    const budget = new Budget({ user: userId, category, amount: amt });
    const result = await budget.save();
    return result;
  } catch (error) {
    throw error;
  }
}

//curl -X POST -H "Content-Type: application/json" -d '{"category": "Food", "amount": 1000000000}' http://localhost:4000/api/budget/655186ae38a6ded67206d572
app.post("/api/budget/:userId/", async function (req, res, next) {
  const { userId } = req.params;
  const { category, amount } = req.body;

  try {
    const result = await addBudget(userId, category, amount);
    return res.json(result);
  } catch (error) {
    console.error("Error adding budget:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------- Expense ----------------

async function addExpense(userId, description, category, amt) {
  try {
    const expense = new Expense({ user: userId, description: description, category: category, amount: amt });
    const result = await expense.save();
    return result;
  } catch (error) {
    throw error;
  }
}

//curl -X POST -H "Content-Type: application/json" -d '{"category": "Food", "amount": 1000000000, "description":"this is testing!!"}' http://localhost:4000/api/expense/655186ae38a6ded67206d572
app.post("/api/expense/:userId/", async function (req, res, next) {
  const { userId } = req.params;
  const { description, category, amount } = req.body;

  try {
    const result = await addExpense(userId, description, category, amount);
    return res.json(result);
  } catch (error) {
    console.error("Error adding expense:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------- Notification ----------------
async function addNotif(userId, content, category) {
  try {
    const notif = new Notification({ user: userId, content: content, category: category });
    const result = await notif.save();
    return result;
  } catch (error) {
    throw error;
  }
}

//curl -X POST -H "Content-Type: application/json" -d '{"content": "Testing", "category": "Food"}' http://localhost:4000/api/notif/655c69379c60f76c90e03045/
app.post("/api/notif/:userId/", async function (req, res, next) {
  const { userId } = req.params;
  const { content, category } = req.body;

  try {
    const result = await addNotif(userId, content, category);
    return res.json(result);
  } catch (error) {
    console.error("Error adding notif:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------- Payment ----------------
async function addPayment(userId, frequency, category, amount, end_date) {
  try {
    const payment = new UpcomingPayment({ user: userId, frequency: frequency, category: category, amount: amount, end_date: end_date });
    const result = await payment.save();
    return result;
  } catch (error) {
    throw error;
  }
}

//curl -X POST -H "Content-Type: application/json" -d '{"frequency": "monthly", "amt": 100, "end_date": "'"$(date -I)"'", "category": "Food"}' http://localhost:4000/api/payment/655c69379c60f76c90e03045/
app.post("/api/payment/:userId/", async function (req, res, next) {
  const { userId } = req.params;
  const { frequency, amt, end_date, category } = req.body;

  try {
    const result = await addPayment(userId, frequency, category, amt, end_date);
    return res.json(result);
  } catch (error) {
    console.error("Error adding payment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// route to create and insert a new user
// app.post("/createUser", async (req, res) => {
//   try {
//     const { username, email, password, total_amount, monthly_income } = req.body;
//     // Create a new user instance
//     const newUser = new User({
//       username,
//       email,
//       password,
//       total_amount,
//       monthly_income,
//     });

//     // Save the user to the database
//     const savedUser = await newUser.save();

//     console.log("This is the newUser: ", newUser);

//     res.status(201).json(savedUser);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// Route to get all expenses for a specific user
app.get("/expenses/:userId", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    const userId = req.params.userId;
    const expenses = await Expense.find({ user: userId });
    // Create an object with aggregated amounts for each category
    const aggregatedExpenses = expenses.reduce((result, expense) => {
      const { category, amount } = expense;

      // If the category already exists, add the amount; otherwise, create a new entry
      result[category] = (result[category] || 0) + amount;

      return result;
    }, {});

    // Convert the aggregated object into an array of objects with [category_name]: [amount] format
    const formattedExpenses = Object.entries(aggregatedExpenses).map(([category, amount]) => ({
      [category]: amount,
    }));

    res.status(200).json(formattedExpenses);
    //console.log("These are the expences: ", expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

cron.schedule('*/10 * * * * *', async () => {
  getData();
});

app.get("/budgets/:userId", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  try {
    const userId = req.params.userId;
    const budgets = await Budget.find({ user: userId });

    // Create an array of objects with category names and budget assigned
    const formattedBudgets = budgets.map((budget) => ({
      [budget.category]: budget.amount,
    }));

    res.status(200).json(formattedBudgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const httpServer = createServer(app).listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
  
    // perform a database connection when server starts
    dbo.connectToServer((err) => {
      if (err) console.error(err);
    });
  });

  