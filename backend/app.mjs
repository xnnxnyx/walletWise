import express from "express";
import {dbo} from "./connection.mjs";
import User from "./models/User.mjs";
import Budget from "./models/Budget.mjs";
import Expense from "./models/Expense.mjs";
import JA from "./models/JointAccount.mjs";
import UP from "./models/UpcomingPayment.mjs";
import Request from "./models/Request.mjs";
import { getData } from './excel.mjs';
import cron from 'node-cron';
import session from "express-session";
import { parse, serialize } from "cookie";
import { compare, genSalt, hash } from "bcrypt";
import cookieParser from "cookie-parser";
import cors from 'cors';
import { addUser, addBudget, addExpense, addNotif, getNotif, addPayment, getUpcomingPayments, addJA, getAllAccounts, deleteNotification, deleteRequest, getUser, deleteBudget} from "./mongoUtils.mjs";
import { createServer } from "http";
import { updateBudget } from "../frontend/src/api.mjs";

const PORT = 4000;
const app = express();

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("static"));

app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, X-Requested-With, Accept");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(
  session({
    secret: 'changed',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, //false
      secure: false, // Set to true if using HTTPS // false
      sameSite: 'strict' //strict
    },
  })
);

app.use(function (req, res, next) {
  console.log("HTTPS request", req.session.username, req.method, req.url, req.body);
  next();
});

function isAuthenticated(req, res, next) {
  if (!req.session.username) return res.status(401).end("access denied");
  next();
}

// ---------------- User ------------------

