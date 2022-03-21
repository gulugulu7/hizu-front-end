<template>
  <div v-if="dialogRegisterFormVisible">
    <div class="dialog_register">
      <el-dialog
        title="注册"
        :visible.sync="dialogRegisterFormVisible"
        center
        @close="closeDialog"
        :modal="false"
        top="3.3vh"
      >
        <div class="toregister">
          已有账号？点击
          <span @click="toLogin">登录</span>
        </div>
        <el-form :model="registerForm" ref="registerForm" :rules="rules">
          <el-form-item prop="name">
            <el-input
              autocomplete="off"
              v-model="registerForm.name"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item prop="pass">
            <el-input
              type="password"
              autocomplete="off"
              v-model="registerForm.pass"
              show-password
              placeholder="请输入6-12位密码"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item prop="checkPass">
            <el-input
              type="password"
              autocomplete="off"
              v-model="registerForm.checkPass"
              show-password
              placeholder="请确认密码"
              prefix-icon="el-icon-key"
               @input="djJudge()"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input
              type="text"
              autocomplete="off"
              v-model="registerForm.phone"
              placeholder="请输入手机号"
              clearable
              prefix-icon="el-icon-phone"
            ></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input
              type="text"
              autocomplete="off"
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              clearable
              prefix-icon="el-icon-message"
              @keyup.enter.native="submitForm('registerForm')"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="submitForm('registerForm')">立即注册</el-button>
          <div class="read">
            <span>
              <el-checkbox v-model="checked"></el-checkbox>
            </span>
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
.dialog_register .el-dialog {
  width: 30%;
}
.dialog_register .el-dialog__title {
  font-size: 0.28rem;
  font-weight: bold;
}

.dialog_register .el-form-item {
  margin-bottom: 0.3rem;
}
.dialog_register .el-dialog__body {
  padding: 0.15rem 0.4rem 0rem;
}
.dialog_register .el-form {
  margin-top: 0.2rem;
}
.dialog_register .el-dialog__close:hover {
  color: #ff9024 !important;
}
.dialog_register .toregister {
  font-size: 0.16rem;
}
.dialog_register .toregister span {
  color: #ff9024;
  cursor: pointer;
}
.dialog_register .el-button {
  background-color: #ff9024;
  width: 88%;
  color: white;
  font-size: 0.16rem;
  border: none;
}
.dialog_register .forgetPass {
  text-decoration: none;
  color: #ff9024;
}
.dialog_register .el-form-item:last-child {
  margin-bottom: 0.2rem;
}
.dialog_register .read {
  color: #999999;
  padding-top: 0.15rem;
  font-size: 0.12rem;
}
.dialog_register .read a {
  color: #6b91b3;
}
</style>

<style scoped>
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
          if (this.registerForm.chenkPass !== "") {
            this.$refs.registerForm.validateField("checkPass");
          }
          callback();
        }
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value.length < 6 || value.length > 12) {
        callback(new Error("请输入6-12位密码"));
      } else if (value !== this.registerForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入手机号"));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的手机号"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入邮箱"));
      } else if (
        !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(value)
      ) {
        callback(new Error("请输入正确的邮箱地址"));
      } else {
        callback();
      }
    };

    return {
      checked: false,
      dialogRegisterFormVisible: false,
      dialogLoginFormVisible: false,
      yydx:0,
      yyxx:0,
      yysz:0,
      registerForm: {
        name: "",
        pass: "",
        checkPass: "",
        phone: "",
        email: "",
        password_grade:0
      },
      rules: {
        name: [{ validator: checkName, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        email: [{ validator: validateEmail, trigger: "blur" }]
      }
    };
  },
  props: {
    show: Boolean
  },
  methods: {
    isShow() {
      this.dialogRegisterFormVisible = !this.dialogRegisterFormVisible;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (this.checked == false) {
          this.$message({
            type: "info",
            message: "请阅读并接受协议和政策"
          });
        } else {
          if (valid) {
            this.$http
              .post("/api/users/register", this.registerForm)
              .then(response => {
                if (response.data.success == "name") {
                  this.$message({
                    type: "info",
                    message: "用户名已经存在"
                  });
                } else if (response.data.success == "email") {
                  this.$message({
                    type: "info",
                    message: "邮箱已被占用"
                  });
                } else if (response.data.success == "phone") {
                  this.$message({
                    type: "info",
                    message: "手机号已被占用"
                  });
                } else {
                  this.$message({
                    type: "success",
                    message: "注册成功"
                  });
                  this.closeDialog();
                  this.dialogRegisterFormVisible = false;
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            console.log("error submit!!");
            return false;
          }
        }
      });
    },
    close() {
      this.closeDialog();
      this.dialogRegisterFormVisible = false;
    },
    closeDialog() {
      this.$emit("closeModal");
      this.$refs["registerForm"].resetFields();
    },
    toLogin() {
      this.dialogRegisterFormVisible = false;
      this.$emit("openReg");
    },
    djJudge(){
      var dx= this.registerForm.checkPass.match(/^.*[A-Z]+.*$/)  //判断大写    
      var xx=this.registerForm.checkPass.match(/^.*[a-z]+.*$/)   //判断小写    
      var sz=this.registerForm.checkPass.match(/^.*[0-9]+.*$/)   //判断小写
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
      this.registerForm.password_grade=this.yydx+this.yyxx+this.yysz
      console.log(this.registerForm.password_grade)
    },
  },
  watch: {
    dialogRegisterFormVisible(n, o) {
      if (n) document.body.classList.add("el-popup-parent--hidden");
    }
  }
};
</script>