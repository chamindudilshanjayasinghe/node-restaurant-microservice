"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = void 0;
// middleware/validate-dto.ts
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const validateDto = (DtoClass) => async (req, res, next) => {
    try {
        const dto = (0, class_transformer_1.plainToInstance)(DtoClass, req.body, {
            enableImplicitConversion: true,
        });
        const errors = await (0, class_validator_1.validate)(dto, {
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
    }
    catch (err) {
        next(err);
    }
};
exports.validateDto = validateDto;
