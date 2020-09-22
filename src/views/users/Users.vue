<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航 end-->
    <!-- card 区域 -->
    <el-card class="box-card">
      <!-- 1.搜索/添加用户区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <div>
            <el-input
              v-model="queryInfo.query"
              @clear="getUserList"
              placeholder="请输入内容"
              class="input-with-select"
              clearable
            >
              <el-button slot="append" @click="getUserList" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="clickAddUser">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 2.用户列表区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="clickEditUser(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button 
						type="danger" 
						icon="el-icon-delete" 
						size="mini"
						@click="clickDeleteUser(scope.row.id)"></el-button>
            <!-- 分配管理按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 3.页码条区域 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!-- card 区域 end-->

    <!-- 添加用户对话框区域 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addFormClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框区域 end -->

    <!-- 编辑用户对话框区域 -->
    <el-dialog title="编辑用户" 
		:visible.sync="editDialogVisible" 
		width="50%"
		@close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框区域 end -->
  </div>
</template>

<script>
import {
  getUserList,
  changeUserState,
  addUser,
	getUserInfoById,
	editUserInfo,
	deleteSingleUser
} from "network/home";

export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;

      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 获取用户列表
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 对话框是否显示
      addDialogVisible: false,
      // 添加用户表单绑定的数据和规则
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 6, message: "长度在 2 到 6 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 控制编辑用户对话框是否显示
      editDialogVisible: false,
      // 编辑表单的数据和规则
      editForm: {
				id: "",
				username: "",
				email: "",
				mobile: ""
			},
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // 获取用户列表
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    getUserList() {
      getUserList(this.queryInfo).then((res) => {
        const { data: result } = res;
        // console.log(result);

        if (result.meta.status !== 200)
          return this.$message.error("请求用户列表失败");
        this.userList = result.data.users;
        this.total = result.data.total;

        // console.log(this.userList)
        // console.log(this.total)
      });
    },
    // 改变当前的页码
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 改变当前每页显示的数据条数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 修改状态开关
    userStatusChange(userInfo) {
      changeUserState(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(
        (res) => {
          const { data: result } = res;

          if (result.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state;
            return this.$message.error("更新用户状态失败");
          }
          this.$message.success("更新用户状态成功");
        }
      );
		},
    // 点击添加用户按钮
    clickAddUser() {
      this.addDialogVisible = true;
    },
    // 关闭添加用户弹窗重置表单数据
    addFormClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        // 发起添加用户的网络请求
        addUser(this.addForm).then((res) => {
          const { data: result } = res;

          if (result.meta.status !== 201)
            return this.$message.error("添加用户失败");
          this.$message.success("添加用户成功");
          this.addDialogVisible = false;
          this.getUserList();
        });
      });
    },
    // 点击编辑用户按钮
    clickEditUser(id) {
      // 根据id请求用户数据
      getUserInfoById("users/" + id).then((res) => {
        // 保存用户数据
        this.editForm = res.data.data;
      });
      this.editDialogVisible = true;
		},
		// 重置编辑用户表单
		editDialogClosed() {
			this.$refs.editFormRef.resetFields()
		},
		// 修改用户
		editUser() {
			this.$refs.editFormRef.validate(valid=>{
				if(!valid) return this.$message.error('修改用户失败')
				// 发送修改的网络请求
				editUserInfo(this.editForm).then(res=>{
					const {data: result} = res

					if(result.meta.status !== 200 ) return this.$message.error('更新用户数据失败')

					this.editDialogVisible = false
					this.getUserList()
					this.$message.success('更新用户信息成功')
				})
			})
		},
		// 点击删除按钮
		clickDeleteUser(id) {
			this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res=>{
					// console.log('已确定删除')
					deleteSingleUser('users/' + id).then(res=>{
						const {data: result} = res
						if(result.meta.status !== 200) return this.$message.error('删除用户失败')

						this.$message.success('删除用户成功')
						this.getUserList()

					})


					// return this.$message.info('已确定删除')
				}).catch(err=>{
					return this.$message.info('已取消删除')
				})
		}
  },
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  .el-table {
    margin-top: 15px;
    font-size: 12px;
  }
  .el-pagination {
    margin-top: 15px;
  }
}
</style>>
