import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export function validateDto<T extends object>(DtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(DtoClass, req.body);
    const errors = await validate(instance as object, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.map(e => ({
          property: e.property,
          constraints: e.constraints,
        })),
      });
    }

    // replace body with the typed instance if you like
    req.body = instance as unknown as Request['body'];
    next();
  };
}
