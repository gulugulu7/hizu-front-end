<template>
  <header class="header">
    <div class="logo">
      <img src="../assets/images/index/logo.jpg" alt />
    </div>
    <div class="positioning">
      <div class="nav_drop_down_menu">
        <el-select v-model="city_number" class="el-select" placeholder="定位中">
          <el-option
            v-for="item in cityoptions"
            :key="item.city_number"
            :label="item.city_name"
            :value="item.city_number"
            class="city_select"
            @click.native="tocity(city_number)"
          ></el-option>
        </el-select>
      </div>
    </div>
    <nav>
      <ul>
        <li @click="active(0)" :class="{navheader_active :0==ins}">
          <router-link :to="{ name: 'Index', params: { city:this.$store.state.city}}">首页</router-link>
        </li>
        <li @click="active(1)" :class="{navheader_active :1==ins}">
          <router-link
            :to="{ name: 'List', params: { city:this.$store.state.city,style:'area',aindex:'a0',bindex:'b0',cindex:'c0',dindex:'d0',eindex:'e0',findex:'f0',gindex:'g0',hindex:'h0',iindex:'i0'}}"
          >区域找房</router-link>
        </li>
        <li @click="active(2)" :class="{navheader_active :2==ins}">
          <router-link
            :to="{ name: 'List', params: { city:this.$store.state.city,style:'subway',aindex:'a0',bindex:'b0',cindex:'c0',dindex:'d0',eindex:'e0',findex:'f0',gindex:'g0',hindex:'h0',iindex:'i0'}}"
          >地铁找房</router-link>
        </li>
        <li @click="active(3)" :class="{navheader_active :3==ins}">
          <router-link :to="{name:'Map',params:{city:this.$store.state.city}}">地图找房</router-link>
        </li>
        <li @click="active(4)" :class="{navheader_active :4==ins}">
          <router-link :to="{name:'Publish',params:{city:this.$store.state.city}}">发布房源</router-link>
        </li>
      </ul>
    </nav>
    <login
      ref="login"
      :show="isLoginShow"
      v-on:openLogin="openregister"
      v-on:closeModal="closeModal"
    ></login>
    <register
      ref="register"
      :show="isRegShow"
      v-on:openReg="openlogin"
      v-on:closeModal="closeModal"
    ></register>
    <div class="login_register_help" v-if="this.$store.state.username==null">
      <div class="login">
        <div @click="openlogin">登录</div>
      </div>
      <div class="register">
        <div @click="openregister">注册</div>
      </div>
    </div>
    <div class="login_register_help" v-else>
      <div class="login">
        <div @click="touser" style="display:flex;flex-direction: row;align-items: center;">
          {{this.$store.state.username}}
          <span
            v-if="new_message_number>0"
            class="message_number"
          >{{new_message_number}}</span>
        </div>
      </div>
      <div class="register">
        <div @click="logout">注销</div>
      </div>
    </div>
    <section class="dialog-modal" v-if="dislogModalShow"></section>
  </header>
</template>

<style scoped>
.dialog-modal {
  position: fixed;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background-color: #000;
  top: 0;
  left: 0;
  z-index: 999;
}
</style>

<style>
.city_select.selected {
  color: #606266;
  font-weight: 500;
}
.city_select.hover {
  color: #ff9024;
  background-color: #fff0e0;
}
.nav_drop_down_menu .el-select .el-input__inner {
  border: 0;
  padding: 0 0.05rem;
}
.nav_drop_down_menu .el-select .el-input {
  max-width: 0.68rem;
}
.el-select-dropdown__wrap {
  max-height: 4rem;
}
</style>


