import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { request } from 'http';
import { config } from 'process'



// create axios instance
const instance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    //withCredentials: true
})


/**
 * request interceptor
 * @description: request -> [request intercepter] -> server
 * JWT verifycation: Accept the token which sever responded, store the token into
 * pinia / local storage.
 */
instance.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = window.localStorage.getItem('mtms_token');

    if (token != null) {
        config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error: AxiosError) => {
        Promise.reject(error)
    }
)

/**
 * response interceptor
 * @description: intercept reponse
 */
instance.interceptors.response.use((responce: AxiosResponse) => {
    return responce.data;
})


export function get(url: string, params: any=null, timeout:number=20000): Promise<any> {
    const config: AxiosRequestConfig = {
        method: 'get',
        url: url,
        params: params,
        timeout: timeout
    }
    return instance(config);
}

export function post(url: string, data: any=null): Promise<any>{
    
    const config: AxiosRequestConfig = {
        method: 'post',
        url: url,
        data:data
    }
    console.log(config)
    return instance(config);
}


export function put(url: string, params: {params?: any, data?: any}): Promise<any>{
    
    const config: AxiosRequestConfig = {
        method: 'put',
        url: url,
        data:params.data,
        params: params.params,
    }
    console.log(config)
    return instance(config);
}

export function Delete(url: string, params: any=null): Promise<any> {
    const config: AxiosRequestConfig = {
        method: 'delete',
        url: url,
        params: params
    }
    return instance(config);
}