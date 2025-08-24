const API_BASE_URL = 'https://finetunetechcrafterp-dev.up.railway.app';

const END_POINTS = {
  API_BASE_URL,

  // USER
  MODIFY_USER: '/api/users',
  GET_USERS: '/api/users',

  // STORE
  MODIFY_STORE: '/api/stores',
  GET_STORES: '/api/stores',

  // BRAND
  MODIFY_BRAND: '/api/brands',
  GET_BRANDS: '/api/brands',

  // SPARES
  MODIFY_SPARE: '/api/spares',
  GET_SPARES: '/api/spares',

  // BOOKINGS
  MODIFY_BOOKING: '/api/bookings',
  GET_PRODUCTS: '/api/products',
  GET_VARIANTS: '/api/variants',
  GET_BOOKINGS: '/api/bookings',
  MODIFY_DEPARTMENT: '/api/departments',
  GET_DEPARTMENTS: '/api/departments',
  MODIFY_CATEGORY: '/api/categories',
  GET_CATEGORIES: '/api/categories',
  MODIFY_SUBCATEGORY: '/api/subcategories',
  GET_SUBCATEGORIES: '/api/subcategories',

  // AUTHENTICATION
  LOGIN: '/api/auth/login',
  REFRESH_TOKEN: '/api/token/refresh',
  LOGOUT: '/api/auth/logout',
};

export default END_POINTS;
