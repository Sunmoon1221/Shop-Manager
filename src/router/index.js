import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')

const routes = [
	{
		path: '',
		redirect: '/login'
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/home',
		component: Home
	}
]

const router = new VueRouter({
	routes
})

// 导航守卫
// 在未登陆前无法访问其他的api
router.beforeEach((to,from,next) => {
// 	// 如果目标路径不为login或者没有token值 则不放行
	// if((to.path !== '/login') || (!window.sessionStorage.getItem('token'))) return next('/login')
	// else next()
	if(to.path === '/login') return next()
	
	const tokenStr = window.sessionStorage.getItem('token')
	if(!tokenStr) return next('/login')
	next()
})

export default router