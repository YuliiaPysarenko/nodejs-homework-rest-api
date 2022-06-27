const { Schema, model } = require("mongoose");
const Joi = require("joi");

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  }
});

// validation

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string()
    .min(5)
    .pattern(/^[0-9-]+$/, "numbers")
    .required(),
  favorite: Joi.boolean(),
});

const Contacts = model("Contacts", contactSchema);

const schemaFavorite = Joi.object({
  favorite: Joi.boolean(),
});

module.exports = {
  Contacts,
  schema,
  schemaFavorite,
};