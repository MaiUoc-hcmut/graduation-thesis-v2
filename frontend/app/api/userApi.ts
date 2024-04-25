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
        return axiosConfig.get(url);
    },
}

export default userApi;