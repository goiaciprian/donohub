import {
  CategoryDto,
  CommentDto,
  CommentPaginatedDto,
  CommentPostDto,
  CompleteDonationReviewPost,
  DonationDto,
  LocationDto,
  PaginatedDeliveryDonationDto,
  PaginatedDonationDto,
  PaginatedDonationRequestByUserDto,
  PaginatedDonationUserRequestsDto,
  PaginatedEvaluatedDonationDto,
  PaginatedUserCommentsDto,
  PostLocationDto,
  PutDonationEvaluationDto,
  PutDonationRequestDto,
  UserInfoDto,
} from '@donohub/shared';

import { withRequest } from '@/utils';

export const getDonations = withRequest('/api/donations')<
  PaginatedDonationDto,
  { page: number; size: number },
  undefined
>('GET');

export const getDonationById = withRequest(
  '/api/donations/by/:id',
)<DonationDto>('GET');

export const getCategories =
  withRequest('/api/categories')<CategoryDto[]>('GET');

export const getLocationsDropdown = withRequest('/api/locations/dropdown')<
  string[]
>('GET');

export const getLocations = withRequest('/api/locations')<LocationDto[]>('GET');

export const getUserInfoByClerkId = withRequest(
  '/api/userInfo/:id/clerk',
)<UserInfoDto>('GET');

export const postDonations = withRequest('/api/donations')<
  DonationDto,
  undefined,
  FormData
>('POST');

export const postLocation = withRequest('/api/locations')<
  LocationDto,
  undefined,
  PostLocationDto
>('POST');

export const getComments = withRequest('/api/comments/:donationId')<
  CommentPaginatedDto,
  { page: number; size: number }
>('GET');
export const postComment = withRequest('/api/comments/:donationId')<
  CommentDto,
  undefined,
  CommentPostDto
>('POST');

export const getUnlistedDonations = withRequest('/api/donations/unlisted')<
  PaginatedDonationDto,
  { page: number; size: number }
>('GET');

export const evaluateDonation = withRequest(
  '/api/donations/evaluate/:id/:status',
)<void, undefined, PutDonationEvaluationDto>('PUT');

export const selfDonations = withRequest('/api/donations/self')<
  PaginatedEvaluatedDonationDto,
  { page: number; size: number }
>('GET');

export const updateDonation = withRequest('/api/donations/update/:id')<
  DonationDto,
  undefined,
  FormData
>('PUT');

export const makeDonationRequest = withRequest(
  '/api/donations/request/create/:donationId',
)<void, undefined, PutDonationRequestDto>('PUT');

export const getSelfDonationRequests = withRequest(
  '/api/donations/request/self',
)<PaginatedDonationRequestByUserDto, { page: number; size: number }>('GET');

export const getDonationRequests = withRequest(
  '/api/donations/request/donation',
)<PaginatedDonationUserRequestsDto, { page: number; size: number }>('GET');

export const resolveDonationRequest = withRequest(
  '/api/donations/request/resolve/:requestId/:status',
)<void>('PUT');

export const getDeliveryDonationsRequest = withRequest(
  '/api/donations/delivery',
)<PaginatedDeliveryDonationDto, { page: number; size: number }>('GET');

export const reviewDonationRequest = withRequest(
  '/api/donations/complete/:donationId',
)<undefined, undefined, CompleteDonationReviewPost>('POST');

export const getUserCommentsRequest = withRequest('/api/comments/user/self')<
  PaginatedUserCommentsDto,
  { page: number; size: number }
>('GET');

export * from './router';
