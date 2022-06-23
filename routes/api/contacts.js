const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (e) {
    next(e);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    res.status(200).json(contact);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
});

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string()
    .min(5)
    .pattern(/^[0-9-]+$/, "numbers")
    .required(),
  favorite: Joi.boolean(),
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone, favorite = false } = req.body;
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    const contact = await addContact(name, email, phone, favorite);
    res.status(201).json(contact);
  } catch (e) {
    next(e);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Contact deleted" }).status(204);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing fields" });
    }
    const contact = await updateContact(contactId, req.body);
    res.status(200).json(contact);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
});

const schemaFavorite = Joi.object({
  favorite: Joi.boolean(),
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { error } = schemaFavorite.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing field favorite" });
    }
    const contact = await updateStatusContact(contactId, req.body);
    res.status(200).json(contact);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
});

module.exports = router;