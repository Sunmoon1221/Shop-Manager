<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑导航 end -->

    <!-- card区域 -->
    <el-card class="roles-card">
      <!-- 添加角色按钮 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary" @click="clickAddRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色表区域 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="[
                'vcenter',
                'right-row',
                'bd-bottom',
                index1 === 0 ? 'bd-top' : '',
              ]"
            >
              <el-col :span="5">
                <!-- 一级菜单 -->
                <el-tag
                  closable
                  @close="clickCloseRight(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  :class="[
                    'vcenter',
                    'right-row',
                    index2 === 0 ? '' : 'bd-top',
                  ]"
                >
                  <!--二级菜单  -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="clickCloseRight(scope.row, item2.id)"
                      type="success"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级菜单 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      class="right-col"
                      closable
                      @close="clickCloseRight(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="290px">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="clickEditRole(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="clickDeleteBtn(scope.row)"
              >删除</el-button
            >
            <el-button
              @click="clickSetRight(scope.row)"
              type="warning"
              icon="el-icon-s-cooperation"
              size="mini"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- card区域 end-->

    <!-- 分配权限对话框区域 -->
    <el-dialog
      @close="setRightDialogClosed"
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <div class="tree">
        <el-tree
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          :data="rightsList"
          :props="treeProps"
          ref="treeRef"
        ></el-tree>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框区域 end-->

    <!-- 编辑对话框区域 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="50%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框区域 end-->

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="50%"
			@close="addRoleDialogClosed"
    >
      <el-form
        :model="addRoleForm"
        :rules="addRoleFormRules"
        ref="addRoleFormRef"
        label-width="70px"
      >
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加用户对话框 end-->
  </div>
</template>

<script>
import {
  getRolesList,
  deleteSpecRight,
  getAllRights,
  allotRights,
  editRoles,
	deleteRoles,
	addRoles
} from "network/home";
export default {
  data() {
    return {
      rolesList: [],
      rightsList: [],
      // 控制分配权限对话框是否显示
      setRightDialogVisible: false,
      // 属性空间绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认勾选的权限
      defKeys: [],
      // 角色id
      roleId: "",
      // 编辑对话框是否显示
      editDialogVisible: false,
      // 编辑对话框绑定的数据源和规则
      editForm: {
        roleName: "",
        roleDesc: "",
      },
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
      },
      // 点击编辑按钮传递的角色id
      editRoleId: "",
      // 添加角色对话框显示与否
      addRoleDialogVisible: false,
      // 添加角色绑定的数据源和规则
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    getRolesList() {
      getRolesList().then((res) => {
        const { data: result } = res;

        if (result.meta.status !== 200)
          return this.$message.console.error("获取角色列表失败");
        this.rolesList = result.data;
      });
    },
    // 点击权限的X
    clickCloseRight(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          deleteSpecRight(`roles/${role.id}/rights/${rightId}`).then((res) => {
            role.children = res.data.data;
          });
        })
        .catch((err) => {
          // return console.log(err)
          return this.$message.info("取消删除该权限");
        });
    },
    // 点击分配权限按钮
    clickSetRight(role) {
      this.roleId = role.id;
      this.getLeafKeys(role, this.defKeys);

      this.setRightDialogVisible = true;
      // 请求所有权限
      getAllRights().then((res) => {
        const { data: result } = res;
        this.rightsList = result.data;
      });
    },
    // 请求角色的三级权限id，并加到defKeys中,递归完毕，把所有当前三级节点保存到arr
    getLeafKeys(node, arr) {
      // 如果是三级权限，直接把id添加到defKeys中
      if (!node.children) {
        return arr.push(node.id);
      }

      // 如果节点不是三级权限，要继续在children里找
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听分配权限对话框关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 分配权限
    allotRight() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      const idStr = keys.join(",");

      // 请求分配权限
      allotRights(`roles/${this.roleId}/rights`, idStr).then((res) => {
        const { data: result } = res;

        if (result.meta.status !== 200)
          return this.$message.error("更新用户权限失败");

        this.$message.success("更新用户权限成功");
        this.getRolesList();
        this.setRightDialogVisible = false;
      });
    },
    // 点击编辑按钮
    clickEditRole(role) {
      this.editRoleId = role.id;
      this.editDialogVisible = true;
    },
    // 编辑角色信息
    editRole() {
      editRoles(`roles/${this.editRoleId}`, this.editForm).then((res) => {
        const { data: result } = res;

        if (result.meta.status !== 200)
          return this.$message.error("编辑角色失败");

        this.$message.success("编辑用户成功");
        this.getRolesList();
        this.editDialogVisible = false;
      });
    },
    // 关闭编辑角色对话框
    editDialogClosed() {
      this.editForm = {};
    },
    // 点击删除按钮
    clickDeleteBtn(role) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          deleteRoles(`roles/${role.id}`).then((res) => {
            const { data: result } = res;

            if (result.meta.status !== 200)
              return this.$message.error("删除用户失败");

            this.getRolesList();
          });
        })
        .catch((err) => {
          this.$message.info("取消删除角色");
        });
    },
    // 点击添加角色按钮
    clickAddRole() {
      this.addRoleDialogVisible = true;
		},
		// 添加角色
		addRole() {
			console.log(this.addRoleForm)
			addRoles(this.addRoleForm).then(res=>{
				const {data: result} = res


				if(result.meta.status !== 201) return this.$message.error('添加用户失败')

				this.$message.success('添加角色成功')
				this.getRolesList()
				this.addRoleDialogVisible = false;
			})
		},
		// 关闭添加角色对话框
		addRoleDialogClosed() {
			this.addRoleForm = {}
		}
  },
};
</script>

<style scoped>
.roles-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
.bd-top {
  border-top: 1px solid #eee;
}
.bd-bottom {
  border-bottom: 1px solid #eee;
}
.right-row {
  padding: 5px;
}
.right-col {
  margin-right: 5px;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-tree {
  min-width: 100%;
  /* font-size: 14px; */
  display: inline-block;
}
.tree {
  overflow-y: auto;
  overflow-x: scroll;
  height: 500px;
  /*width:200px;*/
  /* border: 1px solid blue; */
}
</style>