import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { sendError } from '../utils/response.util';

// Pass a Joi schema, get back an Express middleware
const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((d) => d.message.replace(/"/g, "'"));
      sendError(res, 'Validation failed.', 422, messages);
      return;
    }

    next();
  };
};

export default validate;