import {
  getMessages,
  addMessage,
  deleteMessage,
  upvoteMessage,
  downvoteMessage,
} from "../../../frontend/app/api/api.mjs/index.js";

function updateMessages(messages) {
    console.log(messages);
  document.querySelector("#messages").innerHTML = "";
  messages.forEach(function (message) {
    const elmt = document.createElement("div");
    elmt.className = "row message align-items-center";
    elmt.id = "msg" + message.id;
    elmt.innerHTML = `
        <div class="col-1 message-user">
          <img
            class="message-picture"
            src="media/user.png"
            alt="${message.author}"
          />
          <div class="message-username">${message.author}</div>
        </div>
        <div class="col-auto message-content">
          ${message.content}
        </div>
        <div class="col-1 upvote-icon icon">${message.upvote}</div>
        <div class="col-1 downvote-icon icon">${message.downvote}</div>
        <div class="col-1 delete-icon icon"></div>
      `;
    elmt.querySelector(".delete-icon").addEventListener("click", function () {
      deleteMessage(message._id).then(updateMessages)
    });
    elmt.querySelector(".upvote-icon").addEventListener("click", function () {
      upvoteMessage(message._id).then(updateMessages)
    });
    elmt.querySelector(".downvote-icon").addEventListener("click", function () {
      downvoteMessage(message._id).then(updateMessages)
    });
    document.querySelector("#messages").prepend(elmt);
  });
}

getMessages().then(updateMessages);

document
  .querySelector("#create-message-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const author = document.getElementById("post-username").value;
    const content = document.getElementById("post-content").value;
    document.getElementById("create-message-form").reset();
    addMessage(author, content).then(updateMessages)
  });
