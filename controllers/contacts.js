const { contacts } = require("../services");

const listContacts = async (req, res, next) => {
  try {
    const { id } = req.user;
    const allContacts = await contacts.getAll(req.query, id);
    res.status(200).json(allContacts);
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { contactId } = req.params;
    const contact = await contacts.getById(contactId, id);
    res.status(200).json(contact);
  } catch (e) {
    res.status(404).json({ message: "Not found" });
    console.log(e);
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const {id} = req.user;
    const contact = await contacts.create(req.body, id);
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
    const { id } = req.user;
    const { contactId } = req.params;
    const contact = await contacts.updateById(id, contactId, req.body);
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
    const { id } = req.user;
    const { contactId } = req.params;
    const contact = await contacts.updateStatusById(id, contactId, req.body);
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