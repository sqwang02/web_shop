'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://localhost:8080/v2/api-docs"'  //本地地址
  // BASE_API: '" http://120.27.63.9:8080"'  //线上地址
  // BASE_API: '"https://nei.netease.com/api/apimock-v2/50fd1cc2b1315ac4ef1aeadcb3576d33"'//测试地址
  BASE_API: '"http://47.99.74.215:8000"'
  // BASE_API: '"http://10.21.30.224:8000"'//实验室地址
  // BASE_API: '"http://192.168.1.109:8000"'


  
})

