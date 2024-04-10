import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseErrorMessage(e: any) {
  if (Array.isArray(e)) {
    const error = e[0];
    if (typeof error === 'string') {
      return error;
    }

    if (error.path) {
      return `${error.path} - ${error.message}`;
    }

    return (error.message as string) ?? 'Unknown error';
  }
  if (typeof e === 'string') {
    return e;
  }

  return e.message ?? 'Unknown error';
}
