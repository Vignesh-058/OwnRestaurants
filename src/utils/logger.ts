/**
 * Centralized logging utility for development.
 * Silences logs in production environments to prevent console spam and information leakage.
 */

const isDev = import.meta.env.MODE === 'development';

export const logger = {
 info: (message: string, ...optionalParams: any[]) => {
 if (isDev) {
 console.log(`[INFO]: ${message}`, ...optionalParams);
 }
 },
 warn: (message: string, ...optionalParams: any[]) => {
 if (isDev) {
 console.warn(`[WARN]: ${message}`, ...optionalParams);
 }
 },
 error: (message: string, ...optionalParams: any[]) => {
 if (isDev) {
 console.error(`[ERROR]: ${message}`, ...optionalParams);
 }
 },
};
