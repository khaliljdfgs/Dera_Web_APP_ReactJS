import axios from 'axios'
import { SERVER_URL } from '../config'

const API_SERVICE = () => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
  }

  return {
    get: (url, options = {}) => axios.get(SERVER_URL + url, { ...defaultOptions, ...options }),
    post: (url, data, options = {}) => axios.post(SERVER_URL + url, data, { ...defaultOptions, ...options }),
    put: (url, data, options = {}) => axios.put(SERVER_URL + url, data, { ...defaultOptions, ...options }),
    delete: (url, options = {}) => axios.delete(SERVER_URL + url, { ...defaultOptions, ...options }),
    patch: (url, data, options = {}) => axios.patch(SERVER_URL + url, data, { ...defaultOptions, ...options }),
  }
}

export default API_SERVICE