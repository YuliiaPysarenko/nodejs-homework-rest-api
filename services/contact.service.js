const { Contacts } = require("../models/contacts");

const getAll = async (query, id) => {
  const { page, limit, favorite } = query;
  const skipped = (page - 1) * limit;
  const skip = skipped < 0 ? 0 : skipped;

  if (!favorite) {
    return Contacts.find({ owner: id }, {}, { skip, limit: +limit });
  }

  return Contacts.find(
    { owner: id, favorite: favorite },
    {},
    { skip, limit: +limit }
  );
};

const getById = async (contactId, userId) => {
  const contact = await Contacts.findById(contactId);
  return contact.owner.valueOf() === userId ? contact : null;
};

const create = async (contact, id) => {
  return Contacts.create({ ...contact, owner: id });
};

const updateById = async (userId, contactId, contact) => {
  const existedContact = await Contacts.findById(contactId);
  if (existedContact.owner.valueOf() === userId.valueOf()) {
    return Contacts.findByIdAndUpdate(contactId, contact, { new: true });
  }
  return null;
};

const updateStatusById = async (userId, contactId, contact) => {
  const { favorite } = contact;
  const existedContact = await Contacts.findById(contactId);
  if (existedContact.owner.valueOf() === userId.valueOf()) {
    return Contacts.findByIdAndUpdate(contactId, { favorite }, { new: true });
  }
  return null;
};

const deleteById = async (userId, contactId) => {
  const existedContact = await Contacts.findById(contactId);
  if (existedContact.owner.valueOf() === userId.valueOf()) {
    return Contacts.findByIdAndDelete(contactId);
  }
  return null;
};

module.exports = {
  updateById,
  updateStatusById,
  create,
  getById,
  getAll,
  deleteById,
};
