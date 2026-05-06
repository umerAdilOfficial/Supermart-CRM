import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getProducts = () => api.get('/products');
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getCustomers = () => api.get('/customers');
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

export const getSales = () => api.get('/sales');
export const createSale = (data) => api.post('/sales', data);

export const getDashboardStats = () => api.get('/dashboard');
