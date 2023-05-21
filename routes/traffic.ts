import express from "express";
import { prisma } from "../server";
const router = express.Router();

router.get("/", async (req, res) => {
  let conditions = {};
  if (req.query.date1 && req.query.date2) {
    conditions["createdAt"] = {
      gte: String(req.query.date1),
      lte: String(req.query.date2),
    };
  } else if (req.query.date1) {
    conditions["createdAt"] = {
      equals: String(req.query.date1),
    };
  } else if (req.query.date2) {
    conditions["createdAt"] = {
      equals: String(req.query.date2),
    };
  } else {
    conditions["createdAt"] = { equals: new Date() };
  }
  const balance = await prisma.balance.findFirst();
  const traffic = await prisma.traffic.findMany({
    where: {
      ...conditions,
    },
  });
  res.send({ balance: balance, traffic: traffic });
});

router.post("/create", async (req, res) => {
  await prisma.traffic.create({
    data: {
      amount: req.body.amount,
      note: req.body.note,
    },
  });
  const balance = await prisma.balance.findFirst();
  await prisma.balance.update({
    data: {
      balance: balance?.balance + req.body.amount,
    },
    where: {
      id: balance?.id,
    },
  });
  res.send({ statusMessage: "Traffic Created!" });
});

router.delete("/:id/delete", async (req, res) => {
  const deletedTraffic = await prisma.traffic.delete({
    where: { id: Number(req.params.id) },
  });
  const balance = await prisma.balance.findFirst();
  await prisma.balance.update({
    data: {
      balance: balance?.balance || 0 - Number(deletedTraffic.amount),
    },
    where: {
      id: balance?.id,
    },
  });
  res.send({ statusMessage: "Traffic Deleted!" });
});

router.get("/calculate-balance", async (req, res) => {
  let result = await prisma.traffic.aggregate({
    _sum: { amount: true },
  });
  const balance = await prisma.balance.findFirst();
  if (balance?.balance || 0 === Number(result._sum)) {
    await prisma.balance.update({
      data: {
        balance: Number(result._sum),
      },
      where: {
        id: balance?.id,
      },
    });
  }
  res.send(result);
});

module.exports = router;
