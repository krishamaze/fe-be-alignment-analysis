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
  GET_UNITS: '/api/units',
  GET_QUALITIES: '/api/qualities',

  // REPAIRS
  MODIFY_ISSUE: '/api/issues',
  GET_ISSUES: '/api/issues',
  MODIFY_OTHER_ISSUE: '/api/other-issues',
  GET_OTHER_ISSUES: '/api/other-issues',
  MODIFY_QUESTION: '/api/questions',
  GET_QUESTIONS: '/api/questions',

  // INVENTORY
  GET_STOCK_LEDGERS: '/api/stock-ledgers',
  MODIFY_STOCK_ENTRY: '/api/stock-entries',
  GET_SERIALS: '/api/serials',
  MODIFY_SERIAL: '/api/serials',
  GET_PRICE_LOGS: '/api/price-logs',
  GET_INVENTORY_CONFIG: '/api/inventory-config',
  MODIFY_INVENTORY_CONFIG: '/api/inventory-config',

  // AUTHENTICATION
  LOGIN: '/api/auth/login',
  REFRESH_TOKEN: '/api/token/refresh',
  LOGOUT: '/api/auth/logout',
};

export default END_POINTS;
