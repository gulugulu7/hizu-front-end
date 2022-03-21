<template>
  <div class="user_content">
     <div class="dialog_check">
      <el-dialog title="查看评论看房" :visible.sync="dialogFormVisible1" width="40%">
        <div>
          <span>是否完成看房：</span>
          <span v-if="commentResult.arrive==true">已完成</span>
          <span v-if="commentResult.arrive==false">未完成</span>
        </div>
          <div v-if="commentResult.arrive==true">
            <span>评分：</span>
            <span>
              <el-rate disabled v-model="commentResult.appointment_score" :colors="colors" show-text></el-rate>
            </span>
          </div>
          <div v-if="commentResult.arrive==true">
            <span>评分理由：</span>
            <span>{{commentResult.true_reason}}</span>
          </div>
          <div v-if="commentResult.arrive==false">
            <span>违约人：</span>
            <span>{{commentResult.defaulter}}</span>
          </div>
          <div v-if="commentResult.arrive==false">
            <span>违约理由：</span>
            <span>{{commentResult.false_reason}}</span>
          </div>
      </el-dialog>
    </div>
    <div class="dialog_appointment">
      <el-dialog title="修改预约" :visible.sync="dialogFormVisible" width="30%">
        <el-form :model="appointmentForm">
          <el-form-item label="预约日期" :label-width="formLabelWidth">
            <el-date-picker
              :picker-options="pickerOptions"
              v-model="appointmentForm.appointmentDate"
              type="date"
              placeholder="选择日期"
              style="width:90%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="预约时间" :label-width="formLabelWidth">
            <el-time-select
              v-model="appointmentForm.appointmentTime"
              :picker-options="{
                  start: '9:00',
                  step: '1:00',
                  end: '20:00'
                }"
              placeholder="选择时间"
              style="width:90%"
            ></el-time-select>
          </el-form-item>
          <el-form-item label="约看地址" :label-width="formLabelWidth">
            <el-input
              v-model="appointmentForm.appointmentPlace"
              placeholder="输入约看地址"
              style="width:90%"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm(appointmentForm)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="user_content_title">
      <p class="no_select_title">我的预约</p>
      <p class="select_title">收到预约</p>
    </div>
    <div class="no_user_msg" v-if="seeReceiveAppointmentLen==0">
      <div class="no_msg_img"></div>
      <div class="no_msg_text">暂无数据~</div>
    </div>
    <div v-else>
      <div class="info_table margin_top">
        <p>预约成功信息</p>
        <el-table :data="seeReceiveAppointmentList01" border>
        <el-table-column prop="house_id.house_number" width="150" label="房屋编号"></el-table-column>
          <el-table-column prop="appointment_date" width="100" label="日期"></el-table-column>
          <el-table-column prop="appointment_time" width="60" label="时间"></el-table-column>
          <el-table-column prop="appointment_phone" width="120" label="对方联系方式"></el-table-column>
          <el-table-column prop="appointment_place" width="260" label="约看地点"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="handleCheck(scope.$index, scope.row)"
              >查看房屋</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="info_table margin_top">
        <p>收到预约信息</p>
        <el-table :data="seeReceiveAppointmentList02" border>
       <el-table-column prop="house_id.house_number" width="150" label="房屋编号"></el-table-column>
          <el-table-column prop="appointment_date" width="100" label="日期"></el-table-column>
          <el-table-column prop="appointment_time" width="60" label="时间"></el-table-column>
          <el-table-column prop="appointment_phone" width="120" label="对方联系方式"></el-table-column>
          <el-table-column prop="appointment_place" width="260" label="约看地点"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="handleCheck(scope.$index, scope.row)"
                style="margin-bottom:0.06rem"
              >查看房屋</el-button>
              <el-button size="mini" type="primary" @click="handleAgree(scope.$index, scope.row)">同意</el-button>
              <el-button
                style="background:#409EFF;border-color:#409EFF"
                size="mini"
                type="danger"
                @click="dialogFormVisible=true,handleModify(scope.$index, scope.row)"
              >修改</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="info_table margin_top">
        <p>待对方同意信息</p>
        <el-table :data="seeReceiveAppointmentList03" border>
          <el-table-column prop="house_id.house_number" width="150" label="房屋编号"></el-table-column>
          <el-table-column prop="appointment_date" width="100" label="日期"></el-table-column>
          <el-table-column prop="appointment_time" width="60" label="时间"></el-table-column>
          <el-table-column prop="appointment_phone" width="120" label="对方联系方式"></el-table-column>
          <el-table-column prop="appointment_place" width="260" label="约看地点"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="handleCheck(scope.$index, scope.row)"
              >查看房屋</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="info_table margin_top">
        <p>完成预约信息</p>
        <el-table :data="seeReceiveAppointmentList04" border style="margin-bottom:0.5rem">
          <el-table-column prop="house_id.house_number" width="150" label="房屋编号"></el-table-column>
          <el-table-column prop="appointment_date" width="100" label="日期"></el-table-column>
          <el-table-column prop="appointment_time" width="60" label="时间"></el-table-column>
          <el-table-column prop="appointment_phone" width="120" label="对方联系方式"></el-table-column>
          <el-table-column prop="appointment_place" width="260" label="约看地点"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="handleCheck(scope.$index, scope.row)"
              >查看房屋</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleCheckComment(scope.$index, scope.row)"
                v-if="scope.row.comment==true"
              >查看评论</el-button>
              <el-button
                size="mini"
                type="danger"
                disabled
                v-if="scope.row.comment==false"
              >尚未评论</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      dialogFormVisible: false,
      appointmentForm: {
        appointmentId: "",
        appointmentDate: "",
        appointmentTime: "",
        appointmentPlace: ""
      },
      seeReceiveAppointmentList: new Array(),
      seeReceiveAppointmentLen: new Number(),
      seeReceiveAppointmentList01: new Array(),
      seeReceiveAppointmentList02: new Array(),
      seeReceiveAppointmentList03: new Array(),
      seeReceiveAppointmentList04: new Array(),
      formLabelWidth: "0.8rem",
      dialogFormVisible1:false,
      commentResult:""
    };
  },
  methods: {
    seeReceiveAppointment() {
      this.$http
        .get("api/appointments/seeReceiveAppointment")
        .then(response => {
          this.seeReceiveAppointmentList =
            response.data.seeReceiveAppointmentList;
          this.seeReceiveAppointmentLen = this.seeReceiveAppointmentList.length;
          for (var i = 0; i < this.seeReceiveAppointmentLen; i++) {
            this.seeReceiveAppointmentList[i].appointment_date = this.$moment(
              this.seeReceiveAppointmentList[i].appointment_date
            ).format("YYYY-MM-DD");
            if (
              this.seeReceiveAppointmentList[i].house_owner_confirm == true &&
              this.seeReceiveAppointmentList[i].appointment_user_confirm == true
            ) {
                if (
              this.$moment().isBefore(
                this.seeReceiveAppointmentList[i].appointment_date
              )
            ) {
              this.seeReceiveAppointmentList01.push(
                this.seeReceiveAppointmentList[i]
              );
            } else {
              this.seeReceiveAppointmentList04.push(
                this.seeReceiveAppointmentList[i]
              );
            }
            } else if (
              this.seeReceiveAppointmentList[i].house_owner_confirm == false &&
              this.seeReceiveAppointmentList[i].appointment_user_confirm == true
            ) {
              this.seeReceiveAppointmentList02.push(
                this.seeReceiveAppointmentList[i]
              );
            } else if (
              this.seeReceiveAppointmentList[i].house_owner_confirm == true &&
              this.seeReceiveAppointmentList[i].appointment_user_confirm ==
                false
            ) {
              this.seeReceiveAppointmentList03.push(
                this.seeReceiveAppointmentList[i]
              );
            }
          }
        });
    },
    handleAgree(index, row) {
      let that = this;
      that.$prompt("请输入约看地址", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        callback: (action, instance) => {
          if (action === "confirm") {
            that.$http
              .get("api/appointments/ownerAgreeAppointment", {
                params: {
                  appointmentId: row._id,
                  appointmentPlace: instance.inputValue
                }
              })
              .then(response => {
                if (response.data.success == "true") {
                  that.$message.success("同意成功");
                  this.seeReceiveAppointmentList01 = [];
                  this.seeReceiveAppointmentList02 = [];
                  this.seeReceiveAppointmentList03 = [];
                  this.seeReceiveAppointment();
                  this.util.newMessage(
                    "收到同意预约消息",
                    "房东同意了你的预约看房，房屋编号为" +
                      row.house_id.house_number +
                      "，记得准时到达，点击前往查看",
                    row.appointment_user_id,
                    "makeappointment",
                    2
                  );
                }
              });
          }
        }
      });
    },
    submitForm(formName) {
      this.$http
        .post("api/appointments/ownerModifyAppointment", this.appointmentForm)
        .then(response => {
          if (response.data.success == "true") {
            this.$message.success("修改成功");
            this.util.newMessage(
              "收到修改预约消息",
              "房东修改了你的预约看房，房屋编号为" +
                response.data.appointmentInfo.house_id.house_number +
                "，点击前往查看",
              response.data.appointmentInfo.appointment_user_id,
              "makeappointment",
              2
            );
            this.appointmentDate = "";
            this.appointmentTime = "";
            this.appointmentPlace = "";
            this.dialogFormVisible = false;
            this.seeReceiveAppointmentList01 = [];
            this.seeReceiveAppointmentList02 = [];
            this.seeReceiveAppointmentList03 = [];
            this.seeReceiveAppointment();
          }
        });
    },
    handleModify(index, row) {
      this.appointmentForm.appointmentId = row._id;
    },
    handleCheck(index, row) {
      this.$router.push({
        name: "ViewHouse",
        params: { houseid: row.house_id._id }
      });
    },
    handleDelete(index, row) {
      this.$confirm("是否取消预约?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .get("api/appointments/aidCancelAppointment", {
              params: {
                AppointmentId: row._id
              }
            })
            .then(response => {
              if (response.data.success == "true") {
                this.$message({
                  type: "success",
                  message: "已取消预约"
                });
                this.seeReceiveAppointmentList01 = [];
                this.seeReceiveAppointmentList02 = [];
                this.seeReceiveAppointmentList03 = [];
                this.seeReceiveAppointment();
                this.util.newMessage(
                  "收到取消预约消息",
                  "房东拒绝了你的预约看房，房屋编号为" +
                    row.house_id.house_number +
                    "，点击查看房屋详情",
                  row.appointment_user_id,
                  "/city/detail/" + row.house_id._id,
                  2
                );
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "放弃取消预约"
          });
        });
    },
       handleCheckComment(index, row) {
      this.dialogFormVisible1 = true;
      this.$http.get('api/appointments/checkComment',{
        params:{
          appointmentId:row._id
        }
      }).then(response=>{
        this.commentResult=response.data.commentResult
      })
    },
  },
  mounted() {
    this.seeReceiveAppointment();
  }
};
</script>

<style scoped>
.info_table > p {
  padding: 0.3rem;
  color: #fdac5b;
  font-weight: bold;
}
</style>

<style>
.info_table .el-table {
  width: 96% !important;
  margin: 0 auto;
}
.dialog_check .el-dialog__body{
  padding-top: 0.2rem;
}
.dialog_check .el-dialog__body>div{
  padding-bottom: 0.3rem;
}
.dialog_check .el-dialog__body>div>span{
  font-size: 0.16rem;
}
.dialog_check .el-dialog__body>div>span:nth-of-type(1){
  display: inline-block;
  width: 24%;
  text-align: right;
  padding-right: 0.22rem;
}
.dialog_check .el-rate{
  display: inline-block;
}
</style>