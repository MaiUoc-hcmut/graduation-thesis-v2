import axiosConfig from "@/redux/axios.config"

const paymentApi = {
    getAll: () => {
        const url = `/test`;
        return axiosConfig.get(url);
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