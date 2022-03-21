<template>
  <div class="user_content">
    <div class="dialog_comment">
      <el-dialog title="评论看房" :visible.sync="dialogFormVisible" width="40%">
        <el-form :model="commentForm">
          <el-form-item label="是否完成看房" :label-width="formLabelWidth">
            <el-radio-group v-model="commentForm.arrive">
              <el-radio :label="true">已完成</el-radio>
              <el-radio :label="false">未完成</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="评分" :label-width="formLabelWidth" v-if="commentForm.arrive==true">
            <el-rate v-model="commentForm.appointmentScore" :colors="colors" show-text></el-rate>
          </el-form-item>
          <el-form-item label="评分理由" :label-width="formLabelWidth" v-if="commentForm.arrive==true">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请您写下看房感受，满意或不满意的理由。"
              v-model="commentForm.trueReason"
            ></el-input>
          </el-form-item>
          <el-form-item label="违约人" :label-width="formLabelWidth" v-if="commentForm.arrive==false">
            <el-radio-group v-model="commentForm.defaulter">
              <el-radio label="预约人">自己</el-radio>
              <el-radio label="房东">房东</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="违约理由" :label-width="formLabelWidth" v-if="commentForm.arrive==false">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请您写下您或房东的违约理由。"
              v-model="commentForm.falseReason"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm(commentForm)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
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
    <div class="user_content_title">
      <p class="no_select_title">我的预约</p>
      <p class="select_title">发起预约</p>
    </div>
    <div class="no_user_msg" v-if="seeMakeAppointmentLen==0">
      <div class="no_msg_img"></div>
      <div class="no_msg_text">暂无数据~</div>
    </div>
    <div v-else>
      <div class="info_table margin_top">
        <p>预约成功信息</p>
        <el-table :data="seeMakeAppointmentList01" border>
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
        <p>待房东同意信息</p>
        <el-table :data="seeMakeAppointmentList02" border>
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
        <p>房东修改预约信息</p>
        <el-table :data="seeMakeAppointmentList03" border>
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
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">拒绝</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="info_table margin_top">
        <p>完成预约信息</p>
        <el-table :data="seeMakeAppointmentList04" border style="margin-bottom:0.5rem">
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
                @click="handleComment(scope.$index, scope.row)"
                v-if="scope.row.comment==false"
              >评价</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleCheckComment(scope.$index, scope.row)"
                v-if="scope.row.comment==true"
              >查看评论</el-button>
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
      seeMakeAppointmentList: new Array(),
      seeMakeAppointmentLen: new Number(),
      seeMakeAppointmentList01: new Array(),
      seeMakeAppointmentList02: new Array(),
      seeMakeAppointmentList03: new Array(),
      seeMakeAppointmentList04: new Array(),
      dialogFormVisible: false,
      dialogFormVisible1: false,
      formLabelWidth: "1.2rem",
      commentForm: {
        appointmentId: "",
        arrive: true,
        appointmentScore: 0,
        trueReason: "",
        defaulter: "",
        falseReason: ""
      },
      colors: ["#99A9BF", "#F7BA2A", "#FF9900"],
      commentResult:""
    };
  },
  methods: {
    seeMakeAppointment() {
      this.seeMakeAppointmentList=[]
      this.seeMakeAppointmentList01=[],
      this.seeMakeAppointmentList02=[],
      this.seeMakeAppointmentList03=[],
      this.seeMakeAppointmentList04=[],
      this.$http.get("api/appointments/seeMakeAppointment").then(response => {
        this.seeMakeAppointmentList = response.data.seeMakeAppointmentList;
        this.seeMakeAppointmentLen = this.seeMakeAppointmentList.length;
        for (var i = 0; i < this.seeMakeAppointmentLen; i++) {
          this.seeMakeAppointmentList[i].appointment_date = this.$moment(
            this.seeMakeAppointmentList[i].appointment_date
          ).format("YYYY-MM-DD");
          if (
            this.seeMakeAppointmentList[i].house_owner_confirm == true &&
            this.seeMakeAppointmentList[i].appointment_user_confirm == true
          ) {
            if (
              this.$moment().isBefore(
                this.seeMakeAppointmentList[i].appointment_date
              )
            ) {
              this.seeMakeAppointmentList01.push(
                this.seeMakeAppointmentList[i]
              );
            } else {
              this.seeMakeAppointmentList04.push(
                this.seeMakeAppointmentList[i]
              );
            }
          } else if (
            this.seeMakeAppointmentList[i].house_owner_confirm == false &&
            this.seeMakeAppointmentList[i].appointment_user_confirm == true
          ) {
            this.seeMakeAppointmentList02.push(this.seeMakeAppointmentList[i]);
          } else if (
            this.seeMakeAppointmentList[i].house_owner_confirm == true &&
            this.seeMakeAppointmentList[i].appointment_user_confirm == false
          ) {
            this.seeMakeAppointmentList03.push(this.seeMakeAppointmentList[i]);
          }
        }
      });
    },
    handleCheck(index, row) {
      this.$router.push({
        name: "Detail",
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
                this.seeMakeAppointmentList01 = [];
                this.seeMakeAppointmentList02 = [];
                this.seeMakeAppointmentList03 = [];
                this.seeMakeAppointment();
                this.util.newMessage(
                  "收到取消预约消息",
                  "用户" +
                    window.sessionStorage.getItem("username") +
                    "取消了预约，房屋编号为" +
                    row.house_id.house_number,
                  row.house_owner_id,
                  "",
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
    handleAgree(index, row) {
      this.$http
        .get("api/appointments/userAgreeAppointment", {
          params: {
            appointmentId: row._id
          }
        })
        .then(response => {
          if (response.data.success == "true") {
            this.$message.success("同意成功");
            this.seeMakeAppointmentList01 = [];
            this.seeMakeAppointmentList02 = [];
            this.seeMakeAppointmentList03 = [];
            this.seeMakeAppointment();
            this.util.newMessage(
              "收到同意预约消息",
              "用户" +
                window.sessionStorage.getItem("username") +
                "同意了你修改的预约看房，房屋编号为" +
                row.house_id.house_number +
                "，记得准时到达，点击前往查看",
              row.house_owner_id,
              "receiveappointment",
              2
            );
          }
        });
    },
    handleComment(index, row) {
      this.dialogFormVisible = true;
      this.commentForm.appointmentId = row._id;
    },
    handleCheckComment(index, row) {
      this.dialogFormVisible1 = true;
      this.$http.get('api/appointments/checkComment',{
        params:{
          appointmentId:row._id
        }
      }).then(response=>{
        this.commentResult=response.data.commentResult
        console.log(this.commentResult)
      })
    },
    submitForm(formName) {
      this.$http
        .post("api/appointments/commentAppointment", this.commentForm)
        .then(response => {
          if (response.data.success == "true") {
            this.$message.success("评论成功");
            this.dialogFormVisible = false;
            this.seeMakeAppointment();
          }
        });
    }
  },
  mounted() {
    this.seeMakeAppointment();
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
.dialog_comment .el-rate {
  margin-top: 0.12rem;
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