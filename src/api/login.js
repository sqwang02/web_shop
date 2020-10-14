import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/auth/login',
    method: 'post',
    params:params
  })
}
export function getInfo() {
  return request({
    url: '/auth/getCurrentAdmin',
    method: 'get',
  })
}

// export function logout(params) {
//   return request({
//     url: '/admin/login',
//     method: 'post',
//     params:params
//   })
// }

export function fetchList(params) {
  return request({
    url: '/admin/list',
    method: 'get',
    params: params
  })
}

export function createAdmin(data) {
  return request({
    url: '/admin/register',
    method: 'post',
    data: data
  })
}

export function updateAdmin(id, data) {
  return request({
    url: '/admin/update/' + id,
    method: 'post',
    data: data
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/admin/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function deleteAdmin(id) {
  return request({
    url: '/admin/delete/' + id,
    method: 'post'
  })
}

export function getRoleByAdmin(id) {
  return request({
    url: '/admin/role/' + id,
    method: 'get'
  })
}

export function allocRole(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data: data
  })
}
