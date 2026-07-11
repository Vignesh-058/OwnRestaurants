import axios, { AxiosError } from 'axios';

export interface ApiError {
 message: string;
 status?: number;
 code?: string;
}

export const ApiErrorParser = (error: unknown): ApiError => {
 if (axios.isAxiosError(error)) {
 const axiosError = error as AxiosError<{ message?: string; error?: string }>;
 return {
 message: axiosError.response?.data?.message || axiosError.response?.data?.error || axiosError.message || 'An unexpected error occurred.',
 status: axiosError.response?.status,
 code: axiosError.code,
 };
 }
 
 if (error instanceof Error) {
 return {
 message: error.message,
 };
 }

 return {
 message: 'An unknown error occurred.',
 };
};
