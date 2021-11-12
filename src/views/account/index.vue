<template>
  <div>
    <div class="search-box">
      <a-form layout="inline" :model="searchData" class="demo-form-inline">
        <!-- <a-form-item label="账号UID">
          <a-input v-model="searchData.unique_id" placeholder="账号UID" allow-clear />
        </a-form-item> -->
        <a-form-item label="昵称">
          <a-input v-model="searchData.nickname" placeholder="请输入昵称" allow-clear />
        </a-form-item>
        <a-form-item label="ID">
          <a-input v-model="searchData.id" placeholder="请输入账号ID" allow-clear />
        </a-form-item>
        <a-form-item>
        <a-form-item v-if="role == 1" label="状态">
          <a-select v-model="searchData.is_bind" placeholder="账号状态" style="width:213px" allow-clear>
            <a-select-option :value="2">全部</a-select-option>
            <a-select-option :value="1">已分配</a-select-option>
            <a-select-option :value="0">未分配</a-select-option>
          </a-select>
        </a-form-item>

          <a-button type="primary" style="margin-left: 10px;width:88px" @click="init()">查询</a-button>
          <a-button v-if="role == 1" type="primary" style="margin-left: 10px" @click="assign">分配到用户</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="add">绑定到端口</a-button>
          <!-- <a-button type="primary" style="margin-left: 10px" @click="checkAccount()">查看封禁账号</a-button> -->
          <!-- 新增 绑定IP设备 取消 -->
          <!-- <a-button type="primary" style="margin-left: 10px">绑定IP设备</a-button> -->
          <a-button type="primary" style="margin-left: 10px" @click="changeNickname">修改昵称</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="changeSignature">修改个签</a-button>
          <a-button type="primary" style="margin-left: 10px" @click="changeHeadImg">修改头像</a-button>
          <a-button type="danger" style="margin-left: 10px" v-if="form.account_list.length != 0" @click="deleteVisible">批量删除</a-button>
          <!-- <a-button v-if="isBundle_id" type="primary" style="margin-left: 10px;" @click="dialogAccount = true">新增账号</a-button> -->

          <!-- <a-button v-if="role == 1" type="primary" style="margin-left: 10px;width:88px" @click="create('Collection')">采集</a-button> -->
          <!-- <a-button v-if="role == 1" type="primary" style="margin-left: 10px" @click="exportAccount">导出</a-button> -->
          <!-- <a-button type="primary" style="margin-left: 10px;width:88px" @click="exportAccount">
            导出
          </a-button> -->
          <a-modal
            title="下载链接"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
          >
            <p>{{ ModalText }}</p>
          </a-modal>

          <!-- <a-button type="primary" @click="create('Comment')">评论</a-button> -->
        </a-form-item>
      </a-form>
      <span v-if="form.account_list.length != 0">已选中账号：{{form.account_list.length}}</span>
    </div>
    
    
    <div class="table-box">
      <a-table :columns="columns" :data-source="tableData" :row-key="record => record.id" class="tableLimit" :row-selection="{selectedRowKeys: form.account_list ,onChange: rowSelection}" :bordered="true" :pagination="false">
        <span slot="avatar" slot-scope="text, row ">
          <a-badge v-if="row.id == bundle_id" color="#87d068">
            <a-avatar :src="row.avatar" />
          </a-badge>
          <a-avatar v-else :src="row.avatar" />
          <p>{{ row.nickname }}</p>
        </span>
        <span slot="created_at" slot-scope="text, row">
          {{ new Date(row.created_at) | getTime }}
        </span>
        <span slot="port_id" slot-scope="text, row">
          {{ row.port_no }}
        </span>
        <span slot="status" slot-scope="text, row ">
          {{ row.status == '' ? '正常' : row.status }}
        </span>
        <span slot="device_remarks">
          {{ deviceInfo.remarks }}
        </span>
        <!-- <span slot="remarks" slot-scope="text, row">
          <a-input v-model="row.remarks" size="small" @blur="handleInputBlur(row)" />
        </span> -->
        <span slot="action" slot-scope="text, row">
          <!-- <el-button v-if="isBundle_id" :disabled="scope.row.id == device_id" size="small" type="success" plain @click="handCheck(scope.row)">{{ scope.row.id == device_id ? '当前账号' : '切换账号' }}</el-button>
          <el-button size="small" type="primary" plain @click="handPut(scope.row.id)">重置次数</el-button>
          <el-button size="small" type="danger" plain @click="handleDelete(scope.row.id)">删除</el-button> -->
          <a-button v-if="role == 0 || role == 1" style="margin-left: 10px" type="primary" @click="openRunInfo(row.id)">运行记录</a-button>

          <a-button v-if="isBundle_id" :disabled="row.id == bundle_id" @click="handCheck(row)">{{ row.id == bundle_id ? '当前账号' : '切换账号' }}</a-button>
          <!-- <a-button style="margin-left: 8px" type="primary" @click="handPut(row.id)">重置次数</a-button> -->
          <!-- 新增修改资料页面   修改资料页面 绑定IP设备 -->
          <!-- <a-button v-if="role == 0 || role == 1" style="margin-left: 10px" @click="openRunInfo(row.id)">修改资料</a-button> -->

          <a-popconfirm title="是否删除？此操作会导致账号无法添加到后台，仅用于账号被封禁的情况下！！！" ok-text="是" cancel-text="否" @confirm="handleDelete(row.id)">
            <a-button style="margin-left: 10px" type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>

      <a-modal v-model="dialogVisible" title="分配账号到设备" width="500px" ok-text="确认" cancel-text="取消" @ok="handleAdd">
        <a-form ref="form" :model="form" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-form-item label="设备ID">
            <!-- <a-input v-model="form.group_id" @click="dialogGroupId = true" /> -->
            <a-input v-model="form.group_id" @click="dialogPortVisible" />
          </a-form-item>
        </a-form>
      </a-modal>


      <a-modal v-model="nicknameDialogAccount" title="修改昵称" width="500px" ok-text="确认" cancel-text="取消" @ok="changeAccountNickname">
        <a-form ref="account_form" :model="changeAccountForm" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-form-item label="昵称">
            <a-button class="add-btn" type="success" plain @click="Nickname">选择资源</a-button><br/>
            <a-tag v-for="(item, index) in selectedNicknameValue" v-model="selectedNicknameValue" color="#2db7f5" closable :key="index" @close="tagNickname">昵称：{{item.name}}</a-tag>
            <!-- <a-textarea v-model="changeAccountForm.account_nickname" :rows="4"/> -->
          </a-form-item>
        </a-form>
      </a-modal>
      
      <a-modal v-model="signatureDialogAccount" title="修改个签" width="500px" ok-text="确认" cancel-text="取消" @ok="changeAccountSignature">
        <a-form ref="account_form" :model="changeAccountForm" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <!-- <a-form-item label="个签">
            <a-textarea v-model="changeAccountForm.account_signale" :rows="4"/>
          </a-form-item> -->
          
          <a-form-item label="资源">
            <a-button class="add-btn" type="success" plain @click="resourcesText">选择资源</a-button><br/>
            <a-tag v-for="(item, index) in selectedRowKeysValue" v-model="selectedRowKeysValue" color="#2db7f5" closable :key="index" @close="tagID">个签：{{item.name}}</a-tag>
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal v-model="headImgDialogAccount" title="修改头像" width="500px" ok-text="确认" cancel-text="取消" @ok="changeAccountHeadImg">
        <a-form ref="account_form" :model="changeAccountForm" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-form-item label="头像">
            <!-- <a-textarea v-model="changeAccountForm.account_headimg" :rows="4"/> -->
            <a-button class="add-btn" type="success" plain @click="Headimg">选择资源</a-button><br/>
            <a-tag v-for="(item, index) in selectedHeadimgValue" v-model="selectedHeadimgValue" color="#2db7f5" closable :key="index" @close="tagNickname">头像：{{item.name}}</a-tag>
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal v-model="resourcesTextVisible" title="选择个签资源" ok-text="确认" cancel-text="取消" width="600px" @ok="submitResourcesText">
        <a-table :columns="columnsResource" :data-source="ResourceData" :row-key="record => record.id" :row-selection="{onChange:onSelectChange,selectedRowKeys: selectedRowKeysId,type: 'radio'}" class="tableLimit" :scroll="{ x:550 }" :bordered="true" :pagination="false">
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${ResourceTotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="ResourcePage" :total="ResourceTotal" @change="handleASign" @showSizeChange="handleSizeASign">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </a-modal>

      <a-modal v-model="nicknameVisible" title="选择昵称资源" ok-text="确认" cancel-text="取消" width="600px" @ok="submitNickname">
        <a-table :columns="columnsResource" :data-source="ResourceData" :row-key="record => record.id" :row-selection="{onChange:onSelectChangeNickname,selectedRowKeys: selectedNicknameId,type: 'radio'}" class="tableLimit" :scroll="{ x:550 }" :bordered="true" :pagination="false">
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${NicknameTotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="NicknamePage" :total="NicknameTotal" @change="handleNickname" @showSizeChange="handleSizeNickname">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </a-modal>

      <a-modal v-model="headimgVisible" title="选择头像资源" ok-text="确认" cancel-text="取消" width="600px" @ok="submitHeadimg">
        <a-table :columns="columnsResource" :data-source="ResourceData" :row-key="record => record.id" :row-selection="{onChange:onSelectChangeHeadimg,selectedRowKeys: selectedHeadimgId,type: 'radio'}" class="tableLimit" :scroll="{ x:550 }" :bordered="true" :pagination="false">
          <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
        </a-table>
        <div class="page">
          <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${HeadimgTotal} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="HeadimgPage" :total="HeadimgTotal" @change="handleHeadimg" @showSizeChange="handleSizeHeadimg">
            <template slot="buildOptionText" slot-scope="props">
              <span>{{ props.value }}条/页</span>
            </template>
          </a-pagination>
        </div>
      </a-modal>

      <a-modal v-model="batchDeleteVisible" title="" ok-text="确认" cancel-text="取消" width="600px" @ok="submitBatchDelete">
        <a-form ref="account_form" :model="changeAccountForm" :label-col="{ span:4 }" :wrapper-col="{ span: 20 }">
          <a-form-item label="账号ID">
            <a-textarea v-model="changeAccountForm.delete_nickname" :rows="4"/>
          </a-form-item>
        </a-form>
      </a-modal>


      <!-- <group :dialog-group-id="dialogGroupId" @getGroupId="getGroupId" @cancelGetGroupId="dialogGroupId = false" /> -->
      <user v-if="dialogUserId" @getGroupId="assignNewUser" @cancelGetGroupId="dialogUserId = false" />
      <port v-if="dialogPortId" :dialogPortId="dialogPortId" @getPortId='getPortId' @cancelGetPortId="dialogPortId = false"></port>
      
      <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div>


      <!-- // 运行记录 -->
      <div>
        <a-modal v-model="runInfoGroupId" title="运行记录" width="60%" ok-text="确认" cancel-text="取消" @cancel="cancel" @ok="cancel">
          <a-table :columns="runInfocolumns" :data-source="runInfoData" :row-key="record => record.id" class="tableLimit" :pagination="false">
            <span slot="created_at" slot-scope="text, row">
            {{ new Date(row.created_at) | getTime }}
          </span>
          </a-table>
          <div class="page">
            <a-pagination :show-total="(runInfoTotal, range) => `总数:${runInfoTotal} 条`" :page-size-options="['10', '20', '50', '100']" show-size-changer :default-current="1" :current="runInfoCurrentPage" :total="runInfoTotal" @change="runInfoCurrentChange" @showSizeChange="runInfohandleSizeChange" />
          </div>
        </a-modal>
      </div>

    </div>
  </div>
</template>

<script>
import * as api from '@/api/index'
import group from '@/components/group/index'
import user from '@/components/user/user'
import { message } from 'ant-design-vue'
import port from './components/port.vue'
import jsCookie from 'js-cookie'

const runInfocolumns = [{

    title: '任务类型',
    dataIndex: 'type',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '昵称',
    dataIndex: 'nickname',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '目标用户',
    dataIndex: 'unique_id',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '地区',
    dataIndex: 'region',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '状态',
    dataIndex: 'status',
    width: '60px',
    ellipsis: true,
    align: 'center'
},{
    title: '创建时间',
    dataIndex: 'created_at',
    width: '60px',
    ellipsis: true,
    align: 'center'
}]

const columns = [{
  title: '头像',
  dataIndex: 'avatar',
  align: 'center',
  width: '80px',
  scopedSlots: { customRender: 'avatar' }
},
{
  title: '个签',
  dataIndex: 'signature',
  width: '90px',
  ellipsis: true,
  align: 'center'
},
{
  title: '帖子数量',
  dataIndex: 'posts_number',
  width: '90px',
  ellipsis: true,
  align: 'center'
},
{
  title: '关注人数',
  dataIndex: 'follow_number',
  width: '90px',
  ellipsis: true,
  align: 'center'
},
{
  title: '好友数量',
  dataIndex: 'friends_number',
  width: '90px',
  ellipsis: true,
  align: 'center'
},
{
  title: '状态',
  dataIndex: 'status',
  width: '90px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'status' }
},
{
  title: '创建时间',
  dataIndex: 'created_at',
  width: '90px',
  ellipsis: true,
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
},
{
  title: '操作',
  dataIndex: 'action',
  align: 'center',
  width: '200px',
  scopedSlots: { customRender: 'action' }
}]
const columnsResource = [{
  title: '资源名称',
  dataIndex: 'name',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'name' }
},
/* {
  title: '资源内容',
  dataIndex: 'data',
  width: '80px',
  align: 'center',
  customRender: (value, row, index) => {
    return value != null ? value.join(',') : value
  },
  scopedSlots: { customRender: 'data' }
}, */
{
  title: '创建时间',
  dataIndex: 'created_at',
  width: '80px',
  align: 'center',
  scopedSlots: { customRender: 'created_at' }
},
]
export default {
  components: {
    group,
    user,
    port
  },
  data() {
    return {
      userInfo: JSON.parse(window.sessionStorage.getItem('userInfo')),
      searchData: {
        nickname: null,
        _like_r_nickname: '',
        page: 1,
        page_size: 10,
        order_created_at: true,
        port_id: null,
        user_id: null,
        is_bind: null,
        id: ''
      },
      runInfocolumns,
      tableData: [],
      runInfoData: [],
      columns: [],
      columnsResource: [],
      ResourceData: [],
      groupTableData: [],
      selectDataId: [],
      selectedRowKeysId: [],
      selectedRowKeysValue: [],
      selectedNicknameValue: [],
      selectedNicknameId: [],
      selectedHeadimgValue: [],
      selectedHeadimgId: [],
      total: 0,
      runInfoTotal: 0,
      size: 10,
      runInfohandleSize: 10,
      runInfoCurrentPage: 1,
      currentAccountId: '',
      dialogVisible: false,
      batchDeleteVisible: false,
      nicknameDialogAccount: false,
      signatureDialogAccount: false,
      headImgDialogAccount: false,
      resourcesTextVisible: false,
      nicknameVisible: false,
      headimgVisible: false,
      dialogGroupId: false,
      dialogPortId: false,
      runInfoGroupId: false,
      dialogAccount: false,
      dialogUserId: false,
      ResourceTotal: 0,
      ResourcePage: 1,
      ResourceASize: 10,
      NicknameTotal: 0,
      NicknamePage: 1,
      NicknameASize: 10,
      HeadimgTotal: 0,
      HeadimgPage: 1,
      HeadimgASize: 10,
      form: {
        account_list: [],
        group_id: ''
      },
      modifyForm: {
        account_list: [],
        group_id: ''
      },
      accountForm: {
        account_username: '',
        account_password: ''
      },
      changeAccountForm: {
        account_nickname: '',
        account_signale: '',
        account_headimg: '',
        delete_nickname: '',
        delete_ids: []
      },
      role: null,
      isBundle_id: false,
      deviceInfo: {},
      device_id: null,
      isDeviceId: null,
      bundle_id: null,
      port_id: null,
      ModalText: '',
      visible: false,
      confirmLoading: false
    }
  },
  async mounted() {
    this.role = this.userInfo.data.r
    this.init()
  },
  methods: {
    async init() {
      this.searchData.group_id = this.$route.query.group_id || null
      this.searchData.port_id = this.$route.query.device_id || 0
      this.searchData.user_id = this.$route.query.bundle_id || null

      this.form.account_list = []
      this.selectedRowKeysId = []
      this.selectedNicknameId = []
      this.selectedHeadimgId = []
      this.selectedNicknameValue = [] 
      this.selectedRowKeysValue = [] 
      this.selectedHeadimgValue = []
      // this.searchData.port_id = this.$router.query.device_id || null
      /* if (this.searchData.port_id === null) {
        this.searchData.port_id = 0
        this.searchData.user_id = 0
      } */

      // 判断角色
      if (this.role === 0){
        this.searchData.user_id = this.userInfo.data.i
      }

      if (this.searchData.device_id != null) {
        this.isDeviceId = true
      }

      // 判断状态
      if (this.searchData.is_bind != null){
        this.searchData.port_id = null
        this.searchData.user_id = null
        // 全部
        if (this.searchData.is_bind == 2){
          this.searchData.is_bind = null
        }
      }

      this.searchData.page = 1
      this.columns = []
      columns.forEach(item => {
        if (item.role != null && !item.role.includes(this.role)) {
          return
        }
        if (item.isDeviceId != null && !this.isDeviceId) {
          return
        }
        this.columns.push(item)
      })
      this.columnsResource = columnsResource
      this.searchData.id = this.searchData.id || null
      this.searchData.nickname = this.searchData.nickname || null
      this.getTableData()
    },
    rowSelection(selectedRowKeys, values) {
      // 批量端口续费 获取ID
      // console.log(selectedRowKeys)
      this.form.account_list = []
      selectedRowKeys.forEach(item => {
        this.form.account_list.push(item)
      })
    },
    // 查看封禁账号
    checkAccount() {

    },
    async getTableData() {
      let res = ''
      const name = ''
      const remarks = ''
      if (this.searchData.group_id != null || this.searchData.device_id != null || this.searchData.unique_id != null || this.searchData.bundle_id != null || this.searchData.user_id != null) {
        if (this.searchData.device_id) {
          const deviceRes = await api.getDevice({ id: this.searchData.device_id })
          this.deviceInfo = deviceRes.data.data[0]
        }

        res = await api.getAcount(this.searchData)
        if (res && res.code === 0 && res.data) {
          res.data.data.map(item => { item.device_name = name })
          res.data.data.map(item => { item.device_remarks = remarks })
          this.tableData = res.data.data
          this.total = res.data.count
        }
      } else {
        if (this.role === 1) {
          res = await api.getAcountAll(this.searchData)
          if (res && res.code === 0 && res.data) {
            this.tableData = res.data.data
            this.total = res.data.count
          }
        }else{
          this.searchData.user_id = this.userInfo.data.i
          res = await api.getAcountAll(this.searchData)
          if (res && res.code === 0 && res.data) {
            this.tableData = res.data.data
            this.total = res.data.count
          }
        }
      }
    },
    
    add() {
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.dialogVisible = true
      this.form.group_id = ''
    },
    dialogPortVisible() {
      this.dialogPortId = true
    },
    getPortId(id) {
      if(id === undefined) {
        this.form.group_id = ''
      } else {
        this.form.group_id = id
      }
    },
    changeNickname() {
      // 修改昵称
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.nicknameDialogAccount = true
    },
    changeSignature() {
      // 修改个签
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.changeAccountForm.account_signale = ''
      this.signatureDialogAccount = true
    },
    resourcesText() {
      this.resourcesTextVisible = true
      this.ResourceText()
    },
    ResourceText() {
      let form = {
        status: 2,
        // name: '',
        type: 7,
        page: this.ResourcePage,
        page_size: this.ResourceASize,
        order_created_at: true
      }
      api.getResourceUser(form).then((res) => {
        this.ResourceData = res.data.data
        this.ResourceTotal = res.data.count
      }).catch((err) => {
        console.log(err)
      })
    },
    // 个签资源
    handleASign(page) {
      this.ResourcePage = page 
      this.ResourceText()
    },
    handleSizeASign(p, s) {
      this.ResourceASize = s
      this.ResourcePage = 1
      this.ResourceText()
    },
    onSelectChange(selectedRowKeys, value) {
      this.selectedRowKeysValue = []
      this.selectedRowKeysId = []
      selectedRowKeys.forEach(item => {
        this.selectedRowKeysId.push(item)
      })
      value.forEach(item => {
        this.selectedRowKeysValue.push(item)
      })
      this.changeAccountForm.account_signale = this.selectedRowKeysValue[0].data.join(',')
    },
    tagID(e) {
      this.selectedRowKeysId = []
    },
    submitResourcesText() {
      this.resourcesTextVisible = false
    },
    
    submitNickname() {
      this.nicknameVisible = false
    },
    // 修改昵称
    Nickname() {
      this.nicknameVisible = true
      this.NicknameList()
    },
    NicknameList() {
      let form = {
        status: 2,
        // name: '',
        type: 1,
        page: this.NicknamePage,
        page_size: this.NicknameASize,
        order_created_at: true
      }
      api.getResourceUser(form).then((res) => {
        this.ResourceData = res.data.data
        this.NicknameTotal = res.data.count
      }).catch((err) => {
        console.log(err)
      })
    },
    // 昵称资源 分页
    handleNickname(page) {
      this.NicknamePage = page 
      this.NicknameList()
    },
    handleSizeNickname(p, s) {
      this.NicknameASize = s
      this.NicknamePage = 1 
      this.NicknameList()
    },
    onSelectChangeNickname(selectedRowKeys, value) {
      this.selectedNicknameValue = []
      this.selectedNicknameId = []
      selectedRowKeys.forEach(item => {
        this.selectedNicknameId.push(item)
      })
      value.forEach(item => {
        this.selectedNicknameValue.push(item)
      })
      this.changeAccountForm.account_signale = this.selectedNicknameValue[0].data.join(',')
    },
    tagNickname() {
      this.selectedNicknameId = []
    },
    // 头像
    Headimg() {
      this.headimgVisible = true
      this.HeadimgList()
    },
    HeadimgList() {
      let form = {
        status: 2,
        // name: '',
        type: 5,
        page: this.HeadimgPage,
        page_size: this.HeadimgASize,
        order_created_at: true
      }
      api.getResourceUser(form).then((res) => {
        this.ResourceData = res.data.data
        this.HeadimgTotal = res.data.count
      }).catch((err) => {
        console.log(err)
      })
    },
    // 头像资源 分页
    handleHeadimg(page) {
      this.HeadimgPage = page 
      this.HeadimgList()
    },
    handleSizeHeadimg(p, s) {
      this.HeadimgASize = s
      this.HeadimgPage = 1 
      this.HeadimgList()
    },
    onSelectChangeHeadimg(selectedRowKeys, value) {
      this.selectedHeadimgValue = []
      this.selectedHeadimgId = []
      selectedRowKeys.forEach(item => {
        this.selectedHeadimgId.push(item)
      })
      value.forEach(item => {
        this.selectedHeadimgValue.push(item)
      })
      this.changeAccountForm.account_signale = this.selectedHeadimgValue[0].data.join(',')
    },
    submitHeadimg() {
      this.headimgVisible = false
    },
    changeHeadImg() {
      // 修改头像
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.headImgDialogAccount  = true
    },
    assign() {
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.dialogUserId = true
    },
    assignNewUser(id) { // 分配到新的用户
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      this.dialogUserId = false

      const data = {
        list: this.form.account_list,
        port_id: 0,
        user_id: id
      }

      api.putAcountAssign(data).then((res) => {
        if (res.code === 0) {
          console.log("分配日志：\n用户ID " + id + "\n账号：" + this.form.account_list)
          message.success('分配成功')
          this.form.account_list = []
          this.getTableData()
        } else {
          this.form.account_list = []
          message.error(res.data.message)
        }
      })
    },
    exportAccount() {
      if (this.form.account_list.length === 0) {
        this.$message.error('请先选择要添加的账号')
        return
      }
      console.log(this.form.account_list.join(','))
      var downloadParamsList = []
      for (var i = 0; i < this.form.account_list.length; i++) {
        var dataTemp = 'id=' + this.form.account_list[i]
        downloadParamsList.push(dataTemp)
      }
      var downloadParam = downloadParamsList.join('&')
      var pullUrl = 'http://47.97.22.234:33411/api/v1/account/download?' + downloadParam
      // api.exportAccountInfo(downloadParam)
      this.ModalText = pullUrl
      this.visible = true
    },
    handleOk(e) {
      this.visible = false
      this.confirmLoading = false
    },
    handleCancel(e) {
      this.visible = false
    },
    deleteVisible() {
      this.batchDeleteVisible = true
      this.changeAccountForm.delete_nickname = this.form.account_list.join(',')
      console.log(this.form.account_list)
    },
    submitBatchDelete() {
      let form = {}
      form.ids = this.form.account_list
      api.postUserbatchDelete(form).then((res) => {
        if(res.code === 0) {
          this.form.account_list = 0
          this.batchDeleteVisible = false
          this.init()
          console.log(res)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleAdd() {
      if (this.form.group_id === '') {
        this.$message.error('请先选择设备端口')
        return
      }
      
      this.form.group_id = Number(this.form.group_id)
      const data = {
        list: this.form.account_list,
        port_id: this.form.group_id, // 设备Id
        user_id: this.userInfo.data.i // 用户ID
      }

      api.putAcountBindPortUser(data).then((res) => {
        if (res.code === 0) {
          this.dialogVisible = false
          this.form.group_id = ''
          this.form.account_list = []
          this.getTableData()
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    openRunInfo(accountId){
      this.currentAccountId = accountId
      this.runInfoGroupId=true
      var accountRecordParam = {
        account_id: accountId,
        order_created_at: true
      }
      api.getAccountRecordUser(accountRecordParam).then((res) => {
        if (res && res.code === 0 && res.data) {

          for (var i=0; i< res.data.data.length; i++){
            if (res.data.data[i].type == 1){
              res.data.data[i].type = "关注"
            }else{
              res.data.data[i].type = "私信"
            }
          }
          this.runInfoData = res.data.data
          this.runInfoTotal = res.data.count
        }
      })
    },
    runInfoCurrentChange(page) {
     this.runInfoCurrentPage = page
      var accountRecordParam = {
        account_id: this.currentAccountId,
        page: page,
        page_size: this.runInfohandleSize,
        order_created_at: true
      }
      api.getAccountRecordUser(accountRecordParam).then((res) => {
        if (res && res.code === 0 && res.data) {
          for (var i=0; i< res.data.data.length; i++){
            if (res.data.data[i].type == 1){
              res.data.data[i].type = "关注"
            }else{
              res.data.data[i].type = "私信"
            }
          }
          this.runInfoData = res.data.data
          this.runInfoTotal = res.data.count
        }
      })
    },
    runInfohandleSizeChange(p, s) {
      this.runInfohandleSize = s
      this.runInfoCurrentPage = 1
      this.runInfoCurrentChange()
    },
    cancel() {
      this.runInfoGroupId = false
      this.getTableData()
    },
    handleDelete(row) {
      api.delAcount(row).then(res => {
        if (res.code === 0) {
          this.init()
        }
      })
    },
    handleSelectionChange(row) {
      this.form.account_list = []
      row.forEach(item => {
        this.form.account_list.push(item.id)
      })
    },
    getGroupId(id) {
      this.dialogGroupId = false
      this.form.group_id = id
    },
    async handPut(id) {
      const res = await api.putSend(id)
      if (res.code === 0) {
        this.getTableData()
      }
    },
    async handleAddAccount() {
      if (this.accountForm.account_username !== '' && this.accountForm.account_password !== '') {
        const res = await api.postTask({
          type: 7,
          account_username: this.accountForm.account_username,
          account_password: this.accountForm.account_password,
          executive_bundle: Number(this.searchData.bundle_id)
        })
        if (res.code === 0) {
          this.dialogAccount = false
        }
      }
    },
    async changeAccountNickname() {
      if(this.selectedNicknameId.length < 1) {
        this.$message.error('请选择资源')
        return
      }
      var dataList = this.selectedNicknameId[0]
      // var dataList = this.changeAccountForm.account_nickname.split('\n')
      console.log(dataList)
      var changeAccountParam = {
        list: this.form.account_list,
        resource_id: dataList
      }
      const res = await api.setAccountNicknameUser(changeAccountParam)
      if (res.code === 0) {
        this.nicknameDialogAccount = false
        this.init()
      }
    },
    async changeAccountSignature() {
      if(this.selectedRowKeysId.length < 1) {
        this.$message.error('请选择资源')
        return
      }
      let dataList = this.selectedRowKeysId[0]
      console.log(dataList)
      let changeAccountParam = {
        // list: this.form.account_list,
        list: [30],
        resource_id: dataList
      }
      const res = await api.setAccountSignatureUser(changeAccountParam)
      if (res.code === 0) {
        this.signatureDialogAccount = false
        this.changeAccountForm.account_signale = ''
        this.init()
      }
    },
    async changeAccountHeadImg() {
      // console.log(this.selectedHeadimgId)
      if(this.selectedHeadimgId.length < 1) {
        this.$message.error('请选择资源')
        return
      }
      var dataList = this.selectedHeadimgId[0]
      // var dataList = this.changeAccountForm.account_headimg.split('\n')
      // console.log(dataList)
      var changeAccountParam = {
        list: this.form.account_list,
        resource_id: dataList
      }

      const res = await api.setAccountAvatarUser(changeAccountParam)
      if (res.code === 0) {
        this.headImgDialogAccount = false
        this.init()
      }
    },
    async handRandom() {
      const res = await api.postTask({
        type: 8,
        switch_account: '',
        executive_bundle: Number(this.searchData.bundle_id)
      })
      if (res.code === 0) {
        this.init()
      }
    },
    async handCheck(row) {
      const res = await api.postTask({
        type: 8,
        switch_account: row.unique_id,
        executive_device: Number(this.searchData.bundle_id)
      })
      if (res.code === 0) {
        this.init()
      }
    },
    async handleInputBlur(row) {
      await api.putAcountRemarks({ id: row.id, remarks: row.remarks })
    },
    handleCurrentChange(page) {
      this.searchData.page = page
      this.getTableData()
    },
    handleSizeChange(p, s) {
      this.searchData.page_size = s
      this.init()
    }
  }
}
</script>

<style lang="scss">
.ant-tooltip {
  max-width: 480px;
}
.circle {
  width: 100px;
  height: 100px;
  text-align: right;
  background-color: green;
}
</style>
