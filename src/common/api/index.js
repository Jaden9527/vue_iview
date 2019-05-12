import axios from './axios'
import config from './apiConfig'
const baseUrl = config.baseUrl
let instance = axios();
export default {
    get(url, params, headers) {
        let options = {}
        if (params) {
            options.params = params
        }
        if (headers) {
            options.headers = headers
        }
        return instance.get(baseUrl + url, options)
    },
    post(url, params, headers) {
        let options = {}
        if (headers) {
            options.headers = headers
        }
        return instance.post(baseUrl + url, params, options)
    },
    put(url, params, headers) {
        let options = {}
        if (headers) {
            options.headers = headers
        }
        return instance.put(url, params, options)
    },
    delete(url, params, headers) {
        let options = {}
        if (params) {
            options.params = params
        }
        if (headers) {
            options.headers = headers
        }
        return instance.delete(url, options)
    }
}