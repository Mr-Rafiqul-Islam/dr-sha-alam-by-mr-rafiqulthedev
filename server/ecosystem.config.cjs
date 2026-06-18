module.exports = {
    apps: [
      {
        name: "dr-sha-alam-server",
        cwd: "/var/www/dr-sha-alam/server",
        script: "dist/app.js",
        interpreter: "node",
        env: {
          NODE_ENV: "production",
        },
      },
    ],
  };
  