export default function applyRouters(app) {
  const userRouter = require("../routes/user");
  app.use("/user", userRouter);

  const emailRouter = require("../routes/email");
  app.use("/emails", emailRouter);
  const accountRouter = require("../routes/account");
  app.use("/accounts", accountRouter);
}
