const API_BASE_URL = "https://finetunetechcrafterp-dev.up.railway.app";

const END_POINTS = {
  API_BASE_URL,

  // USER
  MODIFY_USER: "/api/users",
  GET_USERS: "/api/users",

  // STORE
  MODIFY_STORE: "/api/stores",
  GET_STORES: "/api/stores",
  
  // SPARES
  MODIFY_SPARE: "/api/spares",
  GET_SPARES: "/api/spares",

  // BOOKINGS
  MODIFY_BOOKING: "/api/bookings",
  GET_BOOKINGS: "/api/bookings",


  // AUTHENTICATION
  LOGIN: '/api/auth/login',
  REFRESH_TOKEN: '/api/token/refresh',
  LOGOUT: '/api/auth/logout',
};

export default END_POINTS;
