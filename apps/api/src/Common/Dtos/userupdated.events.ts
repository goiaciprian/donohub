import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const VerificationSchema = z.object({
    "attempts": z.number().nullable(),
    "expire_at": z.date().nullable(),
    "status": z.string(),
    "strategy": z.string(),
});
export type Verification = z.infer<typeof VerificationSchema>;

export const MetadataSchema = z.object({
});
export type Metadata = z.infer<typeof MetadataSchema>;

export const HttpRequestSchema = z.object({
  client_ip: z.string(),
  user_agent: z.string(),
});
export type HttpRequest = z.infer<typeof HttpRequestSchema>;

export const EmailAddressSchema = z.object({
  email_address: z.string(),
  id: z.string(),
  linked_to: z.array(z.any()),
  object: z.string(),
  reserved: z.boolean(),
  verification: VerificationSchema,
});
export type EmailAddress = z.infer<typeof EmailAddressSchema>;

export const EventAttributesSchema = z.object({
  http_request: HttpRequestSchema,
});
export type EventAttributes = z.infer<typeof EventAttributesSchema>;

export const DataSchema = z.object({
  birthday: z.string(),
  created_at: z.number(),
  email_addresses: z.array(EmailAddressSchema),
  external_accounts: z.array(z.any()),
  external_id: z.string().nullable(),
  first_name: z.string(),
  gender: z.string(),
  id: z.string(),
  image_url: z.string(),
  last_name: z.string().nullable(),
  last_sign_in_at: z.date().nullable(),
  object: z.string(),
  password_enabled: z.boolean(),
  phone_numbers: z.array(z.any()),
  primary_email_address_id: z.string(),
  primary_phone_number_id: z.string().nullable(),
  primary_web3_wallet_id: z.string().nullable(),
  private_metadata: MetadataSchema,
  profile_image_url: z.string(),
  public_metadata: MetadataSchema,
  two_factor_enabled: z.boolean(),
  unsafe_metadata: MetadataSchema,
  updated_at: z.number(),
  username: z.string().nullable(),
  web3_wallets: z.array(z.any()),
});
export type Data = z.infer<typeof DataSchema>;

export const UserUpdateEventSchema = z.object({
  data: DataSchema,
  event_attributes: EventAttributesSchema,
  object: z.string(),
  timestamp: z.number(),
  type: z.string(),
});
export type UserUpdateEvent = z.infer<typeof UserUpdateEventSchema>;

export class UserUpdatedEvent extends createZodDto(UserUpdateEventSchema) {};
