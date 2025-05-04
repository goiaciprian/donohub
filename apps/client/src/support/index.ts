import {
  CategoryDto,
  CommentDto,
  CommentPaginatedDto,
  CommentPostDto,
  DonationDto,
  LocationDto,
  PaginatedDonationDto,
  PaginatedEvaluatedDonationDto,
  PostLocationDto,
  PutDonationEvaluationDto,
  UpdateDonationDto,
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

export * from './router';
