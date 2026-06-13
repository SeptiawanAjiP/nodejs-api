module.exports = {
  apps: [
    {
      name: "nodejs-api",
      script: "server.js",
      env: {
        HOST: "0.0.0.0",
        PORT: "3000"
      }
    }
  ]
};
