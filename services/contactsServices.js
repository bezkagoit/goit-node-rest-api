import Contact from "../models/contacts.js";

async function listContacts(ownerId , next) {
  try {
    const contacts = await Contact.find({ owner: ownerId });
    return contacts;
  } catch (error) 
{
    next(error);}
}

async function getContactById(contactId, ownerId, next) {
  try {
    const data = await Contact.findOne({ _id: contactId, owner: ownerId });
    return data;
   
  } catch (error) { next(error) }
}
 
async function removeContact(contactId, ownerId , next) {
  
  try {
    const data = await Contact.findByIdAndDelete({
      _id: contactId, owner: ownerId});
    return data;
  } catch (error) {
    next(error);
  }
}

async function addContact (ownerId, name, email, phone, favorite = false , next) {
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
      next(error);
    }
    
}

async function updateContact(contactId, ownerId, name, email, phone, favorite, next) {

  const contactToUpdate = await getContactById({
    _id: contactId,
    owner: ownerId,
  });
  
  if (contactToUpdate === null) {
    return null;
  }
      const newContact = {
        name: name !== undefined ? name : contactToUpdate.name,
        email: email !== undefined ? email : contactToUpdate.email,
        phone: phone !== undefined ? phone : contactToUpdate.phone,
        favorite: favorite !== undefined ? favorite : contactToUpdate.favorite,
      };   

try {   
  const result = await Contact.findByIdAndUpdate(contactId, newContact, {
    new: true,
  });
  console.log(result)
    return result;
  } catch (error) {
  next(error);
  }
  };
  
async function updateContactFavorite(id, favoriteStatus, next) {
  try {
    const result = await Contact.findByIdAndUpdate(id, favoriteStatus,{new: true} );
    return result;
  } catch (error) {
    next(error);
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