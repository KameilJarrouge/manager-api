import express from "express";
import { prisma } from "../server";
import { decrypt, encrypt } from "../encryption";
const router = express.Router();

router.get("/", async (req, res) => {
  const result = await prisma.diary.findMany({
    take: Number(req.query.take),
    skip: Number(req.query.skip),
  });
  const diary = result.map((item) => {
    return {
      id: item.id,
      entry: decrypt(item.entry),
      createdAt: item.createdAt,
    };
  });
  res.send(diary);
});

router.post("/create", async (req, res) => {
  await prisma.diary.create({
    data: {
      entry: encrypt(req.body.entry),
    },
  });
  res.send({ statusMessage: "Entry Created!" });
});

module.exports = router;
