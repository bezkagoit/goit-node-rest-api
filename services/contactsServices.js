import * as fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const contactsPath = path.resolve('db', 'contacts.json');

async function readContacts() {
  const data = await fs.readFile(contactsPath, { encoding: 'utf-8' });

  return JSON.parse(data);
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function listContacts() {
  const contacts = await readContacts();
  return contacts;
}

async function getContactById(id) {
  const contacts = await readContacts();

  const contact = contacts.find(contact => contact.id === id);

  if (typeof contact === 'undefined') {
    return null;
  }

  return contact;
}

async function addContact(name, email,phone) {
  const newContact = {
    id: crypto.randomUUID(),
    name,
    email,
    phone
  };
 const contacts = await readContacts();
 contacts.push(newContact);
 await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
 return newContact;
  }
 


async function removeContact(id) {
  const contacts = await readContacts();

  const index = contacts.findIndex(contact => contact.id === id);

  if (index === -1) {
    return null;
  }

  const removedContact = contacts[index];

  contacts.splice(index, 1);
  await writeContacts(contacts);
  return removedContact;
}

async function updateContact(id, newData) {
  const contacts = await readContacts();
  const index = contacts.findIndex(contact => contact.id === id);
  if (index === -1) {
    return null;
  }

  contacts[index] = {...contacts[index], ...newData};
  await writeContacts(contacts);
  return contacts[index];
}

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact
};