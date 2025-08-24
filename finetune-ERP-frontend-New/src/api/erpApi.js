import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import END_POINTS from '../utils/Endpoints';

export const erpApi = createApi({
  reducerPath: 'erpApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Brand',
    'Store',
    'Spare',
    'Booking',
    'Product',
    'Variant',
    'Department',
    'Category',
    'SubCategory',
    'Unit',
    'Quality',
  ],
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => ({ url: END_POINTS.GET_BRANDS }),
      providesTags: ['Brand'],
    }),
    createBrand: builder.mutation({
      query: (body) => ({
        url: END_POINTS.MODIFY_BRAND,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Brand'],
    }),
    updateBrand: builder.mutation({
      query: ({ id, body }) => ({
        url: `${END_POINTS.MODIFY_BRAND}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Brand'],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `${END_POINTS.MODIFY_BRAND}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Brand'],
    }),
    getStores: builder.query({
      query: (params) => ({ url: END_POINTS.GET_STORES, params }),
      providesTags: ['Store'],
    }),
    createStore: builder.mutation({
      query: (body) => ({
        url: END_POINTS.MODIFY_STORE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Store'],
    }),
    updateStore: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${END_POINTS.MODIFY_STORE}/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Store'],
    }),
    deleteStore: builder.mutation({
      query: (id) => ({
        url: `${END_POINTS.MODIFY_STORE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Store'],
    }),
    getSpares: builder.query({
      query: () => ({ url: END_POINTS.GET_SPARES }),
      providesTags: ['Spare'],
    }),
    createSpare: builder.mutation({
      query: (body) => ({
        url: END_POINTS.MODIFY_SPARE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Spare'],
    }),
    updateSpare: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${END_POINTS.MODIFY_SPARE}/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Spare'],
    }),
    deleteSpare: builder.mutation({
      query: (id) => ({
        url: `${END_POINTS.MODIFY_SPARE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Spare'],
    }),
    getDepartments: builder.query({
      query: () => ({ url: END_POINTS.GET_DEPARTMENTS }),
      providesTags: ['Department'],
    }),
    createDepartment: builder.mutation({
      query: (body) => ({
        url: END_POINTS.MODIFY_DEPARTMENT,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Department'],
    }),
    updateDepartment: builder.mutation({
      query: ({ slug, body }) => ({
        url: `${END_POINTS.MODIFY_DEPARTMENT}/${slug}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Department'],
    }),
    deleteDepartment: builder.mutation({
      query: (slug) => ({
        url: `${END_POINTS.MODIFY_DEPARTMENT}/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department'],
    }),
    getCategories: builder.query({
      query: (params) => ({ url: END_POINTS.GET_CATEGORIES, params }),
      providesTags: ['Category'],
    }),
    createCategory: builder.mutation({
      query: (body) => ({
        url: END_POINTS.MODIFY_CATEGORY,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: builder.mutation({
      query: ({ slug, body }) => ({
        url: `${END_POINTS.MODIFY_CATEGORY}/${slug}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Category'],
    }),
    deleteCategory: builder.mutation({
      query: (slug) => ({
        url: `${END_POINTS.MODIFY_CATEGORY}/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    getSubCategories: builder.query({
      query: (params) => ({ url: END_POINTS.GET_SUBCATEGORIES, params }),
      providesTags: ['SubCategory'],
    }),
    createSubCategory: builder.mutation({
      query: (body) => ({
        url: END_POINTS.MODIFY_SUBCATEGORY,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SubCategory'],
    }),
    updateSubCategory: builder.mutation({
      query: ({ slug, body }) => ({
        url: `${END_POINTS.MODIFY_SUBCATEGORY}/${slug}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['SubCategory'],
    }),
    deleteSubCategory: builder.mutation({
      query: (slug) => ({
        url: `${END_POINTS.MODIFY_SUBCATEGORY}/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SubCategory'],
    }),
    getUnits: builder.query({
      query: () => ({ url: END_POINTS.GET_UNITS }),
      providesTags: ['Unit'],
    }),
    getQualities: builder.query({
      query: () => ({ url: END_POINTS.GET_QUALITIES }),
      providesTags: ['Quality'],
    }),
    getProducts: builder.query({
      query: (params) => ({ url: END_POINTS.GET_PRODUCTS, params }),
      providesTags: ['Product'],
    }),
    getProductBySlug: builder.query({
      query: (slug) => ({ url: `${END_POINTS.GET_PRODUCTS}/${slug}` }),
      providesTags: ['Product'],
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: END_POINTS.GET_PRODUCTS,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ slug, body }) => ({
        url: `${END_POINTS.GET_PRODUCTS}/${slug}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    deleteProduct: builder.mutation({
      query: (slug) => ({
        url: `${END_POINTS.GET_PRODUCTS}/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
    getVariants: builder.query({
      query: (params) => ({ url: END_POINTS.GET_VARIANTS, params }),
      providesTags: ['Variant'],
    }),
    getVariantBySlug: builder.query({
      query: (slug) => ({ url: `${END_POINTS.GET_VARIANTS}/${slug}` }),
      providesTags: ['Variant'],
    }),
    createVariant: builder.mutation({
      query: (body) => ({
        url: END_POINTS.GET_VARIANTS,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Variant'],
    }),
    updateVariant: builder.mutation({
      query: ({ slug, body }) => ({
        url: `${END_POINTS.GET_VARIANTS}/${slug}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Variant'],
    }),
    deleteVariant: builder.mutation({
      query: (slug) => ({
        url: `${END_POINTS.GET_VARIANTS}/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Variant'],
    }),

    getBookings: builder.query({
      query: (params) => ({ url: END_POINTS.GET_BOOKINGS, params }),
      providesTags: ['Booking'],
    }),
    createBooking: builder.mutation({
      query: (body) => ({
        url: END_POINTS.MODIFY_BOOKING,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Booking'],
    }),
    updateBooking: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${END_POINTS.MODIFY_BOOKING}/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
  useGetStoresQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useGetSparesQuery,
  useCreateSpareMutation,
  useUpdateSpareMutation,
  useDeleteSpareMutation,
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useGetUnitsQuery,
  useGetQualitiesQuery,
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetVariantsQuery,
  useGetVariantBySlugQuery,
  useCreateVariantMutation,
  useUpdateVariantMutation,
  useDeleteVariantMutation,
  useGetBookingsQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
} = erpApi;
