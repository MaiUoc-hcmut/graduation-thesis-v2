import axiosConfig from "@/redux/axios.config"

const userApi = {
    getAllTeacher: () => {
        const url = `/teacher/get-all-teacher`;
        return axiosConfig.get(url);
    },
    addToCart: (id_course: any, id_cart: string) => {
        const url = `/payment/cart/${id_cart}`;
        return axiosConfig.post(url, { data: { id_course } }, {
            baseURL: 'http://localhost:4004/api/v1'
        });
    },
    getCart: (id_student: any) => {
        const url = `/payment/cart/${id_student}`;
        return axiosConfig.get(url, {
            baseURL: 'http://localhost:4004/api/v1'
        });
    },
    deleteCart: (id_course: any) => {
        const url = `/payment/cart/${id_course}`;
        return axiosConfig.delete(url, {
            baseURL: 'http://localhost:4004/api/v1'
        });
    },
    getCartOfStudent: (id_student: any) => {
        const url = `/payment/cart/${id_student}`;
        return axiosConfig.get(url, {
            baseURL: 'http://localhost:4004/api/v1'
        });
    },

}

export default userApi;