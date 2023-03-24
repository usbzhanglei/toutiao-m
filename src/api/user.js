// 用户相关请求
import request from '@/utils/request'
export const login = data => {
  return request({
    method: 'post',
    url: 'v1_0/authorizations',
    data
  })
}
// 发送验证码
// 每个手机号每分钟只能发一次
export const sendSms = mobile => {
  return request({
    method: 'get',
    url: `v1_0/sms/codes/${mobile}`
  })
}
