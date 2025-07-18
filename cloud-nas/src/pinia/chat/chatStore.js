import { defineStore } from 'pinia';
import {memberInfoShare} from "../member/MemberInfoShare.js";
import {h, ref} from "vue";
import mRequest from "../../utils/MemberRequest.js";
import {ElMessage, ElNotification} from "element-plus";
import {useMessageOPStore} from "./UseMessageOPStore.js";

export const useChatStore = defineStore('chat', () => {

        const memberInfoStore = memberInfoShare()
        const messageOPStore = useMessageOPStore()

        const socket = ref(null)
        const chatMessages = ref([])
        const memberId = ref()
        const receiveId = ref()
        const receiveNickName = ref()
        const receiveAvatar = ref()
        const receiveStatus = ref(false)
        const connected = ref(false)
        const chatWithId = ref(0)


        function connect() {
            if (memberInfoStore.memberId === '') {
                return;
            }
            // 从localStorage获取用户名或使用默认值
            this.memberId = memberInfoStore.memberId;

            // 创建WebSocket连接
            // const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            // const socketUrl = 'ws://localhost:8030/ws/chat?memberId=' + encodeURIComponent(memberId.value);

            // 自动适应当前网页协议和主机
            const socketUrl = (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws/chat?memberId=' + encodeURIComponent(memberId.value);

            this.socket = new WebSocket(socketUrl);

            // 连接建立时的处理
            this.socket.onopen = () => {
                this.connected = true;
                console.log('WebSocket连接已建立');
            };

            // 接收到消息时的处理
            this.socket.onmessage = (event) => {
                // 在控制台打印接收到的消息
                console.log('收到消息:', event.data);
                addMessage(event.data);
            };

            // 连接关闭时的处理
            this.socket.onclose = () => {
                this.connected = false;
                console.log('WebSocket连接已断开');
            };

            // 连接错误时的处理
            this.socket.onerror = (error) => {
                console.log('连接发生错误: ' + error.message);
            };
        }

        function disconnect() {
            if (this.socket) {
                this.socket.close();
            }
        }

        function sendMessage(message,status) {
            if (this.connected && this.socket) {
                // let json = memberInfoStore.memberId + ":" + receiveId.value + ":" + message
                const msgObj = {sendId: memberInfoStore.memberId,sendNickName: memberInfoStore.memberNickName,receiveId: receiveId.value,status: status,message: message}
                const msgJson = JSON.stringify(msgObj);
                // console.log(msgJson)
                // console.log(json)
                this.socket.send(msgJson);
                // let save = memberInfoStore.memberNickName + ":" + memberInfoStore.memberId + ":" + receiveId.value + ":" + message
                addMessage(msgJson)
                // 在控制台打印发送的消息，方便调试
                console.log('发送消息:', message);
            }
        }

        function addMessage(message) {
            // const arr = message.split(":")
            const msgObj = JSON.parse(message);
            chatMessages.value.push(msgObj);
            if (Number(msgObj.sendId) !== Number(memberInfoStore.memberId)) {
                if (chatWithId.value !== Number(msgObj.sendId)) {
                    messageOPStore.newsNums += 1;
                    ElNotification({
                        title: '新消息',
                        message: h(
                            'div',
                            {
                                style: 'cursor: pointer',
                                onClick: () => {
                                    alert('通知被点击了')
                                    // 可以在这里跳转、打开弹窗、做别的处理
                                }
                            },
                            [
                                h('span', { style: 'color: orange' }, msgObj.sendNickName + ': '),
                                h('span', { style: 'color: skyblue' }, msgObj.status === 0?msgObj.message:"图片")
                            ]
                        ),
                        showClose: false
                    })
                }
            }
        }

        let currentPage = ref(1);
        let isCover = ref(true);
        let hasMore = ref(true);
        async function getHistoryChat () {
            try {
                const response = await mRequest.get("/pointMessage/getHistory",{
                    params: {
                        sendId: memberInfoStore.memberId,
                        receiveId: receiveId.value,
                        currentPage: currentPage.value,
                    }
                });
                if (response.data.code === 200) {
                    if (response.data.data !== null && response.data.data.length > 0) {
                        if (isCover.value) {
                            chatMessages.value = response.data.data;
                            console.log(chatMessages.value)
                            currentPage.value ++;
                            isCover.value = false;
                            if (response.data.data.length < 20) {
                                hasMore.value = false
                            }
                        } else {
                            let temp = []
                            temp.value = response.data.data
                            chatMessages.value = temp.value.concat(chatMessages.value)
                            console.log(chatMessages.value)
                            currentPage.value ++;
                        }
                    } else {
                        hasMore.value = false;
                        ElMessage({
                            type: "success",
                            message: "没有更多记录了"
                        })
                    }
                } else {
                    console.log(response.data.msg)
                }
            } catch (e) {
                console.log(e.message)
            }
        }

        function reset() {
            chatMessages.value = []
            chatWithId.value = 0;
        }

        return {
            socket,
            chatMessages,
            receiveId,
            receiveNickName,
            receiveAvatar,
            receiveStatus,
            connected,
            memberId,
            connect,
            disconnect,
            isCover,
            sendMessage,
            currentPage,
            getHistoryChat,
            hasMore,
            chatWithId,
            reset,
        }
})