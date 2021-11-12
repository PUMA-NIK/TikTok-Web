<template>
  <a-layout-sider width="auto">
    <!-- 平台账号 -->
    <div class="user-type">
      <p>登录平台</p>
      <div class="type-list">
        <div
          v-for="(item, i) in this.$store.state.typeList"
          :key="item.name + i"
          @click="getUserType(item, i)"
          :class="['item-list', { typeactive: codeActive == i }]"
        >
         <a-tooltip :title="item.name">
            <img :src="item.typeImg" alt="" />
          </a-tooltip>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>

    <!-- 平台账号列表 -->
    <transition
      enter-active-class="bounceIn"
      leave-active-class="bounceOut"
      :duration="200"
    >
      <div class="news-type" v-if="userListKey.length > 0">
       <a-input-search placeholder="搜索账号" @search="onSearch" />
        <div style="padding: 10px 5px">
          <div
            v-for="(item2, index2) in userListKey"
            @click="getFriendList(item2, item2.id)"
            :key="index2"
            :class="['my-img', { userctive: userActive == item2.id }]"
          >
            <img v-if="item2.avatar" :src="item2.avatar" alt="" />
            <a-avatar v-if="!item2.avatar" shape="square" :size="40" icon="user" />
           <a-tooltip :title="item2.nickname">
          
              <p>{{ item2.nickname }}</p>
            </a-tooltip>
          </div>
        </div>
      </div>
    </transition>

    <!--好友列表 -->
    <transition
      enter-active-class="bounceIn"
      leave-active-class="bounceOut"
      :duration="200"
    >
      <div class="user-list" v-if="friendList.length > 0">
        <div class="user-list-seach">
         <a-input-search placeholder="搜索粉丝" @search="onSearch" />
        </div>
        <div class="user-list-box">
          <div
            v-for="(item, index) in friendList"
            :key="index"
            @contextmenu.prevent="contextmenu(item, index)"
            @click="getUserDetial(item), (friendActive = index)"
            ref="userdiglog"
            :class="['user-detail', { codeactive: friendActive == index }]"
          >
            <!-- 气泡 -->
            <div class="user-menu" v-if="menuIndex == index">
              <i
                class="el-icon-circle-close"
                @click.stop="menuIndex = null"
              ></i>
              <ul>
                <li>置顶</li>
                <li>移除列表</li>
              </ul>
            </div>
            <div class="user-avatar-img">
              <a-badge
                class="item"
              >
                <a-avatar v-if="!item.avatar" shape="square" :size="50" icon="user" />
                <img v-if="item.avatar" :src=" item.avatar" alt="" />
              </a-badge>
            </div>
            <div class="user-name">
              <div class="user-time">
                <p>{{ item.nickname }}</p>
                <p>{{ computedMoment(item.created_at)  }}</p>
              </div>
              <!-- <p
                class="user-centent"
                v-if="
                  item.messgeList[item.messgeList.length - 1]['type'] ==
                  'messge'
                "
              >
                {{ item.messgeList[item.messgeList.length - 1]["messge"] }}
              </p> -->
              <!-- <p
                class="user-centent"
                v-if="
                  item.messgeList[item.messgeList.length - 1]['type'] == 'img'
                "
              >
                [图片]
              </p> -->
            </div>
          </div>
        </div>
      </div>
    </transition>
  </a-layout-sider>
</template>

<script>
import bus from "../utils/brotherBus";
import * as api from "@/api/index";
import moment from 'moment'
export default {
  data() {
    return {
      codeActive: null,
      userActive: null,
      friendActive: null,
      seachValue: "",
      userListKey: [],
      friendList: [],
      menuIndex: null,
      keyBoolin:false,
      fansId:null,
      parame: {
        page: 1,
        page_size: 10,
        order_created_at: true,
      },
    };
  },
  computed: {
      computedMoment() {
        return function(value) {
          return moment(value).format('HH:mm')
        }
        }
  },
  mounted() {},
  methods: {

    onSearch(){

    },
    // 获取好友列表
    getChumList() {
      let form = this.parame;
      api.getChatRoom(form).then((res) => {
        console.log(res);
        this.userListKey = res.data.data;
      });
    },

    // 数据右击事件
    contextmenu(item, index) {
      this.menuIndex = index;
    },
    // 选择平台
    getUserType(item, index) {
      this.$store.commit("getUserInfo", {});
      (this.codeActive = index), (this.userListKey = []);
      this.friendList = [];
      this.getChumList();      
      //   this.userListKey = item.myUserinfoList;

    },

    //选择账号获取粉丝列表
    getFriendList(item, index) {
      var that = this
      this.userActive = index;
      console.log()
      this.$store.commit("getUserInfo", {});
      // this.$store.commit("getMyInfo", item);
      this.friendList = []
      localStorage.setItem('fansId',index)
      this.fansId = index
      let parame = this.parame;
      parame.account_id = index;
     
      api.getFansList(parame).then((res) => {
        console.log(res.data.data);
        that.friendList = res.data.data;
      });
    },
    // 获取粉丝聊天记录
    getUserDetial(item) {
       localStorage.setItem('userId' , item.id)
        bus.$emit('tabs','11111')
       let parame = {...this.parame , account_id:localStorage.getItem('fansId'),account_follower_id:item.id};
       api.getFansMessge(parame).then((res) => {
         this.$store.commit("getUserInfo", item);
      });
      bus.$emit("setScroll", "切换好友");
    },
  },
};
</script>

