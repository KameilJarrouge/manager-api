import express from "express";
import { prisma } from "../server";
const router = express.Router();

/**
 * Get all notes with there tags
 * expects query parameters:
 *  tag => single tag for now
 */
router.get("/", async (req, res) => {
  let conditions = {};
  if (req.query.tags) {
    conditions["tags"] = {
      some: {
        tag: {
          in: req.body.tags,
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
    },
  });
  res.send(result);
});

router.get("/tags", async (req, res) => {
  let tags = await prisma.noteTag.findMany({
    distinct: "tag",
  });
  res.send(tags);
});

router.post("/create", async (req, res) => {
  await prisma.note.create({
    data: {
      entry: req.body.entry,
      tags: {
        create: req.body.tags,
      },
    },
  });
  res.send({ statusMessage: "Note Created!" });
});

router.delete("/tags/:id/remove-tag", async (req, res) => {
  await prisma.noteTag.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Tag Removed from Note!" });
});

router.put("/:id/update", async (req, res) => {
  await prisma.note.update({
    data: {
      entry: req.body.entry,
      tags: {
        create: req.body.tags,
      },
    },
    where: {
      id: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Note Updated!" });
});

router.post("/:id/add-tag", async (req, res) => {
  await prisma.noteTag.create({
    data: {
      tag: req.body.tag,
      noteId: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Tag Added to Note!" });
});

router.delete("/:id/delete", async (req, res) => {
  await prisma.note.delete({
    where: {
      id: Number(req.params.id),
    },
  });
  res.send({ statusMessage: "Note Deleted!" });
});

router.get("/:id", async (req, res) => {
  let result = await prisma.note.findFirst({
    include: {
      tags: true,
    },
    where: {
      id: Number(req.params.id),
    },
  });
  res.send(result);
});

module.exports = router;
