<template>
  <div>
		<a-form layout="inline" :model="searchData" class="demo-form-inline">
			<a-form-item label="搜索内容">
				<a-input v-model="searchData.keyword" placeholder="请输入搜索内容" allow-clear />
			</a-form-item>
			<a-form-item>
				<a-button type="primary" @click="getResourcesTableData()">查询</a-button>
				<a-button style="margin-left: 8px" type="primary" @click="videoDownload">视频下载</a-button>
				<a-button style="margin-left: 8px" type="primary" @click="userDownload">博主下载</a-button>
			</a-form-item>
		</a-form>
		<div class="table-box">
			<a-table :columns="columns" :data-source="tableData" :row-key="record => record.video_id" class="tableLimit" :row-selection="{selectedRowKeys: resourcesId ,onChange: rowSelectionValue}" :bordered="true" :pagination="false">
				<span slot="userAvatar" slot-scope="text, row ">
          <a-avatar :src="row.userAvatar" />
          <p>{{ row.userNickname }}</p>
        </span>
				<span slot="action" slot-scope="text, row">
					<a-button type="primary" @click="userVisible(row)">预览博主</a-button>
					<a-button type="primary" style="margin-left: 10px" @click="videoVisible(row)">预览视频</a-button>
				</span>
			</a-table>
			<a-modal v-model="userMessageVisible" title="预览博主信息" width="500px" ok-text="确认" cancel-text="取消">
        <div style="height:200px; overflow-y:auto;">
          <p>博主：{{userMessage.nickname}}</p>
				  <p>博主头像：<a-avatar :src="userMessage.avatar" /></p>
					<p>博主地址：{{userMessage.region}}</p>
					<p>博主名片地址：<a :href='userMessage.share_url' title="博主名片" target="_blank">{{userMessage.share_url}}</a></p>
        </div>
      </a-modal>
			<a-modal v-model="videoMessageVisible" title="预览视频信息" width="500px" ok-text="确认" cancel-text="取消">
        <div style="height:300px; overflow-y:auto;">
          <p>视频信息：{{videoMessage.desc}}</p>
					<p>视频封面</p>
				  <img style="height:100px; width: 100px;border-radius: 10px" :src="videoMessage.cover" alt="视频信息">
					<p>视频地址：<a :href='videoMessage.share_url' title="博主名片" target="_blank">{{videoMessage.share_url}}</a></p>
        </div>
      </a-modal>
			
			<!-- <div class="page">
        <a-pagination :show-total="(total, range) => `${range[0]}-${range[1]} 条，总数:${total} 条`" :page-size-options="['10', '20', '50', '100', '200']" show-size-changer :default-current="1" :current="searchData.page" :total="total" @change="handleCurrentChange" @showSizeChange="handleSizeChange">
          <template slot="buildOptionText" slot-scope="props">
            <span>{{ props.value }}条/页</span>
          </template>
        </a-pagination>
      </div> -->
		</div>
	</div>
</template>

