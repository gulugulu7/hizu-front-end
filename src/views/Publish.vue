<template>
  <div class="publish">
    <div class="main" v-if="publishSuccess==false">
      <div class="title">
        <h1>免费发布出租房源</h1>
        <span>请如实填写信息！若发现虚假可能会下架房源信息</span>
      </div>
      <div class="form_sidebar">
        <div class="house_form" style="color:#666">
          <el-form
            :model="ruleForm"
            ref="ruleForm"
            label-width="1rem"
            :rules="rules"
            class="demo-ruleForm"
          >
            <h4 id="sidebar1">基础信息</h4>
            <el-form-item label="房源类型" prop="housingType">
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
            <el-form-item label="出租方式" prop="rentalMode">
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
            <el-form-item label="小区名称" prop="communityName">
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
            <el-form-item label="房屋地址" required>
              <el-form-item prop="areaValue" style="display: inline-block;">
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
              <el-form-item prop="sqValue" style="display: inline-block;">
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
              <el-form-item prop="cellAddress" style="display: inline-block;">
                <el-input v-model="ruleForm.cellAddress" style="width:4rem" placeholder="请填写小区地址"></el-input>
              </el-form-item>
            </el-form-item>
            <el-form-item label="房屋户型" required class="apartment">
              <el-form-item prop="room" style="display: inline-block;">
                <el-input v-model.number="ruleForm.room"></el-input>
              </el-form-item>
              <span>室</span>
              <el-form-item prop="hall" style="display: inline-block;">
                <el-input v-model.number="ruleForm.hall"></el-input>
              </el-form-item>
              <span>厅</span>
              <el-form-item prop="toilet" style="display: inline-block;">
                <el-input v-model.number="ruleForm.toilet"></el-input>
              </el-form-item>
              <span>卫</span>
            </el-form-item>
            <el-form-item label="建筑面积" prop="floorage">
              <el-input v-model.number="ruleForm.floorage" style="width:1rem;padding-right:0.12rem"></el-input>平方米
            </el-form-item>
            <el-form-item label="楼层信息" required>
              <el-form-item prop="floor" style="display: inline-block;">
                <el-input
                  v-model.number="ruleForm.floor"
                  style="width:0.5rem;padding-right:0.12rem"
                ></el-input>层 ， 共
              </el-form-item>
              <el-form-item prop="floorAll" style="display: inline-block;">
                <el-input v-model.number="ruleForm.floorAll" style="width:0.5rem;padding:0 0.12rem"></el-input>层
              </el-form-item>
              <el-form-item prop="elevator" style="display: inline-block;">
                <el-select v-model="ruleForm.elevator" style="width:1rem;padding-left:0.12rem">
                  <el-option label="有电梯" value="true"></el-option>
                  <el-option label="无电梯" value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="房屋朝向" prop="houseOrientation">
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
            <el-form-item label="附近地铁" required>
              <el-form-item prop="subwayChecked" style="display: inline-block;">
                <el-checkbox v-model="ruleForm.subwayChecked">近地铁</el-checkbox>
              </el-form-item>
              <span v-if="ruleForm.subwayChecked">
                <el-form-item prop="subwayLineValue" style="display: inline-block;">
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
                <el-form-item prop="subwayStationValue" style="display: inline-block;">
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
            <h4 id="sidebar2">租金信息</h4>
            <el-form-item label="月租金" required>
              <el-form-item prop="price" style="display: inline-block;">
                <el-input v-model.number="ruleForm.price" style="width:1rem;padding-right:0.12rem"></el-input>元/月
              </el-form-item>
              <el-form-item prop="paymentMethod" style="display: inline-block;">
                <el-select
                  v-model="ruleForm.paymentMethod"
                  style="width:1.3rem;padding-left:0.12rem"
                >
                  <el-option label="押一付一" value="押一付一"></el-option>
                  <el-option label="押一付三" value="押一付三"></el-option>
                  <el-option label="半年付" value="半年付"></el-option>
                  <el-option label="年付" value="年付"></el-option>
                </el-select>
              </el-form-item>
            </el-form-item>
            <el-form-item label="租金包含" prop="rentIncludes">
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
            <h4 id="sidebar3">详细介绍</h4>
            <el-form-item label="最早住入" required>
              <el-form-item prop="checkInTime" style="display: inline-block;">
                <el-date-picker
                  :picker-options="pickerOptions"
                  v-model="ruleForm.checkInTime"
                  type="date"
                  placeholder="选择日期"
                ></el-date-picker>              
              </el-form-item>
              <span style="padding-left:0.2rem">宜住</span>
              <el-form-item prop="number" style="display: inline-block;">
                <el-input v-model.number="ruleForm.number" style="width:0.6rem;padding:0 0.08rem"></el-input>
              </el-form-item>

              <span>人</span>
            </el-form-item>
            <el-form-item label="装修情况" prop="renovation">
              <el-radio-group v-model="ruleForm.renovation">
                <el-radio label="简单装修"></el-radio>
                <el-radio label="普通装修"></el-radio>
                <el-radio label="精装修"></el-radio>
                <el-radio label="豪华装修"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="房屋配置" prop="configurationIncludes">
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
            <el-form-item label="出租要求" prop="rentalRequirements">
              <el-radio-group v-model="ruleForm.rentalRequirements">
                <el-radio label="只限女生"></el-radio>
                <el-radio label="只限男生"></el-radio>
                <el-radio label="男女不限"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="房屋描述" prop="housingDescription">
              <el-input
                type="textarea"
                :autosize="{ minRows: 5}"
                placeholder="可以介绍一下房源亮点，交通、周边环境，可以入住的时间和对租客的要求等，详细的描述会大大增加快速出租的机会！请不要在描述中包含：1.任意形式的联系方式及变型词；2.与房源或相关配套描述无关的内容；3.违反国家法律法规的内容等"
                v-model="ruleForm.housingDescription"
                style="width:7rem;"
              ></el-input>
            </el-form-item>
            <h4 id="sidebar4">房源图片</h4>
            <el-form-item label="上传图片" prop="houseImg">             
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
            <h4 id="sidebar5">联系信息</h4>
            <el-form-item label="联系人" required>
              <el-form-item prop="contacts" style="display: inline-block;">
                <el-input v-model="ruleForm.contacts" style="width:1.2rem"></el-input>
              </el-form-item>
              <el-form-item prop="contactssex" style="display: inline-block;padding-left:0.4rem;">
                <el-radio-group v-model="ruleForm.contactssex">
                  <el-radio label="先生">先生</el-radio>
                  <el-radio label="女士">女士</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <el-input style="width:2.4rem" v-model="ruleForm.contactNumber"></el-input>
            </el-form-item>
            <el-form-item label="房屋编号" v-show="false">
              <el-input style="width:2.4rem" v-model="ruleForm.houseNumber"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" class="submithouse">确定发布</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="sidebar">
          <div class="container">
            <ul>
              <li
                v-for="(item,index) in sidebarList"
                :key="index"
                @click="addClass(index)"
                :class="{sidebarli:index==current}"
              >
                <i :class="item.icon"></i>
                <a :href="item.href">{{item.title}}</a>
                <p></p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="publish_success">
      <div class="main_success">
        <p><i class="el-icon-success"></i><span>恭喜您，发布成功，您的房源已提交审核，请耐心等待...</span></p>
        <p><span>审核通过或审核不通过将会发送系统消息通知您，注意查看系统消息！</span></p>
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
      publishSuccess:false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now()
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
        houseNumber: "",
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
        subwayStationOptions: [],
      },
      rules: {
        housingType: [
          { required: true, message: "请选择房源类型", trigger: "change" }
        ],
        rentalMode: [
          { required: true, message: "请选择出租方式", trigger: "change" }
        ],
        communityName: [
          { required: true, message: "请选择小区名称", trigger: "change" }
        ],
        areaValue: [{ required: true, message: "请选择区域", trigger: "change" }],
        sqValue: [{ required: true, message: "请选择商圈", trigger: "change" }],
        cellAddress: [
          { required: true, message: "请选择小区地址", trigger: "change" }
        ],
        room: [
          { required: true, message: "请输入室数", trigger: "change" },
          { type: "number", message: "只能输入数字", trigger: "change" }
        ],
        hall: [
          { required: true, message: "请输入厅数", trigger: "change" },
          { type: "number", message: "只能输入数字", trigger: "change" }
        ],
        toilet: [
          { required: true, message: "请输入卫数", trigger: "change" },
          { type: "number", message: "只能输入数字", trigger: "change" }
        ],
        floorage: [
          { required: true, message: "请输入建筑面积", trigger: "change" }
        ],
        floor: [{ required: true, message: "请输入房屋楼层", trigger: "change" }],
        floorAll: [
          { required: true, message: "请输入总楼层", trigger: "change" }
        ],
        elevator: [
          { required: true, message: "请选择有无电梯", trigger: "change" }
        ],
        houseOrientation: [
          { required: true, message: "请选择房屋朝向", trigger: "change" }
        ],
        subwayLineValue: [
          { required: true, message: "请选择地铁线", trigger: "change" }
        ],
        subwayStationValue: [
          { required: true, message: "请选择地铁站", trigger: "change" }
        ],
        price: [{ required: true, message: "请输入月租金", trigger: "change" }],
        paymentMethod: [
          { required: true, message: "请选择付款方式", trigger: "change" }
        ],
        rentIncludes: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个租金包含的费用",
            trigger: "change"
          }
        ],
        checkInTime: [
          {
            type: "date",
            required: true,
            message: "请选择最早入住时间",
            trigger: "change"
          }
        ],
        number: [{ required: true, message: "请输入人数", trigger: "change" }],
        renovation: [
          { required: true, message: "请选择装修情况", trigger: "change" }
        ],
        configurationIncludes: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个房屋配置",
            trigger: "change"
          }
        ],
        rentalRequirements: [
          {
            required: true,
            message: "请选择出租要求",
            trigger: "change"
          }
        ],
        housingDescription: [
          { required: true, message: "请输入房屋描述", trigger: "change" },
          { max: 300, message: "不能多于三百字", trigger: "change" }
        ],
        houseImg: [
          { required: true, message: "请上传房源图片", trigger: "change" }
        ],
        contacts: [
          { required: true, message: "请输入联系人姓名", trigger: "change" }
        ],
        contactssex: [
          { required: true, message: "请选择联系人性别", trigger: "change" }
        ],
        contactNumber: [
          { required: true, message: "请输入联系电话", trigger: "change" },

          {
            pattern: /^1[34578]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "change"
          }
        ]
      }
    };
  },

  methods: {
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
      map.centerAndZoom(this.hancity, 11)
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
      if(this.ruleForm.subwayStationValue==""){
        this.ruleForm.subwayStationValue="5e00dcac305fc61478e80000"
      }
      var timestamp = new Date().getTime();
      this.ruleForm.houseNumber = this.abcity + timestamp;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http
            .post("/api/houses/publish", this.ruleForm)
            .then(response => {
              if (response.data.success) {
                this.publishSuccess=true
                this.$message({
                  type: "success",
                  message: "发布成功"
                });
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
    addClass: function(index) {
      this.current = index;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleRemove(file, fileList) {
      delete this.housePictures[file.response];
      this.ruleForm.houseImg = JSON.stringify(this.housePictures);
      if (this.ruleForm.houseImg == "{}") {
        this.ruleForm.houseImg = "";
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.response;
      this.dialogVisible = true;
    },
    handleSuccess(response, file, fileList) {
      console.log(this.housePictures)
      if (this.housePictures == "") {
        this.housePictures = { [response]: 1 };
      } else {
        this.housePictures = Object.assign(this.housePictures, {
          [response]: 0
        });
      }
      this.ruleForm.houseImg = JSON.stringify(this.housePictures);
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 10 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeHouseUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 10MB!');
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
        .get("api/citys/getSubwayStation", { params: {subwayLine: this.subwayLine_number } })
        .then(response => {
          this.ruleForm.subwayStationOptions = response.data.subwayStationList;
        })
        .catch(error => {
          console.log(error);
        });
    },
  },

  mounted() {
    this.restaurants = this.loadAll();
    this.choicePlot();
    this.getDistrict();
    this.getSq();
    this.getSubwayLine();
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
    },
  },
  watch: {
    $route(to, from) {
      this.getDistrict();
      // this.getSq();
    }
  }
};
</script>

<style scoped>
.publish {
  background-color: #f5f5f6;
}
.main {
  margin: 0 auto;
  width: 84%;
}
.publish_success{
  margin: 0rem auto;
  width: 84%;
  
}
.main_success{
background: white;
margin: 0.2rem 0;
display: inline-block;
width: 100%;
height: 6rem;
}
.main_success>p:nth-of-type(1){
  padding: 0.4rem 0.2rem;
}
.main_success>p:nth-of-type(1)>i{
  font-size: 0.26rem;
  color: #09ca03;
  padding: 0 0.1rem 0 0.1rem;
}
.main_success>p:nth-of-type(1)>span{
  font-size: 0.26rem;
}
.main_success>p:nth-of-type(2)>span{
  font-size: 0.18rem;
  padding-right: 0.2rem;
}
.main_success>p:nth-of-type(2){
  padding: 0 0.44rem;
}

.form_sidebar {
  display: flex;
}
.sidebar {
  position: sticky;
  top: 0.2rem;
  height: 3.5rem;
  margin-left: 0.2rem;
  background: #fff;
}
.sidebar .container ul {
  list-style-type: none;
}
.sidebar .container p {
  width: 0.01rem;
  height: 0.3rem;
  margin: 0.06rem 0 0.06rem 0.07rem;
  background-color: #dddddd;
}
.sidebar .container ul > li:nth-of-type(5) > p {
  display: none;
}
.sidebar .container ul li:first-child {
  padding-top: 0.4rem;
}
.sidebar .container ul li {
  padding: 0 0.48rem;
}
.sidebar .container ul a {
  text-decoration: none;
  color: #666;
}
.title {
  width: 100%;
  display: inline-block;
  margin: 0.2rem 0;
  background: #fff;
}
.title h1 {
  padding: 0.2rem 0.3rem;
  display: inline-block;
  font-weight: 500;
}
.title span {
  font-size: 0.14rem;
  color: red;
}
.sidebarli {
  color: #ff9024;
}
.sidebarli a {
  color: #ff9024 !important;
}
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
.house_form .submithouse {
  background-color: #ff9024;
  border: none;
  width: 2.6rem;
  font-size: 0.18rem;
  letter-spacing: 0.08rem;
  font-weight: bolder;
  margin: 0.8rem 2rem;
}
</style>