const { v4: uuidv4 } = require("uuid");
const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  }
});

const Contacts = model("Contacts", contactSchema);

const listContacts = async () => {
  const data = await Contacts.find();
  return data;
};

const getContactById = async (contactId) => {
  const contact = await Contacts.findById(contactId).catch(err => console.log('getContactById: ', err));
  return contact;
};

const addContact = async (name, email, phone, favorite) => {
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
    favorite,
  };
  return await Contacts.create(newContact).catch(err => console.log('addContact: ', err));
};

const removeContact = async (contactId) => {
  const deletedContact = await Contacts.findByIdAndDelete(contactId).catch(err => console.log('removeContact: ', err));
  return deletedContact.deletedCount === 1 ? deletedContact.deletedCount : null;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone, favorite = false } = body;
  const updatedContact = await Contacts.findByIdAndUpdate(
    contactId,
    { name, email, phone, favorite },
    { new: true }
  ).catch(err => console.log('updateContact: ', err));
  return updatedContact || null;
};

const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;
  const updatedContact = await Contacts.findByIdAndUpdate(
    contactId,
    { favorite },
    { new: true }
  ).catch(err => console.log('updateStatusContact: ', err));
  return updatedContact || null;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
