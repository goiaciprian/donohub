import { applyDecorators } from "@nestjs/common";
import { ApiResponse, ApiResponseOptions } from "@nestjs/swagger";

export const EndpointResponse = (options: ApiResponseOptions) => applyDecorators(
    ApiResponse({ status: 200, ...options }),
    ApiResponse({ status: 401 })
)