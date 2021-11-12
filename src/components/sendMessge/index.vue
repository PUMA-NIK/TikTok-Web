<template>
  <div class="send-messge">
    <div class="function-class">
      <i class="iconfont icon-400biaoqing_biaoqing"></i>
      <i class="iconfont icon-charutupian">
        <input
          type="file"
          class="upload-img"
          @change="changepic($event)"
          accept="image/*"
        />
      </i>
      <i class="iconfont icon-wenjianjia"></i>
    </div>
    <div class="item-input">
      <textarea
        @keydown="keyup($event)"
        class="myTextarea"
        v-model="value"
        id="myTextarea"
        cols="30"
        rows="10"
      ></textarea>
      <div class="send-btn">
        <a-button
          type="info"
          :disabled="!value"
          @click.prevent="sendMessge"
          plain
          >发送(Enter)</a-button
        >
        <a-button type="danger" :disabled="!value" @click="value = ''" plain
          >清空</a-button
        >
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import { translate } from "../../utils/translate";
import bus from "../../utils/brotherBus";
import * as api from "../../api/index";
export default {
  data() {
    return {
      value: undefined,
      listArr:[]
    };
  },
  mounted() {
    
  },
  methods: {
    // 翻译
    changepic(e) {
      let that = this;

      let fileList = e.target.files[0];

      let reader = new FileReader();

      reader.readAsDataURL(fileList);

      reader.onload = function (e) {
        let dataURL = reader.result;

        that.$store.commit("messgePushData", {
          image: dataURL,
          type: "img",
          vid: 2,
          sendTime: new Date(),
        });
      };
    },

    // 键盘回车发送消息
    keyup(event) {
      if (event.keyCode === 13) {
        event.preventDefault(); // 阻止浏览器默认换行操作
        this.sendMessge(); // 发送文本
        return false;
      }
    },

    // 发送消息推送
    sendMessge(event) {
      var that = this
      let parmes = {
        type: "text",
        account_id: parseInt(localStorage.getItem("fansId")),
        account_follower_id: parseInt(localStorage.getItem("userId"))  ,
        content: this.value,
      };
      api.sendMessge(parmes)
        .then((res) => {
          this.$message.loading("消息发送中..").then(() => {
             let messgeList = JSON.parse(localStorage.getItem("messgeList"));
             console.log(messgeList)
             console.log(res.data,that.listArr)
            that.listArr.push(res.data);
            that.listArr = [...messgeList, res.data];
            localStorage.setItem("messgeList", JSON.stringify(that.listArr));
            that.$store.commit("newData", JSON.stringify(that.listArr));
          });
        })
        .catch(() => {
          this.$message.info("服务器异常");
        });
      // translate(undefined, undefined, this.value).then((res) => {
      //   this.$store.commit("messgePushData", {
      //     messge: res,
      //     type: "messge",
      //     vid: 2,
      //     sendTime: new Date(),
      //   });

      //   bus.$emit("setScroll", "切换好友");
      // });
      this.value = undefined;
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
textarea {
  outline: none;
  resize: none;
  width: 100%;
}
::v-deep .el-button--info.is-plain {
}
#myTextarea::-webkit-scrollbar {
  display: none;
}
.upload-img {
  width: 100%;
  opacity: 0;
  position: absolute;
  left: 0px;
  z-index: 999;
  height: 100%;
}
#myTextarea {
  margin: 0px;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  resize: none;
  cursor: pointer;
  height: 195px;
}
.send-messge {
  box-sizing: border-box;
  border: 1px solid #c0c4cc;
  position: relative;
  display: flex;
  flex-direction: column;
  .item-input {
    flex: 1;
    .send-btn {
      position: absolute;
      bottom: 4px;
      right: 4px;
      button {
        margin: 4px;
      }
    }
  }
  .function-class {
    /* width: 100%; */
    height: 40px;
    background: #304156;
    display: flex;
    align-items: center;
    padding-left: 20px;
    i {
      color: white;
      font-size: 24px;
      margin-right: 20px;
    }
    i:nth-child(2) {
      position: relative;
    }
  }
}
</style>