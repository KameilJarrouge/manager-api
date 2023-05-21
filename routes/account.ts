import express from "express";
import { prisma } from "../server";
import { encrypt } from "../encryption";
const router = express.Router();

/**
 * Get all accounts with there tags
 * expects query parameters:
 *  tag => single tag for now
 *  searchKey => searching among the main columns
 */
router.get("/", async (req, res) => {
  let conditions = {};
  if (req.query.tag) {
    conditions["tags"] = {
      some: {
        tag: {
          contains: String(req.query.tag),
        },
      },
    };
  }

  let result = await prisma.account.findMany({
    include: {
      tags: true,
    },
    where: {
      ...conditions,
      OR: [
        { username: { contains: String(req.query.searchKey) } },
        { email: { contains: String(req.query.searchKey) } },
        { name: { contains: String(req.query.searchKey) } },
        { phoneNumber: { contains: String(req.query.searchKey) } },
      ],
    },
  });
  res.send(result);
});

router.post("/create", async (req, res) => {
  await prisma.account.create({
    data: {
      username: req.body.username,
      email: req.body.email,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      note: req.body.note,
      password: encrypt(req.body.password),
      createdAt: req.body.createdAt,
      tags: {
        create: req.body.tags,
      },
    },
  });
  res.send({ statusMessage: "Account Created!" });
});

router.delete("/tags/:id/remove-tag", async (req, res) => {
  await prisma.accountTag.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Tag Removed from Account!" });
});

router.put("/:id/update", async (req, res) => {
  await prisma.account.update({
    data: {
      username: req.body.username,
      email: req.body.email,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      note: req.body.note,
      password: encrypt(req.body.password),
      createdAt: req.body.createdAt,
      tags: {
        create: req.body.tags,
      },
    },
    where: {
      id: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Account Updated!" });
});

router.post("/:id/add-tag", async (req, res) => {
  await prisma.accountTag.create({
    data: {
      tag: req.body.tag,
      accountId: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Tag Added to Account!" });
});

router.delete("/:id/delete", async (req, res) => {
  await prisma.account.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Account Deleted!" });
});

router.get("/:id", async (req, res) => {
  let result = await prisma.account.findFirst({
    where: {
      id: Number(req.params.id),
    },
  });
  res.send(result);
});

module.exports = router;
