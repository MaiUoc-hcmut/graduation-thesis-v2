import axiosConfig from "@/redux/axios.config"

const examApi = {
    getAllExamByTeacher: (id_teacher: string, page: string) => {
        const url = `/exams/teacher/${id_teacher}/page/${page}?exam=true`;
        return axiosConfig.get(url);
    },
    getAllQuizByTeacher: (id_teacher: string, page: string) => {
        const url = `/exams/teacher/${id_teacher}/page/${page}?exam=false`;
        return axiosConfig.get(url);
    },

    getAll: () => {
        const url = '/courses';
        return axiosConfig.get(url);
    },

    get: async (id: string) => {
        const url = `/exams/full/${id}`;
        return await axiosConfig.get(url);
    },
    searchExam: async (query: string) => {
        const url = `/exams/search/page/1?query=${query}`;
        return await axiosConfig.get(url);
    },

    getAssigmnentByExamId: async (id_student: string, id_exam: string) => {
        const url = `/assignments/student/${id_student}/exam/${id_exam}/page/1`;
        return await axiosConfig.get(url);
    },

    getAssigmnentByTeacherId: async (id_teacher: string, page: number, filterString: string) => {
        const url = `/assignments/teacher/${id_teacher}/page/${page}?${filterString}`;
        return await axiosConfig.get(url);
    },

    getDetailAssigmnent: async (id_assignment: string) => {
        const url = `/assignments/full/${id_assignment}`;
        return await axiosConfig.get(url);
    },



    update: (id: string, data: object) => {
        const url = `/exams/${id}`;
        return axiosConfig.put(url, data);
    },

    create: async (data: object) => {
        const url = `/exams`;
        return axiosConfig.post(url, data);

    },
    submitExam: async (data: object) => {
        const url = `/assignments`;
        return axiosConfig.post(url, data);

    },

    delete: (id: string) => {
        const url = `/exams/${id}`;
        return axiosConfig.delete(url);
    },



}

export default examApi;
