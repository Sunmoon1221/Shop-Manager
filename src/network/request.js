import axios from 'axios'

export function request(config) {
	const instance = axios.create({
		baseURL: 'http://127.0.0.1:8888/api/private/v1/',
		timeout: 1000
	});

	instance.interceptors.request.use(config=>{
		// 需要授权的API，必须在请求头中使用Authorization字段
		// 提供token令牌
		config.headers.Authorization = window.sessionStorage.getItem('token')
		
		return config
	})

	return instance(config);
}