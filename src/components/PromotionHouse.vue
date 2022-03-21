<template>
  <div class="user_content">
    <div v-if="ruleForm.house_number_promotion==''">
      <div class="user_content_title">
        <p class="no_select_title">推广中心</p>
        <p class="select_title">推广房源</p>
      </div>
      <div class="no_user_msg" v-if="userHouseLen==0">
        <div class="no_msg_img"></div>
        <div class="no_msg_text">暂无数据~</div>
      </div>
      <div v-else>
        <div class="info_table">
          <p>未推广信息</p>
          <el-table :data="wuProHouseList" border>
            <el-table-column prop="house_number" width="180" label="房屋编号"></el-table-column>
            <el-table-column prop="rental_mode" width="160" label="出租方式"></el-table-column>
            <el-table-column prop="community_name" width="160" label="小区名称"></el-table-column>
            <el-table-column prop="price" label="租金" width="160"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleCheck(scope.$index, scope.row)"
                >查看</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handlePromotion(scope.$index, scope.row)"
                >推广</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="info_table">
          <p>推广中信息</p>
          <el-table :data="youProHouseList" border>
            <el-table-column prop="house_number" width="180" label="房屋编号"></el-table-column>
            <el-table-column prop="rental_mode" width="160" label="出租方式"></el-table-column>
            <el-table-column prop="community_name" width="160" label="小区名称"></el-table-column>
            <el-table-column prop="price" label="租金" width="160"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleCheck(scope.$index, scope.row)"
                >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="info_table">
          <p>待推广信息</p>
          <el-table :data="daiProHouseList" border style="margin-bottom:0.5rem">
            <el-table-column prop="house_number" width="180" label="房屋编号"></el-table-column>
            <el-table-column prop="rental_mode" width="160" label="出租方式"></el-table-column>
            <el-table-column prop="community_name" width="160" label="小区名称"></el-table-column>
            <el-table-column prop="price" label="租金" width="160"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleCheck(scope.$index, scope.row)"
                >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="promotion_form" v-else>
      <p>推广设置</p>
      <el-form :model="ruleForm" ref="ruleForm" label-width="1.5rem" class="demo-ruleForm">
        <el-form-item label="房屋编号">
          <div>{{this.ruleForm.house_number_promotion}}</div>
        </el-form-item>
        <el-form-item label="设置开始时间">
          <el-date-picker
            v-model="ruleForm.startTime"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="设置推广时长">
          <el-radio-group v-model="ruleForm.promotionTime" @change="changePrice">
            <el-radio label="3d">
              三天
              <span class="price">
                <span class="color">15</span>元
              </span>
            </el-radio>
            <el-radio label="7d">
              七天
              <span class="price">
                <span class="color">33</span>元（
                <span class="discount_color">9.5</span>折）
              </span>
            </el-radio>
            <el-radio label="15d">
              十五天
              <span class="price">
                <span class="color">67</span>元（
                <span class="discount_color">9</span>折）
              </span>
            </el-radio>
            <el-radio label="1M">
              一个月
              <span class="price">
                <span class="color">124</span>元（
                <span class="discount_color">8.5</span>折）
              </span>
            </el-radio>
            <el-radio label="3M">
              三个月
              <span class="price">
                <span class="color">360</span>元（
                <span class="discount_color">8</span>折）
              </span>
            </el-radio>
            <el-radio label="6M">
              六个月
              <span class="price">
                <span class="color">675</span>元（
                <span class="discount_color">7.5</span>折）
              </span>
            </el-radio>
            <el-radio label="1y">
              一年
              <span class="price">
                <span class="color">1260</span>元（
                <span class="discount_color">7</span>折）
              </span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="推广费" class="promotion_price">
          <div>￥{{ruleForm.promotionPrice}}</div>
        </el-form-item>
        <p class="promotion_introduce">推广的房源将置于首页精品房源推荐，列表页置顶位置，侧边栏位置及筛选热门推广选项</p>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">立即购买</el-button>
        </el-form-item>
      </el-form>
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
      userHouseList: new Array(),
      userHouseLen: "",
      youProHouseList: new Array(),
      daiProHouseList: new Array(),
      wuProHouseList: new Array(),
      fullscreenLoading: false,
      ruleForm: {
        house_number_promotion: "",
        houseId: "",
        startTime: "",
        promotionTime: "",
        promotionPrice: 0,
        tradeNo: ""
      }
    };
  },
  methods: {
    getUserHouse() {
      this.$http.get("api/users/getPromotionHouse").then(response => {
        this.youProHouseList = response.data.youProHouseList;
        this.daiProHouseList = response.data.daiProHouseList;
        this.wuProHouseList = response.data.wuProHouseList;
        this.userHouseList = response.data.userHouseList;
        this.userHouseLen = response.data.userHouseList.length;
      });
    },
    handleCheck(index, row) {
      this.$router.push({ name: "ViewHouse", params: { houseid: row._id } });
    },
    handlePromotion(index, row) {
      this.ruleForm.house_number_promotion = row.house_number;
      this.ruleForm.houseId = row._id;
    },
    changePrice(value) {
      switch (value) {
        case "3d":
          this.ruleForm.promotionPrice = 15;
          break;
        case "7d":
          this.ruleForm.promotionPrice = 33;
          break;
        case "15d":
          this.ruleForm.promotionPrice = 67;
          break;
        case "1M":
          this.ruleForm.promotionPrice = 124;
          break;
        case "3M":
          this.ruleForm.promotionPrice = 360;
          break;
        case "6M":
          this.ruleForm.promotionPrice = 675;
          break;
        case "1y":
          this.ruleForm.promotionPrice = 1260;
          break;
      }
    },
    submitForm() {
      const that = this;
      const loading = this.$loading({
        lock: true,
        text: "支付中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      this.$http.post("api/alipay/pay", this.ruleForm).then(response => {
        window.open(response.data.result, "_blank");
        function paySuccess() {
          that.ruleForm.tradeNo = response.data.tradeNo;
          that.$http
            .get("api/alipay/tradeNo", {
              params: {
                tradeNo: that.ruleForm.tradeNo
              }
            })
            .then(response => {
              if (response.data.trade_status == "TRADE_SUCCESS") {
                that.$http
                  .post("api/alipay/addPromotion", that.ruleForm)
                  .then(response => {
                    loading.close();
                    clearInterval(interval);
                    that.ruleForm.house_number_promotion = "";
                    that.ruleForm.houseId = "";
                    that.ruleForm.startTime = "";
                    that.ruleForm.promotionTime = "";
                    that.ruleForm.promotionPrice = 0;
                    that.$message({
                      type: "success",
                      message: "支付成功"
                    });
                    that.getUserHouse();
                  });
              }
            });
        }
        var interval = setInterval(paySuccess, 1000);
      });
    }
  },
  mounted() {
    this.getUserHouse();
    if (this.$route.params.number) {
      this.ruleForm.house_number_promotion = this.$route.params.number;
    }
  }
};
</script>

