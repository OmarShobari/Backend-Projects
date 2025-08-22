const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

let users = [
  {
    name: "omar",
    id: 1,
    email: "o@gmail.com",
    pass: "123",
  },
  {
    name: "elwan",
    id: 2,
    email: "e@gmail.com",
    pass: "456",
  },
  {
    name: "may",
    id: 3,
    email: "m@gmail.com",
    pass: "789",
  },
];
let posts = [
  {
    id: 1,
    text: "The sun set behind the mountains, casting a warm golden glow across the tranquil meadow. Birds chirped their evening melodies as the cool breeze whispered through the tall grass. Nature's symphony embraced the peacefulness, inviting serenity into the hearts of those who witnessed its beauty.",
    date: "20/10/2022",
    time: "12:35",
  },
  {
    id: 2,
    text: "In the bustling city streets, people hurriedly went about their daily routines, lost in a sea of faces. Car horns blared, mingling with the chatter of voices and the rhythmic footsteps on the pavement. Amidst the chaos, dreams and aspirations converged, igniting sparks of possibility.",
    date: "1/6/2023",
    time: "01:25",
  },
  {
    id: 3,
    text: "The old bookstore was a treasure trove of forgotten tales, its shelves lined with weathered books bearing the weight of untold stories. Dust particles danced in the sunlight that streamed through the worn-out windows, as if celebrating the magic of literature. Each page turned held the promise of a new adventure.",
    date: "15/11/2022",
    time: "04:05",
  },
];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.json(newUser);
});

app.delete("/users", (req, res) => {
  const userId = parseInt(req.query.id);
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    const deletedUser = users.splice(userIndex, 1);
    res.json(deletedUser);
  } else {
    res.json({ message: "User not found" });
  }
});

app.put("/users", (req, res) => {
  const userData = req.body;
  const userId = parseInt(userData.id);
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    const { id, name, email, pass } = userData;
    users[userIndex] = { id, name, email, pass };
    res.json(users[userIndex]);
  } else {
    res.json({ message: "User not found" });
  }
});

app.get("/users/sorted", (req, res) => {
  const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
  res.json(sortedUsers);
});

app.get("/users/search", (req, res) => {
  const userId = parseInt(req.query.id);
  const user = users.find((user) => user.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.json({ message: "User not found" });
  }
});

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/posts", (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  res.json(newPost);
});

app.delete("/posts", (req, res) => {
  const postId = parseInt(req.query.id);
  const deletedPost = posts.find((post) => post.id === postId);
  if (deletedPost) {
    posts = posts.filter((post) => post.id !== postId);
    res.json(deletedPost);
  } else {
    res.json({ message: "Post not found" });
  }
});

app.put("/posts", (req, res) => {
  const updatedPost = req.body;
  const postId = updatedPost.id;
  const existingPost = posts.find((post) => post.id === postId);
  if (existingPost) {
    existingPost.text = updatedPost.text;
    existingPost.date = updatedPost.date;
    existingPost.time = updatedPost.time;
    res.json(existingPost);
  } else {
    res.json({ message: "Post not found" });
  }
});

app.get("/posts/reversed", (req, res) => {
  const reversedPosts = [...posts].reverse();
  res.json(reversedPosts);
});

app.get("/posts/search", (req, res) => {
  const postId = parseInt(req.query.id);
  const post = posts.find((post) => post.id === postId);
  if (post) {
    res.json(post);
  } else {
    res.json({ message: "Post not found" });
  }
});

app.use((req, res) => {
  res.status(404).send("Not found");
});

app.listen(8000, () => {
  console.log("Listening to req on 8000");
});
