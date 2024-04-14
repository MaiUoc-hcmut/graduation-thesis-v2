import axiosConfig from "@/redux/axios.config"

const paymentApi = {
    getPayment: (amount: string) => {
        const url = `/payment/pay`;
        return axiosConfig.post(url, {
            amount: amount,
            orderInfo: 'dsc'
        });
    },
    addToCart: (id_course: any, id_cart: string) => {
        const url = `/cart/${id_cart}`;
        return axiosConfig.post(url, { data: { id_course } });
    },
    getCart: (id_student: any) => {
        const url = `/cart/${id_student}`;
        return axiosConfig.get(url);
    },
    deleteCart: (id_course: any, data: any) => {
        const url = `/cart/${id_course}`;
        return axiosConfig.delete(url, { data });
    },
    getCartOfStudent: (id_student: any) => {
        const url = `/cart/${id_student}`;
        return axiosConfig.get(url);
    },

}

export default paymentApi;