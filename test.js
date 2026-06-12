const assert = require("assert");
const { startServer, users } = require("./server");

async function runTests() {
  // Reset data in-memory agar hasil test selalu konsisten.
  users.length = 0;

  const server = startServer(0);

  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    const getResponse = await fetch(`${baseUrl}/users`);
    assert.strictEqual(getResponse.status, 200, "GET /users should return 200");

    const initialUsers = await getResponse.json();
    assert.deepStrictEqual(initialUsers, [], "Initial user list should be empty");

    const postResponse = await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Alice",
        email: "alice@example.com"
      })
    });

    assert.strictEqual(postResponse.status, 201, "POST /users should return 201");

    const createdUser = await postResponse.json();
    assert.strictEqual(createdUser.name, "Alice", "Created user should keep name");
    assert.strictEqual(createdUser.email, "alice@example.com", "Created user should keep email");

    const secondGetResponse = await fetch(`${baseUrl}/users`);
    assert.strictEqual(secondGetResponse.status, 200, "Second GET /users should return 200");

    const usersAfterInsert = await secondGetResponse.json();
    assert.strictEqual(usersAfterInsert.length, 1, "User list should contain one item");
    assert.strictEqual(usersAfterInsert[0].id, createdUser.id, "Stored user should match created user");

    console.log("All tests passed.");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });
  }
}

runTests().catch((error) => {
  console.error("Test failed.");
  console.error(error);
  process.exit(1);
});
