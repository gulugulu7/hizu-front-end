<template>
  <div class="user_content">
    <div class="user_content_title">
      <p class="select_title">系统消息</p>
    </div>
    <div class="no_user_msg" v-if="messageLen==0">
      <div class="no_msg_img"></div>
      <div class="no_msg_text">您还没有消息哟~</div>
    </div>
    <div v-else class="message_list">
      <div v-for="(item,index) in messageList" :key="index" @click="messageRead(item._id)">
        <router-link :to="item.message_jump">
          <div class="cue_light" v-if="item.message_state==true"></div>
          <div class="message_data">
            <div class="message_header">
              <span>{{item.message_header}}</span>
              <span class="sending_time">{{item.sending_time}}</span>
            </div>
            <div class="message_content">{{item.message_content}}</div>
          </div>
        </router-link>
        <i class="el-icon-close" @click="deleteMessage(item._id)"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messageList: [],
      messageLen: ""
    };
  },
  methods: {
    getMessage() {
      this.$http.get("api/users/getMessage").then(response => {
        this.messageList = response.data.messageList;
        this.messageLen = this.messageList.length;
        for (var i = 0; i < this.messageLen; i++) {
          this.messageList[i].sending_time = this.$moment(
            this.messageList[i].sending_time
          ).format("YYYY-MM-DD HH:mm:ss");
        }
      });
    },
    messageRead(messageId) {
      this.$http
        .get("api/users/messageRead", {
          params: {
            messageId: messageId
          }
        })
        .then(response => {
          this.getMessage();
        });
    },
    deleteMessage(messageId) {
      this.$http
        .get("api/users/deleteMessage", {
          params: {
            messageId: messageId
          }
        })
        .then(response => {
          this.getMessage();
        })
        .catch(error => console.log(error));
    }
  },
  mounted() {
    this.getMessage();
  }
};
</script>

<style scoped>
.message_data:hover {
  background: #f1f1f1;
}
.message_list a {
  text-decoration: none;
}
.message_data {
  height: 0.8rem;
  border-bottom: 0.01rem solid rgb(224, 224, 224);
  padding-top: 0.05rem;
  padding-left: 0.5rem;
}
.message_header {
  padding-top: 0.1rem;
  color: #ff9024;
  font-weight: 600;
}
.message_content {
  color: #666666;
  font-size: 0.14rem;
  padding-top: 0.12rem;
  padding-left: 0.16rem;
}
.sending_time {
  padding-left: 0.3rem;
  font-size: 0.12rem;
  font-weight: 400;
  color: #8a8a8a;
}
.cue_light {
  width: 0.1rem;
  height: 0.1rem;
  border-radius: 50%;
  transform: scale(0.8, 0.8);
  background-color: rgb(248, 62, 62);
  position: absolute;
  margin-top: 0.36rem;
  margin-left: 0.2rem;
}
</style>
<style>
.el-icon-close {
  display: none;
  position: absolute;
  margin-top: -0.76rem;
  margin-left: 8.8rem;
}
.el-icon-close:hover {
  cursor: pointer;
  display: block;
}
.message_list a:hover ~ .el-icon-close {
  display: block;
}
.message_list > div:last-child {
  padding-bottom: 0.4rem;
}
</style>