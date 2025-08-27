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
    'Log',
    'Issue',
    'OtherIssue',
    'Question',
    'Invoice',
    'Payment',
    'StockLedger',
    'StockEntry',
    'Serial',
    'PriceLog',
    'InventoryConfig',
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
    createUnit: builder.mutation({
      query: (body) => ({
        url: END_POINTS.GET_UNITS,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Unit'],
    }),
    updateUnit: builder.mutation({
      query: ({ slug, body }) => ({
        url: `${END_POINTS.GET_UNITS}/${slug}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Unit'],
    }),
    deleteUnit: builder.mutation({
      query: (slug) => ({
        url: `${END_POINTS.GET_UNITS}/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Unit'],
    }),
    getQualities: builder.query({
      query: () => ({ url: END_POINTS.GET_QUALITIES }),
      providesTags: ['Quality'],
    }),
    createQuality: builder.mutation({
      query: (body) => ({
        url: END_POINTS.GET_QUALITIES,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Quality'],
    }),
    updateQuality: builder.mutation({
      query: ({ slug, body }) => ({
        url: `${END_POINTS.GET_QUALITIES}/${slug}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Quality'],
    }),
    deleteQuality: builder.mutation({
      query: (slug) => ({
        url: `${END_POINTS.GET_QUALITIES}/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Quality'],
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
    cancelBooking: builder.mutation({
      query: ({ id, reason }) => ({
        url: `${END_POINTS.MODIFY_BOOKING}/${id}`,
        method: 'PATCH',
        body: { status: 'cancelled', reason },
      }),
      invalidatesTags: ['Booking'],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `${END_POINTS.MODIFY_BOOKING}/${id}`,
        method: 'PATCH',
        body: { status, reason },
      }),
      invalidatesTags: ['Booking'],
    }),
    getIssues: builder.query({
      query: () => ({ url: END_POINTS.GET_ISSUES }),
      providesTags: ['Issue'],
    }),
    createIssue: builder.mutation({
      query: (body) => ({
        url: END_POINTS.MODIFY_ISSUE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Issue'],
    }),
    updateIssue: builder.mutation({
      query: ({ id, body }) => ({
        url: `${END_POINTS.MODIFY_ISSUE}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Issue'],
    }),
    deleteIssue: builder.mutation({
      query: (id) => ({
        url: `${END_POINTS.MODIFY_ISSUE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Issue'],
    }),
    getOtherIssues: builder.query({
      query: () => ({ url: END_POINTS.GET_OTHER_ISSUES }),
      providesTags: ['OtherIssue'],
    }),
    createOtherIssue: builder.mutation({
      query: (body) => ({
        url: END_POINTS.MODIFY_OTHER_ISSUE,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OtherIssue'],
    }),
    updateOtherIssue: builder.mutation({
      query: ({ id, body }) => ({
        url: `${END_POINTS.MODIFY_OTHER_ISSUE}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['OtherIssue'],
    }),
    deleteOtherIssue: builder.mutation({
      query: (id) => ({
        url: `${END_POINTS.MODIFY_OTHER_ISSUE}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['OtherIssue'],
    }),
    getQuestions: builder.query({
      query: (params) => ({ url: END_POINTS.GET_QUESTIONS, params }),
      providesTags: ['Question'],
    }),
    createQuestion: builder.mutation({
      query: (body) => ({
        url: END_POINTS.MODIFY_QUESTION,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Question'],
    }),
    updateQuestion: builder.mutation({
      query: ({ id, body }) => ({
        url: `${END_POINTS.MODIFY_QUESTION}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Question'],
    }),
    deleteQuestion: builder.mutation({
      query: (id) => ({
        url: `${END_POINTS.MODIFY_QUESTION}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),
    getInvoices: builder.query({
      query: () => ({ url: '/api/invoices/' }),
      providesTags: ['Invoice'],
    }),
    createInvoice: builder.mutation({
      query: (body) => ({
        url: '/api/invoices/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Invoice'],
    }),
    getInvoicePdf: builder.query({
      query: (id) => ({
        url: `/api/invoices/${id}/pdf/`,
        responseHandler: (response) => response.blob(),
      }),
    }),
    getPayments: builder.query({
      query: () => ({ url: '/api/payments/' }),
      providesTags: ['Payment'],
    }),
    createPayment: builder.mutation({
      query: (body) => ({
        url: '/api/payments/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Payment', 'Invoice'],
    }),
    getLogs: builder.query({
      query: (params) => ({ url: '/api/logs/', params }),
      providesTags: ['Log'],
    }),

    getStockLedgers: builder.query({
      query: (params) => ({ url: END_POINTS.GET_STOCK_LEDGERS, params }),
      providesTags: ['StockLedger'],
    }),
    getStockEntries: builder.query({
      query: (params) => ({ url: END_POINTS.GET_STOCK_ENTRIES, params }),
      providesTags: ['StockEntry'],
    }),
    createStockEntry: builder.mutation({
      query: (body) => ({
        url: END_POINTS.MODIFY_STOCK_ENTRY,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['StockLedger', 'StockEntry'],
    }),
    getSerials: builder.query({
      query: (params) => ({ url: END_POINTS.GET_SERIALS, params }),
      providesTags: ['Serial'],
    }),
    updateSerial: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `${END_POINTS.MODIFY_SERIAL}/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['Serial'],
    }),
    getPriceLogs: builder.query({
      query: (params) => ({ url: END_POINTS.GET_PRICE_LOGS, params }),
      providesTags: ['PriceLog'],
    }),
    getInventoryConfig: builder.query({
      query: () => ({ url: END_POINTS.GET_INVENTORY_CONFIG }),
      providesTags: ['InventoryConfig'],
    }),
    updateInventoryConfig: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${END_POINTS.MODIFY_INVENTORY_CONFIG}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['InventoryConfig'],
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
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
  useGetQualitiesQuery,
  useCreateQualityMutation,
  useUpdateQualityMutation,
  useDeleteQualityMutation,
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
  useCancelBookingMutation,
  useUpdateBookingStatusMutation,
  useGetIssuesQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useGetOtherIssuesQuery,
  useCreateOtherIssueMutation,
  useUpdateOtherIssueMutation,
  useDeleteOtherIssueMutation,
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetInvoicesQuery,
  useCreateInvoiceMutation,
  useGetInvoicePdfQuery,
  useGetPaymentsQuery,
  useCreatePaymentMutation,
  useGetLogsQuery,
  useGetStockLedgersQuery,
  useGetStockEntriesQuery,
  useCreateStockEntryMutation,
  useGetSerialsQuery,
  useUpdateSerialMutation,
  useGetPriceLogsQuery,
  useGetInventoryConfigQuery,
  useUpdateInventoryConfigMutation,
} = erpApi;
