const Contacts = require("../models/contacts");

const listContacts = async (req, res, next) => {
  try {
    const contacts = await Contacts.find();
    res.status(200).json(contacts);
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contacts.findById(contactId);
    res.status(200).json(contact);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { name, email, phone, favorite = false } = req.body;
    const contact = await Contacts.create({ name, email, phone, favorite });
    res.status(201).json(contact);
  } catch (e) {
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await Contacts.findByIdAndDelete(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.json({ message: "Contact deleted" }).status(204);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, email, phone, favorite = false } = req.body;
    const contact = await Contacts.findByIdAndUpdate(
      contactId,
      { name, email, phone, favorite },
      { new: true }
    );
    res.status(200).json(contact);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    const contact = await Contacts.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );
    res.status(200).json(contact);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};