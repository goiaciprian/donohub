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
      return <WashingMachine />;
    case 'FURNITURE':
      return <Armchair />;
    case 'FOOTWEAR':
      return <Footprints />;
    case 'STATIONERY':
      return <Layers />;
    case 'CLOTHING':
      return <Shirt />;
    default:
      return <CircleEllipsis />;
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
