<template>
  <div class="user_content">
    <div v-if="modifyAvatar==false&&modifyName==false&&modifyEmail==false&&modifyPhone==false&&modifyPassword==false">
      <div class="user_content_title">
        <p class="select_title">个人资料</p>
      </div>
      <div class="profile">
        <ul>
          <li class="photo">
            <span>头像</span>
            <img :src="userInfo.avatar" />
            <div class="profile_button">
              <el-button size="small" @click="modifyAvatar = true">修改</el-button>
            </div>
          </li>
          <li class="name">
            <span>用户名</span>
            <span>{{userInfo.username}}</span>
            <div class="profile_button">
              <el-button size="small" @click="modifyName = true">修改</el-button>
            </div>
          </li>
          <li class="name">
            <span>邮箱</span>
            <span>{{userInfo.email}}</span>
            <div class="profile_button">
              <el-button size="small" @click="modifyEmail= true">修改</el-button>
            </div>
          </li>
          <li class="name">
            <span>手机</span>
            <span>{{userInfo.phone}}</span>
            <div class="profile_button">
              <el-button size="small" @click="modifyPhone= true">修改</el-button>
            </div>
          </li>
          <li class="name">
            <span>密码</span>
            <span>密码安全等级</span>
            <div class="anqBox">
              <div class="djBox" :class="{'didj':userInfo.password_grade==1,'zhongdj':userInfo.password_grade==2,'gaodj':userInfo.password_grade==3}">
                <div class="djCon "></div>          
              </div>           
            </div>
            <span class="djText" v-if="userInfo.password_grade==1">低</span>
            <span class="djText" v-if="userInfo.password_grade==2">中</span>
            <span class="djText" v-if="userInfo.password_grade==3">高</span>
            <div class="profile_button">
              <el-button size="small" @click="modifyPassword= true">修改</el-button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="modifyAvatar==true">
      <div class="user_content_title">
        <p class="no_select_title" @click="reset()">个人资料</p>
        <p class="select_title">修改头像</p>
      </div>
      <div class="modifyAvatar">
        <img :src="useravatar" />
        <el-upload
          action="/api/users/uploadAvatar"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :show-file-list="false"
        >
          <el-button size="small" type="primary" class="select_avatar">选择头像</el-button>
        </el-upload>
        <el-button
          size="small"
          type="primary"
          v-if="saveavatar"
          class="save_avatar"
          @click="saveAvatar()"
        >保存头像</el-button>
        <div class="el-upload__tip">*上传文件小于2M，支持jpg、jpeg、png格式的图片</div>
      </div>
    </div>
    <div v-if="modifyName==true">
      <div class="user_content_title">
        <p class="no_select_title" @click="reset()">个人资料</p>
        <p class="select_title">修改用户名</p>
      </div>
      <div class="modifyName">
        <div>
          <span class="label">旧用户名：</span>
          {{userInfo.username}}
        </div>
        <div>
          <span class="label">新用户名：</span>
          <el-input v-model="formName.newName" placeholder="请输入新用户名"></el-input>
        </div>
        <div>
          <el-button size="small" type="primary" @click="modifyNameMethod()">确定修改</el-button>
        </div>
      </div>
    </div>
    <div v-if="modifyEmail==true">
      <div class="user_content_title">
        <p class="no_select_title" @click="reset()">个人资料</p>
        <p class="select_title">修改邮箱</p>
      </div>
      <div class="modifyEmail">
        <div>
          <span class="label">旧邮箱：</span>
          <el-input v-model="formEmail.oldEmail" placeholder="请输入旧邮箱"></el-input>
        </div>
        <div>
          <span class="label">新邮箱：</span>
          <el-input v-model="formEmail.newEmail" placeholder="请输入新邮箱"></el-input>
        </div>
        <div>
          <el-button size="small" type="primary" @click="modifyEmailMethod()">确定修改</el-button>
        </div>
      </div>
    </div>

    <div v-if="modifyPhone==true">
      <div class="user_content_title">
        <p class="no_select_title" @click="reset()">个人资料</p>
        <p class="select_title">修改手机</p>
      </div>
      <div class="modifyPhone">
        <div>
          <span class="label">旧手机：</span>
          <el-input v-model="formPhone.oldPhone" placeholder="请输入旧手机"></el-input>
        </div>
        <div>
          <span class="label">新手机：</span>
          <el-input v-model="formPhone.newPhone" placeholder="请输入新手机"></el-input>
        </div>
        <div>
          <el-button size="small" type="primary" @click="modifyPhoneMethod()">确定修改</el-button>
        </div>
      </div>
    </div>

     <div v-if="modifyPassword==true">
      <div class="user_content_title">
        <p class="no_select_title" @click="reset()">个人资料</p>
        <p class="select_title">修改密码</p>
      </div>
      <div class="modifyPassword">
        <div>
          <span class="label">旧密码：</span>
          <el-input v-model="formPassword.oldPassword" placeholder="请输入旧密码"></el-input>
        </div>
        <div>
          <span class="label">新密码：</span>
          <el-input v-model="formPassword.newPassword" placeholder="请输入新密码" @input="djJudge()"></el-input>
            <div class="anqBox inline-block" v-if="formPassword.passwordGrade!=0">
              <div class="djBox" :class="{'didj':formPassword.passwordGrade==1,'zhongdj':formPassword.passwordGrade==2,'gaodj':formPassword.passwordGrade==3}">
                <div class="djCon "></div>          
              </div>           
            </div>
            <span class="djText" v-if="formPassword.passwordGrade==1">低</span>
            <span class="djText" v-if="formPassword.passwordGrade==2">中</span>
            <span class="djText" v-if="formPassword.passwordGrade==3">高</span>
        </div>
        <div v-show="false">
          <el-input v-model="formPassword.passwordGrade">{{formPassword.passwordGrade}}</el-input>
        </div>
        <div>
          <el-button size="small" type="primary" @click="modifyPasswordMethod()">确定修改</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: "",
      modifyAvatar: false,
      modifyName: false,
      modifyEmail: false,
      modifyPhone: false,
      modifyPassword: false,
      useravatar: "",
      saveavatar: false,     
      yydx:0,
      yyxx:0,
      yysz:0,
      formName:{
        newName:""
      },
      formEmail:{
        oldEmail:"",
        newEmail:""
      },
      formPhone:{
        oldPhone:"",
        newPhone:""
      },
      formPassword:{
        oldPassword:"",
        newPassword:"",
        passwordGrade:0,
      }
    };
  },
  methods: {
    getUser() {
      this.$http.get("api/users/getUser").then(response => {
        this.userInfo = response.data.userInfo;
        this.userInfo.phone =
          this.userInfo.phone.substr(0, 3) +
          "****" +
          this.userInfo.phone.substr(7, 4);
          this.userInfo.email =
          this.userInfo.email.substr(0, 2) +
          "****" +
          this.userInfo.email.substr(this.userInfo.email.length-7, 7);
        this.useravatar = this.userInfo.avatar;
      });
    },
    reset() {
      this.modifyAvatar = false;
      this.saveavatar = false;
      this.modifyName=false;
      this.modifyEmail=false;
      this.modifyPhone=false;
      this.modifyPassword=false,
      this.formPassword.passwordGrade=0,
      this.yydx=0,
      this.yyxx=0,
      this.yysz=0,
      this.formName.newName="",
      this.formEmail.oldEmail="",
      this.formEmail.newEmail="",
      this.formPhone.oldPhone="",
      this.formPhone.newPhone="",
      this.formPassword.oldPassword="",
      this.formPassword.newPassword="",
      this.getUser();
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG 格式或PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      this.useravatar = res;
      console.log(file)
      this.saveavatar = true;
    },
    saveAvatar() {
      this.$http
        .get("api/users/saveAvatar", {
          params: {
            avatar: this.useravatar
          }
        })
        .then(response => {
          if (response.data.success) {
            this.$message.success("保存成功");
            this.$parent.getUser();
            this.saveavatar = false;
            this.modifyAvatar = false;
            this.getUser();
          }
        });
    },
    modifyNameMethod() {
      this.$http.post("api/users/modifyName", this.formName).then(response => {
        if (response.data.success=='true') {
          this.$message.success("修改成功");
          this.$parent.getUser();
          this.modifyName = false;
          this.formName.newName="";
          this.getUser();
        } else {
          this.$message.error("用户名已存在");
        }
      });
    },
    modifyEmailMethod() {
      this.$http.post("api/users/modifyEmail", this.formEmail).then(response => {
        if (response.data.info=='error') {
          this.$message.error("旧邮箱错误");     
        } else if(response.data.info=='exist'){
          this.$message.error("邮箱已占用");
        }else{
          this.$message.success('修改成功')
          this.$parent.getUser();
          this.modifyEmail = false;
          this.formEmail.oldEmail="";
          this.formEmail.newEmail="";
          this.getUser();
        }
      });
    },
    modifyPhoneMethod() {
      this.$http.post("api/users/modifyPhone", this.formPhone).then(response => {
        if (response.data.info=='error') {
          this.$message.error("旧手机错误");     
        } else if(response.data.info=='exist'){
          this.$message.error("手机已占用");
        }else{
          this.$message.success('修改成功')
           this.$parent.getUser();
          this.modifyPhone = false;
          this.formPhone.oldPhone="";
          this.formPhone.newPhone="";
          this.getUser();
        }
      });
    },
    djJudge(){
      var dx= this.formPassword.newPassword.match(/^.*[A-Z]+.*$/)  //判断大写    
      var xx=this.formPassword.newPassword.match(/^.*[a-z]+.*$/)   //判断小写    
      var sz=this.formPassword.newPassword.match(/^.*[0-9]+.*$/)   //判断小写
      if(dx!=null){
        this.yydx=1
      }else if(dx==null){
        this.yydx=0
      }
      if(xx!=null){
        this.yyxx=1
      }else if(xx==null){
        this.yyxx=0
      }
      if(sz!=null){
        this.yysz=1
      }else if(sz==null){
        this.yysz=0
      }
      this.formPassword.passwordGrade=this.yydx+this.yyxx+this.yysz
    },
     modifyPasswordMethod() {
      this.$http.post("api/users/modifyPassword", this.formPassword).then(response => {
        if (response.data.success=='false') {
          this.$message.error("旧密码错误");     
        }else{
          this.$message.success('修改成功')
          this.$parent.getUser();
          this.modifyPassword = false;
          this.formPassword.oldPassword="";
          this.formPassword.newPassword="";
          this.formPassword.passwordGrade=0,
           this.yydx=0,
           this.yyxx=0,
            this.yysz=0,
          this.getUser();
        }
      });
    },
  },
  mounted() {
    this.getUser();
  }
};
</script>

