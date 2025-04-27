import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Page } from './Page';
import { CategoryDto } from '@donohub/shared';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import React from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { QueriedDonations } from '../QueriedDonations.Donations';
import { useSearchParams } from 'react-router-dom';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getCategories, getLocationsDropdown } from '@/support';

interface State {
  query?: string;
  location?: string;
  category?: string;
  pageSize?: string;
  page?: string;
}

interface Payload<T extends keyof State> {
  key: T;
  value: State[T];
}

const initialState: State = {
  category: undefined,
  location: undefined,
  page: '1',
  pageSize: '20',
  query: undefined,
};

const reducerFunc = (state: State, payload: Payload<keyof State>) => {
  const newState = { ...state };
  const { key, value } = payload;

  if (key !== 'page') {
    newState.page = '1';
  }

  return {
    ...newState,
    [key]: value,
  };
};

export const DonationsPage = () => {
  const [searchParams, setSearchParms] = useSearchParams();

  const [{ category, location, page, pageSize, query }, dispatchRaw] =
    React.useReducer(reducerFunc, initialState, () => ({
      category: searchParams.get('category') ?? initialState.category,
      location: searchParams.get('location') ?? initialState.location,
      query: searchParams.get('q') ?? initialState.query,
      page: searchParams.get('page') ?? initialState.page,
      pageSize: searchParams.get('pageSize') ?? initialState.pageSize,
    }));

  const dispatch = (
    payload: Payload<keyof State>,
    searchKey: string,
    condition: boolean,
    resetPage = true,
  ) => {
    dispatchRaw(payload);
    setSearchParms((prev) => {
      if (condition) prev.set(searchKey, payload.value as string);
      else prev.delete(searchKey);

      if (resetPage) prev.delete('page');

      return prev;
    });
  };

  const getCategoriesFn = useAuthRequest(getCategories);
  const categoriesQuery = useQuery<CategoryDto[]>({
    queryKey: ['categories'],
    queryFn: () => getCategoriesFn({}),
  });

  const getDropdownLocationsFn = useAuthRequest(getLocationsDropdown);
  const dropdownLocationsQuery = useQuery<string[]>({
    queryKey: ['locationsDropdown'],
    queryFn: () => getDropdownLocationsFn({}),
  });

  const categories = categoriesQuery.data ?? [];
  const locationsDropdown = dropdownLocationsQuery.data ?? [];

  const debounceQuery = useDebouncedCallback((value) => {
    dispatch({ key: 'query', value }, 'q', !!value);
  }, 500);

  return (
    <Page
      className="lg:md:mx-[15%]"
      staticFirst={
        <div>
          <div className="py-5">
            <h1 className="font-bold text-4xl">Donations</h1>
            <h3 className="text-2xl">
              Here you can search for what you need. You can search for specific
              key word, or filter based on the category and the location
            </h3>
          </div>
          <div className="flex w-full items-end py-5 gap-8 *:last:ml-auto">
            <div>
              <Input
                value={query}
                placeholder="Search"
                onChange={(event) => debounceQuery(event.target.value)}
              />
            </div>
            <div>
              <Select
                onValueChange={(c) => {
                  const value = c === 'clear' ? undefined : c;
                  dispatch({ key: 'category', value }, 'category', !!value);
                }}
                value={category ?? 'clear'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">All</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                onValueChange={(l) => {
                  const value = l === 'clear' ? undefined : l;
                  dispatch({ key: 'location', value }, 'location', !!value);
                }}
                value={location ?? 'clear'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clear">All</SelectItem>
                  {locationsDropdown.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location.split(',').reverse().join(', ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select
                onValueChange={(value) => {
                  dispatch(
                    { key: 'pageSize', value },
                    'pageSize',
                    value !== '20',
                  );
                }}
                value={pageSize}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Page size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={'1'}>1</SelectItem>
                  <SelectItem value={'5'}>5</SelectItem>
                  <SelectItem value={'10'}>10</SelectItem>
                  <SelectItem value={'15'}>15</SelectItem>
                  <SelectItem value={'20'}>20</SelectItem>
                  <SelectItem value={'50'}>50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      }
      dynamicComponent={
        <QueriedDonations
          category={category}
          location={location}
          q={query}
          size={pageSize}
          page={page}
          updatePage={(page) => {
            const value = `${page}`;
            dispatch({ key: 'page', value }, 'page', value !== '1', false);
          }}
        />
      }
    />
  );
};
