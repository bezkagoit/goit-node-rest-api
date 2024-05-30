import mongoose from "mongoose";
import contactsServices from "../services/contactsServices.js";

export const getAllContacts = (req, res, next) => {
  let { page = 1, limit = 20, favorite } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const filter = { owner: req.user.id };
  if (favorite !== undefined) {
    filter.favorite = favorite === "true";
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
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  contactsServices
    .getContactById(req.user.id, id)
    .then((contact) => {
      if (contact === null) {
         return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => {
      next(err);
    });
};


export const deleteContact = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  contactsServices
    .removeContact(id, req.user.id)
    .then((contact) => {
      if (contact === null) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json({ message: "Contact deleted successfully" });
    })
    .catch((err) => next(err));
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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const { name, email, phone, favorite } = req.body;

  if (
    name === undefined &&
    email === undefined &&
    phone === undefined &&
    favorite === undefined
  ) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }

  contactsServices
    .updateContact(id, req.user.id, name, email, phone, favorite)
    .then((contact) => {
      if (contact === null) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => next(err));
};


export const updateContactFavorite = (req, res, next) => {
  const { id } = req.params;
  const { favorite } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (typeof favorite !== 'boolean') {
    return res.status(400).json({ message: "Favorite field must be a boolean" });
  }

  contactsServices
    .updateContactFavorite(id, req.user.id, { favorite })
    .then((contact) => {
      if (contact === null) {
        return res.status(404).json({ message: "Not found" });
      }
      res.status(200).json(contact);
    })
    .catch((err) => next(err));
};

