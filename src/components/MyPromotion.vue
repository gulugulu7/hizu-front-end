<template>
  <div class="user_content">
    <div class="user_content_title">
      <p class="no_select_title">推广中心</p>
      <p class="select_title">我的推广</p>
    </div>
    <div class="no_user_msg" v-if="proHouseLen==0">
      <div class="no_msg_img"></div>
      <div class="no_msg_text">暂无数据~</div>
    </div>
    <div v-else>
      <div class="info_table">
        <p>推广历史</p>
        <el-table :data="proHouseList" border style="margin-bottom:0.5rem">
          <el-table-column prop="house_number" width="180" label="房屋编号"></el-table-column>
          <el-table-column prop="community_name" label="小区名称"></el-table-column>
          <el-table-column prop="start_time" label="开始时间"></el-table-column>
          <el-table-column prop="end_time" label="结束时间"></el-table-column>
          <el-table-column prop="promotion_price" label="推广费用"></el-table-column>
          <el-table-column prop="promotion_status" label="推广状态"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleApply(scope.$index, scope.row)"
                v-if="scope.row.refund=='false'"
              >申请退款</el-button>
              <span v-if="scope.row.refund=='apply'">申请退款中</span>
              <span v-if="scope.row.refund=='true'">已退款</span>
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
      proHouseList: new Array(),
      proHouseLen: ""
    };
  },
  methods: {
    getProtionHistory() {
      this.proHouseList=[]
      this.$http
        .get("api/alipay/getProtionHistory")
        .then(response => {
          var proHouseList = response.data.proHouseList;
          for (var i = 0; i < proHouseList.length; i++) {
            var promotion_status = "";
            if (
              this.$moment().isBetween(
                proHouseList[i].start_time,
                proHouseList[i].end_time
              ) == true
            ) {
              promotion_status = "推广中";
            } else {
              if (this.$moment().isBefore(proHouseList[i].start_time) == true) {
                promotion_status = "等待中";
              }
              if (this.$moment().isAfter(proHouseList[i].end_time) == true) {
                promotion_status = "已过期";
              }
            }
            var proobj = {};
            Object.assign(
              proobj,
              { house_number: proHouseList[i].house_id.house_number },
              { community_name: proHouseList[i].house_id.community_name },
              {
                start_time: this.$moment(proHouseList[i].start_time).format(
                  "YYYY-MM-DD"
                )
              },
              {
                end_time: this.$moment(proHouseList[i].end_time).format(
                  "YYYY-MM-DD"
                )
              },
              { promotion_price: proHouseList[i].promotion_price },
              { promotion_status: promotion_status },
              { refund: proHouseList[i].refund },
              { _id: proHouseList[i]._id }
            );
            this.proHouseList.push(proobj);
          }
          this.proHouseLen = this.proHouseList.length;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleApply(index, row) {
      this.$confirm("退款金额如果为开始推广原价退回，如果已在推广中为您目前所剩的日期的金额，一天为3元", "申请退款", {
        confirmButtonText: "确定",
        cancelButtonText: '取消',
        callback: action => {
          if (action === "confirm") {
            this.$http
              .get("api/alipay/applyRefund", {
                params: {
                  promotionId: row._id
                }
              })
              .then(response => {
                if (response.data.success == "true") {
                  this.$message.success("申请退款成功");
                }
                this.getProtionHistory()
              });
          }else{
            this.$message.info("已取消申请退款")
          }
        }
      });
    }
  },
  mounted() {
    this.getProtionHistory();
  }
};
</script>

<style scoped>
.info_table > p {
  padding: 0.4rem 0.3rem;
  color: #fdac5b;
  font-weight: bold;
}
</style>

<style>
.info_table .el-table {
  width: 96% !important;
  margin: 0 auto;
}
</style>