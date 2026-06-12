const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

// Gunakan parser JSON bawaan Express untuk membaca body request.
app.use(express.json());

// Data disimpan di memory agar demo tetap sederhana dan tanpa database.
const users = [];
let nextId = 1;

app.get("/", (req, res) => {
  res.json({
    message: "Express API is running",
    endpoints: [
      "GET /users",
      "POST /users",
      "PUT /users/:id",
      "DELETE /users/:id"
    ]
  });
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Fields 'name' and 'email' are required."
    });
  }

  const newUser = {
    id: nextId++,
    name,
    email
  };

  users.push(newUser);
  return res.status(201).json(newUser);
});

app.put("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const { name, email } = req.body;

  const user = users.find((item) => item.id === userId);

  if (!user) {
    return res.status(404).json({
      message: "User not found."
    });
  }

  // Hanya field yang dikirim yang akan diubah.
  if (name) {
    user.name = name;
  }

  if (email) {
    user.email = email;
  }

  return res.json(user);
});

app.delete("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const userIndex = users.findIndex((item) => item.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found."
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  return res.json({
    message: "User deleted successfully.",
    user: deletedUser
  });
});

function startServer(port = PORT, host = HOST) {
  return app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}

module.exports = {
  app,
  startServer,
  users
};

if (require.main === module) {
  startServer();
}
