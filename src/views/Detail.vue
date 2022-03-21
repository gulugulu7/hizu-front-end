<template>
  <div class="detail" v-if="!loading">
    <div class="dialog_appointment">
      <el-dialog title="预约看房" :visible.sync="dialogFormVisible" width="30%">
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
          <el-form-item label="联系电话" :label-width="formLabelWidth">
            <el-input
              prefix-icon="el-icon-phone-outline"
              v-model="appointmentForm.appointmentPhone"
              style="width:90%"
              placeholder="请输入您的电话号码"
            >></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm(appointmentForm)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="dialog_report">
      <el-dialog title="举报" :visible.sync="dialogFormVisible1" width="40%">
        <el-form :model="reportForm">
          <el-form-item label="举报原因" :label-width="formLabelWidth">
            <el-radio-group v-model="reportForm.reason">
              <el-radio :label="1">房屋已出租</el-radio>
              <el-radio :label="2">价格虚假</el-radio>
              <el-radio :label="3">电话无法接通/号码错误</el-radio>
              <el-radio :label="4">房源不存在/地址虚假</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请您详细描述您的举报理由，以便工作人员更好的判断。"
              v-model="reportForm.remarks"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="submitForm1(reportForm)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="main">
      <div class="breadcrumb_search">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ name: 'Index', params: { city:this.$store.state.city}}">嗨租租房</el-breadcrumb-item>
            <el-breadcrumb-item
              :to="{ name: 'List', params: { city:this.$store.state.city,style:'area',aindex:'a0',bindex:'b0',cindex:'c0',dindex:'d0',eindex:'e0',findex:'f0',gindex:'g0',hindex:'h0',iindex:'i0'}}"
            >{{hanzicity}}租房</el-breadcrumb-item>
            <el-breadcrumb-item
              :to="{ name: 'List', params: { city:this.$store.state.city,style:'area',aindex:houseDetail.sq_value.district_id.district_number,bindex:'b0',cindex:'c0',dindex:'d0',eindex:'e0',findex:'f0',gindex:'g0',hindex:'h0',iindex:'i0'}}"
            >{{houseDetail.sq_value.district_id.district_name}}租房</el-breadcrumb-item>
            <el-breadcrumb-item>房源详情</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <nav-search></nav-search>
      </div>

      <div class="detail_mess">
        <div class="detail_basic_img">
          <div class="detail_img">
            <div class="big_img">
              <img :src="title_img" alt />
              <i class="el-icon-arrow-left" @click="zuohua"></i>
              <i class="el-icon-arrow-right" @click="youhua"></i>
            </div>
            <div class="img_card">
              <div class="containt">
                <div class="iconleft" @click="zuohua">
                  <i></i>
                </div>
                <ul ref="carousel" :style="{'left':calleft + 'px'}" class="containt_ul">
                  <li
                    v-for="(item,index) in houseImgUrl"
                    :key="index"
                    class="containt_ul_li"
                    :class="{opacity_img:index==img_ins}"
                    @click="opacityImg(index)"
                  >
                    <img :src="item" />
                  </li>
                </ul>
                <div class="iconright" @click="youhua">
                  <i></i>
                </div>
              </div>
            </div>
          </div>
          <div class="detail_basic">
            <h2>{{houseDetail.rental_mode}} · {{houseDetail.community_name}} · {{houseDetail.room}}居室</h2>
            <div class="time_cr">
              <div
                class="update_time"
              >更新时间：{{this.$moment(houseDetail.update_time).format("YYYY-MM-DD")}}</div>
              <ul>
                <li @click="addCollection()" v-if="thisCollection==false">
                  <i class="el-icon-star-off"></i>
                  <span>收藏</span>
                </li>
                <li @click="deleteCollection()" v-if="thisCollection==true">
                  <i class="el-icon-star-on" style="color:#ff9024"></i>
                  <span style="color:#ff9024">已收藏</span>
                </li>
                <li>
                  <i class="el-icon-document-delete"></i>
                  <span @click="dialogFormVisible1=true">举报</span>
                </li>
              </ul>
            </div>
            <div class="price-wrap">
              <span class="price">{{houseDetail.price}}</span>元/月
              <span class="unit">{{houseDetail.payment_method}}</span>
            </div>
            <ul class="er_list">
              <li class="f_fl">
                <span class="t">
                  户
                  <i class="space"></i>型：
                </span>
                <span
                  class="content"
                >{{houseDetail.room}}室{{houseDetail.hall}}厅{{houseDetail.toilet}}卫</span>
              </li>
              <li class="item f_fl">
                <span class="t">
                  面
                  <i class="space"></i>积：
                </span>
                <span
                  class="content"
                >{{houseDetail.rental_mode}}&nbsp;&nbsp;{{houseDetail.floorage}}㎡</span>
              </li>
              <li class="f_fl">
                <span class="t">
                  朝
                  <i class="space"></i>向：
                </span>
                <span class="content">{{houseDetail.house_orientation}}</span>
              </li>
              <li class="f_fl">
                <span class="t">
                  楼
                  <i class="space"></i>层：
                </span>
                <span class="content">{{houseDetail.floor}}层/共{{houseDetail.floor_all}}层</span>
              </li>
              <li class="f_fl">
                <span class="t">装修情况：</span>
                <span class="content">{{houseDetail.renovation}}</span>
              </li>
              <li class="f_fl">
                <span class="t">
                  电
                  <i class="space"></i>梯：
                </span>
                <span class="content">{{houseDetail.elevator?'有':'无'}}</span>
              </li>
            </ul>
            <ul class="er_list_two">
              <li class="f_fl">
                <span class="t2">小区名称：</span>
                <span class="content">
                  <span style="color:blue">{{houseDetail.community_name}}</span>
                  &nbsp;&nbsp;共{{cellNumber}}条租房帖
                </span>
              </li>
              <li class="f_fl">
                <span class="t">
                  地
                  <i class="space"></i>铁：
                </span>
                <span class="content" v-if="!houseDetail.subway_checked">暂无信息</span>
                <span
                  class="content"
                  v-else
                >{{houseDetail.subway_station_value.subwayLine_id.subwayLine_name}} - {{houseDetail.subway_station_value.subwayStation_name}}</span>
              </li>
              <li class="f_fl">
                <span class="t2">所在地址：</span>
                <span
                  class="content"
                >{{houseDetail.sq_value.district_id.district_name}} - {{houseDetail.sq_value.sq_name}} - {{houseDetail.cell_address}}</span>
              </li>
              <li class="f_fl">
                <span class="t">
                  编
                  <i class="space"></i>号：
                </span>
                <span class="content">{{houseDetail.house_number}}</span>
              </li>
            </ul>
            <div class="bottom">
              <div class="phone_order">
                <div
                  class="phone"
                  v-if="checkphone==false"
                  @click="checkphone=true"
                  style="cursor:pointer"
                >
                  <i class="el-icon-phone"></i>
                  <span style="font-weight:bold">点击查看电话</span>
                </div>
                <div class="phone" v-if="checkphone==true">
                  <span
                    style="font-weight:bold"
                  >{{houseDetail.contacts.substr(0,1)+houseDetail.contactssex}}&nbsp;&nbsp;{{houseDetail.contact_number}}</span>
                </div>
                <div
                  class="order"
                  style="cursor:pointer"
                  @click="dialogFormVisible=true"
                  v-if="checkAppointment=='false'"
                >
                  <i class="el-icon-s-home"></i>
                  <span style="font-weight:bold">预约看房</span>
                </div>
                <div
                  class="cancel"
                  style="cursor:pointer"
                  v-else-if="checkAppointment=='true'"
                  @click="userCancelAppointment()"
                >
                  <i class="el-icon-s-home"></i>
                  <span style="font-weight:bold">已预约</span>
                  <span style="font-weight:bold">取消预约</span>
                </div>
                <div v-else class="order">
                  <i class="el-icon-check"></i>
                  <span style="font-weight:bold">完成预约</span>
                </div>
              </div>
              <div class="warn_tips">
                <div class="title">
                  <i class="el-icon-message-solid"></i>
                  <p class="t_con">郑重提示</p>
                </div>
                <p class="content">在签订合同前，切勿支付任何费用，以免上当受骗</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="house_configuration">
        <h3>房屋配置</h3>
        <ul class="collocation">
          <li>
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('电视')"
                src="../assets/images/list/dianshiji.png"
              />
              <img v-else src="../assets/images/list/dianshiji_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('电视')?'text555':'textccc'"
            >电视</p>
          </li>
          <li>
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('空调')"
                src="../assets/images/list/kongtiao.png"
              />
              <img v-else src="../assets/images/list/kongtiao_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('空调')?'text555':'textccc'"
            >空调</p>
          </li>
          <li>
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('热水器')"
                src="../assets/images/list/reshuiqi.png"
              />
              <img v-else src="../assets/images/list/reshuiqi_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('热水器')?'text555':'textccc'"
            >热水器</p>
          </li>
          <li>
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('洗衣机')"
                src="../assets/images/list/xiyiji.png"
              />
              <img v-else src="../assets/images/list/xiyiji_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('洗衣机')?'text555':'textccc'"
            >洗衣机</p>
          </li>
          <li>
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('冰箱')"
                src="../assets/images/list/bingxiang.png"
              />
              <img v-else src="../assets/images/list/bingxiang_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('冰箱')?'text555':'textccc'"
            >冰箱</p>
          </li>
          <li>
            <p></p>
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('床')"
                src="../assets/images/list/chuang.png"
              />
              <img v-else src="../assets/images/list/chuang_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('床')?'text555':'textccc'"
            >床</p>
          </li>
          <li>
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('沙发')"
                src="../assets/images/list/shafa.png"
              />
              <img v-else src="../assets/images/list/shafa_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('沙发')?'text555':'textccc'"
            >沙发</p>
          </li>
          <li>
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('衣柜')"
                src="../assets/images/list/yigui.png"
              />
              <img v-else src="../assets/images/list/yigui_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('衣柜')?'text555':'textccc'"
            >衣柜</p>
          </li>
          <li class="item dele">
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('暖气')"
                src="../assets/images/list/nuanqi.png"
              />
              <img v-else src="../assets/images/list/nuanqi_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('暖气')?'text555':'textccc'"
            >暖气</p>
          </li>
          <li>
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('宽带')"
                src="../assets/images/list/kuandai.png"
              />
              <img v-else src="../assets/images/list/kuandai_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('宽带')?'text555':'textccc'"
            >宽带</p>
          </li>
          <li class="item dele">
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('厨房')"
                src="../assets/images/list/kezuofan.png"
              />
              <img v-else src="../assets/images/list/kezuofan_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('厨房')?'text555':'textccc'"
            >厨房</p>
          </li>
          <li>
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('阳台')"
                src="../assets/images/list/yangtai.png"
              />
              <img v-else src="../assets/images/list/yangtai_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('阳台')?'text555':'textccc'"
            >阳台</p>
          </li>
          <li>
            <p>
              <img
                v-if="houseDetail.configuration_includes.includes('独立卫生间')"
                src="../assets/images/list/duliweishengjian.png"
              />
              <img v-else src="../assets/images/list/duliweishengjian_gray.png" />
            </p>
            <p
              class="text"
              :class="houseDetail.configuration_includes.includes('独立卫生间')?'text555':'textccc'"
            >独立卫生间</p>
          </li>
        </ul>
      </div>
      <div class="house_describe">
        <h3>房屋描述</h3>
        <div class="rent_includes">
          <span>租金包含：</span>
          <span v-for="(item,index) in houseDetail.rent_includes" :key="index">{{item}}、</span>
        </div>
        <div class="rent_includes">
          <span>出租要求：{{houseDetail.rental_requirements}}</span>
        </div>
        <div class="rent_includes">
          <span>最早入住：{{this.$moment(houseDetail.check_in_time).format("YYYY-MM-DD")}}</span>
        </div>
        <div class="rent_includes">
          <span>宜住人数：{{houseDetail.number}}人</span>
        </div>
        <div class="describe">{{houseDetail.housing_description}}</div>
      </div>
      <div class="map" :class="{padding_bottom_80:nearbyHouseLen==0}">
        <h3>地图</h3>
        <div class="display_map_tab">
          <div id="allmap"></div>
          <div class="map_tab">
            <el-tabs v-model="mapName" @tab-click="mapClick" type="border-card">
              <el-tab-pane label="地铁" name="地铁">
                <div class="r-result" id="r-result-0"></div>
              </el-tab-pane>
              <el-tab-pane label="公交" name="公交车站">
                <div class="r-result" id="r-result-1"></div>
              </el-tab-pane>
              <el-tab-pane label="美食" name="餐饮">
                <div class="r-result" id="r-result-2"></div>
              </el-tab-pane>
              <el-tab-pane label="购物" name="购物">
                <div class="r-result" id="r-result-3"></div>
              </el-tab-pane>
              <el-tab-pane label="银行" name="银行">
                <div class="r-result" id="r-result-4"></div>
              </el-tab-pane>
              <el-tab-pane label="医院" name="医院">
                <div class="r-result" id="r-result-5"></div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
      <div class="nearby_houses padding_bottom_80" v-if="nearbyHouseLen!=0">
        <h3>附近房源</h3>
        <div class="nearby_carousel">
          <el-carousel arrow="always" height="2.34rem" :autoplay="false" indicator-position="none">
            <el-carousel-item v-for="item in 4" :key="item">
              <div class="nearby_carousel_div">
                <router-link
                  v-for="(item,i) in nearbyHouseList"
                  :key="i"
                  :to="{name:'Detail', params: { houseid: item._id }}"
                >
                  <div class="nearby_carousel_data">
                    <div class="img">
                      <img :src="imgtitle(item.house_img)" alt />
                    </div>
                    <div class="nearby_carousel_data_info">
                      <p>{{houseDetail.rental_mode}} · {{item.community_name}} · {{item.room}}居室</p>
                      <p>{{houseDetail.price}}元/月</p>
                    </div>
                  </div>
                </router-link>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.dialog_report .el-radio {
  width: 40%;
  margin-top: 0.15rem;
}
.breadcrumb_search {
  width: 100%;
  padding: 0.24rem 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.breadcrumb_search .breadcrumb .el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  font-weight: 500;
  color: #66747f;
}
.breadcrumb_search
  .breadcrumb
  .el-breadcrumb__item:last-child
  .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  font-weight: 500;
  color: #66747f;
}
.breadcrumb_search .breadcrumb .el-breadcrumb__separator {
  margin: 0 0.05rem;
}

