import { useQuery } from '@tanstack/react-query';
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
import { useDebounce } from 'use-debounce';
import { QueriedDonations } from '../QueriedDonations.Donations';
import { useSearchParams } from 'react-router-dom';
import { useAuthRequest } from '@/hooks/useAuthRequest';
import { getCategories, getLocationsDropdown } from '@/support';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '../buttons/CopyButton';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface StateReducer {
  query?: string;
  location?: string;
  category?: string;
  pageSize?: string;
  page?: string;
  all: Omit<StateReducer, 'all'>;
}

type State = Omit<StateReducer, 'all'>;

type AllowedKeys = keyof StateReducer | 'reset';

interface Payload<T = AllowedKeys> {
  key: T;
  value: T extends keyof StateReducer
    ? StateReducer[T]
    : T extends 'reset'
      ? never
      : never;
}

const initialState: State = {
  category: undefined,
  location: undefined,
  page: '1',
  pageSize: '20',
  query: undefined,
};

const reducerFunc = (state: State, payload: Payload) => {
  const newState = { ...state };
  const { key, value } = payload;
  if (key === 'all') {
    return {
      ...(value as State),
    };
  }

  if (key === 'reset') {
    return { ...initialState };
  }

  if (key !== 'page') {
    newState.page = '1';
  }

  return {
    ...newState,
    [key]: value,
  };
};

export const DonationsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParms] = useSearchParams();

  const [{ category, location, page, pageSize, query }, dispatchRaw] =
    React.useReducer(reducerFunc, initialState, () => ({
      category: searchParams.get('category') ?? initialState.category,
      location: searchParams.get('location') ?? initialState.location,
      query: searchParams.get('q') ?? initialState.query,
      page: searchParams.get('page') ?? initialState.page,
      pageSize: searchParams.get('pageSize') ?? initialState.pageSize,
    }));

  React.useEffect(() => {
    dispatchRaw({
      key: 'all',
      value: {
        category: searchParams.get('category') ?? initialState.category,
        location: searchParams.get('location') ?? initialState.location,
        query: searchParams.get('q') ?? initialState.query,
        page: searchParams.get('page') ?? initialState.page,
        pageSize: searchParams.get('pageSize') ?? initialState.pageSize,
      },
    });
  }, [searchParams]);

  const dispatch = (
    payload: Payload,
    searchKey: string,
    condition: boolean,
    resetPage = true,
  ) => {
    dispatchRaw(payload);
    if (payload.key === 'reset') {
      setSearchParms({});
    } else {
      setSearchParms((prev) => {
        if (condition) prev.set(searchKey, payload.value as string);
        else prev.delete(searchKey);

        if (resetPage) prev.delete('page');

        return prev;
      });
    }
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

  const [debounceQuery] = useDebounce(query, 600);

  return (
    <Page
      className="mx-[5%] select-none"
      staticFirst={
        <div>
          <div className="py-5">
            <div className="flex gap-4 items-center">
              <div>
                <CopyButton url={window.location.href} size={80} />
              </div>
              <h1 className="font-bold text-3xl">{t('donations.title')}</h1>
            </div>
            <h3 className="text-xl">{t('donations.subtitle')}</h3>
          </div>
          <div className="flex w-full items-end py-5 gap-8 *:last:ml-auto">
            <div>
              <label htmlFor="query" className="font-semibold">
                {t('donations.keywords')}
              </label>
              <Input
                id="query"
                value={query ?? ''}
                placeholder="Search"
                onChange={(event) =>
                  dispatch(
                    { key: 'query', value: event.target.value },
                    'q',
                    !!event.target.value,
                  )
                }
              />
            </div>
            <div>
              <label className="font-semibold">{t('donations.category')}</label>
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
                      {t(`categories.${category.name}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="font-semibold">{t('donations.location')}</label>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      onClick={() =>
                        setSearchParms((prev) => {
                          const paramsState: Record<string, string> = {};
                          const pageSize = prev.get('pageSize');
                          if (pageSize) {
                            paramsState['pageSize'] = pageSize;
                          }
                          return paramsState;
                        })
                      }
                    >
                      <X />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('tooltip.clearFilters')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div>
              <label className="font-semibold">{t('donations.pageSize')}</label>
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
          q={debounceQuery}
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
