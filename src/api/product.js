import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url:'/sproduct/list',
    method:'get',
    params:params
  })
}
export function updatePrice(pid,data) {
  return request({
    url:`/priceLog/${pid}`,
    method:'post',
    data:data
  })
}

export function getPriceLog(pid,params) {
return request({
  url:`/priceLog/${pid}`,
  params:params,
  method:'get',
})
}
export function nextFetchList(sid) {
  return request({
    url:`/product/list/${sid}`,
    method:'get',
    //params:params
  })
}

export function fetchSimpleList(params) {
  return request({
    url:'/product/simpleList/',
    method:'get',
    params:params
  })
}

export function updateDeleteStatus(ids) {
  return request({
    url:`/sproduct/delete/${ids}`,
    method:'post',
    //params:params
  })
}

export function updateNextDeleteStatus(ids) {
  return request({
    url:`/product/delete/${ids}`,
    method:'post',
    //params:params
  })
}

export function updateNewStatus(params) {
  return request({
    url:'/product/update/newStatus',
    method:'post',
    params:params
  })
}

export function updateRecommendStatus(ids,params) {
  return request({
    url:`/sproduct/recommend/${ids}`,
    method:'post',
    params:params
  })
}
export function updateNextRecommendStatus(ids,params) {
  return request({
    url:`/product/recommend/${ids}`,
    method:'post',
    params:params
  })
}

export function updatePublishStatus(ids,params) {
  return request({
    url:`/sproduct/publish/${ids}`,
    method:'post',
    params:params
  })
}
export function updateNextPublishStatus(ids,params) {
  return request({
    url:`/product/publish/${ids}`,
    method:'post',
    params:params
  })
}

export function createProduct(data) {
  return request({
    url:'/product/create',
    method:'post',
    data:data
  })
}

export function updateProduct(id,data) {
  return request({
    url:`/product/update/${id}`,
    method:'post',
    data:data
  })
}

export function getProduct(id) {
  return request({
    url:`/sproduct/update/${id}`,
    method:'get',
  })
}
export function getNextProduct(id) {
  return request({
    url:`/sproduct/update/${id}`,
    method:'get',
  })
}



