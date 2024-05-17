import axios, { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { config } from 'process';

const instance = axios.create({
    baseURL: 'http://localhost:4000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})

instance.interceptors.request.use(

    (config) => {

        if (config && config.url) {

            if (
                config.url.indexOf('/login') >= 0 ||
                config.url.indexOf('/register') >= 0 ||
                // config.url.indexOf('/teacher') >= 0 ||
                config.url.indexOf('/refresh-token') >= 0

            ) {
                config.baseURL = 'http://localhost:4000/api/v1';
                return config;
            }

            // // Request to course service
            if (
                // config.url.indexOf('/reviews') >= 0 ||
                config.url.indexOf('/comments') >= 0 ||
                config.url.indexOf('/courses') >= 0 ||
                config.url.indexOf('/coupons') >= 0 ||
                config.url.indexOf('/progresses') >= 0
            ) {
                config.baseURL = 'http://localhost:4001/api/v1';
            }


            if (
                config.url.indexOf('/images') >= 0 ||
                config.url.indexOf('/answers') >= 0 ||
                config.url.indexOf('/forums') >= 0 ||
                config.url.indexOf('/topicsforum') >= 0
            ) {
                config.baseURL = 'http://localhost:4001/api/v1';
                config.headers['Content-Type'] = 'multipart/form-data';
                config.headers['Accept'] = 'multipart/form-data';
            }

            if (
                config.url.indexOf('/exams') >= 0 ||
                config.url.indexOf('assignments/student') >= 0 ||
                config.url.indexOf('/assignments') >= 0
            ) {
                config.baseURL = 'http://localhost:4002/api/v1';
            }
            if (
                config.url.indexOf('/notification') >= 0
            ) {
                config.baseURL = 'http://localhost:4003/api/v1';
            }
            if (
                config.url.indexOf('/test') >= 0 ||
                config.url.indexOf('/payment') >= 0 ||
                config.url.indexOf('/cart') >= 0
            ) {
                config.baseURL = 'http://localhost:4004/api/v1';
            }
            if (
                config.url.indexOf('/messages') >= 0 ||
                config.url.indexOf('/groups') >= 0
            ) {
                config.baseURL = 'http://localhost:4005/api/v1';
            }
        }

        let accessToken = localStorage.getItem('accessToken');
        let expire = null;

        // If there is access token exist, attach the access token to headers when send a request
        if (accessToken) {
            let parsedAccessToken = JSON.parse(accessToken);
            config.headers.Authorization = `Bearer ${parsedAccessToken}`;
            const decodedToken = jwtDecode(parsedAccessToken) as { [key: string]: any };
            expire = decodedToken.exp;
        }

        // If the access token has expire, send request to refresh the access token
        // if (expire < new Date().getTime() / 1000) {
        //     const refreshToken = localStorage.getItem('refreshToken');

        //     if (refreshToken) {
        //         const parsedRefreshToken = JSON.parse(refreshToken);
        //         let decodedRefToken = jwtDecode(parsedRefreshToken) as { [key: string]: any }
        //         let refExpire = decodedRefToken.exp;

        //         // If the refresh token has expire, redirect user to login page
        //         if (refExpire < new Date().getTime() / 1000) {
        //             window.location.href = '/login';
        //         }
        //         instance
        //             .post('auth-teacher/refresh-token', { parsedRefreshToken })
        //             .then(response => {
        //                 if (response.data.accessToken) localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
        //                 if (response.data.refreshToken) localStorage.setItem('accessToken', JSON.stringify(response.data.refreshToken));
        //                 let parsedAccessToken = JSON.parse(response.data.accessToken);
        //                 config.headers.Authorization = `Bearer ${parsedAccessToken}`;
        //             })
        //             .catch(error => {
        //                 return Promise.reject(error);
        //             });
        //     }
        // }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)


// instance.interceptors.response.use((response) => {
//     if (response && response.data) {
//         return response.data;
//     }

//     return response;
// }, (error) => {
//     // Handle errors
//     throw error;
// });


export const setAuthToken = async (token: string) => {
    if (token) {
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};

export default instance;