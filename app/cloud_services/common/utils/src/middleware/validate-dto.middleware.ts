// middleware/validate-dto.ts
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

export const validateDto =
  (DtoClass: new () => object) =>
  async (req: any, res: any, next: any) => {
    try {
      const dto = plainToInstance(DtoClass, req.body, {
        enableImplicitConversion: true,
      });

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false },
      });

      if (errors.length) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.map(e => ({ property: e.property, constraints: e.constraints })),
        });
      }

      // optionally pass the validated dto forward
      req.validatedBody = dto;
      next();
    } catch (err) {
      next(err);
    }
  };
