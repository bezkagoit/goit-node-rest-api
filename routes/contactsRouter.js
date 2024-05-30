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

import authMiddleware from "../middlewares/auth.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authMiddleware,  getAllContacts);

contactsRouter.get("/:id", authMiddleware, getOneContact);

contactsRouter.delete("/:id", authMiddleware, deleteContact);

contactsRouter.post("/",  authMiddleware,  validateBody(schema.createContactSchema) ,createContact);

contactsRouter.put("/:id", authMiddleware, validateBody(schema.updateContactSchema) ,updateContact);

contactsRouter.patch("/:id/favorite",  authMiddleware, updateContactFavorite);

export default contactsRouter;