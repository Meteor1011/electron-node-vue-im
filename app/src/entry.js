import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import routes from './routes/routes'
import configs from '../configs/'
import VueI18n from 'vue-i18n'

 Vue.use(VueI18n)

/*    const messages = {
        en: {
          /!*message: {
           hello: 'world hello',
           IM_login:'login'
          }*!/
        },
        zh: {
          message: {
           hello: '世界',
           IM_login:'立即登录'
          }
        }
    }*/
    const i18n = new VueI18n({
        locale:'zh-CN',
        messages:{
            ar:{
                message:{
                    obj:require('../../im_lan/im_ar_SA'),
                }
            },
            de:{
                message:{
                    obj:require('../../im_lan/im_de_DE'),
                }
            },

            'en-US':{
                message:{
                    obj:require('../../im_lan/im_en_US'),
                }
            },
            es:{
                message:{
                    obj:require('../../im_lan/im_es_ES'),
                }
            },
            fr:{
                message:{
                    obj:require('../../im_lan/im_fr_FR'),
                }
            },
            in:{
                message:{
                    obj:require('../../im_lan/im_in_ID'),
                }
            },
            it:{
                message:{
                    obj:require('../../im_lan/im_it_IT'),
                }
            },
            ja:{
                message:{
                    obj:require('../../im_lan/im_ja_JP'),
                }
            },
            ko:{
                message:{
                    obj:require('../../im_lan/im_ko_KR'),
                }
            },
            ms:{
                message:{
                    obj:require('../../im_lan/im_ms_MY'),
                }
            },
            pt:{
                message:{
                    obj:require('../../im_lan/im_pt_PT'),
                }
            },
            ru:{
                message:{
                    obj:require('../../im_lan/im_ru_RU'),
                }
            },
            th:{
                message:{
                    obj:require('../../im_lan/im_th_TH'),
                }
            },
            vi:{
                message:{
                    obj:require('../../im_lan/im_vi_VN'),
                }
            },
            'zh-CN':{
                message:{
                    obj:require('../../im_lan/im_zh_CN'),
                }
            },
            'zh-TW':{
                message:{
                    obj:require('../../im_lan/im_zh_TW'),
                }
            }
        }
    })
//console.log('i18n======',i18n.messages,i18n.locale);
Vue.use(VueRouter)
const router = new VueRouter({
    routes,
    //mode: 'history',
    base: configs.base
})
router.beforeEach(({ meta, path }, from, next) => {
    const { auth = true } = meta
    const isLogin = false //Boolean(stores.state.user.accesstoken) // true用户已登录， false用户未登录
    if (auth && !isLogin && path !== '/login') {
        let to = { path: '/login' }
        return next(to)
    }
    next()
})
new Vue({
    i18n,
    store: store,
    router,
}).$mount('#app')