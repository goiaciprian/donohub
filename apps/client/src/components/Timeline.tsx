import { cn } from '@/lib/utils';
import React, { HTMLProps } from 'react';

type TimelineProps = {
  children: React.ReactElement[] | React.ReactElement;
  className?: HTMLProps<HTMLElement>['className'];
};

export const Timeline = ({ children, className }: TimelineProps) => {
  return (
    <ol
      className={cn(
        'relative border-s-2 border-gray-200 dark:border-gray-700',
        className,
      )}
    >
      {children}
    </ol>
  );
};

type TimelineItemProps = {
  title?: string;
  description?: string;
  subtext?: string;
  icon?: React.ReactElement;
  className?: HTMLProps<HTMLElement>['className'];
  isStepResolved?: boolean;
};

export const TimelineItem = ({
  description,
  icon,
  subtext,
  title,
  className,
  isStepResolved,
}: TimelineItemProps) => {
  return (
    <li className={cn('ms-6', isStepResolved ? '' : 'text-muted-foreground', className)}>
      <span className="absolute flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full -start-3 ring-10 ring-white dark:ring-gray-900 dark:bg-blue-900">
        {icon}
      </span>
      <h3 className={cn("pl-4 mb-1 text-lg font-semibold text-gray-900 dark:text-white", isStepResolved ? '' : 'text-muted-foreground')}>
        {title}
      </h3>
      <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
        {subtext}
      </time>
      <p className="text-base font-normal text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </li>
  );
};
