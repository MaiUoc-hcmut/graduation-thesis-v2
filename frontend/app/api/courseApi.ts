import axiosConfig from "@/redux/axios.config"

const courseApi = {
    getAllByTeacher: (id_teacher: string) => {
        const url = `/courses/teacher/${id_teacher}/page/1`;
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

    search: async (data: object) => {

        const url = `courses/search/page/1`;
        return await axiosConfig.post(url, data);
    },

    getProgress: async (id_student: string, id_course: string) => {
        const url = `/progresses/${id_student}/${id_course}`;
        return await axiosConfig.get(url);
    },

    filter: (filterString: string) => {
        const url = `/courses/filter?${filterString}`;
        return axiosConfig.get(url);
    },


    update: (id: string, data: object) => {
        console.log(data);

        const url = `/courses/${id}`;
        return axiosConfig.put(url, data);
    },

    create: async (data: object) => {
        const url = `/courses`;
        return axiosConfig.post(url, data);

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

    getCommentByTopic: (id: string) => {
        const url = `/comments/topic/${id}`;
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

    createProgress: (data: object) => {
        const url = `/progresses/increase`;
        return axiosConfig.post(url, data);
    },
}

export default courseApi;
