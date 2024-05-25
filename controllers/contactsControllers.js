import contactsServices from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
    try {
        const contacts = await contactsServices.listContacts();
        res.status(200).json(contacts);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
  try{
    const { id } = req.params;
    const contact = await contactsServices.getContactById(id);
    if (contact) {
        res.status(200).json(contact);
    } else {
        res.status(404).json({ message: "Not found" });
    }
  }
  catch(error) {
    next(error);}
};

export const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    const contact = await contactsServices.removeContact(id);
    if (!contact) {
        return next(HttpError(404, "Not found"));
    }   res.status(200).send(contact);
};

export const createContact = async (req, res, next) => {
    const { name, email, phone } = req.body;
   const contact = await contactsServices.addContact(name, email, phone);
   try {
    res.status(201).json(contact);
   } catch (error) {
    next(error);
   }
};

export const updateContact = async (req, res) => {
    if (Object.keys(req.body).length === 0) {return res.sendStatus(400).json({message: "missing fields"})
    
    ;}
    const data = await contactsServices.updateContact(req.params.id, req.body);
    if (!data) {
        return res.sendStatus(404).json({message: "Not found"});
    }
    res.status(200).json(data);
};

export const updateContactFavorite = async (req, res) => {
    const {id} = req.params;
    const {favorite} = req.body;

    contactsServices 
    .updateContactFavorite(id, {favorite})
    .then((data) => {
        if (!data) {
            return res.sendStatus(404).json({message: "Not found"});
        }
        res.status(200).json(data);
    })
    .catch((error) => {
        next(error);
    })
}