async function send(method, url, data){
  const x = await fetch(`http://localhost:4000${url}`, {
    method: method,
    credentials: "include",
    headers: { "Content-Type": "application/json"},
    body: (data) ? JSON.stringify(data) : null,
  });
  return await x.json();
}



function sendFiles(method, url, data, callback) {
    const formdata = new FormData();
    Object.keys(data).forEach(function (key) {
      const value = data[key];
      formdata.append(key, value);
    });
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      if (xhr.status !== 200)
        callback("[" + xhr.status + "]" + xhr.responseText, null);
        else callback(null, JSON.parse(xhr.responseText));
      };
      xhr.open(method, url, true);
      xhr.send(formdata);
}

// Function to get username from cookies
export function getUsername() {
  const usernameCookie = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('username='));

  return usernameCookie ? usernameCookie.split('=')[1] : null;
}

// Function to get userID from cookies
export function getUserID() {
  const userIDCookie = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('userID='));

  return userIDCookie ? userIDCookie.split('=')[1] : null;

}

// Function to get userID from cookies
export function getUserType() {
  const userTypeCookie = document.cookie
    .split('; ')
    .find(cookie => cookie.startsWith('userType='));

  return userTypeCookie ? userTypeCookie.split('=')[1] : null;

}

// ------------ Signin/ Singnup -----------------
export function signin(username, password) {
  send("POST", "/signin/", { username, password });
}

export function signout() {
  send("POST", "/signout/");
}

export function signup(username, password, email, callback) {
    send("POST", "/signup/", { username, password , email}, callback);
}

export function joinAccUser(joinAccId, callback){
  send ("POST", "/api/join/" + joinAccId + "/", callback);
}

export function defaultUser(userId, callback){
  send ("POST", "/api/user/" + userId + "/", callback);
}
// ------------------ Users -----------------------
// get all the users in the db 
export function getAllUsers(){
  return send("GET", "/api/users/", null)
};

// send request for creating join account
export function requestJA(username, callback){
  send ("POST", "/api/user/" + username + "/sendRequest/", callback);
}

export function getAllReq(username, callback){
  return send ("GET", "/api/user/" + username + "/requests/", callback);
}

export function deleteReq(username, callback){
  return send ("DELETE", "/api/user/" + username + "/requests/", null);
}

// when a user accepts a request, create joint account
export function acceptReq(requestee, callback){
  send ("POST", "/api/user/" + requestee + "/acceptRequest/", callback);
}

export function getAllJointAccounts(username, callback){
  send("GET", "/api/jas/" + username + "/", function(err, res){
    if (err) return callback(err);
    else return callback(res);
  },
)};

// ------------------ Budget ----------------------
export function addBudget(userId, userType, category, amt, callback) {
    send("POST", "/api/budget/" + userId + "/" + userType + "/", { category: category, amount: amt }, function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    },
  )};

  export function getBudget(userId){
    return send ("GET", "/api/budgets/" + userId + "/", null)
  }

// ----------------- Expense ----------------------
export function addExpense(userId, userType, category, amt, description, callback) {
    send("POST", "/api/expense/" + userId + "/" + userType + "/", { description: description, category: category, amount: amt }, function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    },
  )};


  export function getExpenses(userId){
    return send ("GET", "/api/expenses/" + userId + "/", null)
  }


// ----------------- Notification -----------------
export function addNotif(userId, userType, category, content, callback) {
    send("POST", "/api/notif/" + userId + "/"+ userType + "/", { category: category, content: content}, function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    },
  )};

export function getNotif(id) {
  return send("GET", "/api/notifs/" + id + "/", null);
}

export function deletenotif(id){
  return send("DELETE", "/api/notifs/" + id + "/", null);
};

// ----------------- Upcoming Payment -----------------
export function addPayment(userId, userType, category, amt, start_date, end_date, frequency , callback) {
    send("POST", "/api/payment/" + userId + "/"+ userType + "/", { category: category, amt: amt , start_date: start_date, end_date: end_date, frequency: frequency}, function (err, res) {
      if (err) return callback(err);
      else return callback(res);
    },
  )};

export function getUpcomingPayment(userId, userType) {
  return send("GET", "/api/upcomingPayments/" + userId + "/", null);
}

export function getAllEvents(userId) {
  return send("GET", "/api/allEvents/" + userId + "/", null);
}

