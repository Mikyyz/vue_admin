import axios from 'axios';
import store from '../store'
import { getToken } from '@/utils/auth'


const baseUrl = process.env.VUE_APP_URL;
//创建axios实例
const request = axios.create({
    baseURL: baseUrl, //baseUrl
    //baseURL: '',
    method: 'GET',  //默认的请求方法
    timeout: 50000 //请求的超时时间
})

//request请求拦截器
request.interceptors.request.use(config => {
    if (store.getters.token) {
        config.headers['Authorization'] = getToken();// 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config;
}, error => {
        // Do something with request error
         // for debug
        Promise.reject(error)
})


export default request;


