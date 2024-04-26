import axiosConfig from "@/redux/axios.config"

const userApi = {
    getAllTeacher: (filterstring: string) => {
        const url = `/teacher/page/1?${filterstring}`;
        return axiosConfig.get(url);
    },

    getProfileTeacher: (id_teacher: string) => {
        const url = `/teacher/get-profile-teacher/${id_teacher}`;
        return axiosConfig.get(url);
    },
    getReviewOfTeacher: (id: string) => {
        const url = `/reviews/teacher/${id}/page/1`;
        return axiosConfig.get(url, {
            baseURL: 'http://localhost:4000/api/v1'
        });
    },
    createReviewTeacher: async (data: object) => {
        const url = `/reviews`;

        await axiosConfig.post(url, data, {
            baseURL: 'http://localhost:4000/api/v1'
        });
        return
    },
}

export default userApi;