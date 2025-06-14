const mongoose = require("mongoose");
const Chat = require("./models/schema");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

main()
  .then(() => {
    console.log("Successfully connected to DB.");
  })
  .catch(() => {
    console.log("Getting error while connecting to DB.");
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/chat");
}

app.get("/chats", async (req, res) => {
  let chats = await Chat.find();
  // console.log(chats);
  res.render("index.ejs", { chats });
});

//NEW ROUTE
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

//CREATE ROUTE
app.post("/chats", async (req, res) => {
  let { from, msg, to } = req.body;
  let newChat = new Chat({
    from: from,
    msg: msg,
    to: to,
    created_at: new Date(),
  });
  newChat
    .save()
    .then(() => {
      console.log("Chat Saved!");
    })
    .catch((err) => {
      console.log("Error", err);
    });
  res.redirect("/chats");
});

//EDIT ROUTE
app.get("/chats/:id/edit", async (req, res) => {
  let { id } = req.params;
  let data = await Chat.findById(id);
  console.log(data);
  res.render("edit.ejs", { data });
});

//UPDATE ROUTE
app.patch("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let data = await Chat.findById(id);

  let { msg } = req.body;
  let newContent = await Chat.findByIdAndUpdate(
    id,
    { msg },
    { runValidators: true, new: true }
  );
  // console.log(newContent);
  res.redirect("/chats");
});

//DELETE ROUTE
app.delete("/chats/:id", async (req, res) => {
  let { id } = req.params;
  let data = await Chat.findById(id);

  let deletedData = await Chat.findByIdAndDelete(data);
  res.redirect("/chats");
});

app.get("/", (req, res) => {
  res.send("Root is working");
});

app.listen("8080", (req, res) => {
  console.log("App is listening at 8080 port.");
});