<script>
const columns = [
{
  title: '博主',
  dataIndex: 'userAvatar',
  align: 'center',
  width: '100px',
  scopedSlots: { customRender: 'userAvatar' }
},
{
  title: '视频简介',
  dataIndex: 'search_desc',
	ellipsis: true,
  width: '300px',
  align: 'center'
},
{
  title: '视频地址',
  dataIndex: 'share_url',
	ellipsis: true,
  width: '300px',
  align: 'center'
},
{
  title: '视频上传时间',
  dataIndex: 'video_time',
	ellipsis: true,
  width: '200px',
  align: 'center'
},
{
  title: '操作',
  dataIndex: 'action',
  width: '200px',
  align: 'center',
  scopedSlots: { customRender: 'action' }
}]
import * as api from '@/api/index'
export default {
  data() {
    return {
			columns: columns,
      searchData: {
        keyword: '',
				search_id: '',
				offset: 0
      },
			total: 0,
			tableData: [],
      fileList: [],
      fileDataList: [],
			resourcesId: [],
			resourcesValue: [],
			videoMessage: {},
			userMessage: {},
			videoMessageVisible: false,
			userMessageVisible: false,
			list:[123+'\r\n'+123+'\r\n'+123+'\r\n'+123+'\r\n']
    }
  },
  mounted() {
		this.init()
  },
  methods:{
		init() {
			this.searchData.keyword = ''
			this.searchData.search_id = ''
			this.searchData.offset = 0
		},
		getResourcesTableData() {
			let form = {}
			form.keyword = this.searchData.keyword
			form.search_id = this.searchData.search_id
			form.offset = this.searchData.offset
			api.postUserSearch(form).then(res => {
				if(res.code === 0) {
					this.searchData.search_id = res.data.next.search_id
					this.searchData.keyword = res.data.next.keyword
					this.searchData.offset = res.data.next.offset
					this.tableData = res.data.list
					this.tableData = res.data.list.map(item => {
						return {...item, 
						userAvatar: item.user.avatar,
						video_time: new Date(item.create_time* 1000).toLocaleString().replace(/:\d{1,2}$/,' '),
						userNickname: item.user.nickname,
						userRegion: item.user.region,
						userSec_uid: item.user.sec_uid,
						userShare_url: item.user.share_url,
						userUid: item.user.uid,
						userUnique_id: item.user.unique_id}
					})
				}
			}).catch(err => {
				console.log(err)
			})
		},
		rowSelectionValue(selectedRowKeys, value) {
			this.resourcesId = []
			this.resourcesValue = []
			selectedRowKeys.forEach(item => {
        this.resourcesId.push(item)
      })
			value.forEach(item => {
        this.resourcesValue.push(item)
      })
		},
		//  下载视频地址
		videoDownload() {
			let videoTextList = this.resourcesValue.map(item => {
				return item.video_id
			})
			let videoText = Array.from(new Set(videoTextList) )
			let str = videoText.toString()
			let strList = str.replace(/,/g,'\r\n')
			let list = []
			list.push(strList)
			let videoIDText = list
			this.downloadTxt(videoIDText,'视频信息')
		},
		//  下载博主地址
		userDownload() {
			let userTextList = this.resourcesValue.map(item => {
				return item.userUid+'|'+item.userSec_uid
			})
			let userText = Array.from(new Set(userTextList) )
			let str = userText.toString()
			let strList = str.replace(/,/g,'\r\n')
			let list = []
			list.push(strList)
			let userIDText = list
			this.downloadTxt(userIDText,'名片信息')
		},
		downloadTxt(text, fileName){
			let element = document.createElement('a')
			element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text))
			element.setAttribute('download', fileName)
			element.style.display = 'none'
			element.click()
		},
		userVisible(row) {
			this.userMessageVisible = true
			let userMessage = {}
			this.userMessage ={}
			userMessage.avatar = row.user.avatar
			userMessage.nickname = row.user.nickname
			userMessage.region = row.user.region
			userMessage.sec_uid = row.user.sec_uid
			userMessage.share_url = row.user.share_url
			userMessage.uid = row.user.uid
			userMessage.unique_id = row.user.unique_id
			this.userMessage = userMessage
			console.log(row)
		},
		videoVisible(row) {
			this.videoMessageVisible = true
			let videoMessage = {}
			this.videoMessage = {}
			videoMessage.cover = row.cover
			videoMessage.create_time = row.create_time
			videoMessage.desc = row.desc
			videoMessage.desc_language = row.desc_language
			videoMessage.search_desc = row.search_desc
			videoMessage.share_url = row.share_url
			videoMessage.video_id = row.video_id
			this.videoMessage = videoMessage
			console.log(row)
		},
		handleCurrentChange(page) {
			this.searchData.page = page
			this.getResourcesTableData()
		},
		handleSizeChange(page, size) {
			this.searchData.page_size = size
			this.getResourcesTableData()
		}

  }
}
</script>