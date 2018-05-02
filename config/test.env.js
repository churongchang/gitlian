'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  WXAppID: '"wx375cf3c33dd40faa"',
  WXScope: '"snsapi_userinfo"'
})
