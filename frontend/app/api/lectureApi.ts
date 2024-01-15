import axiosClient from "./axiosClient";

const lectureApi = {
    getAll: (params: Object) => {
        const url = `/courses/chapters/lecture`;
        return axiosClient.get(url, { params });
    },

    get: (id: number) => {
        const url = `/courses/chapters/lectures/${id}`;
        return axiosClient.get(url);
    },

    create: (data: object,) => {
        const url = `/courses/chapters/lectures`;
        return axiosClient.post(url, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        });
    },

    update: (data: object, id: number) => {
        const url = `/courses/chapters/lectures/${id}`;
        return axiosClient.put(url, { data });
    },

    delete: (id: number) => {
        const url = `/courses/chapters/lectures/${id}`;
        return axiosClient.delete(url);
    },
}

export default lectureApi;