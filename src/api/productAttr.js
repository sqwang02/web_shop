import request from '@/utils/request'
// export function fetchList(cid,params) {
//   return request({
//     url:'/productAttribute/list/'+cid,
//     method:'get',
//     params:params
//   })
// }

export function fetchList(id,params) {
  return request({
    url:`/attribute/list/${id}`,
    method:'get',
    params:params
  })
}

export function deleteProductAttr(id) {
  return request({
    url:`/attribute/delete/${id}`,
    method:'post',
    //data:data
  })
}

export function createProductAttr(data) {
  return request({
    url:'/attribute/add',
    method:'post',
    data:JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'//发送的数据类型（默认是json）
     },
  })
}

export function updateProductAttr(data) {
  return request({
    url:'/attribute/update',
    method:'post',
    data:JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'//发送的数据类型（默认是json）
     },
  })
}
export function getProductAttr(id) {
  return request({
    url:`/attribute/list/${id}`,
    method:'get'
  })
}

export function getProductAttrInfo(productCategoryId) {
  return request({
    url:'/productAttribute/attrInfo/'+productCategoryId,
    method:'get'
  })
}
