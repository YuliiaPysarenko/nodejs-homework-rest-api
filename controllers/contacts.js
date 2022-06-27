// const Contacts = require("../models/contacts");
const { contacts } = require("../services");

const listContacts = async (req, res, next) => {
  try {
    // const allContacts = await contacts.find().populate('owner', 'user');
    const { id } = req.params;
    console.log(id);
    const allContacts = await contacts.getAll(req.query);
    res.status(200).json(allContacts);
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contacts.getById(contactId);
    res.status(200).json(contact);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const {_id} = req.user;
    const contact = await contacts.create(req.body, _id);
    // const { name, email, phone, favorite = false } = req.body;
    // const contact = await contacts.create({ name, email, phone, favorite });
    res.status(201).json(contact);
  } catch (e) {
    if(e.message.includes('duplicate')){
      e.status = 400
    }
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contacts.deleteById(contactId);
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
    const { id } = req.params;
    // const { contactId } = req.params;
    // const { name, email, phone, favorite = false } = req.body;
    const contact = await contacts.updateById(id, req.body);
      // contactId,
      // { name, email, phone, favorite },
      // { new: true }
    // );
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    next(e);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    // const { contactId } = req.params;
    // const { favorite } = req.body;
    const { id } = req.params;
    const contact = await contacts.updateStatusById(id, req.body);
    // const contact = await contacts.findByIdAndUpdate(
    //   contactId,
    //   { favorite },
    //   { new: true }
    // );
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
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