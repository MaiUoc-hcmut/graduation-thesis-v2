import axiosClient from "./axiosClient";

const courseApi = {
    getAll: (params: object) => {
        const url = `/lecture/comment`;
        return axiosClient.get(url, { params });
    },

    get: (id: string) => {
        const url = `/courses/${id}`;
        return axiosClient.get(url);
    },


    update: (id: string) => {
        const url = `/courses/${id}`;
        return axiosClient.get(url);
    },

    create: (data: object) => {
        const url = `/lecture/comment`;
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
