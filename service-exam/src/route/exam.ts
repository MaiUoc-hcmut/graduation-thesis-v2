const express = require('express');
const router = express.Router();
const examController = require("../app/controllers/examController");

router.get("/:id/all", examController.getAllexamFull);
router.put("/:id", examController.update);
router.delete("/:id", examController.delete);
router.post("/", examController.create);
router.get("/:id", examController.getexam);
router.get("/", examController.getAllexam);

module.exports = router;
