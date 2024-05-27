import express from "express";
import * as schema from "../schemas/contactsSchemas.js";
import  validateBody  from "../helpers/validateBody.js";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateContactFavorite
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(schema.createContactSchema) ,createContact);

contactsRouter.put("/:id", validateBody(schema.updateContactSchema) ,updateContact);

contactsRouter.patch("/:id/favorite", updateContactFavorite);

export default contactsRouter;