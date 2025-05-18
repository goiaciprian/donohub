import Resources from '@/support/resources';
import { LocationDto } from '@donohub/shared';
import clsx, { ClassValue } from 'clsx';
import {
  Armchair,
  CircleEllipsis,
  Footprints,
  Layers,
  Shirt,
  WashingMachine,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCategoryIcon(category: string) {
  switch (category) {
    case 'HOME_APPLIANCES':
      return <WashingMachine size={18} />;
    case 'FURNITURE':
      return <Armchair size={18} />;
    case 'FOOTWEAR':
      return <Footprints size={18} />;
    case 'STATIONERY':
      return <Layers size={18} />;
    case 'CLOTHING':
      return <Shirt size={18} />;
    default:
      return <CircleEllipsis size={18} />;
  }
}

export function displayLocation(
  location: Omit<LocationDto, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const hasValue = (value: string | null, showCharater = true) => {
    return value ? `${showCharater ? ', ' : ''} ${value}` : '';
  };

  return `${hasValue(location.county, false)}${hasValue(location.city)}${hasValue(location.street)}${hasValue(location.number)}${hasValue(location.postalCode)}`;
}

export type LocaleCategoriesHeleper = `categories:${keyof Resources['categories']}`;

export type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | `${K}.${DeepKeys<T[K]>}`
        : never;
    }[keyof T]
  : never;

export function displayEnum(value: string) {
  return value.split('_').map(word => `${word[0]}${word.slice(1).toLocaleLowerCase()}`).join(' ');
}