'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  WXAppID: '"wxb33403dcfb20d927"',
  WXScope: '"snsapi_userinfo"',
  BaseURL: '"//47.94.152.92:8890/"'
})