<style scoped>
.header {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border-bottom: 0.01rem solid rgb(218, 218, 218);
}
.logo {
  width: 8%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.logo img {
  width: 1.12rem;
  height: 0.4rem;
}
.logo {
  padding-left: 1rem;
}
.positioning {
  padding-right: 1.4rem;
}
.nav_drop_down_menu {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.nav_drop_down_menu .el-dropdown {
  padding: 0 0.035rem;
}
.nav_drop_down_menu .el-dropdown-link {
  cursor: pointer;
}
nav {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-right: 2.4rem;
}
nav > ul {
  list-style-type: none;
  margin: 0;
}
nav > ul > li {
  float: left;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
nav a {
  text-decoration: none;
  padding: 0.19rem 0.15rem;
  font-weight: bold;
  color: #2c3236;
  font-size: 0.18rem;
}
.navheader_active a {
  color: #ff9024;
}
nav li:before {
  content: "";
  position: absolute;
  width: 0;
  left: 50%;
  bottom: 0.05rem;
  height: 0.04rem;
  background-color: #ff9024;
}
nav li:hover:before {
  width: 80%;
  left: 10%;
  transition: all 0.5s;
}
.login_register_help > div {
  padding: 0 0.15rem;
  line-height: 0.15rem;
  float: left;
}
.login_register_help > div > div {
  cursor: pointer;
}
.login {
  border-right: solid 0.01rem black;
}
.help {
  border-right: none !important;
}
.login_register_help a:hover {
  text-decoration: underline;
}
.message_number {
  text-align: center;
  display: inline-block;
  width: 0.22rem;
  height: 0.18rem;
  background-color: #f56c6c;
  border-radius: 40%;
  color: white;
  font-size: 0.14rem;
  margin-left: 0.06rem;
}
</style>
 
<script>
import Login from "@/components/Login";
import Register from "@/components/Register";
import BMap from "BMap";
import pinyin from "js-pinyin";

export default {
  data() {
    return {
      new_message_number: 0,
      cityoptions: [],
      city_number: window.sessionStorage.getItem("city"),
      dislogModalShow: false,
      isRegShow: false,
      isLoginShow: false,
      ins: "",
      changeindex: 0,
      navheader: [
        {
          navname: "首页",
          toname: "Index",
          toparams: { city: this.$store.state.city }
        },
        {
          navname: "区域找房",
          toname: "List",
          toparams: {
            city: this.$store.state.city,
            style: "area",
            district: "a0",
            sq: "b0"
          }
        },
        {
          navname: "地铁找房",
          toname: "List",
          toparams: {
            city: this.$store.state.city,
            style: "subway",
            district: "a0",
            sq: "b0"
          }
        },
        {
          navname: "发布房源",
          toname: "Publish",
          toparamscity: { city: this.$store.state.city }
        }
      ]
    };
  },
  created() {},
  mounted() {
    this.dz();
    this.util.getCity().then(res => {
      this.cityoptions = res;
    });
    this.getins();
    setInterval(this.newMessageNumber, 1000);
  },
  methods: {
    dz() {
      window.sessionStorage.setItem("city", "guangzhou");
      this.$store.dispatch("CITY", "guangzhou");
      this.$router.push({
        name: this.$route.name,
        params: { city: "guangzhou" }
      });
    },
    // dz() {
    //   var that = this;
    //   var geolocation = new BMap.Geolocation();
    //   geolocation.getCurrentPosition(
    //     function getinfo(position) {
    //       let city = position.address.city; //获取城市信息
    //       let province = position.address.province;
    //       city = city.substr(0, city.length - 1);
    //       if (!window.sessionStorage.getItem("city")) {
    //         that.city_number = city;
    //         var pinyincity = pinyin.getFullChars(city).toLowerCase();
    //         that.$store.dispatch("CITY", pinyincity);
    //         window.sessionStorage.setItem("city", pinyincity);
    //         var sessioncity = pinyin
    //           .getFullChars(window.sessionStorage.getItem("city"))
    //           .toLowerCase();
    //         that.$router.push({
    //           name: that.$route.name,
    //           params: { city: sessioncity }
    //         });
    //       } else {
    //         var sessioncity = window.sessionStorage.getItem("city");
    //         that.$router
    //           .push({
    //             name: that.$route.name,
    //             params: { city: sessioncity }
    //           })
    //           .catch(e => {});
    //       }
    //     },
    //     function(e) {
    //       that.city_number = "定位失败";
    //     },
    //     {
    //       provider: "baidu"
    //     }
    //   );
    // },
    closeModal() {
      this.dislogModalShow = false;
      document.body.classList.remove("el-popup-parent--hidden");
    },
    openlogin() {
      this.dislogModalShow = true;
      this.$refs.login.isShow();
    },
    openregister() {
      this.dislogModalShow = true;
      this.$refs.register.isShow();
    },
    logout() {
      //清除token
      this.$store.dispatch("UserLogout");
      if (!this.$store.state.token) {
        this.$message({
          type: "success",
          message: "注销成功"
        });
        this.$router.push({ name: "Index" });
        this.$refs.login.refresh();
      } else {
        this.$message({
          type: "info",
          message: "注销失败"
        });
      }
    },
    touser() {
      this.$router.push({ name: "UserMessage" });
    },
    tocity(city_number) {
      this.$router.push({
        name: "Index",
        params: { city: city_number }
      });
      this.$store.dispatch("CITY", city_number);
      window.sessionStorage.setItem("city", city_number);
    },
    active(index) {
      this.ins = index;
    },
    getins() {
      if (this.$route.name != "List") {
        if (this.$route.name == "Index") {
          this.ins = 0;
        } else if (this.$route.name == "Publish") {
          this.ins = 3;
        } else {
          this.ins = -1;
        }
      } else {
        if (this.$route.params.style == "area") {
          this.ins = 1;
        } else if (this.$route.params.style == "subway") {
          this.ins = 2;
        }
      }
    },
    newMessageNumber() {
      if (window.sessionStorage.getItem("token")) {
        this.$http.get("api/users/getMessage").then(response => {
          var newMessagePrompt = this.new_message_number;
          this.new_message_number = response.data.newMessageNumber;
          if (newMessagePrompt < this.new_message_number) {
            this.$notify({
              title: "提示",
              message: "收到一条新消息",
              duration: 3000,
              offset: 56
            });
          }
        });
      }
    }
  },
  computed: {},
  components: {
    Login,
    Register
  },
  watch: {
    $route(to, from) {
      this.active(0);
      this.getins();
      this.city_number = this.$route.params.city;
    }
  }
};
</script>>

