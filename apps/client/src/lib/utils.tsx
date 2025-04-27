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
    case 'Electrocasnice':
      return <WashingMachine />;
    case 'Mobilier':
      return <Armchair />;
    case 'Incaltaminte':
      return <Footprints />;
    case 'Papetarie':
      return <Layers />;
    case 'Imbracaminte':
      return <Shirt />;
    default:
      return <CircleEllipsis />;
  }
}
