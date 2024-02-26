import axiosConfig from "@/redux/axios.config"

const courseApi = {
    getAllByTeacher: (id_teacher: string) => {
        const url = `/courses/teacher/${id_teacher}`;
        return axiosConfig.get(url);
    },

    getAll: () => {
        const url = '/courses';
        return axiosConfig.get(url);
    },

    get: async (id: string) => {
        const url = `/courses/full/${id}`;
        return await axiosConfig.get(url);
    },

    filter: (filterString: string) => {
        const url = `/courses/filter?${filterString}`;
        return axiosConfig.get(url);
    },


    // update: (id: string) => {
    //     const url = `/courses/${id}`;
    //     return axiosClient.get(url);
    // },

    create: async (data: object) => {
        const url = `/courses`;
        axiosConfig.post(url, data).then((course) => {
            Promise.all()
            update
            return course
        });

    },

    delete: (id: string) => {
        const url = `/courses/${id}`;
        return axiosConfig.delete(url);
    },

    createReview: async (data: object) => {
        const url = `/reviews`;

        await axiosConfig.post(url, data);
        return
    },

    getReview: (id: string) => {
        const url = `/reviews/course/${id}`;
        return axiosConfig.get(url);
    },

    getCommentByLecture: (id: string) => {
        const url = `/comments/${id}`;
        return axiosConfig.get(url);
    },

    createComment: (data: object) => {
        const url = `/comments`;
        return axiosConfig.post(url, data);
    },

    uploadVideo: (video: object) => {
        const url = `/images`;
        return axiosConfig.post(url, video);
    },
}

export default courseApi;
