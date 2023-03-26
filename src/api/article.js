// 文章请求模块
import request from '@/utils/request'
// 请求获取文章列表数据
export const getArticle = params => {
  return request({
    method: 'get',
    url: '/v1_0/articles',
    params
  })
}
