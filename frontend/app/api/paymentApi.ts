import axiosConfig from "@/redux/axios.config"

const paymentApi = {
    getPayment: (amount: string) => {
        const url = `/payment/pay`;
        return axiosConfig.post(url, {
            amount: amount,
            orderInfo: 'dsc'
        });
    },
    addToCart: (id_course: any) => {
        const url = `/cart/student`;
        return axiosConfig.post(url, { data: { id_course } });
    },
    deleteCart: (data: any) => {
        const url = `/cart/student`;
        return axiosConfig.delete(url, { data });
    },
    getCartOfStudent: () => {
        const url = `/cart/student`;
        return axiosConfig.get(url);
    },
    sendInfoTransaction: (data: object) => {
        const url = `/payment/receive-ipn`;
        return axiosConfig.post(url, data);
    },

}

export default paymentApi;