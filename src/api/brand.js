import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/brand/list',
    method:'get',
    params:params
  })
}

export function fetchGetList(params) {
  return request({
    url:'brand/search/list',
    method:'post',
    params:params
  })
}

export function createBrand(data) {
  return request({
    url:'/brand/create',
    method:'post',
    data:data
  })
}
export function updateShowStatus(data) {
  return request({
    url:'/brand/update/showStatus',
    method:'post',
    data:data
  })
}

export function updateFactoryStatus(data) {
  return request({
    url:'/brand/update/factoryStatus',
    method:'post',
    data:data
  })
}

export function deleteBrand(data) {
  return request({
    url:'/brand/delete',
    method:'post',
    data:data,
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8'//发送的数据类型（默认是json）
    //  },
  })
}

export function createProductBrand(data) {
  return request({
    url:'/brand/create',
    method:'post',
    params:data,
    //data:JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'//发送的数据类型（默认是json）
     },
  })
}




export function updateProductBrand(data) {
  return request({
    url:'/brand/update',
    method:'post',
    params:data
    // headers: {
    //   'Content-Type': 'application/json;charset=UTF-8'//发送的数据类型（默认是json）
    //  },
  })
}

export function getBrand(id) {
  return request({
    url:`/list/update/${id}`,
    method:'get',
  })
}

export function updateBrand(id) {
  return request({
    url:`/list/update/${id}`,
    method:'get',
  })
}

