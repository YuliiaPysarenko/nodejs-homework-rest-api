const Contacts = require("../models/contacts");

const listContacts = async () => {
  return await Contacts.find();
};

const getContactById = async (contactId) => {
  return await Contacts.findById(contactId);
};

const addContact = async (name, email, phone, favorite) => {
  const newContact = {
    name,
    email,
    phone,
    favorite,
  };
  return await Contacts.create(newContact);
};

const removeContact = async (contactId) => {
  return await Contacts.findByIdAndDelete(contactId);
};

const updateContact = async (contactId, body) => {
  const { name, email, phone, favorite = false } = body;
  return await Contacts.findByIdAndUpdate(
    contactId,
    { name, email, phone, favorite },
    { new: true }
  );
};

const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;
  return await Contacts.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
