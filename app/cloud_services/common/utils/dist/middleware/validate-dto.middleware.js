"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = validateDto;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
function validateDto(DtoClass) {
    return async (req, res, next) => {
        const instance = (0, class_transformer_1.plainToInstance)(DtoClass, req.body);
        const errors = await (0, class_validator_1.validate)(instance, {
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
        req.body = instance;
        next();
    };
}
