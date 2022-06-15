const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();
const Joi = require("joi");

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
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (e) {
    console.log(e);
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
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    const { name, email, phone } = req.body;
    const contact = await addContact(name, email, phone);
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
    res.status(204).json({ message: "contact deleted" });
  } catch (e) {
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
    next(e);
    return res.status(404).json({ message: "Not found" });
  }
});

module.exports = router;
