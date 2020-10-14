import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/category/list',
    method:'get',
    params:params
  })
}

export function createProductAttrCate(data) {
  return request({
    url:'/category/add',
    //url:'/productAttribute/category/create',
    method:'post',
    data:JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'//发送的数据类型（默认是json）
     },
  })
}

export function deleteProductAttrCate(cid) {
  return request({
    url:`/category/delete/${cid}`,
    method:'post'
  })
}

// export function updateProductAttrCate(id,data) {
//   return request({
//     url:'/productAttribute/category/update/'+id,
//     method:'post',
//     data:data
//   })
// }

export function updateProductAttrCate(data) {
  return request({
    url:'/category/update',
    method:'post',
    data:JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'//发送的数据类型（默认是json）
     },
  })
}

export function fetchListWithAttr() {
  return request({
    url:'/list/selector',
    method:'get'
  })
}
