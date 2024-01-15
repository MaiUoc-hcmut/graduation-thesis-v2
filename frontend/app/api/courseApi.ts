import axiosClient from "./axiosClient";

const courseApi = {
    getAllByTeacher: (params: Object) => {
        const url = '/courses';
        return axiosClient.get(url, { params });
    },

    getAll: (params: Object) => {
        const url = '/courses';
        return axiosClient.get(url, { params });
    },

    get: (id: string) => {
        const url = `/courses/${id}`;
        return axiosClient.get(url);
    },

    getFull: (id: string) => {
        const url = `/courses/${id}/all`;
        return axiosClient.get(url);
    },

    update: (id: string) => {
        const url = `/courses/${id}`;
        return axiosClient.get(url);
    },

    create: (data: object) => {
        const url = `/courses`;
        return axiosClient.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
    },
    delete: (id: number) => {
        const url = `/courses/${id}`;
        return axiosClient.delete(url);
    },
}

export default courseApi;
