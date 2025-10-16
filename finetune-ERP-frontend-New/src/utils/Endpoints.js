// Environment-based API URL with Replit support
const getApiBaseUrl = () => {
  // If explicitly set via env, use that
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // In Replit environment, use HTTPS via Replit proxy
  if (typeof window !== 'undefined' && window.location.hostname.includes('replit.dev')) {
    const hostname = window.location.hostname;
    // Replit proxies HTTPS to Django dev server, use port 8000
    return `https://${hostname}:8000`;
  }
  
  // Default to production Railway URL
  return 'https://finetunetechcrafterp-dev.up.railway.app';
};

const API_BASE_URL = getApiBaseUrl();

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
  GET_STOCK_ENTRIES: '/api/stock-entries',
  MODIFY_STOCK_ENTRY: '/api/stock-entries',
  GET_SERIALS: '/api/serials',
  MODIFY_SERIAL: '/api/serials',
  GET_PRICE_LOGS: '/api/price-logs',
  GET_INVENTORY_CONFIG: '/api/inventory-config',
  MODIFY_INVENTORY_CONFIG: '/api/inventory-config',

  // SALES
  GET_SALE_INVOICES: '/api/sales/invoices',
  CREATE_SALE_INVOICE: '/api/sales/invoices',
  GET_SALE_INVOICE_PDF: '/api/sales/invoices',
  SEARCH_SALE_PRODUCTS: '/api/sales/products',

  // AUTHENTICATION
  LOGIN: '/api/auth/login',
  REFRESH_TOKEN: '/api/token/refresh',
  LOGOUT: '/api/auth/logout',
};

export default END_POINTS;
