import axiosConfig from "@/redux/axios.config"

const notifyApi = {
    getNotify: async (id_user: string) => {
        const url = `/notification/get-noti/${id_user}`;
        return await axiosConfig.get(url);
    },

}

export default notifyApi;