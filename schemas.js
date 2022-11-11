import Joi from "joi";

export const validateParticipant = (body) => {
  const participantSchema = Joi.object({
    name: Joi.string().alphanum().required(),
  });

  return participantSchema.validate(body, { abortEarly: false });
};

export const validateMessage = (body) => {
  const messageSchema = Joi.object({
    to: Joi.string().alphanum().required(),
    text: Joi.string().required(),
    type: Joi.any().valid("private_message", "message"),
  });

  return messageSchema.validate(body, { abortEarly: false });
};
