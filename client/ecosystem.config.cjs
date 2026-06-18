module.exports = {
    apps: [
      {
        name: "dr-sha-alam-client",
        cwd: "/var/www/dr-sha-alam/client",
        script: "npm",
        args: "start",
        env: {
          NODE_ENV: "production",
          PORT: 3000,
        },
      },
    ],
  };
  