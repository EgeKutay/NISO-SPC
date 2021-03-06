import Vue from 'vue'
import Vuex from 'vuex'

// Modules

import app from './app'
import appConfig from './app-config'
import verticalMenu from './vertical-menu'
import rtspc from './spc/rtspc.module'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    appConfig,
    verticalMenu,
    rtspc
   
  },
  strict: process.env.DEV,
})
