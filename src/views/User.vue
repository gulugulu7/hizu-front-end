<template>
  <div class="main">
    <div class="user_header">
      <img :src="userInfo.avatar" alt />
      <div class="user_info">
        <div class="hello">{{time}}好</div>
        <ul>
          <li>用户名：{{userInfo.username}}</li>
          <li>登录时间：{{this.$moment(userInfo.login_time).format("YYYY-MM-DD HH:mm:ss")}}</li>
        </ul>
      </div>
      <div class="user_button">
        <el-button type="primary" @click="toUserProfile()">修改资料</el-button>
      </div>
    </div>
    <div class="user_main">
      <div class="user_side">
        <el-menu default-active="1" class="el-menu-vertical-demo" :router="true">
          <el-menu-item index="1" :route="{name:'UserMessage'}">
            <i class="el-icon-document"></i>
            <span slot="title">消息</span>
          </el-menu-item>
          <el-menu-item index="2" :route="{name:'UserCollection'}">
            <i class="el-icon-menu"></i>
            <span slot="title">我的收藏</span>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-phone"></i>
              <span>我的预约</span>
            </template>
            <el-menu-item index="3-1" :route="{name:'MakeAppointment'}">发起预约</el-menu-item>
            <el-menu-item index="3-2" :route="{name:'ReceiveAppointment'}">收到预约</el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-office-building"></i>
              <span>房源管理</span>
            </template>
            <el-menu-item index="4-1" :route="{name:'ManageAll'}">全部信息</el-menu-item>
            <el-menu-item index="4-2" :route="{name:'ManageDisplay'}">显示中的信息</el-menu-item>
            <el-menu-item index="4-3" :route="{name:'ManageInAudit'}">审核中的信息</el-menu-item>
            <el-menu-item index="4-4" :route="{name:'ManageAuditFailed'}">审核未通过的信息</el-menu-item>
            <el-menu-item index="4-5" :route="{name:'ManageDeleted'}">已删除的信息</el-menu-item>
          </el-submenu>
          <el-menu-item index="5" :route="{name:'UserProfile'}" @click="resetProfile">
            <i class="el-icon-s-custom"></i>
            <span slot="title">个人资料</span>
          </el-menu-item>
          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>推广中心</span>
            </template>
            <el-menu-item index="6-1" :route="{name:'PromotionHouse'}">推广房源</el-menu-item>
            <el-menu-item index="6-2" :route="{name:'MyPromotion'}">我的推广</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <router-view ref="profile"></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: ""
    };
  },
  methods: {
    getUser() {
      this.$http.get("api/users/getUser").then(response => {
        this.userInfo = response.data.userInfo;
      });
    },
    resetProfile() {
      this.$refs.profile.reset();
      this.getUser();
    },
    toUserProfile(){
      this.$router.push({name:'UserProfile'})
    }
  },
  mounted() {
    this.getUser();
  },
  computed: {
    time: function() {
      var hour = new Date().getHours();
      if (hour < 6) {
        return "凌晨";
      } else if (hour < 9) {
        return "早上";
      } else if (hour < 10) {
        return "上午";
      } else if (hour < 14) {
        return "中午";
      } else if (hour < 17) {
        return "下午";
      } else if (hour < 19) {
        return "傍晚";
      } else if (hour < 22) {
        return "晚上";
      } else {
        return "夜里";
      }
    }
  },
  watch: {
    $route(to, from) {}
  }
};
</script>

<style scoped>
.main {
  background-color: #f1f1f1;
}
.user_header {
  height: 1rem;
  width: 100%;
  background: url(../assets/images/user/banner100_100.png) center center;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.user_header > img {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 50%;
  margin-left: 1rem;
}
.user_info {
  width: 70%;
  padding-left: 0.2rem;
}
.user_info .hello {
  color: #333;
  padding: 0.04rem 0;
}
.user_info > ul {
  list-style-type: none;
  font-size: 0.12rem;
  padding: 0.04rem 0;
}
.user_info > ul > li {
  display: inline-block;
  color: #333;
}
.user_info > ul > li:last-child {
  padding-left: 0.2rem;
  color: #999;
}
.user_main {
  width: 86%;
  margin: 0.3rem auto 0;
  display: flex;
}
.user_side {
  flex: 1;
}
</style>

<style>
.user_side .el-menu {
  width: 2.1rem;
  border-right: none;
}
.user_side .el-menu-item.is-active {
  background-color: #f2f6ed;
  border-left: solid 0.03rem #ff9024;
}
.user_side .el-submenu .el-menu-item {
  min-width: 2.1rem;
}

.user_content {
  min-height: 5.3rem;
  background: white;
  flex: 4;
}
.user_content .user_content_title {
  border-bottom: solid 0.02rem #ff9024;
  background-color: #f8f8f8;
}
.user_content .user_content_title .no_select_title {
  display: inline-block;
  padding: 0.1rem 0.3rem;
  background: #f8f8f8;
  color: #666666;
}
.user_content .user_content_title .select_title {
  display: inline-block;
  padding: 0.1rem 0.3rem;
  background: #ff9024;
  color: white;
}
.no_user_msg {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.no_msg_img {
  width: 1.6rem;
  height: 1.2rem;
  background-image: url("//pages.anjukestatic.com/usersite/site/img/userCenter/noContent.png");
  background-size: 1.6rem 1.2rem;
  margin-top: 1rem;
}
.no_msg_text {
  font-size: 0.14rem;
  color: #999;
  margin-top: 0.2rem;
}
</style>