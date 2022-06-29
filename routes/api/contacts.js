const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");
const { validateRequest } = require('../../middlewares/validateRequest');
const { authCheck } = require("../../middlewares");
const { schema, schemaFavorite } = require("../../models/contacts");

const router = express.Router();

router.get("/", authCheck, listContacts);
router.get("/:contactId", authCheck, getContactById);
router.post("/", validateRequest(schema), authCheck, addContact);
router.delete("/:contactId", authCheck, removeContact);
router.put("/:contactId", validateRequest(schema), authCheck, updateContact);
router.patch("/:contactId/favorite", validateRequest(schemaFavorite), authCheck, updateStatusContact);

module.exports = router;