<template>
  <div class="user_content">
    <div class="user_content_title">
      <p class="no_select_title">房源管理</p>
      <p class="select_title">编辑房源</p>
    </div>
    <div class="edit_house">
      <div class="house_form" style="color:#666">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="房源类型">
            <el-radio-group v-model="ruleForm.housingType">
              <el-radio-button label="小区">
                <i class="el-icon-discount"></i>
                小区
              </el-radio-button>
              <el-radio-button label="公寓">
                <i class="el-icon-office-building"></i>
                公寓
              </el-radio-button>
              <el-radio-button label="别墅">
                <i class="el-icon-school"></i>
                别墅
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="出租方式">
            <el-radio-group v-model="ruleForm.rentalMode">
              <el-radio-button label="整租">
                <i class="el-icon-link"></i>
                整租
              </el-radio-button>
              <el-radio-button label="合租">
                <i class="el-icon-connection"></i>
                合租
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="小区名称">
            <el-autocomplete
              popper-class="my-autocomplete"
              class="inline-input"
              v-model="ruleForm.communityName"
              :fetch-suggestions="querySearch"
              placeholder="请选择小区"
              :trigger-on-focus="false"
              @select="handleSelect"
              style="width:7rem"
              @input="choicePlot"
            >
              <i slot="suffix" @click="handleIconClick"></i>
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <span class="addr">{{ item.address }}</span>
              </template>
            </el-autocomplete>
          </el-form-item>
          <div id="l-map" style="display:none"></div>
          <el-form-item label="房屋地址">
            <el-form-item style="display: inline-block;">
              <el-select
                v-model="ruleForm.areaValue"
                placeholder="请选择区域"
                style="max-width:1.2rem;padding-right:0.05rem"
                @change="changeDistrict"
              >
                <el-option
                  v-for="item in ruleForm.areaOptions"
                  :key="item._id"
                  :label="item.district_name"
                  :value="item.district_number"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="display: inline-block;">
              <el-select
                v-model="ruleForm.sqValue"
                placeholder="请选择商圈"
                style="max-width:1.62rem;padding-right:0.05rem"
              >
                <el-option
                  v-for="item in ruleForm.sqOptions"
                  :key="item._id"
                  :label="item.sq_name"
                  :value="item._id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="display: inline-block;">
              <el-input v-model="ruleForm.cellAddress" style="width:4rem" placeholder="请填写小区地址"></el-input>
            </el-form-item>
          </el-form-item>
          <el-form-item label="房屋户型" class="apartment">
            <el-form-item style="display: inline-block;">
              <el-input v-model.number="ruleForm.room"></el-input>
            </el-form-item>
            <span>室</span>
            <el-form-item style="display: inline-block;">
              <el-input v-model.number="ruleForm.hall"></el-input>
            </el-form-item>
            <span>厅</span>
            <el-form-item style="display: inline-block;">
              <el-input v-model.number="ruleForm.toilet"></el-input>
            </el-form-item>
            <span>卫</span>
          </el-form-item>
          <el-form-item label="建筑面积">
            <el-input v-model.number="ruleForm.floorage" style="width:1rem;padding-right:0.12rem"></el-input>平方米
          </el-form-item>
          <el-form-item label="楼层信息">
            <el-form-item style="display: inline-block;">
              <el-input v-model.number="ruleForm.floor" style="width:0.5rem;padding-right:0.12rem"></el-input>层 ， 共
            </el-form-item>
            <el-form-item style="display: inline-block;">
              <el-input v-model.number="ruleForm.floorAll" style="width:0.5rem;padding:0 0.12rem"></el-input>层
            </el-form-item>
            <el-form-item style="display: inline-block;">
              <el-select v-model="ruleForm.elevator" style="width:1rem;padding-left:0.12rem">
                <el-option label="有电梯" value="true"></el-option>
                <el-option label="无电梯" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="房屋朝向">
            <el-select v-model="ruleForm.houseOrientation" style="width:1rem;">
              <el-option label="朝东" value="朝东"></el-option>
              <el-option label="朝南" value="朝南"></el-option>
              <el-option label="朝西" value="朝西"></el-option>
              <el-option label="朝北" value="朝北"></el-option>
              <el-option label="南北" value="南北"></el-option>
              <el-option label="东南" value="东南"></el-option>
              <el-option label="东北" value="东北"></el-option>
              <el-option label="西南" value="西南"></el-option>
              <el-option label="西北" value="西北"></el-option>
              <el-option label="东西" value="东西"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="附近地铁">
            <el-form-item style="display: inline-block;">
              <el-checkbox v-model="ruleForm.subwayChecked">近地铁</el-checkbox>
            </el-form-item>
            <span v-if="ruleForm.subwayChecked">
              <el-form-item style="display: inline-block;">
                <el-select
                  v-model="ruleForm.subwayLineValue"
                  placeholder="请选择地铁线"
                  style="max-width:1.4rem;padding-right:0.05rem;padding-left:0.4rem"
                  @change="changeSubwayLine"
                >
                  <el-option
                    v-for="item in ruleForm.subwayLineOptions"
                    :key="item._id"
                    :label="item.subwayLine_name"
                    :value="item.subwayLine_number"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item style="display: inline-block;">
                <el-select
                  v-model="ruleForm.subwayStationValue"
                  placeholder="请选择地铁站"
                  style="max-width:1.62rem;padding-right:0.05rem"
                >
                  <el-option
                    v-for="item in ruleForm.subwayStationOptions"
                    :key="item._id"
                    :label="item.subwayStation_name"
                    :value="item._id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <span style="font-size:0.12rem;color:#ff9024;padding-left:0.3rem">（请选择最近的地铁站）</span>
            </span>
          </el-form-item>
          <el-form-item label="月租金">
            <el-form-item style="display: inline-block;">
              <el-input v-model.number="ruleForm.price" style="width:1rem;padding-right:0.12rem"></el-input>元/月
            </el-form-item>
            <el-form-item style="display: inline-block;">
              <el-select v-model="ruleForm.paymentMethod" style="width:1.3rem;padding-left:0.12rem">
                <el-option label="押一付一" value="押一付一"></el-option>
                <el-option label="押一付三" value="押一付三"></el-option>
                <el-option label="半年付" value="半年付"></el-option>
                <el-option label="年付" value="年付"></el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="租金包含">
            <el-checkbox-group v-model="ruleForm.rentIncludes" @change="handleRentIncludesChange">
              <el-checkbox
                v-for="costType in ruleForm.costTypes"
                :label="costType"
                :key="costType"
                style="width:1rem"
              >{{costType}}</el-checkbox>
              <el-checkbox
                class="ctrl"
                :indeterminate="ruleForm.isIndeterminate1"
                v-model="ruleForm.checkCostTypeAll"
                @change="handleCheckCostTypeAllChange"
              >全选</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="最早住入">
            <el-form-item style="display: inline-block;">
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="ruleForm.checkInTime"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>

            <span style="padding-left:0.2rem">宜住</span>
            <el-form-item style="display: inline-block;">
              <el-input v-model.number="ruleForm.number" style="width:0.6rem;padding:0 0.08rem"></el-input>
            </el-form-item>

            <span>人</span>
          </el-form-item>
          <el-form-item label="装修情况">
            <el-radio-group v-model="ruleForm.renovation">
              <el-radio label="简单装修"></el-radio>
              <el-radio label="普通装修"></el-radio>
              <el-radio label="精装修"></el-radio>
              <el-radio label="豪华装修"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="房屋配置">
            <el-checkbox-group
              v-model="ruleForm.configurationIncludes"
              @change="handleConfigurationIncludesChange"
            >
              <el-checkbox
                v-for="configureType in ruleForm.configureTypes"
                :label="configureType"
                :key="configureType"
                style="width:1rem"
              >{{configureType}}</el-checkbox>
              <el-checkbox
                class="ctrl"
                :indeterminate="ruleForm.isIndeterminate2"
                v-model="ruleForm.checkConfigureTypeAll"
                @change="handleCheckConfigureTypeAllChange"
              >全选</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="出租要求">
            <el-radio-group v-model="ruleForm.rentalRequirements">
              <el-radio label="只限女生"></el-radio>
              <el-radio label="只限男生"></el-radio>
              <el-radio label="男女不限"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="房屋描述">
            <el-input
              type="textarea"
              :autosize="{ minRows: 5}"
              placeholder="可以介绍一下房源亮点，交通、周边环境，可以入住的时间和对租客的要求等，详细的描述会大大增加快速出租的机会！请不要在描述中包含：1.任意形式的联系方式及变型词；2.与房源或相关配套描述无关的内容；3.违反国家法律法规的内容等"
              v-model="ruleForm.housingDescription"
              style="width:7rem;"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传图片">
            <el-input v-model="ruleForm.houseImg" v-show="false"></el-input>
            <span>请上传清晰、实拍的室内图片，请不要在图片上添加文字、数字、网址等内容，请勿上传名片、二维码、自拍照、风景照等与房源无关的图片，最多上传12张，每张最大10M</span>
            <div class="upload_houseimg">
              <el-upload
                action="/api/houses/uploadImg"
                list-type="picture-card"
                multiple
                :limit="10"
                ref="upload"
                :on-exceed="handleExceed"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeHouseUpload"
                :file-list="fileList"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible" width="30%">
                <img width="100%" :src="dialogImageUrl" alt />
                <div
                  style="cursor:pointer;"
                  @click="setTitle(dialogImageUrl)"
                  v-if="this.housePictures[dialogImageUrl]==0"
                >
                  <span style="color:#ff9024">设置为标题图片</span>
                </div>
                <div v-else>
                  <span style="color:#ff9024">标题图片</span>
                </div>
              </el-dialog>
            </div>
          </el-form-item>
          <el-form-item label="联系人">
            <el-form-item style="display: inline-block;">
              <el-input v-model="ruleForm.contacts" style="width:1.2rem"></el-input>
            </el-form-item>
            <el-form-item style="display: inline-block;padding-left:0.4rem;">
              <el-radio-group v-model="ruleForm.contactssex">
                <el-radio label="先生">先生</el-radio>
                <el-radio label="女士">女士</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input style="width:2.4rem" v-model="ruleForm.contactNumber"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="toCheck()">页面效果</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确定修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import BMap from "BMap";

