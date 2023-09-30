import axiosClient from "./axiosClient";

const productApi = {
    getAll: (params: Object) => {
        const url = '/courses';
        return axiosClient.get(url, { params });
    },

    get: (id: number) => {
        const url = `/courses/${id}`;
        return axiosClient.get(url);
    },

    getFull: (id: number) => {
        const url = `/courses/${id}/all`;
        return axiosClient.get(url);
    },

    update: (id: number) => {
        const url = `/courses/${id}`;
        return axiosClient.get(url);
    },
}

export default productApi;