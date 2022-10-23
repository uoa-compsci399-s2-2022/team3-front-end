import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'


//export const baseURL = 'https://api.uoamtms.com/'
export const baseURL = import.meta.env.VITE_API_URL as string


// create axios instance
const instance = axios.create({
    baseURL: baseURL,
    timeout: 200000,
    headers:{
        'Cache-Control': 'no-cache'
    }
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


export function get(url: string, params?: any, timeout?:number): Promise<any> {
    if (timeout === undefined){
        timeout = 200000;
    }
    const config: AxiosRequestConfig = {
        method: 'get',
        url: url,
        params: params,
        timeout: timeout
    }
    return instance(config);
}

export function post(url: string, data: any=null, header?:any): Promise<any>{
    
    const config: AxiosRequestConfig = {
        method: 'post',
        url: url,
        data:data,
        headers: header
    }
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

export function Delete(url: string, params: {params?: any, data?: any}={}): Promise<any> {
    const config: AxiosRequestConfig = {
        method: 'delete',
        url: url,
        params: params.params,
        data: params.data
    }
    return instance(config);
}