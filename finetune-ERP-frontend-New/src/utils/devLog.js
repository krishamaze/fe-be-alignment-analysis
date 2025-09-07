/* global process */

export const devLog = (message, data) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Fullpage] ${message}`, data || '');
  }
};
