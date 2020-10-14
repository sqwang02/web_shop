import { login,  getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const name = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        const pwd = userInfo.password
        let params = new URLSearchParams
        params.append("name",name)
        params.append("pwd",pwd)
        login(params).then(response => {
          const data = response.data
          const tokenStr = data
          setToken(tokenStr)
          commit('SET_TOKEN', tokenStr)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if (data.perms && data.perms.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.perms)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
         // commit('SET_AVATAR', data.icon)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    // LogOut({ commit}) {
    //   return new Promise((resolve, reject) => {
    //     login().then(() => {
    //       setToken('')
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
     
    // },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
