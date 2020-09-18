<template>
	<div class="login">
		<div class="login-box">
			<!-- 头像区域 -->
			<div class="login-box-logo">
				<img src="~assets/img/logo.png" alt="">
			</div>
			<!-- 登录表单区域 -->
			<el-form ref="loginForm" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login-form">
				<el-form-item prop="username">
					<el-input v-model= "loginForm.username" prefix-icon="iconfont iconyonghu"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model= "loginForm.password" type="password" prefix-icon="iconfont iconmima"></el-input>
				</el-form-item>
				<el-form-item class="login-btn">
					<el-button @click="login" type="primary">登录</el-button>
					<el-button @click="resetLoginForm" type="info">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import { getLogin } from 'network/login'

export default {
	data() {
		return {
			// 表单绑定的数据对象
			loginForm: {
				username: 'admin',
				password: '123456'
			},
			loginFormRules: {
				username: [
					{ required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		// 重置登录表单
		resetLoginForm() {
			this.$refs.loginForm.resetFields()
		},
		/* 登录逻辑
		1.validate预校验：
		预校验失败直接返回
		预校验成功发送用户名密码给服务器 

		2.判断请求结果：
		status！= 200 即失败 提示失败 否则提示成功
		 */
		login() {
			this.$refs.loginForm.validate((valid) => {
				if(!valid) return
				getLogin(this.loginForm.username,this.loginForm.password).then((res)=>{
					const { data: result} = res
					// test
					console.log(result)
					if(result.meta.status !== 200) return this.$message.error('登录失败')
					this.$message.success('登录成功')
					// 将登陆成功的token值保存到客户端的sessionStorage中
					window.sessionStorage.setItem("token",result.data.token)
					// 通过编程式导航跳转到后台主页
					this.$router.push('/home')
				})
			})
		}
	}
}
</script>

<style lang="less" scoped>
.login {
	position: relative;
	height: 100vh;
	background-color: #2b4b6b;
	.login-box {
		position: absolute;
		top: 50%;
		left: 50%;
		background-color: #ffffff;
		width: 450px;
		height: 300px;
		transform: translate(-50%,-50%);
		// 头像区域
		.login-box-logo {
			position: absolute;
			left: 50%;
			transform: translate(-50%,-50%);
			width: 130px;
			height: 130px;
			padding: 10px;
			background-color: #fff;
			border: 1px solid #eeeeee;
			border-radius: 50%;
			img {
				width: 100%;
				height: 100%px;
				background-color: #eee;
				border-radius: 50%;
			}
		}
		// 登录表单区域
		.login-form {
			position: absolute;
			bottom: 0;
			width: 100%;
			padding: 0 20px;

			.login-btn {
			display: flex;
			justify-content: flex-end;
		}
		}
		
	}
}

</style>>

