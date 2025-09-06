import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested, IsUrl } from "class-validator";
import { Type } from "class-transformer";
import { FilterQuery, QueryOptions } from "mongoose";
import { ItemDocument } from "shared-mongoose-schemas";

export const ItemStatusEnum = ["ACTIVE", "INACTIVE", "DELETED"] as const;
export type ItemStatus = (typeof ItemStatusEnum)[number];

export class ImageDto {
    @IsString() name!: string;
    @IsUrl() url!: string;
    @IsOptional() @IsString() type?: string; // default via schema
}

export class CreateItemDto {
    @IsString() name!: string;

    @IsOptional() @IsString() description?: string;

    @Type(() => Number) @IsNumber() @Min(0)
    price!: number;

    @IsOptional() @IsEnum(ItemStatusEnum)
    status?: ItemStatus;

    @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ImageDto)
    images?: ImageDto[];

    @IsOptional() @IsString() createdBy?: string;

    @IsOptional() @IsString() updatedBy?: string;
}

export class UpdateItemDto {
    @IsOptional() @IsString() name?: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @Type(() => Number) @IsNumber() @Min(0) price?: number;
    @IsOptional() @IsEnum(ItemStatusEnum) status?: ItemStatus;
    @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ImageDto)
    images?: ImageDto[];
    @IsOptional() @IsString() updatedBy?: string;
}

export class ListItemsQueryDto {
    @IsOptional() @IsString() search?: string;
    @IsOptional() @IsEnum(ItemStatusEnum) status?: ItemStatus;
    @IsOptional() @Type(() => Number) @IsNumber() @Min(1) page?: number;   // default 1
    @IsOptional() @Type(() => Number) @IsNumber() @Min(1) limit?: number;  // default 10
    /** e.g. "-createdAt", "price" */
    @IsOptional() @IsString() sort?: string;
}

export type ListParams = {
    filter?: FilterQuery<ItemDocument>;
    page?: number;
    limit?: number;
    sort?: string;
    projection?: any;
    options?: QueryOptions;
    lean?: boolean;
};

export type PaginatedResult<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
};