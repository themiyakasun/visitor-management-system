/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AxiosError } from 'axios';

export function handleApiError(error: unknown): string {
  if ((error as AxiosError).isAxiosError) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      // Backend responded with an error (4xx, 5xx)
      return (
        (axiosError.response.data as any)?.message ||
        `Error ${axiosError.response.status}: ${axiosError.response.statusText}`
      );
    } else if (axiosError.request) {
      // Request was made but no response
      return 'Server not responding. Please try again later.';
    } else {
      // Something else went wrong
      return axiosError.message || 'Unexpected error occurred.';
    }
  }

  // Non-Axios error
  return 'An unknown error occurred.';
}
