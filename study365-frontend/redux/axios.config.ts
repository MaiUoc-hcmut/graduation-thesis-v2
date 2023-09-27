import axios, { AxiosResponse } from 'axios';
import { error } from 'console';
import jwtDecode from 'jwt-decode';
import dotenv from 'dotenv';

const instance = axios.create({
    baseURL: 'http://localhost:4000/api/v1',
    timeout: 2000,
    headers: {
        contentType: 'application/json',
    },
})

instance.interceptors.request.use(
    (config) => {
        // If the request is login, register or refresh token, we dont need to attach access token
        if (config && config.url) {
            if (
                config.url.indexOf('/login') >= 0 ||
                config.url.indexOf('/register') >= 0 ||
                config.url.indexOf('/refresh-token') >= 0
            ) {
                return config;
            }
        }

        let accessToken = localStorage.getItem('accessToken');
        let expire = null;

        // If there is access token exist, attach the access token to headers when send a request
        if (accessToken) {
            let parsedAccessToken = JSON.parse(accessToken);
            config.headers.Authorization = `Bearer ${accessToken}`;
            const decodedToken = jwtDecode(parsedAccessToken) as { [key: string]: any };
            expire = decodedToken.exp;
        }

        // If the access token has expire, send request to refresh the access token
        if (expire < new Date().getTime() / 1000) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                const parsedRefreshToken = JSON.parse(refreshToken);
                let decodedRefToken = jwtDecode(parsedRefreshToken) as { [key: string]: any }
                let refExpire = decodedRefToken.exp;

                // If the refresh token has expire, redirect user to login page
                if (refExpire < new Date().getTime() / 1000) {
                    window.location.href = '/login';
                }
                instance
                    .post('auth/refresh-token', { parsedRefreshToken })
                    .then(response => {
                        if (response.data.accessToken) localStorage.setItem('accessToken', JSON.stringify(response.data.accessToken));
                        if (response.data.refreshToken) localStorage.setItem('accessToken', JSON.stringify(response.data.refreshToken));
                    })
                    .catch(error => {
                        return Promise.reject(error);
                    });
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export const setAuthToken = async (token: string) => {
    if (token) {
        console.log('setAuthToken');
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};

export default instance;