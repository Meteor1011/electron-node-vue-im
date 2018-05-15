import App from '../app'
import Login from '../pages/login/'
import Chat from '../pages/chat'
/*
 * auth true登录才能访问。false不需要登录 ，默认为true 
 */

export default [{
    path: '/',
    component: App,
    children: [{
            path: '/login', //登录
            name: 'login',
            meta: { auth: false },
            component: Login
        },
        {
            path: '/chat', //聊天
            name: 'chat',
            meta: { auth: false },
            component: Chat
        },
        {
            path: '/', //
            redirect: '/login'
        }
    ]
}]