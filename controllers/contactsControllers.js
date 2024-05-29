import mongoose from "mongoose";
import contactsServices from "../services/contactsServices.js";

export const getAllContacts = (req, res, next) => {
  let { page = 1, limit = 20, favorite } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const filter = { owner: req.user.id };
  if (favorite !== undefined) {
      filter.favorite = favorite === 'true';
  }


 if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
    return res.status(400).json({ message: "Invalid query parameters" });
 }

    contactsServices
         .listContacts(filter, page, limit, next) 
        .then((contacts) => res.status(200).json(contacts))
        .catch((error) => res.status(500).json({ error: error.message }));
};

export const getOneContact = (req, res, next) => {
    const { id } = req.params;

    contactsServices
        .getContactById(req.user.id, id, next)
        .then((contact) => {
            if (contact !== null) {
                res.status(200).json(contact);
            } else {
                res.status(404).json({ message: "Not found" });
            }
        })
        .catch(() => res.status(404).json({ message: "Not found" }));
};

export const deleteContact = (req, res, next) => {
    const { id } = req.params;

    contactsServices
        .removeContact(req.user.id, id, next)
        .then((contact) => {
            if (contact !== null) {
                res.status(200).json(contact);
            } else {
                res.status(404).json({ message: "Not found" });
            }
        })
        .catch(() => res.status(500).json({ message: "Failed to delete contact" }));
};

export const createContact = (req, res, next) => {
    const { name, email, phone, favorite } = req.body;

    contactsServices
        .addContact(req.user.id, name, email, phone, favorite, next)
        .then((contact) => res.status(201).json(contact))
        .catch(() => res.status(400).json({ message: "Failed to create contact" }));
};

export const updateContact = (req, res, next) => {
  const { id } = req.params;

  const { name, email, phone, favorite } = req.body;

  if (name === undefined && email === undefined && phone === undefined && favorite === undefined) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  contactsServices
    .updateContact(id, req.user.id, name, email, phone, favorite, next)
    .then((contact) => {
      if (contact !== null) {
        res.status(200).json(contact);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch(() => res.status(404).json({ message: "Not found" }));
};

export const updateContactFavorite = (req, res, next) => {
    const { id } = req.params;
    
    const { favorite } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
    }

  contactsServices
    .updateContactFavorite(req.user.id, id, {favorite}, next)
    .then((contact) => {
      if (contact === null) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => res.status(500).json("Internal Server Error"));
};