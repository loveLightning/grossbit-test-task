import { Component } from 'react'
import { AxiosRequestConfig } from 'axios'
import { axiosBase } from './axios'

export class BaseService extends Component {
  public static async fetch<T>(props: AxiosRequestConfig) {
    return axiosBase.request<T>(props)
  }
}
