const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.resolve("./models/contacts.json");
const { v4: uuidv4 } = require('uuid');

const listContacts = async () => {
        const data = await fs.readFile(contactsPath, "utf8");
        return JSON.parse(data);
};

const getContactById = async (contactId) => {
    const allContacts = await listContacts();
    const contact = allContacts.find(contact => contact.id === contactId);
    return contact || null;
}

const addContact = async (name, email, phone) => {
    const newContact = {
        id: uuidv4(),
        name, 
        email, 
        phone
    };
    const allContacts = await listContacts();
    allContacts.push(newContact);

    await fs.writeFile(contactsPath, JSON.stringify(allContacts));
}

const removeContact = async (contactId) => {
    const allContacts = await listContacts();
    const index = allContacts.findIndex(contact => contact.id === contactId);

    const deletedContact = allContacts[index];
    if(index !== -1) {
        allContacts.splice(index, 1);
        await fs.writeFile(contactsPath, JSON.stringify(allContacts));
    }
    return deletedContact || null;
}

const updateContact = async (contactId, body) => {
    const { name, email, phone} = body;
    const allContacts = await listContacts();
    const index = allContacts.findIndex(contact => contact.id === contactId);
    if(index !== -1) {
        allContacts[index].name = name;
        allContacts[index].email = email;
        allContacts[index].phone = phone;

        await fs.writeFile(contactsPath, JSON.stringify(allContacts));
        return allContacts[index];
    } else {
        return null;
    }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
