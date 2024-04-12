import axiosConfig from "@/redux/axios.config"

const paymentApi = {
    getPayment: () => {
        const url = `/payment/pay`;
        return axiosConfig.post(url, {
            amount: '10000',
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
    deleteCart: (id_course: any) => {
        const url = `/cart/${id_course}`;
        return axiosConfig.delete(url);
    },
    getCartOfStudent: (id_student: any) => {
        const url = `/cart/${id_student}`;
        return axiosConfig.get(url);
    },

}

export default paymentApi;