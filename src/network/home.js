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
// 获取权限列表
export function getRightsList() {
	return request({
		url: 'rights/list'
	})
}
// 获取角色列表
export function getRolesList() {
	return request({
		url: 'roles'
	})
}
// 删除角色指定权限
export function deleteSpecRight(url) {
	return request({
		url,
		method: 'delete'
	})
}
// 请求所有权限 
export function getAllRights() {
	return request({
		url: 'rights/tree'
	})
}
// 分配权限
export function allotRights(url,rid) {
	return request({
		url,
		data: {
			rids: rid
		},
		method: 'post'
	})
}
// 分配用户角色
export function allotRoles(url,rid) {
	return request({
		url,
		data: {
			rid
		},
		method: 'put'
	})
}
// 编辑提交角色
export function editRoles(url,data) {
	return request({
		url,
		data,
		method: 'put'
	})
}
// 删除角色
export function deleteRoles(url) {
	return request({
		url,
		method: 'delete'
	})
}
// 添加角色
export function addRoles(data) {
	return request({
		url: 'roles',
		data,
		method: 'post'
	})
}