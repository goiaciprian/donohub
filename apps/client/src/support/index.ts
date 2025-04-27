import {
  CategoryDto,
  DonationDto,
  LocationDto,
  PaginatedDonationDto,
  PostDonationDto,
  PostLocationDto,
  UserInfoDto,
} from '@donohub/shared';

import { createRequest } from '@/utils';

export const getDonations = createRequest<PaginatedDonationDto>(
  `/api/donations`,
  'GET',
);

export const getDonationById = createRequest<DonationDto>(
  '/api/donations/:id',
  'GET',
);

export const getCategories = createRequest<CategoryDto[]>(
  '/api/categories',
  'GET',
);

export const getLocationsDropdown = createRequest<string[]>(
  '/api/locations/dropdown',
  'GET',
);

export const getLocations = createRequest<LocationDto[]>(
  '/api/locations',
  'GET',
);

export const getUserInfoByClerkId = createRequest<UserInfoDto>(
  '/api/userInfo/:id/clerk',
  'GET',
);

export const postDonations = createRequest<
  DonationDto,
  object,
  FormData
>('/api/donations', 'POST');

export const postLocation = createRequest<LocationDto, object, PostLocationDto>(
  '/api/locations',
  'POST',
);

export * from './router';
