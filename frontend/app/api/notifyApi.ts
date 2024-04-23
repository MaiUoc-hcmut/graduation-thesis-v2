import axiosConfig from "@/redux/axios.config"
import { teacher } from "@/redux/features/teacherSlice";

const notifyApi = {
    getNotify: async (id_user: string) => {
        const url = `/notification/get-noti/${id_user}`;
        return await axiosConfig.get(url);
    },
    readNotify: async (data: object) => {
        const url = `/notification/read-noti`;
        return await axiosConfig.put(url, data);
    },
    teacherSendNotify: async (data: object) => {
        const url = `/notification/teacher-send`;
        return await axiosConfig.post(url, data);
    },

}

export default notifyApi;