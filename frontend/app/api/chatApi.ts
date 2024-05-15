import axiosConfig from "@/redux/axios.config"

const chatApi = {
    getMessageOfGroup: (id_group: string, lastMessage: string) => {
        const url = lastMessage === "" ? `/messages/group/${id_group}` : `/messages/group/${id_group}?lastMessage=${lastMessage}`;
        return axiosConfig.get(url);
    },

    getGroupOfUser: () => {
        const url = `/groups/list`;
        return axiosConfig.get(url);
    },

    createMessage: async (data: object) => {
        const url = `/messages`;

        return await axiosConfig.post(url, data);

    },
    createGroup: async (data: object) => {
        const url = `/groups`;

        return await axiosConfig.post(url, data);
    },

}

export default chatApi;