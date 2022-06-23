const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");
const { validateRequest } = require('../../middlewares/validateRequest');
const { schema, schemaFavorite } = require("../../models/contacts");

router.get("/", listContacts);
router.get("/:contactId", getContactById);
router.post("/", validateRequest(schema), addContact);
router.delete("/:contactId", removeContact);
router.put("/:contactId", validateRequest(schema), updateContact);
router.patch("/:contactId/favorite", validateRequest(schemaFavorite), updateStatusContact);

module.exports = router;