<style scoped>
.info_table > p {
  padding: 0.4rem 0.3rem;
  color: #fdac5b;
  font-weight: bold;
}
.promotion_form .color {
  color: #ff9024;
  font-weight: bold;
}
.promotion_form .price {
  padding-left: 0.14rem;
}
.promotion_form p {
  padding: 0.4rem 0.3rem;
  color: #fdac5b;
  font-weight: bold;
}
.promotion_form .discount_color {
  color: rgb(255, 97, 97);
  font-weight: bold;
}
.promotion_introduce {
  text-align: center;
  color: #ff9024 !important;
}
</style>

<style>
.info_table .el-table {
  width: 96% !important;
  margin: 0 auto;
}
.promotion_form .el-radio:nth-child(-n + 4) {
  padding-bottom: 0.3rem;
}
.promotion_price {
  background-color: #fff2e4;
  padding: 0.1rem 0;
}
.promotion_price label {
  font-size: 0.18rem;
}
.promotion_price div {
  font-size: 0.2rem;
  color: #ff9024;
  font-weight: bold;
  padding-left: 0.1rem;
}
.promotion_form .el-radio__input.is-checked + .el-radio__label {
  color: inherit;
}
.promotion_form .el-button {
  margin: 0.3rem 2.8rem;
}
</style>