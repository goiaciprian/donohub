import { applyDecorators } from "@nestjs/common";
import { ApiResponse, ApiResponseOptions } from "@nestjs/swagger";

export const EndpointResponse = (options: ApiResponseOptions, isCreate = false) => applyDecorators(
    ApiResponse({ status: isCreate ? 201 : 200, ...options }),
    ApiResponse({ status: 401 })
)