<style scoped>
.inline-block{
  display: inline-block
}
.profile ul {
  padding-top: 0.3rem;
  list-style-type: none;
}
.profile > ul > li {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 0.14rem;
  height: 0.8rem;
  position: relative;
}
.profile > ul > li > span:nth-of-type(1) {
  color: #999999;
  width: 1rem;
  padding-left: 0.5rem;
}
.profile > ul > li > span:nth-of-type(2) {
  color: #333333;
}
.profile .photo img {
  width: 0.54rem;
  height: 0.54rem;
  border-radius: 50%;
}

.modifyAvatar > img {
  width: 1rem;
  height: 1rem;
  padding: 0.3rem 0;
}
.no_select_title {
  cursor: pointer;
}
.djBox{
  margin-left: 0.4rem;
  width: 1.5rem;
  height: 0.12rem;

  border-radius: 0.2rem;
}
.djCon{  
  height: 100%;
  border-top-left-radius: 0.2rem;
  border-bottom-left-radius: 0.2rem;
}
.didj{
    border: solid 0.01rem rgb(255, 19, 19);
}
.didj>div{
  width: 33%;
background-color: rgb(255, 19, 19);
}
.zhongdj{
  border: solid 0.01rem rgb(255, 167, 5);
}
.zhongdj>div{
  width: 66%;
background-color: rgb(255, 167, 5);
}
.gaodj{
  border: solid 0.01rem rgb(0, 235, 0);
}
.gaodj>div{
  width: 100%;
background-color: rgb(0, 235, 0);
border-radius: 0.2rem;
}
.djText{
  padding-left: 0.12rem;
}
</style>

