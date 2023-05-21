import express from "express";
import moment from "moment";
import { decrypt, encrypt } from "../encryption";
import { prisma } from "../server";
const router = express.Router();

router.get("/", async (req, res) => {
  const emails = await prisma.email.findMany({
    include: { Accounts: true },
    where: {
      OR: [
        { username: { contains: String(req.query.searchKey) } },
        { email: { contains: String(req.query.searchKey) } },
        {
          name: { contains: String(req.query.searchKey) },
        },
      ],
    },
  });
  const result = emails.map((email) => {
    email.password = decrypt(email.password);
    return email;
  });
  res.send(result);
});

router.post("/create", async (req, res) => {
  await prisma.email.create({
    data: {
      email: req.body.email,
      username: req.body.username,
      password: encrypt(req.body.password),
      name: req.body.name,
      createdAt: moment(req.body.createdAt).toDate(),
    },
  });
  res.send({ statusMessage: "Email Created!" });
});
router.post("/:id/create-account", async (req, res) => {
  await prisma.account.create({
    data: {
      website_name: req.body.website_name,
      emailId: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Account Created!" });
});
router.post("/:id/accounts", async (req, res) => {
  const result = await prisma.account.findMany({
    where: { emailId: Number(req.params.id) },
  });
  res.send(result);
});

router.put("/:id/update", async (req, res) => {
  await prisma.email.update({
    data: {
      email: req.body.email,
      username: req.body.username,
      password: encrypt(req.body.password),
      name: req.body.name,
      createdAt: req.body.createdAt,
    },
    where: {
      id: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Email Updated!" });
});
router.delete("/:id/delete", async (req, res) => {
  await prisma.email.delete({
    where: { id: Number(req.params.id) },
  });
  res.send({ statusMessage: "Email Deleted!" });
});

router.get("/:id/", async (req, res) => {
  let result = await prisma.email.findFirst({
    where: { id: Number(req.params.id) },
  });
  if (result) result.password = decrypt(result?.password);
  res.send(result);
});

module.exports = router;
