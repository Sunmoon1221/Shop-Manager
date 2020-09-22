<template>
  <div class="home">
    <el-container class="home-container">
			<!-- 头部 -->
      <el-header>
				<div>
					<img src="~assets/img/logo.png" alt="">
					<span>电商后台管理系统</span>
				</div>
				<el-button type="info" @click="logout">退出</el-button>
			</el-header>
			<!-- 头部end -->
			<!-- 主体 -->
      <el-container>
				<!-- 侧边栏 -->
        <el-aside :width="isCollapse ? '64px' : '200px'">
					<el-menu background-color="#323744" 
					text-color="#fff" 
					active-text-color="#26b2f3" 
					unique-opened 
					:collapse="isCollapse"
					:collapse-transition="false"
					router
					:default-active="$route.path"> 
      			<!-- 折叠按钮 -->
						<div class="toggle-button" @click="toggleClick">|||</div>
						<!-- 一级菜单 -->
						<el-submenu :index="'/' + item.path + ''" v-for="item in menulist" :key="item.id">
       				<template slot="title">
        			  <i :class="icons[item.id]"></i>
         				<span>{{item.authName}}</span>
        			</template>
							<!-- 二级菜单 -->
							<el-menu-item :index="'/' + subItem.path + ''" v-for="subItem in item.children" :key="subItem.id">
								<template slot="title">
        			  	<i class="el-icon-menu"></i>
         					<span>{{subItem.authName}}</span>
        				</template>
							</el-menu-item>
      			</el-submenu>
					</el-menu>
				</el-aside>
				<!-- 内容区 -->
        <el-main>
					<router-view></router-view>
				</el-main>
      </el-container>
			<!-- 主体end -->
    </el-container>
    
  </div>
</template>

<script>
import { getMenuList } from 'network/home'
export default {
	data() {
		return {
			menulist: [],
			icons: {
				'125': 'iconfont iconyonghu',
				'103': 'iconfont iconquanxian',
				'101': 'iconfont iconshangpin',
				'102': 'iconfont icondingdan',
				'145': 'iconfont iconshuju',
			},
			isCollapse: false
		}
	},
	created() {
		// 请求菜单数据
		this.getMenuList()
	},
  methods: {
		// 用户退出
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
		},
		// 请求侧边栏数据
		getMenuList() {
			getMenuList().then(res=>{
				// console.log(res)

				if(res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg);
				this.menulist = res.data.data

				// console.log(this.menulist)
			
			})
		},
		toggleClick() {
			this.isCollapse = !this.isCollapse
		}
	},
};
</script>

<style lang="less" scoped>
.home-container {
	height: 100vh;
}
.el-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: #373c41;

	> div {
		display: flex;
		align-items: center;

		img {
			width: 26px;
			height: 26px;
		}

		span {
			padding-left: 18px;
			font-size: 18px;
			color: #fff;
		}
	}
}
.el-aside {
	background-color: #323744;
	.toggle-button {
		background-color: #485164;
		color: #fff;
		text-align: center;
		line-height: 24px;
	}

	.el-menu {
		border-right: 0;
	}
}
.el-main {
	background-color: #eaedf2;
}
.iconfont {
	margin-right: 10px;
}
</style>>
