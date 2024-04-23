import axiosConfig from "@/redux/axios.config"

const notifyApi = {
    getNotify: async (id_user: string) => {
        const url = `/notification/get-noti/${id_user}`;
        return await axiosConfig.get(url);
    },
    readNotify: async (data: object) => {
        const url = `/notification/read-noti`;
        return await axiosConfig.post(url, data);
    },

}

export default notifyApi;