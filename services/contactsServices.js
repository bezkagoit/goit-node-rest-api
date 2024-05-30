import Contact from "../models/contacts.js";

async function listContacts(filter , next, page, limit) {
  try {
    const skip = (page - 1) * limit;
    const contacts = await Contact.find(filter).skip(skip).limit(limit);
    const total = await Contact.countDocuments(filter);
    
    return {contacts, page, limit, total};
  } catch (error) 
{
    next(error);}
}

async function getContactById(ownerId, contactId) {
  try {
    const data = await Contact.findOne({ _id: contactId, owner: ownerId });
    return data;
  } catch (error) {
    throw error;
  }
}

 
async function removeContact(contactId, ownerId) {
  
  try {
    const data = await Contact.findOneAndDelete({ _id: contactId, owner: ownerId});
    return data;
  } catch (error) {
    throw (error);
  }
}

async function addContact (ownerId, name, email, phone, favorite = false ) {
  const newContact = {
    name: name,
    email: email,
    phone: phone,
    favorite: favorite,
    owner: ownerId,
  }
    
    try {
      const data = await Contact.create(newContact);
      console.log(data);
      return data;
        }
       catch (error) {
      throw (error);
    }
    
}

async function updateContact(contactId, ownerId, name, email, phone, favorite) {
  try {
    const contactToUpdate = await Contact.findOne({ _id: contactId, owner: ownerId });
    
    if (contactToUpdate === null) {
      return null;
    }

    const newContact = {
      name: name !== undefined ? name : contactToUpdate.name,
      email: email !== undefined ? email : contactToUpdate.email,
      phone: phone !== undefined ? phone : contactToUpdate.phone,
      favorite: favorite !== undefined ? favorite : contactToUpdate.favorite,
    };

    const result = await Contact.findByIdAndUpdate(contactId, newContact, {
      new: true,
    });

    return result;
  } catch (error) {
    throw error;
  }
}

  
async function updateContactFavorite(contactId, ownerId, favoriteStatus) {
  try {
    const contact = await Contact.findOneAndUpdate(
      { _id: contactId, owner: ownerId },
      { favorite: favoriteStatus.favorite },
      { new: true }
    );
    return contact;
  } catch (error) {
    throw error;
  }
}

export default {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateContactFavorite,
};