'use server'

import { headers } from 'next/headers';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"


export  async function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type PathOptions = {
  includeQuery?: boolean;
  stripTrailingSlash?: boolean;
};

export async function useServerPath(options: PathOptions = {}) {
  const { 
    includeQuery = false, 
    stripTrailingSlash = true 
  } = options;

  try {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '/';
    const search = headersList.get('x-invoke-query') || '';
    
    let path = pathname;
    
    // Strip trailing slash if needed
    if (stripTrailingSlash && path.length > 1 && path.endsWith('/')) {
      path = path.slice(0, -1);
    }
    
    // Add query parameters if needed
    if (includeQuery && search) {
      path += `?${search}`;
    }
    
    return {
      path,
      isError: false,
      error: null
    };
  } catch (error) {
    return {
      path: '/',
      isError: true,
      error: error instanceof Error ? error.message : 'Failed to get path'
    };
  }
}