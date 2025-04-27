import {
  CategoryDto,
  DonationDto,
  PaginatedDonationDto,
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

export const getUserInfoByClerkId = createRequest<UserInfoDto>('/api/userInfo/:id/clerk', 'GET');

export * from './router';
