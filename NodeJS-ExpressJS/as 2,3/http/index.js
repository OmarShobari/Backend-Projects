const fs = require("fs");
const http = require("http");
const url = require("url");

let users = [
  {
    name: "omar",
    id: 1,
    email: "o@gmail.com",
    pass: "123",
  },
  {
    name: "shoura 😘",
    id: 2,
    email: "s@gmail.com",
    pass: "456",
  },
  {
    name: "mo",
    id: 3,
    email: "m@gmail.com",
    pass: "789",
  },
];
let posts = [
  {
    id: 1,
    text: "يا رب تتجوز يا شورا",
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

// SERVER
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const query = parsedUrl.query;

  // User end points

  if (path === "/users") {
    // 1- GetAllUsers
    if (req.method === "GET") {
      res.end(JSON.stringify(users));
    }
    //2- AddUser
    else if (req.method === "POST") {
      let body;

      req.on("data", (chunk) => {
        body = chunk;
      });

      req.on("end", () => {
        const newUser = JSON.parse(body);

        users.push(newUser);
        res.end(JSON.stringify(newUser));
      });
    }
    // 4- delete user
    else if (req.method === "DELETE") {
      const userId = parseInt(query.id);
      const userIndex = users.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        const deletedUser = users.splice(userIndex, 1);
        res.end(JSON.stringify(deletedUser));
      } else {
        res.end(JSON.stringify({ message: "User not found" }));
      }
    }
    // 5- update user
    else if (req.method === "PUT") {
      let body;

      req.on("data", (chunk) => {
        body = chunk;
      });

      req.on("end", () => {
        const userData = JSON.parse(body);
        const userId = parseInt(userData.id);

        const userIndex = users.findIndex((user) => user.id === userId);

        if (userIndex !== -1) {
          const newId = userData.id;
          const newName = userData.name;
          const newEmail = userData.email;
          const newPass = userData.pass;

          users[userIndex].id = newId;
          users[userIndex].name = newName;
          users[userIndex].email = newEmail;
          users[userIndex].pass = newPass;
          res.end(JSON.stringify(users[userIndex]));
        } else {
          res.end(JSON.stringify({ message: "User not found" }));
        }
      });
    }
  }
  // 3- Get all users sorted alphabetically by name
  else if (path === "/users/sorted") {
    if (req.method === "GET") {
      const sortedUsers = [...users].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      res.end(JSON.stringify(sortedUsers));
    }
  }
  //6- search  user by id
  else if (path === "/users/search") {
    if (req.method === "GET") {
      const userId = parseInt(query.id);

      const user = users.find((user) => user.id === userId);

      if (user) {
        res.end(JSON.stringify(user));
      } else {
        res.end(JSON.stringify({ message: "User not found" }));
      }
    }

    ////////////////////////////////
    // Post end points
  } else if (path === "/posts") {
    // 1- GetAllPosts

    if (req.method === "GET") {
      res.end(JSON.stringify(posts));
    }
    // 2- AddPost
    else if (req.method === "POST") {
      let body;

      req.on("data", (chunk) => {
        body = chunk;
      });

      req.on("end", () => {
        const newPost = JSON.parse(body);
        posts.push(newPost);

        res.end(JSON.stringify(newPost));
      });
    }
    // 4- delete post
    else if (req.method === "DELETE") {
      const postId = parseInt(query.id);
      const deletedPost = posts.find((post) => post.id === postId);

      if (deletedPost) {
        posts = posts.filter((post) => post.id !== postId);
        res.end(JSON.stringify(deletedPost));
      } else {
        res.end(JSON.stringify({ message: "Post not found" }));
      }
    }
    // 5- update post
    else if (req.method === "PUT") {
      let body;

      req.on("data", (chunk) => {
        body = chunk;
      });

      req.on("end", () => {
        const updatedPost = JSON.parse(body);
        const postId = updatedPost.id;
        const existingPost = posts.find((post) => post.id === postId);

        if (existingPost) {
          existingPost.text = updatedPost.text;
          existingPost.date = updatedPost.date;
          existingPost.time = updatedPost.time;
          res.end(JSON.stringify(existingPost));
        } else {
          res.end(JSON.stringify({ message: "Post not found" }));
        }
      });
    }
  }
  //3- Get all Posts reversed
  else if (path === "/posts/reversed") {
    if (req.method === "GET") {
      const reversedPosts = [...posts].reverse();
      res.end(JSON.stringify(reversedPosts));
    }
  }
  // 6- search  post by id
  else if (path === "/posts/search") {
    if (req.method === "GET") {
      const postId = parseInt(query.id);
      const post = posts.find((post) => post.id === postId);

      if (post) {
        res.end(JSON.stringify(post));
      } else {
        res.end(JSON.stringify({ message: "Post not found" }));
      }
    }
  } else {
    res.end("Not found");
  }
});

server.listen(8000, () => {
  console.log("Listening to req on 8000");
});
