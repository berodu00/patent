import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export interface Patent {
    id: string;
    applicationNumber: string;
    title: string;
    description?: string;
    applicationDate: string;
    registrationDate?: string;
    status: string;
    applicant?: {
        id: string;
        email: string;
        name: string;
    };
    created_at: string;
}

export interface CreatePatentRequest {
    applicationNumber: string;
    title: string;
    description?: string;
    applicationDate: string;
    status?: string;
}

export interface UpdatePatentRequest extends Partial<CreatePatentRequest> {
    id: string;
}

export interface PatentListResponse {
    data: Patent[];
    total: number;
}

export const patentsApi = createApi({
    reducerPath: 'patentsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:3000',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Patent', 'InternationalApplication', 'CostItem', 'Attachment', 'Dashboard'] as any[],
    endpoints: (builder) => ({
        getPatents: builder.query<PatentListResponse, { page?: number; limit?: number; search?: string; status?: string }>({
            query: (params) => ({
                url: '/patents',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Patent' as const, id })),
                        { type: 'Patent', id: 'LIST' },
                    ]
                    : [{ type: 'Patent', id: 'LIST' }],
        }),
        getPatent: builder.query<Patent, string>({
            query: (id) => `/patents/${id}`,
            providesTags: (result, error, id) => [{ type: 'Patent', id }],
        }),
        createPatent: builder.mutation<Patent, CreatePatentRequest>({
            query: (body) => ({
                url: '/patents',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Patent', id: 'LIST' }],
        }),
        updatePatent: builder.mutation<Patent, UpdatePatentRequest>({
            query: ({ id, ...body }) => ({
                url: `/patents/${id}`,
                method: 'PATCH',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Patent', id }, { type: 'Patent', id: 'LIST' }],
        }),
        deletePatent: builder.mutation<void, string>({
            query: (id) => ({
                url: `/patents/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Patent', id: 'LIST' }],
        }),

        // International Applications
        getInternationalApps: builder.query<any[], string>({
            query: (patentId) => `/patents/${patentId}/international`,
            providesTags: (result, error, patentId) => [{ type: 'InternationalApplication' as const, id: `LIST_${patentId}` }],
        }),
        addInternationalApp: builder.mutation<any, { patentId: string; body: any }>({
            query: ({ patentId, body }) => ({
                url: `/patents/${patentId}/international`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { patentId }) => [{ type: 'InternationalApplication', id: `LIST_${patentId}` }],
        }),
        deleteInternationalApp: builder.mutation<void, { patentId: string; iaId: string }>({
            query: ({ iaId }) => ({
                url: `/patents/international/${iaId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { patentId }) => [{ type: 'InternationalApplication', id: `LIST_${patentId}` }],
        }),

        // Cost Management
        getCosts: builder.query<any[], string>({
            query: (patentId) => `/patents/${patentId}/costs`,
            providesTags: (result, error, patentId) => [{ type: 'CostItem' as const, id: `LIST_${patentId}` }],
        }),
        addCost: builder.mutation<any, { patentId: string; body: any }>({
            query: ({ patentId, body }) => ({
                url: `/patents/${patentId}/costs`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { patentId }) => [{ type: 'CostItem', id: `LIST_${patentId}` }],
        }),
        deleteCost: builder.mutation<void, { patentId: string; costId: string }>({
            query: ({ costId }) => ({
                url: `/patents/costs/${costId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { patentId }) => [{ type: 'CostItem', id: `LIST_${patentId}` }],
        }),

        // File Management
        getAttachments: builder.query<any[], string>({
            query: (patentId) => `/patents/${patentId}/attachments`,
            providesTags: (result, error, patentId) => [{ type: 'Attachment' as const, id: `LIST_${patentId}` }],
        }),
        uploadAttachment: builder.mutation<any, { patentId: string; file: File }>({
            query: ({ patentId, file }) => {
                const formData = new FormData();
                formData.append('file', file);
                return {
                    url: `/patents/${patentId}/attachments`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: (result, error, { patentId }) => [{ type: 'Attachment', id: `LIST_${patentId}` }],
        }),
        deleteAttachment: builder.mutation<void, { patentId: string; attId: string }>({
            query: ({ attId }) => ({
                url: `/patents/attachments/${attId}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, { patentId }) => [{ type: 'Attachment', id: `LIST_${patentId}` }],
        }),

        // Dashboard
        getDashboardStats: builder.query<{ totalPatents: number, statusDistribution: Record<string, number> }, void>({
            query: () => '/dashboard/statistics',
            providesTags: [{ type: 'Dashboard', id: 'LIST' }],
        }),
        getDashboardTrends: builder.query<{ name: string, applications: number, registrations: number }[], void>({
            query: () => '/dashboard/trends',
            providesTags: [{ type: 'Dashboard', id: 'LIST' }],
        }),

        // KIPRIS Sync
        syncPatent: builder.mutation<any, string>({
            query: (id) => ({
                url: `/patents/${id}/sync`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Patent', id },
                { type: 'Patent', id: 'LIST' },
                'Dashboard' as any
            ],
        }),
    }),
});

export const {
    useGetPatentsQuery,
    useGetPatentQuery,
    useCreatePatentMutation,
    useUpdatePatentMutation,
    useDeletePatentMutation,
    useGetInternationalAppsQuery,
    useAddInternationalAppMutation,
    useDeleteInternationalAppMutation,
    useGetCostsQuery,
    useAddCostMutation,
    useDeleteCostMutation,
    useGetAttachmentsQuery,
    useUploadAttachmentMutation,
    useDeleteAttachmentMutation,
    useGetDashboardStatsQuery,
    useGetDashboardTrendsQuery,
    useSyncPatentMutation,
} = patentsApi;