<style>
.profile_button .el-button--small {
  padding: 0.09rem 0.25rem;
}
.profile_button .el-button {
  color: #ff9024;
  background-color: #f2f6ed;
  border: none;
}
.profile_button .el-button:focus,
.profile_button .el-button:hover {
  background-color: #ff9024;
  color: white;
}
.profile_button {
  position: absolute;
  left: 6rem;
}
.modifyAvatar {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modifyAvatar .el-upload__tip {
  padding-top: 0.2rem;
}
.modifyAvatar .save_avatar {
  margin-top: 0.2rem;
}
.modifyName .label {
  font-size: 0.14rem;
  color: #999999;
}
.modifyName > div {
  padding-left: 3rem;
  padding-top: 0.4rem;
}
.modifyName .el-input {
  width: 30%;
}
.modifyName > div:last-child {
  padding-left: 4rem;
}

.modifyEmail .label {
  font-size: 0.14rem;
  color: #999999;
}
.modifyEmail > div {
  padding-left: 2.6rem;
  padding-top: 0.4rem;
}
.modifyEmail .el-input {
  width: 40%;
}
.modifyEmail > div:last-child {
  padding-left: 4rem;
}


.modifyPhone .label {
  font-size: 0.14rem;
  color: #999999;
}
.modifyPhone > div {
  padding-left: 2.6rem;
  padding-top: 0.4rem;
}
.modifyPhone .el-input {
  width: 40%;
}
.modifyPhone > div:last-child {
  padding-left: 4rem;
}

.modifyPassword .label {
  font-size: 0.14rem;
  color: #999999;
}
.modifyPassword > div {
  padding-left: 2.6rem;
  padding-top: 0.4rem;
}
.modifyPassword .el-input {
  width: 40%;
}
.modifyPassword > div:last-child {
  padding-left: 4rem;
}
</style>