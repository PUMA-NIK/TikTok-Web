<template>
    <a-tabs :default-active-key="activeName" @change="handleClick" stretch>
        <a-tab-pane key="first" tab='快捷回复'>
            <div class="fast-reply">
                <div v-for="(item,i) in fastList" :key="i">
                    <div class="tag" @dblclick="dbsend(item.text)">
                        <p>{{ item.text }}</p>
                    </div>

                    <a-divider></a-divider>
                </div>
            </div>
        </a-tab-pane>
        <a-tab-pane key="second" tab='客户资料'>
            <div class="user-info">
                <div class="user-avatar">
                    <div class="block">
                        <a-avatar   :src="this.$store.state.userInfo.avatar"  :size="70" icon="user" />
                    </div>
                    <div>{{ this.$store.state.userInfo.nickname }}</div>
                    <p>备注 <span class="el-icon-edit"></span></p>
                </div>
                <div class="item-info-list">
                    <ul>
                        <li>客户昵称：</li>
                        <li>{{ this.$store.state.userInfo.nickname }}</li>
                    </ul>
                    <ul>
                        <li>客户性别：</li>
                        <li>
                            <!-- {{ this.$store.state.userInfo.gender }} -->
                            <span class="iconfont icon-xingbienan"></span>
                        </li>
                    </ul>
                    <ul>
                        <li>用户来源：</li>
                        <li>ins</li>
                    </ul>
                    <ul>
                        <li>个性签名：</li>
                        <!-- <li>{{ this.$store.state.userInfo.signature }}</li> -->
                    </ul>
                </div>
            </div>
        </a-tab-pane>
        <a-tab-pane key="set" tab='用户设置'>
            <div class="set">
                <a-form ref="form" :model="form" label-width="80px">
                    <a-form-item label="翻译语言">
                        <a-select @change="selectTranslate" :default-value="value" placeholder="转换的语言类型">
                            <a-select-option
                                v-for="(item , index) in translateList"
                                :key="index"
                                :value="item.value"
                            >
                            {{item.label}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-form>
            </div>
        </a-tab-pane>
    </a-tabs>
</template>

<script>
import {  translate } from '../../utils/translate'
import bus from '../../utils/brotherBus'
export default {
    data() {
        return {
            form: {},
            translateList: [
                {
                    value: "zh",
                    label: "默认(中文)",
                },
                {
                    value: "en",
                    label: "英语",
                },
                {
                    value: "jp",
                    label: "日语",
                },
                {
                    value: "fra",
                    label: "法语",
                },
                {
                    value: "ru",
                    label: "俄罗斯",
                },
                {
                    value: "it",
                    label: "意大利语",
                },
                {
                    value: "kor",
                    label: "韩语",
                },
                {
                    value: "de",
                    label: "德语",
                },
            ],
            value: "",
            userInfo: this.$store.state.userInfo,
            activeName: "first",
            fastList: [
                {
                    text: "你好！欢迎咨询",
                },
                {
                    text: "很高兴为您服务！",
                },
                {
                    text: "抱歉！这边无法处理您的问题",
                },
                {
                    text: "接下来为你转接其他人工客服，请稍等客服，请稍客服，请稍！",
                },
                {
                    text: "实在抱歉！请您稍等",
                },
            ],
        };
    },
    methods: {

        // 选择翻译类型
        selectTranslate(e){
            this.$store.commit('setTranslateType', this.value)
        },

        //  双击发送消息
        dbsend(text) {
            translate('','',text).then((res)=>{
                console.log(res)
                this.$store.commit("messgePushData", { messge: res, vid: 2 });
                 bus.$emit('setScroll',111)
            })
            
        },
        handleClick(tab, event) {
            console.log(tab, event);
        },
    },
};
</script>

<style lang="scss" scoped>

::v-deep .ant-layout-sider-children{
    background: white;
}
::v-deep .ant-tabs-bar{
    margin: 0 10px;
}
.set {
    padding: 10px;
    box-sizing: border-box;
}
.user-info {
    display: flex;
    /* justify-content: center; */
    flex: 1;
    flex-direction: column;
    .item-info-list {
        padding: 20px;
        flex: 1;
        ul {
            display: flex;
            margin: 20px 0;
            li:nth-child(1) {
                width: 100px;
                font-size: 18px;
                font-weight: 400;
            }
            li:nth-child(2) {
                word-wrap: break-word;
                word-break: normal;
                width: 0px;
                flex: 1;
                span {
                    font-size: 18px;
                }
            }
        }
    }
    .user-avatar {
        // height: 100px;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        background: #304156;
        border-radius: 0 0 100px 100px;
        padding: 50px 0;
        > div:nth-child(2) {
            color: white !important;
            font-size: 16px;
            font-weight: 500;
            margin: 5px 0;
        }
        > p {
            color: rgba(255, 255, 255, 0.3) !important;
            font-size: 14px;
            font-weight: 300;
        }
    }
}
::v-deep .el-divider {
    margin: 10px 0;
}
.el-tabs {
    display: flex;
    flex: 1;
    flex-direction: column;
}
::v-deep .el-tabs__content {
    flex: 1;
    display: flex;
    padding: 0px;
}
::v-deep .a-tab-pane{
    flex: 1;
    display: flex;
    > div {
        flex: 1;
        background: #e9e9e9;
        .tag {
            padding: 0px 0;
            display: flex;
            p {
                font-weight: 500;
                font-size: 14px;
                line-height: 28px;
            }
        }
    }
   
}
 .fast-reply {
        padding: 20px;
        box-sizing: border-box;
    }
</style>>
