import axiosConfig from "@/redux/axios.config"

const courseApi = {
    // getAllByTeacher: (params: Object) => {
    //     const url = '/courses';
    //     return axiosClient.get(url, { params });
    // },

    // getAll: (params: Object) => {
    //     const url = '/courses';
    //     return axiosClient.get(url, { params });
    // },

    // get: (id: string) => {
    //     const url = `/courses/${id}`;
    //     return axiosClient.get(url);
    // },

    // getFull: (id: string) => {
    //     const url = `/courses/${id}/all`;
    //     return axiosClient.get(url);
    // },

    // update: (id: string) => {
    //     const url = `/courses/${id}`;
    //     return axiosClient.get(url);
    // },

    create: async (data: object) => {
        const url = `/courses`;
        const course = await axiosConfig.post(url, data);
        return course
    },

    // delete: (id: number) => {
    //     const url = `/courses/${id}`;
    //     return axiosClient.delete(url);
    // },
}

export default courseApi;
