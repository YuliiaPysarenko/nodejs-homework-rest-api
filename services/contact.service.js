const { Contacts } = require("../models/contacts");

const getAll = async (query) => {
  const { page, limit } = query;
  const skipped = (page - 1) * limit;
  const skip = skipped < 0 ? 0 : skipped;

  return Contacts.find({}, {}, { skip, limit: +limit }).populate("owner", "user");
};

const getById = async (id) => {
  return Contacts.findById(id);
};

const create = async (contact, id) => {
  return Contacts.create({ ...contact, owner: id });
};

const updateById = async (id, contact) => {
  return Contacts.findByIdAndUpdate(id, contact, { new: true });
};

const updateStatusById = async (id, contact) => {
    const { favorite } = contact;
  return Contacts.findByIdAndUpdate(id, { favorite }, { new: true });
};

const deleteById = async (id) => {
  return Contacts.findByIdAndDelete(id);
};

module.exports = {
  updateById,
  updateStatusById,
  create,
  getById,
  getAll,
  deleteById,
};
