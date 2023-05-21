import express from "express";
import { encrypt } from "../encryption";
import { prisma } from "../server";
const router = express.Router();

router.put("/:id/update", async (req, res) => {
  await prisma.account.update({
    data: {
      website_name: req.body.website_name,
    },
    where: {
      id: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Account Updated!" });
});
router.delete("/:id/delete", async (req, res) => {
  await prisma.account.delete({
    where: { id: Number(req.params.id) },
  });
  res.send({ statusMessage: "Account Deleted!" });
});
module.exports = router;
