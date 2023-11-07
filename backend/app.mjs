// import { createServer } from "http";
// import express from "express";
// import Datastore from "nedb";

// const PORT = 4000;
// const app = express();

// app.use(express.json());

// const messages = new Datastore({
//   filename: "db/messages.db",
//   autoload: true,
//   timestampData: true,
// });

// const Message = function item(content, author) {
//   this.content = content;
//   this.author = author;
//   this.upvote = 0;
//   this.downvote = 0;
// };

// function getMessage(_id){
//     return new Promise(function(resolve, reject){
//         messages.findOne({ _id}, function (err, message) {
//           if (err) return reject(err);
//           return resolve(message);
//         });
//     })
// }

// function getMessages(page, limit){
//     return new Promise(function(resolve, reject){
//         limit = Math.max(5, limit ? parseInt(limit) : 5);
//         page = page || 0;
//         messages
//           .find({})
//           .sort({ createdAt: -1 })
//           .skip(page * limit)
//           .limit(limit)
//           .exec(function (err, messages) {
//             if (err) return reject(err);
//             return resolve(messages);
//           });
//     })
// }

// function addMessage(content, author){
//     return new Promise(function(resolve, reject){
//         const message = new Message(content, author);
//         messages.insert(message, function (err, message) {
//             if (err) return reject(err);
//             return resolve(message);
//         });
//     })
// }

// function updateMessage(message, action){
//     return new Promise(function(resolve, reject){
//         const update = {};
//         update[action] = 1;
//         messages.update(
//           { _id: message._id },
//           { $inc: update },
//           { multi: false },
//           function (err, num) {
//               if (err) return reject(err);
//               return resolve(message);
//           },
//         );
//     });
// }

// function deleteMessage(_id){
//     return new Promise(function(resolve, reject){
//         messages.remove(
//           { _id},
//           { multi: false },
//           function (err, num) {
//             if (err) return reject(err);
//            resolve(num);
//           },
//         );
//     });
// }

// app.get("/api/messages/", async function(req, res, next){
//     const messages = await getMessages(req.params.page, req.params.limit);
//     return res.json(messages)
// })

// app.post("/api/messages/", async function (req, res, next) {
//     await addMessage(req.body.content, req.body.author);
//     const messages = await getMessages(req.params.page, req.params.limit);
//     return res.json(messages);
// });

// app.patch("/api/messages/:id/", async function (req, res, next) {
//   if (["upvote", "downvote"].indexOf(req.body.action) == -1)
//     return res.status(400).end("unknown action" + req.body.action);
//   const message = await getMessage(req.params.id);
//   if (!message)
//     return res
//       .status(404)
//       .end("Message id #" + req.params.id + " does not exists");
//   await updateMessage(message, req.body.action);
//   const messages = await getMessages(req.params.page, req.params.limit);
//   return res.json(messages);
// });

// app.delete("/api/messages/:id/", async function (req, res, next) {
//     const message = await getMessage(req.params.id);
//     if (!message)
//       return res
//         .status(404)
//         .end("Message id #" + req.params.id + " does not exists");
//     await deleteMessage(req.params.id);
//     const messages = await getMessages(req.params.page, req.params.limit);
//     return res.json(messages);
// });

// app.use(express.static("static"));

// const server = createServer(app).listen(PORT, function (err) {
//   if (err) console.log(err);
//   else console.log("HTTP server on http://localhost:%s", PORT);
// });

import express from "express";
import Mongodb from "mongodb";
import multer from "multer";
import {dbo} from "./db/connection.mjs";

import { createServer } from "http";

const PORT = 4000;
const app = express();

app.use(express.json());

const httpServer = createServer(app).listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log("HTTP server on http://localhost:%s", PORT);
  
    // perform a database connection when server starts
    dbo.connectToServer((err) => {
      if (err) console.error(err);
    });
  });
  