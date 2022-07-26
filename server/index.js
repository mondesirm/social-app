const express = require("express");
const ProductRouter = require("./routes/product");
const UserRouter = require("./routes/user");
const SecurityRouter = require("./routes/security");
const PostRouter = require("./routes/post");
const verifyToken = require("./middlewares/verifyToken");
const app = express();
const logger = require("./lib/logger");
const cors = require("cors")

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const domainsFromEnv = process.env.CORS_DOMAINS || ""

const whitelist = domainsFromEnv.split(",").map(item => item.trim())

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions))
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res, next) => {
  console.log("test");
  res.json({
    title: "coucou",
  });
});

app.use("/", SecurityRouter);

app.use("/api", verifyToken, ProductRouter, UserRouter, PostRouter);

app.listen(process.env.PORT, () => {
  logger.info(`Server started on port ${process.env.PORT}`);
});