.map_tab .el-tabs--border-card {
  box-shadow: none;
}
.map_tab .r-result {
  height: 3.57rem;
}
.map_tab .el-tabs--border-card > .el-tabs__content {
  padding: 0;
}
.map_tab .r-result > div {
  border: none !important;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.map_tab .r-result > div > div:first-child {
  overflow: auto;
  height: 3.4rem;
}
.map_tab .r-result > div > div:nth-of-type(2) {
  margin: 0 !important;
  padding: 0 !important;
}
.map_tab .r-result li {
  padding: 0 !important;
}
.nearby_carousel .nearby_carousel_data .img {
  width: 2.5rem;
  height: 1.8rem;
}
.nearby_carousel .nearby_carousel_data img {
  width: 100%;
  height: 100%;
}
.nearby_carousel .nearby_carousel_data .nearby_carousel_data_info p {
  font-size: 0.16rem;
  color: #333;
  margin: 0.06rem 0;
}

.nearby_carousel .nearby_carousel_div {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
.nearby_carousel a {
  display: inline-block;
  text-decoration: none;
}
.nearby_carousel a:not(:first-child) {
  padding-left: 0.21rem;
}
.nearby_carousel a:hover p:first-child {
  color: #0000ee;
}

.nearby_carousel .el-carousel__arrow {
  background: none;
}
.nearby_carousel .el-carousel__arrow--left {
  width: 0.35rem;
  height: 0.67rem;
  background: url(../assets/images/index/index_prev_c.png) left center no-repeat;
  background-size: 0.35rem 0.67rem;
  display: none;
}
.nearby_carousel .el-carousel__arrow--right {
  width: 0.35rem;
  height: 0.67rem;
  background: url(../assets/images/index/index_next_c.png) left center no-repeat;
  background-size: 0.35rem 0.67rem;
  display: none;
}
.nearby_carousel .el-icon-arrow-left {
  display: none;
}
.nearby_carousel .el-icon-arrow-right {
  display: none;
}
.dialog_appointment .el-dialog__title {
  font-weight: bold;
  font-size: 0.2rem;
}
</style>

<style scoped>
.main {
  margin: 0 auto;
  width: 80%;
  padding-top: 0.1rem;
}

.detail_basic_img {
  display: flex;
}
.detail_img {
  flex: 1;
}
.detail_basic {
  padding-left: 0.3rem;
  flex: 1;
}
.detail_basic h2 {
  margin: 0;
  color: #333;
}
.detail_basic .time_cr {
  display: flex;
}
.detail_basic .time_cr .update_time {
  display: inline-block;
  flex: 1.8;
}
.detail_basic .time_cr ul {
  display: inline-block;
  list-style-type: none;
  flex: 1;
  padding-top: 0.11rem;
}
.detail_basic .time_cr ul > li {
  display: inline;
  color: #999999;
  font-size: 0.14rem;
  padding: 0 0.13rem;
  border-left: solid 0.01rem #e9e9e9;
  cursor: pointer;
}
.textccc {
  color: #cccccc;
}
.text555 {
  color: #555555;
}
.detail_basic .time_cr ul > li:first-child {
  border-left: none;
}

.big_img {
  width: 5.4rem;
  height: 3.5rem;
  position: relative;
}
.big_img:hover i {
  display: block;
}
.big_img i {
  font-size: 0.5rem;
  color: rgb(117, 117, 117);
  z-index: 99;
  position: absolute;
  cursor: pointer;
  display: none;
}
.big_img i:nth-of-type(1) {
  left: 0.1rem;
  top: 1.6rem;
}
.big_img i:nth-of-type(2) {
  right: 0.1rem;
  top: 1.6rem;
}
.big_img img {
  height: 100%;
  width: 100%;
}
.update_time {
  font-size: 0.12rem;
  color: #999;
  padding: 0.15rem 0;
}
.price-wrap {
  font-size: 0.14rem;
  color: #999;
}
.price-wrap .price {
  font-size: 0.3rem;
  color: #ff9024;
}
.price-wrap .unit {
  padding-left: 0.2rem;
  color: #555;
}
.er_list {
  padding: 0;
  margin: 0;
}
.er_list .f_fl {
  width: 49%;
  list-style: none;
  display: inline-block;
  color: #999;
  font-size: 0.14rem;
  padding-top: 0.1rem;
}
.er_list .f_fl .space {
  display: inline-block;
  width: 0.24rem;
}
.er_list .f_fl .content {
  color: #333;
  padding-left: 0.06rem;
}
.er_list_two {
  padding: 0;
  margin: 0;
}
.er_list_two .f_fl {
  list-style: none;
  color: #999;
  font-size: 0.14rem;
  padding-top: 0.1rem;
}
.er_list_two .f_fl .space {
  display: inline-block;
  width: 0.24rem;
}
.er_list_two .f_fl .content {
  color: #333;
  padding-left: 0.06rem;
}
.er_list_two .f_fl .content a {
  text-decoration: none;
}

.img_card {
  padding-top: 0.06rem;
}

.containt {
  position: relative;
  width: 100%;
  height: 0.8rem;
  overflow: hidden;
  box-sizing: border-box;
}

.containt::before,
.containt::after {
  width: 0.26rem;
  content: "";
  height: 100%;
  background-color: #7e7e7e;
  display: inline-block;
  position: absolute;
  top: 0;
  z-index: 100;
}
.containt::before {
  left: 0;
}
.containt::after {
  right: 0;
}

.containt ul {
  padding: 0;
  margin: 0;
  margin-left: 0.3rem;
  position: absolute;
  left: 0;
  cursor: pointer;
  list-style-type: none;
  white-space: nowrap;
  height: 0.8rem;
}
.containt ul li {
  position: relative;
  display: inline-block;
  width: 1.16rem;
  padding-right: 0.05rem;
  height: 100%;
}

.opacity_img img {
  opacity: 1 !important;
}

.containt img {
  width: 100%;
  height: 100%;
  opacity: 0.5;
}

.containt .iconleft,
.containt .iconright {
  z-index: 101;
}
.containt .containt_ul {
  transition: all ease-in-out 0.3s;
}

.containt .iconleft {
  position: absolute;
  top: 0.32rem;
  left: 0.075rem;
  width: 0.115rem;
  height: 0.21rem;
  background: url(../assets/images/index/left-arrow.png) no-repeat;
  background-size: 100%;
  cursor: pointer;
}

.containt .iconright {
  position: absolute;
  top: 0.32rem;
  right: 0.06rem;
  width: 0.115rem;
  height: 0.21rem;
  background: url(../assets/images/index/right-arrow.png) no-repeat;
  background-size: 100%;
  cursor: pointer;
}

.bottom {
  display: flex;
  margin-top: 0.16rem;
}
.warn_tips {
  flex: 1;
  width: 1.56rem;
  padding: 0.12rem;
  text-align: left;
  color: #666;
  font-size: 0.12rem;
  background: #f3f9e8;
}
.warn_tips .title {
  color: #555;
  font-size: 0.14rem;
  text-align: center;
}
.warn_tips .title p {
  padding: 0.06rem 0;
  margin: 0;
  display: inline-block;
}
.warn_tips .title i {
  display: inline-block;
  color: #ff9024;
}
.phone_order {
  flex: 2;
  margin-left: 0.1rem;
}
.phone_order div {
  width: 70%;
  text-align: center;
  padding: 0.1rem;
  color: #fff;
  background-color: #ff9024;
}
.phone_order .order {
  margin-top: 0.16rem;
}
.cancel {
  margin-top: 0.16rem;
}
.cancel > span:nth-of-type(2) {
  display: none;
}
.cancel:hover > span:nth-of-type(1) {
  display: none;
}
.cancel:hover > span:nth-of-type(2) {
  display: inline;
}
.house_configuration {
  color: #555;
}
.collocation {
  padding: 0;
}
.main h3 {
  padding: 0.4rem 0;
}
.collocation li {
  list-style-type: none;
  display: inline-block;
  padding-top: 0.16rem;
  width: 1rem;
  height: 1rem;
}
.collocation li p {
  margin: 0rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.collocation li .text {
  margin-top: 0.06rem;
  font-size: 0.14rem;
}
.house_describe {
  color: #555;
  white-space: pre-line;
  line-height: 0.28rem; 
}
.rent_includes {
  padding-bottom: 0.2rem;
  font-size: 0.14rem;
}
.describe{
font-size: 0.14rem;
}
.describe p {
  margin: 0;
}
.describe p span {
  line-height: 0.3rem;
}
.map {
  color: #555;
}
.map .display_map_tab {
  display: flex;
}

.map #allmap {
  flex: 2;
  height: 4rem;
}
.map .map_tab {
  flex: 1;
}

.nearby_houses {
  color: #555;
}
.padding_bottom_80 {
  padding-bottom: 0.8rem;
}
/* .nearby_houses h3 {
  position: relative;
}
.nearby_carousel {
  width: 12.4rem;
  position: absolute;
  left: 0.54rem;
} */
</style>


<script>
import BMap from "BMap";
import NavSearch from "@/components/NavSearch";

export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      appointmentForm: {
        appointmentDate: "",
        appointmentTime: "",
        appointmentPhone: "",
        houseId: "",
        houseOwnerId: "",
        appointmentUserId: ""
      },
      reportForm: {
        reason: "",
        Remarks: "",
        houseId: ""
      },
      checkAppointment: "false",
      loading: false,
      children: null,
      nextShow: {},
      mapName: "地铁",
      houseDetail: "",
      checkphone: false,
      houseImgUrl: [],
      calleft: 0,
      img_ins: 0,
      title_img: "",
      thisCollection: false,
      formLabelWidth: "0.8rem",
      cellNumber: new Number(),
      nearbyHouseList: [],
      nearbyHouseLen:new Number
    };
  },
  methods: {
    opacityImg(index) {
      this.img_ins = index;
      this.title_img = this.houseImgUrl[index];
    },
    getHouseDetail() {
      this.loading = true;
      let that = this;
      this.$http
        .get("api/houses/getHouseDetail", {
          params: {
            house_id: this.$route.params.houseid
          }
        })
        .then(response => {
          that.cellNumber = response.data.cellNumber;
          that.houseDetail = response.data.houseDetail[0];
          that.nearbyHouseList = response.data.nearbyHouseList;
          that.nearbyHouseLen=that.nearbyHouseList.length
          for (var i = 0; i < that.nearbyHouseList.length; i++) {
            that.nearbyHouseList[i].house_img = JSON.parse(
              that.nearbyHouseList[i].house_img
            );
          }
          that.houseDetail.house_img = JSON.parse(that.houseDetail.house_img);
          that.houseImgUrl = Object.keys(that.houseDetail.house_img);
          that.title_img = that.houseImgUrl[0];
          that.loading = false;
          if (window.sessionStorage.getItem("token")) {
            that.inspectionCollection();
            that.checkForAppointment();
          }

          setTimeout(() => {
            that.checkmap("r-result-0", "地铁");
          }, 1000);
        });
    },
    //点击按钮左移
    imgtitle(val) {
      let pos = Object.values(val).indexOf(1);
      return Object.keys(val)[pos];
    },
    zuohua() {
      var ulwidth = document.getElementsByClassName(" containt_ul ")[0];
      var liwidth = document.getElementsByClassName(" containt_ul_li ")[0];
      if (this.img_ins > this.houseImgUrl.length - 4) {
        this.opacityImg(this.img_ins - 1);
      } else {
        if (this.calleft >= 0) {
          this.calleft = -ulwidth.offsetWidth + 4 * liwidth.offsetWidth;
          this.opacityImg(this.houseImgUrl.length - 1);
        } else {
          this.calleft = this.calleft + liwidth.offsetWidth;

          this.opacityImg(this.img_ins - 1);
        }
      }
    },
    //点击按钮右移
    youhua() {
      var ulwidth = document.getElementsByClassName(" containt_ul ")[0];
      var liwidth = document.getElementsByClassName(" containt_ul_li ")[0];
      if (this.img_ins < 3) {
        this.opacityImg(this.img_ins + 1);
      } else {
        if (this.calleft > -ulwidth.offsetWidth + 5 * liwidth.offsetWidth) {
          this.calleft = this.calleft - liwidth.offsetWidth;
          this.opacityImg(this.img_ins + 1);
        } else {
          this.calleft = 0;
          this.opacityImg(0);
        }
      }
    },
    checkmap(PanelName, SearchName) {
      let community_name = this.houseDetail.community_name;
      let cell_address = this.houseDetail.cell_address;
      var map = new BMap.Map("allmap");
      var point = new BMap.Point(116.331398, 39.897445);
      var top_left_control = new BMap.ScaleControl({
        anchor: BMAP_ANCHOR_TOP_LEFT
      }); // 左上角，添加比例尺
      var top_left_navigation = new BMap.NavigationControl();
      map.addControl(top_left_control);
      map.addControl(top_left_navigation);
      map.centerAndZoom(point, 12);
      // 创建地址解析器实例
      var myGeo = new BMap.Geocoder();
      // 将地址解析结果显示在地图上,并调整地图视野
      myGeo.getPoint(
        community_name,
        function(point) {
          if (point) {
            point = point;
            map.centerAndZoom(point, 14);
            var marker = new BMap.Marker(point); // 创建标注
            map.addOverlay(marker); // 将标注添加到地图中
            var opts = {
              width: 200, // 信息窗口宽度
              height: 80, // 信息窗口高度
              title: community_name, // 信息窗口标题
              enableMessage: true, //设置允许信息窗发送短息
              message: ""
            };
            var infoWindow = new BMap.InfoWindow(cell_address, opts); // 创建信息窗口对象
            map.openInfoWindow(infoWindow, point);
            marker.addEventListener("click", function() {
              map.openInfoWindow(infoWindow, point); //开启信息窗口
            });

            var circle = new BMap.Circle(point, 2000, {
              fillColor: "cornflowerblue",
              strokeWeight: 1,
              fillOpacity: 0.3,
              strokeOpacity: 0.3
            });
            map.addOverlay(circle);
            var local = new BMap.LocalSearch(map, {
              renderOptions: { map: map, autoViewport: false }
            });
            var local = new BMap.LocalSearch(map, {
              renderOptions: {
                map: map,
                panel: PanelName,
                selectFirstResult: false,
                autoViewport: false
              }
            });
            local.searchNearby(SearchName, point, 2000);
          } else {
            alert("您选择地址没有解析到结果!");
          }
        },
        this.hanzicity
      );
    },
    totransit() {
      console.log("totransit");
    },
    mapClick(tab, e) {
      console.log(tab);
      this.checkmap(`r-result-${tab.index}`, tab.label);
    },
    addCollection() {
      this.$http
        .get("api/users/addCollection", {
          params: {
            houseId: this.$route.params.houseid
          }
        })
        .then(response => {
          if (response.data.success == "true") {
            this.$message.success("收藏成功");
            this.inspectionCollection();
          } else {
            this.$message.warning("收藏失败");
          }
        });
    },
    inspectionCollection() {
      this.$http
        .get("api/users/inspectionCollection", {
          params: {
            houseId: this.$route.params.houseid
          }
        })
        .then(response => {
          this.thisCollection = response.data.thisCollection;
        });
    },
    deleteCollection() {
      this.$http
        .get("api/users/deleteCollection", {
          params: {
            houseId: this.$route.params.houseid
          }
        })
        .then(response => {
          this.inspectionCollection();
        });
    },
    submitForm(formName) {
      this.appointmentForm.houseId = this.houseDetail._id;
      this.appointmentForm.houseOwnerId = this.houseDetail.user_id._id;
      this.$http
        .post("api/appointments/userMakeAppointment", this.appointmentForm)
        .then(response => {
          if (response.data.success == "true") {
            this.$message.success("发起预约成功");
            this.dialogFormVisible = false;
            this.getHouseDetail();
            this.util.newMessage(
              "收到新的预约消息",
              "用户" +
                window.sessionStorage.getItem("username") +
                "发起预约看房，房屋编号为" +
                this.houseDetail.house_number +
                "，点击前往查看",
              this.houseDetail.user_id._id,
              "receiveappointment",
              2
            );
          }
        });
    },
    submitForm1(formName) {
      this.reportForm.houseId = this.houseDetail._id;
      this.$http
        .post("api/houses/reportHouse", this.reportForm)
        .then(response => {
          if (response.data.success == "true") {
            this.$message.success("举报成功");
            this.dialogFormVisible1 = false;
          }
        });
    },
    checkForAppointment() {
      this.$http
        .get("api/appointments/checkForAppointment", {
          params: {
            houseId: this.$route.params.houseid
          }
        })
        .then(response => {
          this.checkAppointment = response.data.checkAppointment;
        });
    },
    userCancelAppointment() {
      this.$confirm("是否取消预约?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http
            .get("api/appointments/userCancelAppointment", {
              params: {
                houseId: this.$route.params.houseid
              }
            })
            .then(response => {
              if (response.data.success == "true") {
                this.$message({
                  type: "success",
                  message: "已取消预约"
                });
                this.getHouseDetail();
                console.log(this.houseDetail);
                this.util.newMessage(
                  "收到取消预约消息",
                  "用户" +
                    window.sessionStorage.getItem("username") +
                    "取消了预约，房屋编号为" +
                    this.houseDetail.house_number,
                  this.houseDetail.user_id._id,
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
    }
  },
  mounted() {},
  created() {
    this.getHouseDetail();
  },
  computed: {
    hanzicity: function() {
      switch (this.$route.params.city) {
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
  components: {
    NavSearch
  }
};
</script>

