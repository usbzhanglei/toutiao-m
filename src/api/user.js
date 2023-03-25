// 用户相关请求
import request from '@/utils/request'
// import store from '@/store'
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
// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    method: 'get',
    url: '/v1_0/user'
    // 发送请求头数据
    // headers: {
    //   // 注意：该接口需要授权才能访问
    //   //    token数据格式： Bearer token数据  注意：Bearer 后面有空格
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
// 获取频道列表
export const getUserChannels = () => {
  return request({
    method: 'get',
    url: '/v1_0/user/channels'
  })
}
