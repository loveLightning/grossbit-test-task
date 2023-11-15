import axios from 'axios'

export const axiosBase = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosBase.defaults.baseURL = ''
