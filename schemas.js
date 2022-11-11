import Joi from "joi";

export const validateParticipant = (body) => {
  const participantSchema = Joi.object({
    name: Joi.string().alphanum().required(),
  });

  return participantSchema.validate(body, { abortEarly: true });
};
