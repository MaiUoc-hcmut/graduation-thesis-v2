import axiosClient from "./axiosClient";

const paymentApi = {
    getAll: () => {
        const url = `/test`;
        return axiosClient.get(url, {
            baseURL: 'http://localhost:4004/api/v1'
        });
    },
}

export default paymentApi;