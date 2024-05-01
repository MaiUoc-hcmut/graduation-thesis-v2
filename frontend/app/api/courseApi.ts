import axiosConfig from "@/redux/axios.config"

const courseApi = {
    getAllByTeacher: (id_teacher: string, page: string) => {
        if (page == null) page = '1'
        const url = `/courses/teacher/${id_teacher}/page/${page}`;
        return axiosConfig.get(url);
    },

    getAll: (filterString: string) => {
        const url = `/courses/page/1?${filterString}`;
        return axiosConfig.get(url);
    },

    get: async (id: string) => {
        const url = `/courses/full/${id}`;
        return await axiosConfig.get(url);
    },

    searchCourseByCreateTeacher: async (id_teacher: string, params: object) => {
        const url = `/courses/search/teacher/${id_teacher}/page/1`;
        return await axiosConfig.get(url, { params });
    },

    searchForum: async (id_forum: string, params: object) => {
        const url = `/topicsforum/search/${id_forum}/page/1`;
        return await axiosConfig.get(url, { params });
    },

    getProgress: async (id_student: string, id_course: string) => {
        const url = `/progresses/${id_student}/${id_course}`;
        return await axiosConfig.get(url);
    },

    filter: (filterString: string) => {
        const url = `/courses/filter/page/1?${filterString}`;
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

    studentBuyCourse: async (id_course: string) => {
        const url = `/courses/${id_course}`;
        return axiosConfig.post(url);

    },
    studentGetCourse: async (id_user: string) => {
        const url = `/courses/student/${id_user}/page/1`;
        return axiosConfig.get(url);

    },

    delete: (id: string) => {
        const url = `/courses/${id}`;
        return axiosConfig.delete(url);
    },

    createReview: async (data: object) => {
        const url = `/reviews`;

        await axiosConfig.post(url, data, {
            baseURL: 'http://localhost:4001/api/v1'
        });
        return
    },

    getReview: (id: string) => {
        const url = `/reviews/course/${id}/page/1`;
        return axiosConfig.get(url, {
            baseURL: 'http://localhost:4001/api/v1'
        });
    },

    getAllReview: () => {
        const url = `/reviews`;
        return axiosConfig.get(url, {
            baseURL: 'http://localhost:4001/api/v1'
        });
    },

    getCommentByTopic: (id: string, page: number) => {
        const url = `/comments/topic/${id}/page/${page}`;
        return axiosConfig.get(url);
    },

    createComment: (data: object) => {
        const url = `/comments`;
        return axiosConfig.post(url, data);
    },

    deleteComment: (id_comment: string) => {
        const url = `/comments/${id_comment}`;
        return axiosConfig.delete(url);
    },

    deleteTopicForum: (id_topic: string) => {
        const url = `/topicsforum/${id_topic}`;
        return axiosConfig.delete(url);
    },

    uploadVideo: (video: object) => {
        const url = `/images`;
        return axiosConfig.post(url, video);
    },

    createProgress: (data: object) => {
        const url = `/progresses/increase`;
        return axiosConfig.post(url, data);
    },

    createTopicForum: (data: object) => {
        const url = `/topicsforum`;
        return axiosConfig.post(url, data);
    },

    editTopicForum: (data: object, id_topic: string) => {
        const url = `/topicsforum/${id_topic}`;
        return axiosConfig.put(url, data);
    },

    createAnswerOfTopic: (data: object) => {
        const url = `/answers`;
        return axiosConfig.post(url, data);
    },

    getForumOfCourse: (id_course: string, page: number) => {
        const url = `/forums/${id_course}/page/${page}`;
        return axiosConfig.get(url);
    },
    getTopicForum: (id_topic: string, page: number) => {
        const url = `/topicsforum/${id_topic}/page/${page}`;
        return axiosConfig.get(url)
    },
    getAllStudenBuyCourseOfTeacher: (id_teacher: string, page: string) => {
        const url = `/courses/all-student/teacher/${id_teacher}/page/${page}`;
        return axiosConfig.get(url);
    },
    getAllStudenBuySpecificCourseOfTeacher: (id_course: string, id_teacher: string, page: string) => {
        const url = `/courses/all-student/teacher/${id_teacher}/page/${page}?id_course=${id_course}`;
        return axiosConfig.get(url);
    },
    getAllStudenBuySpecificCourse: (id_course: string, page: string) => {
        const url = `/courses/${id_course}/student-course/page/${page}`;
        return axiosConfig.get(url);
    },

}

export default courseApi;
