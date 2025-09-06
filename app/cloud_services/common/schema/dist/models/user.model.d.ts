import mongoose, { Document } from 'mongoose';
export interface UserDocument extends Document {
    email: string;
    password: string;
    fullName: string;
    role: 'ADMIN' | 'CUSTOMER' | 'STAFF';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserModel: mongoose.Model<any, {}, {}, {}, any, any>;
//# sourceMappingURL=user.model.d.ts.map