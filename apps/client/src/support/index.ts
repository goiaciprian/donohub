import { PaginatedDonationDto } from '@donohub/shared';

import { createRequest } from '@/utils';

// export const getTestRequest = createRequest<TestDto>('/api/test', 'GET')
// export const postTestRequest = createRequest<TestDto, object, PostTestDto>('/api/test', 'POST')

export const getLatestDonations = createRequest<PaginatedDonationDto>(
  `/api/donations`,
  'GET',
);

export * from './router';
