<template>
    <div class="messge-box" style="flex: none" ref="itembox">
        <div
            class="item-box"
            v-for="(item, index) in  getUserIcons"
            :key="index"
            :style="item.is_send  == false ? '': 'justify-content:end;flex-flow: row-reverse'"
        >
            <div class="item-box-img">
                 <a-avatar shape="square"  v-if="item.is_send  == false"  :size='40' :src="$store.state.userInfo.avatar" />
                <a-avatar shape="square" v-else :size='40' src=""  icon="user"/>
            </div>
            <!-- <div class="item-upload" v-if="item.image"> -->
                <!-- <img :src="item.image" ref="dom" /> -->
            <!-- </div> -->
            <div class="item-fanyi">
                <div
                    class="item-box-messge"
                    :style="
                       item.is_send  == false ? 'margin-left: 20px;background: white;': 'margin-right: 20px;background: #67C23A;'"
                        @mousemove.prevent="tranlsateIndex = index"
                        @mouseout.prevent="tranlsateIndex == null"
                >
                    <div
                    
                        v-if=" item.is_send  == false && tranlsateIndex == index"
                        class="item-box-tranlsate"
                    >
                        <el-button
                           
                            @click="keyTranslete(item,index),item.isTop = true"
                            icon="el-icon-refresh"
                            :loading="btnLoading"
                            >翻译</el-button>
                    </div>
                    <p>{{ imgWD(item)  }}</p>
                    
                    <div :class="['item-box-qipao', item.is_send  == false ? 'triangle-left' : 'triangle-right']"></div>
                </div>
                <div class="fanyi-box"   v-if="item.isTop == true" >
                     <p>翻译：{{ item.translate }}</p>
                     <i class="el-icon-circle-close" @click.stop="deleteMeege(item,index)"></i>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import bus from "../../utils/brotherBus";
import { translate } from "../../utils/translate";
export default {
    name: "messgeBox",
    data() {
        return {
            tranlsateIndex: null,
            btnLoading: false,
            deleteIndex:null,
            listData:[],
            fansId: parseInt(localStorage.getItem('fansId')),
            userId: parseInt(localStorage.getItem('userId')) 
        };
    },
    computed:{
        getUserIcons() {
            var that = this
            var arr = []
            let data = JSON.parse(this.$store.state.messgeList) 
            data.forEach((item)=>{
                if(item.account_follower_id == this.userId){
                    arr.push(item)
                    that.scroolSetBottom();
                }
            })
            return arr
        },
        imgWD(o){
            return function(o){
                console.log(o)
                return JSON.parse(o.content).text
            }
       }
    },
    watch: {
    },
    methods: {

            log(){
                console.log(this.$store.state.messgeList)
                },
        // 删除翻译
        deleteMeege(item,index){
            this.$nextTick(()=>{
                    delete item.translate
                    delete item.isTop
                    this.$forceUpdate()   //强制刷新试图
            })
        },

        // 一键翻译
        keyTranslete(item,index) {
            this.btnLoading = true;
            this.deleteIndex = index
            translate("auto", "zh", item.messge).then((res) => {
                this.$nextTick(() => {
                    this.btnLoading = false;
                    item.translate = res;
                });
            });
        },

        // 鼠标移入翻译
        // 格式化数据
        falatData(){
            let data = JSON.parse(localStorage.getItem('messgeList'))
            let fansId = localStorage.getItem('fansId')
            let userId =  localStorage.getItem('userId')
            this.listData = []
            data.forEach((item)=>{
                if(item.account_follower_id == userId){
                    this.listData.push(item)
                }
            })
            // return data
        },

        // 页面触底
        scroolSetBottom(index) {
            var _that = this;
                this.$nextTick(() => {
                    _that.$refs.itembox.scrollTop = _that.$refs.itembox.scrollHeight;
                });
        },
    },

    created(){

    },
    updated() {
    },
    mounted() {
        bus.$on('tabs',(e)=>{
            this.falatData()
        })
        this.falatData()
        this.scroolSetBottom();

        // 监听兄弟组件的消息
        bus.$on("setScroll", (res) => {
            console.log(res)
            var that = this;
            that.scroolSetBottom();
            this.$forceUpdate()
        });
    },
};
</script>


<style lang="scss" scoped>
.messge-box::-webkit-scrollbar {
    display: none;
}
.triangle-right {
    border-left: 10px solid #67c23a;
    right: -10px;
}
.triangle-left {
    left: -10px;
    border-right: 10px solid white;
}
.messge-box {
    overflow-y: scroll;
    box-sizing: border-box;
    background: #f5f5f5;
    border: 1px solid #c0c4cc;
    background-repeat: no-repeat;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    background-size: 100% 100%;
    height: 588px !important;

    .item-box {
        display: flex;
        margin-bottom: 10px;
        .item-fanyi {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            .fanyi-box {
                max-width: 357px;
                background: rgb(103, 194, 58);
                margin: 15px 0px;
                padding: 15px 10px;
                border-radius: 5px;
                margin-left: 20px;
                font-size: 14px;
                border-bottom: 1px solid #c0c4cc;
                position: relative;
                i{
                    /* color: white; */
                    font-size: 16px;
                    position: absolute;
                    top: -2px;
                    right: -2px;
                }
            }
        }
        .item-box-messge {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            min-height: 30px;
            padding: 5px 10px;
            line-height: 19px;
            border-radius: 5px;
            max-width: 357px;
            position: relative;
            .item-box-tranlsate {
                position: absolute;
                
                right: -67px;
                top: 1px;
                ::v-deep .el-button{
                    padding: 5px 5px;
                }
            }
            .item-box-qipao {
                display: inline-block;
                width: 0;
                height: 0;
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
                position: absolute;
                top: 8px;
            }
        }
        .item-upload {
            /* transform:scale(0.5,0.5); */
            width: 100px;
            height: 100px;
            margin: 0 20px;
            border-radius: 8px;
            background: white;
            img {
                width: 100%;
                height: 100%;
                border-radius: 8px;
            }
        }
        .item-box-img {
            img {
                width: 40px;
                height: 40px;
                border-radius: 5px;
            }
        }
    }
}
</style>