import request from '@/utils/request'
export function fetchList(parentId,params){
    return request({
        url:`/type/subcategories/${parentId}`,
        method:'get',
        params:params
    })
}
export function deleteProductCate(data){
    return request({
        url:'/type/delete',
        method:'post',
        data:data
    })
}


export function createProductCate(data){
    return request({
        url:'/type/create',
        method:'post',
        data:data
    })
}

export function updateProductCate(data){
    return request({
        url:'/type/update',
        method:'post',
        params:data,
        headers: {
           'Content-Type': 'application/json;charset=UTF-8'//发送的数据类型（默认是json）
        },
        
    })
}


export function transferProduct(id,data){
    return request({
        url:`/type/change/${id}`,
        method:'get',
        params:data
    })
}
export function getProductCate(id){
    return request({
        url:`/type/getProduct/${id}`,
        method:'get'
    })
}

export function fetchListWithChildren(){
    return request({
        url:'/type/withChildren',
        method:'get'
    })
}

export function getParentIds(id){
    return request({
        url:`/type/getParentIds/${id}`,
        method:'get'
    })
}

export function checkChild(id){
    return request({
        url:`/type/checkChild/${id}`,
        method:'get'
    })
}

export function getAllProductCate(){
    return request({
        url:'/type/selector',
        method:'get'
    })
}