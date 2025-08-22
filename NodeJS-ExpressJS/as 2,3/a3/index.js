import express from "express";
const app = express();
const port = 3000;
//import bodyParser from "body-parser";
app.use(express.json());

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
    name: "shoura",
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

// User end points

// 1- GetAllUsers
app.get("/users", (req, res) => {
  res.json({ success: true, results: { users } });
});

//2- AddUser
app.post("/users", (req, res) => {
  const newUser = req.body;
  users.push(newUser);
  res.json({ success: true, results: { newUser } });
});
// 3- Get all users sorted alphabetically by name
app.get("/users/sort", (req, res) => {
  const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
  res.json(sortedUsers);
});
// 4- delete user
app.delete("/users/:id", (req, res) => {
  users = users.filter((user) => parseInt(req.params.id) != user.id);
  res.json({ success: true, results: { users } });
});
// 5- update user
app.put("/users/:id", (req, res) => {
  const { name, id, email, pass } = req.body;
  const userIndex = users.findIndex(
    (user) => user.id === parseInt(req.params.id)
  );

  users[userIndex].name = name;
  users[userIndex].email = email;
  users[userIndex].pass = pass;
  users[userIndex].id = id;
  res.json({ success: true, results: { users } });
});
// 6- search  user by id
app.get("/users/search", (req, res) => {
  const userID = parseInt(req.query.id);
  const searched = [...users].filter((user) => user.id === userID);
  res.json({ success: true, results: searched });
});

// Post end points
// 1- GetAllPosts
app.get("/posts", (req, res) => {
  res.json({ success: true, results: { posts } });
});
// 2- AddPost
app.post("/posts", (req, res) => {
  const newPost = req.body;
  posts.push(newPost);
  res.json({ success: true, results: { newPost } });
});
// 3- Get all Posts reversed (but don't change the order of the main array)
app.get("/posts/reversed", (req, res) => {
  const reversed = [...posts].reverse();
  res.json({ success: true, results: { reversed } });
});
// 4- delete post
app.delete("/posts/:id", (req, res) => {
  posts = posts.filter((post) => parseInt(req.params.id) != post.id);
  res.json({ success: true, results: { posts } });
});
// 5- update post
app.put("/posts/:id", (req, res) => {
  const { id, text, date, time } = req.body;
  const postIndex = posts.findIndex(
    (post) => post.id === parseInt(req.params.id)
  );

  posts[postIndex].id = id;
  posts[postIndex].text = text;
  posts[postIndex].date = date;
  posts[postIndex].time = time;
  res.json({ success: true, results: { posts } });
});
// 6- search  post by id
app.get("/posts/search", (req, res) => {
  const postID = parseInt(req.query.id);
  const searched = [...posts].filter((post) => post.id === postID);
  res.json({ success: true, results: searched });
});

app.listen(port, () => {
  console.log("server conncted at port ", port);
});
