import axiosClient from "./axiosClient";

const paymentApi = {
    getAll: () => {
        const url = `/test`;
        return axiosClient.get(url, {
            baseURL: 'http://localhost:4004/api/v1'
        });
    },
    addToCart: (id_course: any, id_cart: string) => {
        const url = `/payment/cart/${id_cart}`;
        return axiosClient.post(url, { data: { id_course } }, {
            baseURL: 'http://localhost:4004/api/v1'
        });
    },
    getCart: (id_student: any) => {
        const url = `/payment/cart/${id_student}`;
        return axiosClient.get(url, {
            baseURL: 'http://localhost:4004/api/v1'
        });
    },
    deleteCart: (id_course: any) => {
        const url = `/payment/cart/${id_course}`;
        return axiosClient.delete(url, {
            baseURL: 'http://localhost:4004/api/v1'
        });
    },
    getCartOfStudent: (id_student: any) => {
        const url = `/payment/cart/${id_student}`;
        return axiosClient.get(url, {
            baseURL: 'http://localhost:4004/api/v1'
        });
    },

}

export default paymentApi;