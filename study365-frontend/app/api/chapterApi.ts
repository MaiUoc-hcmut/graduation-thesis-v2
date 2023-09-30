import axiosClient from "./axiosClient";

const chapterApi = {
    getAll: (params: Object) => {
        const url = `/courses/chapters`;
        return axiosClient.get(url, { params });
    },

    get: (id: number) => {
        const url = `/courses/chapters/${id}`;
        return axiosClient.get(url);
    },

    getFull: (params: Object) => {
        const url = `/courses/chapters/all`;
        return axiosClient.get(url, { params });
    },

    create: (data: object) => {
        const url = `/courses/chapters`;
        return axiosClient.post(url, { data });
    },

    update: (data: object, id: number) => {
        const url = `/courses/chapters/${id}`;
        return axiosClient.put(url, { data });
    },

    delete: (id: number) => {
        const url = `/courses/chapters/${id}`;
        return axiosClient.delete(url);
    },
}

export default chapterApi;