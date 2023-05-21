export default function applyRouters(app) {
  const userRouter = require("../routes/user");
  app.use("/user", userRouter);

  const accountRouter = require("../routes/account");
  app.use("/accounts", accountRouter);

  const noteRouter = require("../routes/note");
  app.use("/notes", noteRouter);

  const diaryRouter = require("../routes/diary");
  app.use("/diary", diaryRouter);

  const trafficRouter = require("../routes/traffic");
  app.use("/traffic", trafficRouter);
}
