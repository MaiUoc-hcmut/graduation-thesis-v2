import axiosConfig from "@/redux/axios.config"
import { changePassword } from "@/redux/features/teacherSlice";

const userApi = {
    getAllTeacher: (filterstring: string, page: string) => {
        const url = `/teacher/page/${page}?${filterstring}`;
        return axiosConfig.get(url);
    },

    getProfileTeacher: (id_teacher: string) => {
        const url = `/teacher/get-profile-teacher/${id_teacher}`;
        return axiosConfig.get(url);
    },
    getTeacherById: (id_teacher: string) => {
        const url = `/teacher/get-teacher-by-id/${id_teacher}`;
        return axiosConfig.get(url);
    },
    getReviewOfTeacher: (id: string, page: number) => {
        const url = `/reviews/teacher/${id}/page/${page}`;
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

    changePasswordTeacher: async (data: object) => {
        const url = `/teacher/change-password`;

        await axiosConfig.put(url, data);
        return
    }
}

export default userApi;