<template>
  <div class="chat-room">
    <a-layout>
      <UserList />
      <a-layout
        v-if="Object.keys(this.$store.state.userInfo).length > 1"
        class="contarners"
      >
        <Hearder />
        <Main />
      </a-layout>
      <ThreeIndex v-if="Object.keys(this.$store.state.userInfo).length <= 1" />
      <UserInfo v-if="Object.keys(this.$store.state.userInfo).length > 1" />
    </a-layout>
  </div>
</template>


<script>
import Hearder from "@/components/hearder.vue";
import Main from "@/components/main.vue";
import UserList from "@/components/userList.vue";
import UserInfo from "@/components/userInfo.vue";
import ThreeIndex from "@/components/404";

export default {
  name: "CharRoom",
  components: {
    Hearder,
    Main,
    UserList,
    UserInfo,
    ThreeIndex,
  },
  data() {
    return {
      websocket: null,
      listArr: [],
    };
  },
  created() {},
  methods: {
    // 初始化webscoket
    initWebSocket() {
      let that = this;
      const apiAddress = process.env.VUE_APP_BASE_API;
      if ("WebSocket" in window) {
        const token = sessionStorage.getItem("token");

        let url = `ws://192.168.80.5:8088/api/v1/ws/`;

        this.websocket = new WebSocket(url);

        // 有消息的回调
        this.websocket.onmessage = function (e) {
          // 判断data类型
          if (typeof e.data == "string") {
            console.log(e.data)
            let data = JSON.parse(e.data);
            // 拿到缓存
            let messgeList = JSON.parse(localStorage.getItem("messgeList"));

            that.listArr.push(data.data);
            that.listArr = [...messgeList, data.data];
            localStorage.setItem("messgeList", JSON.stringify(that.listArr));
            that.$store.commit("newData", JSON.stringify(that.listArr));
          }
        };

        // 链接成功地回调 带token验证
        this.websocket.onopen = function (e) {
          //  this.$message.loading('Action in progress..', 2.5)
          console.log("链接成功", e);
          this.send(token);
        };

        // 连接错误回调
        (this.websocket.onerror = function (e) {
          // this.websocket.send('PING')
          console.log("链接错误", e);
        }),
          // 断开连接回调
          (this.websocket.onclose = function (e) {
            console.log("断开链接", e);
          });
      } else {
        alert("当前浏览器不支持websocket");
      }
    },
  },
  destroyed() {
    this.websocket.close();
  },
  mounted() {
    // 初始化化websocket
    this.initWebSocket();

    this.$store.commit('messgePushData', localStorage.getItem("messgeList"))
    // 页面销毁清空用户信息
    this.$store.commit("deleteUserInfo");
  },
};
</script>

<style lang='scss' scoped>
.ant-layout-sider {
  background: white;
}
::v-deep .a-layout {
  width: 100%;
  height: 100%;
}
.a-layout {
  flex-direction: column;
}
.avatar {
  display: flex;
  justify-content: end;
  align-items: center;
  margin-right: 50px;
  height: 100%;
  p {
    font-size: 16px;
    margin: 0 20px;
    font-weight: 700;
    color: white;
  }
}
.chat-room {
  width: 100%;
  /* height: 100%; */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
}

body > .a-layout {
  margin-bottom: 40px;
}

// .heardes-user {
//   background: #0acffe;
// }
// .el-container:nth-child(5) .el-aside,
// .el-container:nth-child(6) .el-aside {
//   line-height: 260px;
// }

// .el-container:nth-child(7) .el-aside {
//   line-height: 320px;
// }
</style>