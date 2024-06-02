const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get all Contacts
//@route GET /api/contacts
//@access Public

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find();
  res.status(200).json(contacts);
});

//@desc Get New Contacts
//@route POST /api/contacts
//@access Public

const createContact = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("Please enter all fields");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
  });
  res.status(201).json(contact);
});

//@desc Get Contact by ID
//@route GET /api/contacts/:id
//@access Public

const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  res.status(200).json(contact);
});

//@desc Update Contact by ID
//@route PUT /api/contacts/:id
//@access Public

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  const updateContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updateContact);
});

//@desc Delete Contact by ID
//@route DELETE /api/contacts/:id
//@access Public

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }
  const deleteContact = await Contact.findByIdAndDelete(req.params.id);

  res.status(200).json(deleteContact);
});

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
};