app.post("/signup/", async function (req, res, next) {
  try {
    const { username, password, email, monthly_income, picture } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username: username }, { email: email }] });
    console.log("THIS IS EXISITING USER: ", existingUser);
    if (existingUser) {
      // const conflictField = existingUser.username.toLowerCase === username.toLowerCase ? 'Username' : 'Email';
      // const conflictValue = existingUser.username.toLowerCase === username.toLowerCase ? existingUser.username : existingUser.email;
      return res.status(409).json({ error: 'Username / email already in use.' });
    }    

    // Generate a new salt and hash
    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    // Use the addUser function to add the new user
    const savedUser = await addUser(username, email, hashedPassword, monthly_income, picture);

    // Start a session
    req.session.username = savedUser.username;
    req.session.userID = savedUser._id;
    req.session.userType = "UserColl";

    // Initialize cookies
    const cookies = [
      serialize("username", username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
      serialize("userID", savedUser._id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
      serialize("userType", "UserColl", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
    ];

    // Set the "Set-Cookie" header with the array of cookies
    res.setHeader("Set-Cookie", cookies);

    // Return the response
    return res.json({
      username: savedUser.username,
      userID: savedUser._id,
      userType: "UserColl",
    });

    
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/signin/", async function (req, res, next) {
  console.log("req", req.body);
  try {
    const username = req.body.username;
    const password = req.body.password;

    // Check if the user exists
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(401).end("Invalid username or password");
    }

    // Check if the password is correct
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).end("Invalid username or password");
    }


    // Start a session
    req.session.username = username;
    req.session.userID = user._id;
    req.session.userType = "UserColl";

    // Initialize cookies
    const cookies = [
      serialize("username", username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
      serialize("userID", user._id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
      serialize("userType", "UserColl", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
    ];

    // Set the "Set-Cookie" header with the array of cookies
    res.setHeader("Set-Cookie", cookies);

    // Return the response
    return res.json({
      username: user.username,
      userID: user._id,
      userType: "UserColl",
    });


  } catch (error) {
    console.error("Error during signin:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


// app.post("/signout/", function (req, res) {
//   try {
//     // Clear the session
//     req.session.destroy();

//     // Clear the username cookie
//     res.clearCookie("username", { path: "/" });

//     return res.status(200).end("Signed out successfully");
//   } catch (error) {
//     console.error("Error during sign-out:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });


app.get("/signout/", function (req, res, next) {
  try {
    // Clear the session
    req.session.destroy();

    // Clear the cookies
    const cookies = [
      cookie.serialize("username", "", {
        path: "/",
        maxAge: 0, // Set maxAge to 0 to expire the cookie immediately
      }),
      cookie.serialize("userID", "", {
        path: "/",
        maxAge: 0,
      }),
      cookie.serialize("userType", "", {
        path: "/",
        maxAge: 0,
      }),
    ];

    res.setHeader("Set-Cookie", cookies);

    res.redirect("/");
  } catch (error) {
    console.error("Error during sign-out:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/getUserProfile/:userId/type/:userType/", async function (req, res, next){
  try{

    const user = await getUser(userId, userType);
    if (user!=null) {
      return res.status(200).json(user);
    }
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
})

// Create a route for getting all users
app.get("/api/users/", isAuthenticated, async function (req, res, next) {
  try {
    
    const users = await User.find({});
  
    if (users.length === 0) {
      return res.status(404).json({ message: "No users in the db." });
    }
    //console.log("These are the users: ", users);
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/user/:userName/sendRequest", async function (req, res, next) {
  const loggedInUserId = req.session.username;
  const requestedUserId = req.params.userName;
  let existingRequest;
  let existingAccount;
  try {
    existingRequest = await Request.findOne({
      $or: [
        { from: loggedInUserId, to: requestedUserId },
        { from: requestedUserId, to: loggedInUserId },
      ]
    })

    if (existingRequest) {
      return res.status(400).json({error: "Request already sent or received."});
    }

    existingAccount = await JA.findOne({
      $or: [
        { user1: loggedInUserId, user2: requestedUserId },
        { user1: requestedUserId, user2: loggedInUserId },
      ]
    })

    if (existingAccount) {
      return res.status(400).json({error: "Collaborative account already exists."});
    }


    const newRequest = new Request({
      from: loggedInUserId,
      to: requestedUserId,
    });

    // Save the request to the database
    const req = await newRequest.save();

    res.status(201).json(req);
  } catch (error) {
    //console.error("Error creating request:", error);
    res.status(500).json({error:"Error creating request"});
  }
});



app.get("/api/user/:userName/requests/", async function (req, res, next) {
  const userName = req.params.userName;

  try {
    // Find requests where the user is either the sender or receiver
    const allRequests = await Request.find({ $or: [{ from: userName }, { to: userName }] });

    // Create a hashmap to organize the data
    const requestMap = {
      sent: allRequests.filter(request => request.from === userName && request.to !== undefined).map(request => request.to),
      received: allRequests.filter(request => request.to === userName && request.from !== undefined).map(request => request.from),
    };
    res.json(requestMap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// app.delete("/api/user/:userName/requests/:requestId", async function (req, res, next){
//   const userName = req.params.userName;
//   const requestId = req.params.requestId;


app.delete("/api/user/:userName/requests/", async function (req, res, next) {
  const requestee = req.params.userName;
  const username = req.session.username;

  try {
    // Call the deleteRequest function
    const deletedRequest = await deleteRequest(username, requestee);

    if (!deletedRequest) {
      return res.status(404).json({ error: 'Request not found' });
    }

    console.log(`Request deleted successfully: ${deletedRequest}`);

    // You can also send a success response if needed
    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// ---------------- Joint Account ----------------

app.post("/ja/signup/", async function (req, res, next) {
  try {
    const { user_id1, user_id2 } = req.body;

    // Check if a join account with the given pair of user IDs already exists
    const existingJA = await JA.findOne({
      $or: [
        { $and: [{ user1: user_id1 }, { user2: user_id2 }] },
        { $and: [{ user1: user_id2 }, { user2: user_id1 }] },
      ],
    });

    if (existingJA) {
      return res.status(409).end('Join account already exists for these users.');
    } 

    const newJA = await addJA(user_id1, user_id2);
    res.status(201).json(newJA);

    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
});

// app.get("/api/jas/:username/", async function (req, res, next) {
//   const { username } = req.params;
//   try {
//     const accounts = await getAllAccounts(username);
//     return res.json(accounts);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

app.get("/api/jas/:username/", async function (req, res, next) {
  const { username } = req.params;
  console.log("uuuusserer", username);
  try {
    const accounts = await getAllAccounts(username);
    console.log("accounts", accounts);
    
    const usernamePairs = accounts.map(account => [account.user1, account.user2, account._id]);
    console.log("pairs", usernamePairs);
    // if(req.session.userType === "JA"){
    //   usernamePairs.append
    // }
    return res.json(usernamePairs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/api/join/:accountId/", isAuthenticated, function (req, res) {
  try {
    const { accountId } = req.params;
    req.session.userID = accountId;
    req.session.userType = "JA";

    console.log("ACCOUNTID", req.session.userID );

        // Initialize cookies
        const cookies = [
          serialize("username", req.session.username, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          }),
          serialize("userID", accountId, {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          }),
          serialize("userType", "JA", {
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          }),
        ];
    
        // Set the "Set-Cookie" header with the array of cookies
        res.setHeader("Set-Cookie", cookies);

    return res.json({
      username: req.session.username,
      userID: accountId,
      userType: "JA",
    });

  } catch (error) {
    console.error("Error updating user session:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post("/api/user/:username/", isAuthenticated, async function (req, res) {
  const { username } = req.params;

  try {
    // Find the user in the database based on the provided username
    const user = await User.findOne({ username });

    if (!user) {
      // Handle case when user is not found
      return res.status(404).json({ error: 'User not found' });
    }

    // Extract userId from the found user
    const userId = user._id; // Assuming your userId is stored in the _id field

    const cookies = [
      serialize("username", username, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
      serialize("userID", userId, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
      serialize("userType", "UserColl", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }),
    ];

    // Set the "Set-Cookie" header with the array of cookies
    res.setHeader("Set-Cookie", cookies);

    // Return the response
    return res.json({
      username: req.session.username,
      userID: userId,
      userType: "UserColl",
    });
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// when the user accepts the incoming request
// create a joint account
// remove the request from the db 
app.post("/api/user/:requestee/acceptRequest/", isAuthenticated, async function(req, res){
  const { requestee } = req.params;
  const username = req.session.username;
  try{
    const result = await addJA(username, requestee);
    await deleteRequest(username, requestee);

    return res.json(result);

  }catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
})


// ---------------- Budget ----------------
app.post("/api/budget/:userId/:userType/", async function (req, res, next) {
  const { userId, userType } = req.params;
  const { category, amount } = req.body;

  try {
    const result = await addBudget(userId, userType, category, amount);
    return res.json(result);
  } catch (error) {
    console.error("Error adding budget:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/budgets/:userId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const budgets = await Budget.find({ userRef: userId });
  
    if (budgets.length === 0) {
      return res.status(404).json({ message: "No budgets found for the user." });
    }
  
    const formattedBudgets = budgets.map((budget) => ({
      [budget.category]: budget.amount,
        budgetId: budget._id,
    }));
  
    return res.status(200).json(formattedBudgets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  
});

//send("PATCH", "/api/budgets/" + userId + "/" + userType + "/"

app.patch("/api/budgets/:userId/:userType/", async function (req, res, next){
  const { userId, userType } = req.params; 
  const { category, amount } = req.body;

  try {

    const updatedBudget = await Budget.updateOne(
      { userRef: userId, userType: userType, category: category },
      {  $set: { amount: amount}  },
      { new: false }
    ).exec();
    
    if (!updatedBudget) {
      return res.status(404).json({ message: "Budget not found." });
    }
    res.json(updatedBudget);
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }

})

app.delete("/api/budget/:id/", async function (req, res, next) {
  try {
    const id = req.params.id;
    const result = await deleteBudget(id);
    return res.json({ message: "Budget deleted successfully", result });
  } catch (error) {
    console.error("Error deleting budget:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------- Expense ----------------
app.post("/api/expense/:userId/:userType/", async function (req, res, next) {
  const { userId, userType } = req.params;
  const { description, category, amount } = req.body;

  try {
    const result = await addExpense(userId, userType, description, category, amount);
    return res.json(result);
  } catch (error) {
    console.error("Error adding expense:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/expenses/:userId", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const { page, pageSize } = req.query;

    let query = { userRef: userId };

    if (page && pageSize) {
      const skip = (page - 1) * pageSize;
      query = { ...query, skip, limit: parseInt(pageSize) };
    }

    const expenses = await Expense.find(query);

    if (expenses.length === 0) {
      return res.status(200).json({ message: "No expenses found for the user." });
    }

    const formattedExpenses = expenses.map((expense) => ({
      [expense.category]: [expense.amount, expense.description, expense.date]
    }));

    return res.status(200).json(formattedExpenses);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/expensesCategories/:userId", async function (req, res, next) {
  const userId = req.params.userId;
  let query = { userRef: userId };
  try {
    const expenses = await Expense.find(query);
    if (expenses.length === 0) {
      return res.status(200).json({ message: "No expenses found for the user." });
    }

    const categories = [];
    const amounts = [];

    expenses.forEach((expense) => {
      const category = expense.category;
      const amount = expense.amount;

      // Check if the category already exists in the categories array
      const categoryIndex = categories.indexOf(category);

      if (categoryIndex !== -1) {
        // If the category already exists, add the amount to the corresponding amounts array
        amounts[categoryIndex] += amount;
      } else {
        // If the category doesn't exist, push it to the categories array and set the corresponding amount
        categories.push(category);
        amounts.push(amount);
      }
    });

    return res.status(200).json({ categories, amounts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



// ---------------- Notification ----------------

app.post("/api/notif/:userId/:userType/", async function (req, res, next) {
  const { userId, userType } = req.params;
  const { content, category } = req.body;

  try {
    const result = await addNotif(userId, userType, content, category);
    return res.json(result);
  } catch (error) {
    console.error("Error adding notif:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/notifs/:id/", async function (req, res, next) {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const items = await getNotif(req.params.id, page, limit);
    return res.json(items);
  } catch (error) {
    console.error("Error getting notifications:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/api/notifs/:notifId/", async function (req, res, next) {
  try {
    const notifId = req.params.notifId;
    const result = await deleteNotification(notifId);
    return res.json({ message: "Notification deleted successfully", result });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// ---------------- Payment ----------------
app.post("/api/payment/:userId/:userType/", async function (req, res, next) {
  const { userId, userType} = req.params;
  const { frequency, amt, start_date, end_date, category } = req.body;

  try {
    const result = await addPayment(userId, userType, frequency, category, amt, start_date, end_date);
    return res.json(result);
  } catch (error) {
    console.error("Error adding payment:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/upcomingPayments/:userId/", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const items = await getUpcomingPayments(userId);
    return res.json(items);
  }catch (error) {
    console.error("Error getting upcoming payments:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/allEvents/:userId/", async function (req, res, next) {
  try {
    const userId = req.params.userId;
    const events = await UP.find({ userRef: userId });

    if (events.length === 0) {
      return res.status(200).json({ message: "No budgets found for the user." });
    }

    // Group events by frequency
    const groupedEvents = events.reduce((acc, event) => {
      const { start_date, end_date, frequency } = event;

      if (!acc[frequency]) {
        acc[frequency] = [];
      }

      acc[frequency].push([start_date, end_date]);

      return acc;
    }, {});

    // Format the groupedEvents into the desired structure
    const formattedEvents = Object.keys(groupedEvents).map(frequency => ({
      [frequency]: groupedEvents[frequency]
    }));

    return res.status(200).json(formattedEvents);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

cron.schedule('*/10 * * * * *', async () => {
  getData();
});

const httpServer = createServer(app).listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
  
    // perform a database connection when server starts
    dbo.connectToServer((err) => {
      if (err) console.error(err);
    });
  });

  