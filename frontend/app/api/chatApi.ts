import axiosConfig from "@/redux/axios.config"

const chatApi = {
    getMessageOfGroup: (id_group: string, page: string) => {
        const url = `/messages/group/${id_group}/scroll/${page}`;
        return axiosConfig.get(url);
    },

    createMessage: async (data: object) => {
        const url = `/messages`;

        await axiosConfig.post(url, data);
        return
    },

}

export default chatApi;