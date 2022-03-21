<template>
  <div v-if="dialogLoginFormVisible">
    <div class="dialog_login">
      <el-dialog
        title="登录"
        :visible.sync="dialogLoginFormVisible"
        center
        @close="closeDialog"
        :modal="false"
        top="8vh"
      >
        <el-dialog width="25%" title="忘记密码" :visible.sync="innerVisible" append-to-body>
          <el-form :model="forgetForm">
          <el-form-item>
            <el-input
              autocomplete="off"
              v-model="forgetForm.name"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="forgetForm.phone"
              placeholder="请绑定手机号"
              prefix-icon="el-icon-phone"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              type="password"
              autocomplete="off"
              v-model="forgetForm.newPass"
              show-password
              placeholder="请输入新密码"
              prefix-icon="el-icon-key"
            ></el-input>
          </el-form-item>
        </el-form>
          <el-button @click="forgetPass()" type="primary" style="margin:0.1rem 1.1rem">找回密码</el-button>
        </el-dialog>
        <div class="toregister">
          没有账号？点击
          <span @click="toRegister">注册</span>
        </div>
        <el-form :model="loginForm" ref="loginForm" :rules="rules">
          <el-form-item prop="name">
            <el-input
              autocomplete="off"
              v-model="loginForm.name"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input
              type="password"
              autocomplete="off"
              v-model="loginForm.pass"
              show-password
              placeholder="请输入6-12位密码"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input
              type="password"
              autocomplete="off"
              v-model="loginForm.checkPass"
              show-password
              placeholder="请确认密码"
              prefix-icon="el-icon-key"
            ></el-input>
          </el-form-item>
          <div class="el_captcha">
            <el-form-item prop="captcha">
              <el-input
                autocomplete="off"
                v-model="loginForm.captcha"
                placeholder="请输入验证码"
                prefix-icon="el-icon-full-screen"
                @keyup.enter.native="submitForm('loginForm')"
              ></el-input>
            </el-form-item>
            <span v-html="captcha" @click="refresh"></span>
          </div>
        </el-form>
        <span class="forgetPass" @click="innerVisible=true">忘记密码</span>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitForm('loginForm')">立即登录</el-button>
          <div class="read">
            我已阅读并接受 《
            <router-link :to="{ name: 'Agreement', params: { city:this.$store.state.city}}">
              <span @click="close">嗨租用户服务协议</span>
            </router-link>》及 《
            <router-link :to="{ name: 'Policy', params: { city:this.$store.state.city}}">
              <span @click="close">嗨租隐私政策</span>
            </router-link>》
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<style>
.dialog_login .el-dialog {
  width: 30%;
}
.dialog_login .el-dialog__title {
  font-size: 0.28rem;
  font-weight: bold;
}

.dialog_login .el-form-item {
  margin-bottom: 0.3rem;
}
.dialog_login .el-dialog__body {
  padding: 0.15rem 0.4rem 0rem;
}
.dialog_login .el-form {
  margin-top: 0.2rem;
}
.dialog_login .el-dialog__close:hover {
  color: #ff9024 !important;
}
.dialog_login .toregister {
  font-size: 0.16rem;
}
.dialog_login .toregister span {
  color: #ff9024;
  cursor: pointer;
}
.dialog_login .el-button {
  background-color: #ff9024;
  width: 88%;
  color: white;
  font-size: 0.16rem;
  border: none;
}
.dialog_login .forgetPass {
  text-decoration: none;
  color: #ff9024;
  cursor: pointer;
}
.dialog_login .el-form-item:last-child {
  margin-bottom: 0.2rem;
}
.dialog_login .read {
  color: #999999;
  padding-top: 0.15rem;
  font-size: 0.12rem;
}
.dialog_login .read a {
  color: #6b91b3;
}
.dialog_login .el_captcha {
  display: flex;
  justify-content: space-between;
}
</style>

<script>
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else {
        if (value.length < 6 || value.length > 12) {
          callback(new Error("请输入6-12位密码"));
        } else {
          if (this.loginForm.chenkPass !== "") {
            this.$refs.loginForm.validateField("checkPass");
          }
          callback();
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error("请输入6-12位密码"));
      } else if (value !== this.loginForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateCaptcha = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback();
      }
    };

    return {
      innerVisible: false,
      captcha: "",
      dialogLoginFormVisible: false,
      dialogRegisterFormVisible: false,
      loginForm: {
        name: "",
        pass: "",
        checkPass: "",
        captcha: ""
      },
      forgetForm:{
        name:"",
        phone:"",
        newPass:""
      },
      rules: {
        name: [{ validator: checkName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        captcha: [{ validator: validateCaptcha, trigger: "blur" }]
      }
    };
  },
  props: {
    show: Boolean
  },
  mounted() {
    if (!window.sessionStorage.getItem("token")) {
      this.refresh();
    }
  },
  methods: {
    refresh() {
      this.$http
        .get("/api/users/captcha")
        .then(response => {
          this.captcha = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    isShow() {
      this.dialogLoginFormVisible = !this.dialogLoginFormVisible;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post("/api/users/login", this.loginForm)
            .then(response => {
              //验证码错误
              if (response.data.captcha === false) {
                this.$message({
                  type: "error",
                  message: "验证码不正确"
                });
              } else {
                //账号不存在
                if (response.data.info === false) {
                  this.$message({
                    type: "info",
                    message: "账号不存在"
                  });
                  return;
                }
                //账号存在
                if (response.data.success) {
                  this.$message({
                    type: "success",
                    message: "登录成功"
                  });
                  this.closeDialog();
                  this.checkSecurity();
                  this.$parent.newMessageNumber();
                  this.dialogLoginFormVisible = false;
                  //拿到返回的token和username，并存到store
                  let token = response.data.token;
                  let username = response.data.username;
                  this.$store.dispatch("UserLogin", token);
                  this.$store.dispatch("UserName", username);
                } else {
                  this.$message({
                    type: "error",
                    message: "密码错误"
                  });
                }
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    forgetPass(){
      this.$http.post('api/users/forgetPass',this.forgetForm).then(response=>{
        if(response.data.info=='success'){
          this.$message.success('修改成功')
          this.innerVisible=false
        }else if(response.data.info=='name'){
          this.$message.error('用户名不存在')
        }else if(response.data.info=='phone'){
          this.$message.error('绑定的手机号不正确')
        }
      })
    },
    close() {
      this.closeDialog();
      this.dialogLoginFormVisible = false;
    },
    closeDialog() {
      this.$emit("closeModal");
      this.$refs["loginForm"].resetFields();
    },
    toRegister() {
      this.dialogLoginFormVisible = false;
      this.$emit("openLogin");
    },
    checkSecurity() {
      this.$http.get("api/users/checkSecurity").then(response => {
        if (response.data.password_grade < 2) {
          this.util.newMessage(
            "收到新的系统消息",
            "密码安全性低，建议修改，点击前往修改",
            "token",
            "userprofile",
            1
          );
        }
      });
    }
  },
  watch: {
    dialogLoginFormVisible(n, o) {
      if (n) document.body.classList.add("el-popup-parent--hidden");
    }
  }
};
</script>