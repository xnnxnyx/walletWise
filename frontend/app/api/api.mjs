function send(method, url, data){
    console.log(method, url, data)
    return fetch(url, {
        method: method,
        headers: {"Content-Type": "application/json"},
        body: (data)? JSON.stringify(data): null,
    })
    .then(x => x.json())
}

export function addMessage(author, content) {
  return send("POST", "/api/messages/", {author, content});
}

export function getMessages(){
    return send("GET", "/api/messages/", null);
};

export function deleteMessage(id) {
  return send("DELETE", `/api/messages/${id}`, null);
}

export function upvoteMessage(id){
    return send("PATCH", `/api/messages/${id}`, {action: "upvote"});
};

export function downvoteMessage(id){
    return send("PATCH", `/api/messages/${id}`, {action: "downvote"});
};