<style lang="scss" scoped>
.user-list,
.empty-list,
.news-type,
.user-type {
  margin: 0 1px;
  overflow: auto;
  background: #304156;
  
}
.userctive {
  background: #EEEEEE !important;
  border-radius: 4px !important;
}
.typeactive {
  background: #A2A2A2 !important;
  border-radius: 4px !important;
}
.codeactive {
  background: #A2A2A2 !important;
  border-radius: 4px !important;
}
.user-type {
  background: #304156;
  > p {
    text-align: center;
    font-weight: 700;
    color: white;
    margin: 10px 0;
  }
}
::v-deep .el-badge__content {
  padding: 0 6px;
}
::v-deep .el-badge {
  width: 100%;
  height: 100%;
}
.empty-list {
  padding: 5px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
  width: 170px;
  ::v-deep .el-empty {
    flex: 1;
    padding: 0 5px;
  }
  .el-tag {
    width: 100%;
    color: black;
    text-align: center;
  }
}
::v-deep .ant-layout-sider-children {
  color: #333;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  .user-type {
    width: 150px;
    padding: 5px;
    box-sizing: border-box;
    .el-tag {
      width: 100%;
      color: black;
      text-align: center;
    }
    .type-list {
      flex-wrap: wrap;
      margin-top: 33px;
    }
    .item-list {
      display: flex;
      margin: 10px 0;
      margin-top: 20px;
      p {
        font-size: 14px;
        display: flex;
        color: white;
        align-items: center;
      }
      img {
        width: 40px;
        margin: 0 10px;
        margin-left: 0;
        background: white;
        border-radius: 5px;
        height: 40px;
      }
    }
  }
  .news-type {
    width: 170px;
    padding: 5px;
    box-sizing: border-box;
    .my-img {
      background: white;
      border-radius: 4px;
      display: flex;
      padding: 4px;
      margin: 10px 5px;
      p {
        margin: 10px 0;
        font-size: 16px;
        margin-left: 10px;
        flex: 1;
        width: 0px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      img {
        width: 50px;
        height: 50px;
        border-radius: 5px;
      }
    }
  }
}
.user-list {
  width: 250px;
  display: flex;
  flex-direction: column;
  padding: 5px;
  background: #e9e9e9;
  .user-list-box {
    flex: 1;
    padding: 10px 5px;
    .user-detail {
      padding: 2px;
      margin: 10px 0;
      display: flex;
      position: relative;
      .user-menu {
        ul {
          li {
            line-height: 26px;
          }
        }
        i {
          position: absolute;
          right: 2px;
          top: 2px;
          font-size: 18px;
        }
        z-index: 999;
        position: absolute;
        right: 1px;
        background: white;
        padding: 10px;
        border-radius: 4px;
        width: 150px;
        right: 0px;
        top: 29px;
        z-index: 9;
      }
      .user-time {
        flex: 0.5;
        text-align: right;
        font-size: 10px;
        display: flex;
        justify-content: space-between;
      }
      .user-name {
        flex: 1;
        margin: 0 5px 0 18px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 2px;
        .user-centent {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;

          overflow: hidden;
        }
        p:nth-child(1) {
          font-weight: 700;
          font-size: 16px;
        }
        p:nth-child(2) {
          font-size: 12px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
      .user-avatar-img {
        width: 50px;
        height: 50px;
        border-radius: 5px;
        img {
           width: 50px;
          height: 50px;
          border-radius: 5px;
        }
      }
    }
  }
}
</style>