const costTypeOptions = [
  "水费",
  "电费",
  "燃气费",
  "宽带费",
  "物业费",
  "取暖费",
  "有线电视费",
  "停车费"
];
const configureTypeOptions = [
  "电视",
  "空调",
  "热水器",
  "洗衣机",
  "冰箱",
  "床",
  "沙发",
  "衣柜",
  "暖气",
  "宽带",
  "厨房",
  "阳台",
  "独立卫生间"
];
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      restaurants: [],
      loadAllData: [],
      housePictures: "",
      sidebarList: [
        {
          icon: "el-icon-office-building",
          href: "#sidebar1",
          title: "基础信息"
        },
        { icon: "el-icon-coin", href: "#sidebar2", title: "租金信息" },
        { icon: "el-icon-tickets", href: "#sidebar3", title: "详细介绍" },
        { icon: "el-icon-postcard", href: "#sidebar4", title: "房源图片" },
        { icon: "el-icon-user", href: "#sidebar5", title: "联系信息" }
      ],
      current: 0,
      dialogImageUrl: "",
      dialogVisible: false,
      district_number: "",
      ruleForm: {
        houseId: "",
        housingType: "小区",
        rentalMode: "整租",
        communityName: "",
        areaValue: "",
        sqValue: "",
        cellAddress: "",
        room: "",
        hall: "",
        toilet: "",
        floorage: "",
        floor: "",
        floorAll: "",
        elevator: "true",
        houseOrientation: "",
        subwayChecked: false,
        subwayLineValue: "",
        subwayStationValue: "",
        price: "",
        paymentMethod: "",
        rentIncludes: [],
        configurationIncludes: [],
        costTypes: costTypeOptions,
        configureTypes: configureTypeOptions,
        isIndeterminate1: true,
        isIndeterminate2: true,
        checkCostTypeAll: false,
        checkConfigureTypeAll: false,
        checkInTime: "",
        number: "",
        renovation: "",
        houseImg: "",
        rentalRequirements: "",
        housingDescription: "",
        contacts: "",
        contactssex: "",
        contactNumber: "",
        areaOptions: [],
        sqOptions: [],
        subwayLineOptions: [],
        subwayStationOptions: []
      },
      fileList: []
    };
  },

  methods: {
    getHouseDetail() {
      this.$http
        .get("api/houses/getHouseDetail", {
          params: {
            house_id: this.$route.params.houseid
          }
        })
        .then(response => {
          let houseDetail = response.data.houseDetail[0];
          this.ruleForm.housingType = houseDetail.housing_type;
          this.ruleForm.rentalMode = houseDetail.rental_mode;
          this.ruleForm.communityName = houseDetail.community_name;
          this.ruleForm.areaValue =
            houseDetail.sq_value.district_id.district_number;
          this.changeDistrict(this.ruleForm.areaValue);
          this.ruleForm.sqValue = houseDetail.sq_value._id;
          this.ruleForm.cellAddress = houseDetail.cell_address;
          this.ruleForm.room = houseDetail.room;
          this.ruleForm.hall = houseDetail.hall;
          this.ruleForm.toilet = houseDetail.toilet;
          this.ruleForm.floorage = houseDetail.floorage;
          this.ruleForm.floor = houseDetail.floor;
          this.ruleForm.floorAll = houseDetail.floor_all;
          this.ruleForm.elevator = houseDetail.elevator.toString();
          this.ruleForm.houseOrientation = houseDetail.house_orientation;
          this.ruleForm.subwayChecked = houseDetail.subway_checked;
          if (this.ruleForm.subwayChecked == true) {
            this.ruleForm.subwayLineValue =
              houseDetail.subway_station_value.subwayLine_id.subwayLine_number;
              this.changeSubwayLine(this.ruleForm.subwayLineValue)
            this.ruleForm.subwayStationValue =
              houseDetail.subway_station_value._id;
          }

          this.ruleForm.price = houseDetail.price;
          this.ruleForm.paymentMethod = houseDetail.payment_method;
          this.ruleForm.rentIncludes = houseDetail.rent_includes;
          this.ruleForm.rentIncludes = houseDetail.rent_includes;
          this.ruleForm.checkInTime = houseDetail.check_in_time;
          this.ruleForm.number = houseDetail.number;
          this.ruleForm.renovation = houseDetail.renovation;
          this.ruleForm.configurationIncludes =
            houseDetail.configuration_includes;
          this.ruleForm.rentalRequirements = houseDetail.rental_requirements;
          this.ruleForm.housingDescription = houseDetail.housing_description;
          var fileListObject = JSON.parse(houseDetail.house_img);
          var fileListArray = Object.keys(fileListObject);
          for (const key in fileListArray) {
            this.fileList.push({ url: fileListArray[key] });
          }
          this.ruleForm.houseImg = houseDetail.house_img;
          this.housePictures = fileListObject;
          this.ruleForm.contacts = houseDetail.contacts;
          this.ruleForm.contactssex = houseDetail.contactssex;
          this.ruleForm.contactNumber = houseDetail.contact_number;
        });
    },
    querySearch(queryString, cb) {
      setTimeout(() => {
        var restaurants = this.restaurants;
        var results = queryString
          ? restaurants.filter(this.createFilter(queryString))
          : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      }, 1000);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      return this.loadAllData;
    },
    handleSelect(item) {
      this.ruleForm.cellAddress = item.address;
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    choicePlot() {
      var map = new BMap.Map("l-map");
      var that = this;
      map.centerAndZoom(this.hancity, 11);

      var options = {
        onSearchComplete: function(results) {
          // 判断状态是否正确
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            var s = [];
            for (var i = 0; i < results.getCurrentNumPois(); i++) {
              s.push({
                value: results.getPoi(i).title,
                address: results.getPoi(i).address
              });
            }
            that.loadAllData = s;
            that.restaurants = that.loadAll();
          }
        }
      };
      var local = new BMap.LocalSearch(map, options);
      local.search(this.ruleForm.communityName);
    },
    handleCheckCostTypeAllChange(val) {
      this.ruleForm.rentIncludes = val ? costTypeOptions : [];
      this.ruleForm.isIndeterminate1 = false;
    },
    handleRentIncludesChange(value) {
      let checkedCount = value.length;
      this.ruleForm.checkCostTypeAll =
        checkedCount === this.ruleForm.costTypes.length;
      this.ruleForm.isIndeterminate1 =
        checkedCount > 0 && checkedCount < this.ruleForm.costTypes.length;
    },
    handleCheckConfigureTypeAllChange(val) {
      this.ruleForm.configurationIncludes = val ? configureTypeOptions : [];
      this.ruleForm.isIndeterminate2 = false;
    },
    handleConfigurationIncludesChange(value) {
      let checkedCount = value.length;
      this.ruleForm.checkConfigureTypeAll =
        checkedCount === this.ruleForm.configureTypes.length;
      this.ruleForm.isIndeterminate2 =
        checkedCount > 0 && checkedCount < this.ruleForm.configureTypes.length;
    },
    submitForm(formName) {
      this.ruleForm.houseId = this.$route.params.houseid;
      if (this.ruleForm.subwayStationValue == "") {
        this.ruleForm.subwayStationValue = "5e00dcac305fc61478e80000";
      }
      this.$http
        .post("/api/users/editUserHouse", this.ruleForm)
        .then(response => {
          if (response.data.success == "true") {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.$router.go(-1);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    addClass: function(index) {
      this.current = index;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleRemove(file, fileList) {
      if (file.response) {
        delete this.housePictures[file.response];
      } else {
        delete this.housePictures[file.url];
      }

      this.ruleForm.houseImg = JSON.stringify(this.housePictures);
      if (this.ruleForm.houseImg == "{}") {
        this.ruleForm.houseImg = "";
      }
    },
    handlePictureCardPreview(file) {
      if (file.response) {
        this.dialogImageUrl = file.response;
      } else {
        this.dialogImageUrl = file.url;
      }

      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      if (this.housePictures == "") {
        this.housePictures = { [response]: 1 };
      } else {
        this.housePictures = Object.assign(this.housePictures, {
          [response]: 0
        });
      }
      this.ruleForm.houseImg = JSON.stringify(this.housePictures);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 10 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeHouseUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 10MB!");
      }
      return isJPG && isLt2M;
    },
    setTitle(setImg) {
      for (const key in this.housePictures) {
        this.housePictures = Object.assign(this.housePictures, { [key]: 0 });
      }
      this.housePictures = Object.assign(this.housePictures, { [setImg]: 1 });
      this.dialogVisible = false;
      this.ruleForm.houseImg = JSON.stringify(this.housePictures);
    },
    getDistrict() {
      this.$http
        .get("api/citys/getDistrict", {
          params: { city: this.$route.params.city }
        })
        .then(response => {
          this.ruleForm.areaOptions = response.data.districtList;
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeDistrict(value) {
      this.district_number = value;
      this.getSq();
    },
    getSq() {
      this.$http
        .get("api/citys/getSq", { params: { district: this.district_number } })
        .then(response => {
          this.ruleForm.sqOptions = response.data.sqList;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSubwayLine() {
      this.$http
        .get("api/citys/getSubwayLine", {
          params: { city: this.$route.params.city }
        })
        .then(response => {
          this.ruleForm.subwayLineOptions = response.data.subwayLineList;
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeSubwayLine(value) {
      this.subwayLine_number = value;
      this.getSubwayStation();
    },
    getSubwayStation() {
      this.$http
        .get("api/citys/getSubwayStation", {
          params: { subwayLine: this.subwayLine_number }
        })
        .then(response => {
          this.ruleForm.subwayStationOptions = response.data.subwayStationList;
        })
        .catch(error => {
          console.log(error);
        });
    },
    toCheck() {
      this.$router.push({
        name: "Detail",
        params: { houseid: this.$route.params.houseid }
      });
    }
  },

  mounted() {
    this.restaurants = this.loadAll();
    this.choicePlot();
    this.getDistrict();
    this.getSq();
    this.getSubwayLine();
    this.getHouseDetail();
  },
  computed: {
    abcity: function() {
      switch (window.sessionStorage.getItem("city")) {
        case "beijing":
          return "BJ";
          break;
        case "shanghai":
          return "SH";
          break;
        case "guangzhou":
          return "GZ";
          break;
        case "shenzhen":
          return "SZ";
          break;
        case "hangzhou":
          return "HZ";
          break;
        case "nanjing":
          return "NJ";
          break;
        case "wuhan":
          return "WH";
          break;
        case "chengdu":
          return "CD";
          break;
        case "tianjin":
          return "TJ";
          break;
      }
    },
    hancity: function() {
      switch (window.sessionStorage.getItem("city")) {
        case "beijing":
          return "北京";
          break;
        case "shanghai":
          return "上海";
          break;
        case "guangzhou":
          return "广州";
          break;
        case "shenzhen":
          return "深圳";
          break;
        case "hangzhou":
          return "杭州";
          break;
        case "nanjing":
          return "南京";
          break;
        case "wuhan":
          return "武汉";
          break;
        case "chengdu":
          return "成都";
          break;
        case "tianjin":
          return "天津";
          break;
      }
    }
  },
  watch: {
    $route(to, from) {
      this.getDistrict();
    }
  }
};
</script>

<style scoped>
</style>

<style>
.my-autocomplete li {
  line-height: normal;
  padding: 0.07rem;
}
.my-autocomplete .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete .addr {
  font-size: 0.12rem;
  color: #b4b4b4;
}

.my-autocomplete .highlighted .addr {
  color: #ddd;
}

.house_form {
  margin-top: 0.4rem;
  background: #fff;
}
.house_form .el-form {
  width: 9rem;

  padding-right: 0.32rem;
}
.house_form h4 {
  padding: 0.3rem 0.24rem;
  color: black;
}

.house_form .apartment .el-input {
  width: 0.8rem;
  display: inline-block;
}
.house_form .apartment span {
  display: inline-block;
  padding: 0 0.12rem;
}
.house_form .ctrl {
  color: #ff9024;
}
.house_form .ctrl .el-checkbox__inner {
  display: none;
}
.house_form .ctrl .el-checkbox__label {
  padding: 0;
}
.house_form .el-button {
  margin: 0.15rem;
}
</style>