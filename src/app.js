require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const weatherRoutes = require("./routes/weather");

const app = express();
const port = 3000;

app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  })
);
app.use("/", weatherRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
