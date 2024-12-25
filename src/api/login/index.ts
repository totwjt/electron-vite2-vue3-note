import request from '@/service/axios'
import type { UserType } from './types'
export const loginApi = (data: Partial<UserType>): Promise<IResponse<UserType>> => {
    return request.post({ url: '/auth/manage/login/pwd', data })
}
