export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  SERVICES: '/services',
  ABOUT: '/about',
  CONTACT: '/contact',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_USERS: '/admin/users',
};

export const PRODUCT_CATEGORIES = [
  'Stationery',
  'Office Furniture',
  'Technology',
  'Supplies',
  'Equipment',
  'Accessories',
];

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
};

// Business contact
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '1234567890';

export const CONTACT_PHONE = import.meta.env.VITE_CONTACT_PHONE || '+254 700 000 000';
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'info@pinnaofficesupplies.co.ke';
export const CONTACT_ADDRESS = import.meta.env.VITE_CONTACT_ADDRESS || 'Pinna House, Moi Avenue, Nairobi, Kenya';

export const CACHE_DURATION = {
  SHORT: 5 * 60 * 1000,
  MEDIUM: 15 * 60 * 1000,
  LONG: 60 * 60 * 1000,
};
