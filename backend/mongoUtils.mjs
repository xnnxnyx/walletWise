import User from "./models/User.mjs";
import Budget from "./models/Budget.mjs";
import Expense from "./models/Expense.mjs";
import Notification from "./models/Notification.mjs";
import UpcomingPayment from "./models/UpcomingPayment.mjs";
import JA from "./models/JointAccount.mjs";
import Request from "./models/Request.mjs";



export async function addUser(username, email, password, monthly_income, picture) {
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

export async function getUser(userId, userType) {
    try {
      const UserModel = (userType === 'UserColl') ? User : JA;
  
      const user = await UserModel.findById(userId);
  
      return user;
    } catch (error) {
      throw error;
    }
  }

export async function addBudget(userId, userType, category, amount) {
    try {
      const user = await getUser(userId, userType);
  
      if (!user) {
        throw new Error("User not found");
      }
  
      const budget = new Budget({
        userRef: userId,
        userType: userType,
        category: category,
        amount: amount,
      });
  
      await budget.save();
  
      return { message: "Budget added successfully" };
    } catch (error) {
      console.error("Error adding budget:", error);
      throw error; // Rethrow the error for the route handler to catch
    }
  }

export async function addExpense(userId, userType, description, category, amt) {
  try {
    const user = await getUser(userId, userType);
  
    if (!user) {
        throw new Error("User not found");
    }
    const expense = new Expense({ userRef: userId, userType: userType, description: description, category: category, amount: amt });
    const result = await expense.save();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function addNotif(userId, userType, content, category) {
  try {
    const user = await getUser(userId, userType);
  
    if (!user) {
        throw new Error("User not found");
    }
    const notif = new Notification({ userRef: userId, userType: userType, content: content, category: category });
    const result = await notif.save();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function addPayment(userId, userType, frequency, category, amount, start_date, end_date) {
  try {
    const user = await getUser(userId, userType);
    if (!user) {
      throw new Error("User not found");
    }
    const payment = new UpcomingPayment({ userRef: userId, userType: userType, frequency: frequency, category: category, amount: amount, start_date: start_date, end_date: end_date });
    const result = await payment.save();
    return result;
  } catch (error) {
    throw error;
  }
}

// export async function addJA(user1, user2) {
//   try {
//     // add into the db
//     const joinAccount = new JA({
//       user1: user1,
//       user2: user2
//     });

//     const result = await joinAccount.save();

//     // remove the request from the db

//     return result;
//   } catch (error) {
//     throw error;
//   }
// }

export async function addJA(user1, user2) {
  try {
    // Check if the combination already exists
    const existingJA = await JA.findOne({ user1, user2 });

    if (existingJA) {
      // Combination already exists, handle accordingly (e.g., update or skip)
      console.log(`Account already exists: ${existingJA}`);
      return existingJA;  // Returning existing document, adjust as needed
    }

    // Combination does not exist, add into the db
    const joinAccount = new JA({
      user1: user1,
      user2: user2,
    });

    const result = await joinAccount.save();

    return result;
  } catch (error) {
    throw error;
  }
}


export async function deleteRequest(fromUser, toUser) {
  try {
    // Find and remove the request from the database
    const deletedRequest = await Request.findOneAndDelete({
      $or: [
        { $and: [{ from: fromUser }, { to: toUser }] },
        { $and: [{ to: fromUser }, { from: toUser }] },
      ],
    });

    return deletedRequest;
  } catch (error) {
    throw error;
  }
}

function calculateNextDueDate(startDate, frequency) {
  const nextDueDate = new Date(startDate);
  const currentDate = new Date();
  const fifteenDaysFromNow = new Date();
  fifteenDaysFromNow.setDate(currentDate.getDate() + 15);

  switch (frequency) {
    case "daily":
      nextDueDate.setDate(nextDueDate.getDate() + 1);
      break;
    case "monthly":
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
      break;
    case "weekly":
      nextDueDate.setDate(nextDueDate.getDate() + 7); // Add 7 days for weekly
      break;
    case "yearly":
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
      break;
  }

  // Check if the calculated nextDueDate is within the specified range
  if (nextDueDate >= currentDate && nextDueDate <= fifteenDaysFromNow) {
    return nextDueDate;
  } else {
    return null;
  }
}

export async function getUpcomingPayments(userId) {
  try {
    const currentDate = new Date();
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(currentDate.getDate() + 15);

    const upcomingPayments = await UpcomingPayment.find({
      userRef: userId,
      $or: [
        {
          // Payments with end date within 15 days
          end_date: { $gte: currentDate, $lte: fifteenDaysFromNow },
        },
        {
          // Payments with frequency-based occurrences within 15 days
          end_date: { $gte: currentDate },
          frequency: { $in: ["daily", "monthly", "weekly", "yearly"] },
        },
      ],
    });

    const formattedUpcomingPayments = [];

    upcomingPayments.forEach(payment => {
      const { frequency, amount, start_date, end_date, category } = payment;

      let nextDueDate = calculateNextDueDate(start_date, frequency);

      while (
        nextDueDate &&
        nextDueDate <= fifteenDaysFromNow &&
        nextDueDate <= new Date(end_date) &&
        (frequency !== 'weekly' || nextDueDate <= fifteenDaysFromNow)
      ) {
        formattedUpcomingPayments.push({
          nextDueDate,
          frequency,
          amount,
          category,
        });

        // Calculate the next due date based on the frequency
        nextDueDate = calculateNextDueDate(nextDueDate, frequency);
      }
    });

    return formattedUpcomingPayments;
  } catch (error) {
    throw error;
  }
}


export async function getNotif(userId, page, limit) {
    limit = Math.max(5, limit ? parseInt(limit) : 5);
    page = page || 0;
  
    try {
      const notifs = await Notification
        .find({ userRef: userId })
        .sort({ createdAt: -1 })
        .skip(page * limit)
        .limit(limit)
        .exec();
        
        console.log("Result:", notifs);
      return notifs;
    } catch (error) {
      throw error;
    }
  }

  export async function getAllAccounts(username) {
    try{
        const accounts = await JA.find({ $or: [{ user1: username }, { user2: username }] })
        const joinAccountIds = accounts.map(account => account._id);
        // also send the user ids
        joinAccountIds.push(userId);
        return joinAccountIds;
    } catch (error) {
        throw error;
    }
  }

  export async function deleteNotification(notificationId) {
    try {
      const result = await Notification.findOneAndDelete({ _id: notificationId });
  
      return result;
    } catch (error) {
      throw error;
    }
  }
  