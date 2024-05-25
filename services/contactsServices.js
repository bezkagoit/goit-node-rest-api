
import Contact from '../models/contacts.js';

async function listContacts() {
 return Contact.find();
}

async function getContactById(contactId) {
 return Contact.findById(contactId);
}

async function addContact(name, email,phone, favorite) {
  const newContact = new Contact({
    name: name,
    email: email,
    phone: phone, 
    favorite: favorite
  });
  return await newContact.save();
  }
 


async function removeContact(contactId) {
  return await Contact.findByIdAndDelete(contactId);
}

async function updateContact(contactId, newData) {
return await Contact.findByIdAndUpdate(contactId, newData, {new: true});
    
}

async function updateContactFavorite(contactId, newData) {
  return await Contact.findByIdAndUpdate(contactId, newData);
}

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateContactFavorite
};