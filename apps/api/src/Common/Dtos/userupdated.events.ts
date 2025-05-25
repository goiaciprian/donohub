import { createZodDto } from "@anatine/zod-nestjs";
import z from "zod";


export const VerificationSchema = z.object({
    "attempts": z.number(),
    "expire_at": z.number(),
    "status": z.string(),
    "strategy": z.string(),
});
export type Verification = z.infer<typeof VerificationSchema>;

export const EMetadataSchema = z.object({
});
export type EMetadata = z.infer<typeof EMetadataSchema>;

export const PublicMetadataSchema = z.object({
    "permissions": z.array(z.string()),
});
export type PublicMetadata = z.infer<typeof PublicMetadataSchema>;

export const HttpRequestSchema = z.object({
    "client_ip": z.string(),
    "user_agent": z.string(),
});
export type HttpRequest = z.infer<typeof HttpRequestSchema>;

export const EmailAddressSchema = z.object({
    "created_at": z.number(),
    "email_address": z.string(),
    "id": z.string(),
    "linked_to": z.array(z.any()),
    "matches_sso_connection": z.boolean(),
    "object": z.string(),
    "reserved": z.boolean(),
    "updated_at": z.number(),
    "verification": VerificationSchema,
});
export type EmailAddress = z.infer<typeof EmailAddressSchema>;

export const EventAttributesSchema = z.object({
    "http_request": HttpRequestSchema,
});
export type EventAttributes = z.infer<typeof EventAttributesSchema>;

export const DataSchema = z.object({
    "backup_code_enabled": z.boolean(),
    "banned": z.boolean(),
    "create_organization_enabled": z.boolean(),
    "created_at": z.number(),
    "delete_self_enabled": z.boolean(),
    "email_addresses": z.array(EmailAddressSchema),
    "enterprise_accounts": z.array(z.any()),
    "external_accounts": z.array(z.any()),
    "external_id": z.any(),
    "first_name": z.string(),
    "has_image": z.boolean(),
    "id": z.string(),
    "image_url": z.string(),
    "last_active_at": z.number(),
    "last_name": z.string(),
    "last_sign_in_at": z.number(),
    "legal_accepted_at": z.any(),
    "locked": z.boolean(),
    "lockout_expires_in_seconds": z.any(),
    "mfa_disabled_at": z.any(),
    "mfa_enabled_at": z.any(),
    "object": z.string(),
    "passkeys": z.array(z.any()),
    "password_enabled": z.boolean(),
    "phone_numbers": z.array(z.any()),
    "primary_email_address_id": z.string(),
    "primary_phone_number_id": z.any(),
    "primary_web3_wallet_id": z.any(),
    "private_metadata": EMetadataSchema,
    "profile_image_url": z.string(),
    "public_metadata": PublicMetadataSchema,
    "saml_accounts": z.array(z.any()),
    "totp_enabled": z.boolean(),
    "two_factor_enabled": z.boolean(),
    "unsafe_metadata": EMetadataSchema,
    "updated_at": z.number(),
    "username": z.any(),
    "verification_attempts_remaining": z.number(),
    "web3_wallets": z.array(z.any()),
});
export type Data = z.infer<typeof DataSchema>;

export const UserUpdateEventSchema = z.object({
    "data": DataSchema,
    "event_attributes": EventAttributesSchema,
    "instance_id": z.string(),
    "object": z.string(),
    "timestamp": z.number(),
    "type": z.string(),
});
export type UserUpdateEvent = z.infer<typeof UserUpdateEventSchema>;

export class UserUpdatedEvent extends createZodDto(UserUpdateEventSchema) {};
