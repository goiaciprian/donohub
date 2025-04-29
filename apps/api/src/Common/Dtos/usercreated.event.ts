import { createZodDto } from '@anatine/zod-nestjs';
import { extendApi } from '@anatine/zod-openapi';
import z from 'zod';

export const VerificationSchema = extendApi(
  z.object({
    status: z.string(),
    strategy: z.string(),
  }),
);

export const MetadataSchema = extendApi(z.object({}).optional());

export const HttpRequestSchema = extendApi(
  z.object({
    client_ip: z.string(),
    user_agent: z.string(),
  }),
);

export const EmailAddressSchema = extendApi(
  z.object({
    email_address: z.string(),
    id: z.string(),
    linked_to: z.array(z.any()),
    object: z.string(),
    verification: VerificationSchema,
  }),
);

export const EventAttributesSchema = extendApi(
  z.object({
    http_request: HttpRequestSchema,
  }),
);

export const DataSchema = extendApi(
  z.object({
    birthday: z.string().optional(),
    created_at: z.number(),
    email_addresses: z.array(EmailAddressSchema),
    external_accounts: z.array(z.any()),
    external_id: z.string().optional().nullable(),
    first_name: z.string(),
    gender: z.string().optional(),
    id: z.string(),
    image_url: z.string(),
    last_name: z.string(),
    last_sign_in_at: z.number().optional().nullable(),
    object: z.string(),
    password_enabled: z.boolean(),
    phone_numbers: z.array(z.any()),
    primary_email_address_id: z.string(),
    primary_phone_number_id: z.null(),
    primary_web3_wallet_id: z.null(),
    private_metadata: MetadataSchema,
    profile_image_url: z.string(),
    public_metadata: MetadataSchema,
    two_factor_enabled: z.boolean(),
    unsafe_metadata: MetadataSchema,
    updated_at: z.number(),
    username: z.null(),
    web3_wallets: z.array(z.any()),
  }),
);

export const UserCreatedEventSchema = extendApi(
  z.object({
    data: DataSchema,
    event_attributes: EventAttributesSchema.optional(),
    object: z.string().optional(),
    timestamp: z.number(),
    type: z.string(),
  }),
);

export class UserCreatedEvent extends createZodDto(UserCreatedEventSchema) {}
