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
// 添加关注
export const addFollow = target => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target
    }
  })
}
// 取消关注
export const deleteFollow = target => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${target}`
  })
}
// 获取当前登录用户的个人信息
export const getUserProfile = () => {
  return request({
    method: 'get',
    url: '/v1_0/user/profile'
  })
}
// 修改当前登录用户资料
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}
// 修改当前登录用户头像
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}
