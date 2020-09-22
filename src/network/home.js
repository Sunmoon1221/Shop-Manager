import { request } from './request'

// 获取菜单列表
export function getMenuList() {
	return request({
		url:'/menus'
	})
}

// 获取用户列表
export function getUserList(params) {
	return request({
		url: '/users',
		params
	})
}

// 修改用户状态
export function changeUserState(url) {
	return request({
		url,
		method: 'put' 
	})
}

// 添加用户
export function addUser(data) {
	return request({
		url: '/users',
		method: 'post',
		data
	})
}

// 根据id查询用户信息
export function getUserInfoById(url) {
	return request({
		url
	})
}

// 修改用户信息
export function editUserInfo({id,email,mobile}) {
	return request({
		url: 'users/' + id ,
		data: {
			email,
			mobile
		},
		method: 'put'
	})
}

// 删除单个用户
export function deleteSingleUser(url) {
	return request({
		url,
		method: 'delete'
	})
}
