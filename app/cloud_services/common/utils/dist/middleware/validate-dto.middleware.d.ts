import { ClassConstructor } from 'class-transformer';
import { NextFunction, Request, Response } from 'express';
export declare function validateDto<T extends object>(DtoClass: ClassConstructor<T>): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=validate-dto.middleware.d.ts.map