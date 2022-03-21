<template>
  <div>
    <div class="main">
      <section class="banner">
        <div class="drop_down_search">
          <div>
            <el-autocomplete
              popper-class="my-autocomplete1"
              class="input-with-select"
              v-model="searchForm.searchValue"
              :fetch-suggestions="querySearch"
              placeholder="请选择小区"
              :trigger-on-focus="false"
              @select="handleSelect"
              @input="choiceSearch"
            >
              <template slot-scope="{ item }">
                <div class="name">{{ item.value }}</div>
                <span class="addr">{{ item.address }}</span>
              </template>
              <el-select slot="prepend" v-model="searchForm.select">
                <el-option label="全部" value="1" class="renting-mode"></el-option>
                <el-option label="合租" value="2" class="renting-mode"></el-option>
                <el-option label="整租" value="3" class="renting-mode"></el-option>
                <el-option label="公寓" value="4" class="renting-mode"></el-option>
              </el-select>
              <el-button slot="append" icon="el-icon-search" @click="submitForm(searchForm)"></el-button>
            </el-autocomplete>
            <div id="l-map-search" style="display:none"></div>
          </div>
        </div>
      </section>
      <!-- <section class="nav">
        <ul class="nav_main">
          <li>
            <img src="../assets/images/index//wt.png" />
            <p>万套真房</p>
            <span>实拍照片、实地视频、真实价格</span>
          </li>
          <li>
            <img src="../assets/images/index//zj.png" />
            <p>租金优惠</p>
            <span>合作房源、高优惠、房租立减</span>
          </li>
          <li>
            <img src="../assets/images/index//qs.png" />
            <p>轻松约房</p>
            <span>直呼房东、客服帮约、全程免费</span>
          </li>
          <li>
            <img src="../assets/images/index//jh.png" />
            <p>聚合房源</p>
            <span>多渠道报价、房源信息一览无余</span>
          </li>
        </ul>
      </section> -->
 
      <section class="recommend">
        <div class="tab_menu">
          <div class="recomTit">精品房源推荐</div>
          <ul class="clearfix">
            <li :class="{on01:0==onindex}" @click="clickindex(0),getRecommendList(0)">热门推广</li>
            <li :class="{on01:1==onindex}" @click="clickindex(1),getRecommendList(1)">最新房源</li>
            <li :class="{on01:2==onindex}" @click="clickindex(2),getRecommendList(2)">收藏最多</li>
          </ul>
          <div>
            <a class="more" style="display: block;" @click="moreHouse()" v-if="onindex!=2">更多房源</a>
          </div>
        </div>
        <el-carousel indicator-position="none" height="3.5rem" trigger="click" arrow="always" v-if="recommend.length!=0">
          <el-carousel-item v-for="(items, indexs) in recommend" :key="indexs">
            <div style="width: 12rem;margin: 0 auto">
              <div class="common_house_model">
                <div class="house_zheng">
                  <router-link
                    v-for="(item,i) in items"
                    :key="i"
                    :to="{name:'Detail', params: { houseid: item._id }}"
                  >
                    <div class="img">
                      <img :src="imgtitle(item.house_img)" alt />
                    </div>
                    <p class="price">
                      <span>{{item.price}}</span>元/月
                    </p>
                    <p class="intro">
                      <span>{{item.rental_mode}}</span>
                      <i>·</i>
                      <span class="address">{{item.community_name}}</span>
                      <i>·</i>
                      <span>{{item.room}}居室</span>
                    </p>
                    <p class="label">
                      <span>{{item.payment_method}}</span>
                      <span>{{item.renovation}}</span>
                      <span>{{item.housing_type}}</span>
                    </p>
                  </router-link>
                </div>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
        <div v-else class="no_message">
            <img src="../assets/images/index/no_message.png" alt="">
            <p>该地区暂无房源</p>
            <span>我们每天都在更新房源，明天再来试试看吧~~~</span>
          </div>
      </section>

     <entrance></entrance>
      <carousel
        :houses="districtHouseList"
        :navtop="districtList"
        :navtopb="sqList"
        @changeNumber1="changeNumber1"
        @changeNumber3="changeNumber3"
      >
        <span slot="common_fl">区域找房</span>
      </carousel>

      <carousel
        :houses="subwayLineHouseList"
        :navtop="subwayLineList"
        :navtopb="subwayStationList"
        @changeNumber2="changeNumber2"
        @changeNumber4="changeNumber4"
      >
        <span slot="common_fl">地铁找房</span>
      </carousel>
    </div>
  </div>
</template>

<style>
.drop_down_search {
  font-size: 0.16rem;
  width: 52%;
  height: 0.6rem !important;
  margin-top: 3.2rem;
}
.drop_down_search .input-with-select {
  height: 0.6rem;
  width: 7rem;
}
.drop_down_search .el-input__inner {
  height: 0.6rem;
  font-size: 0.18rem;
  border-top: none;
  border-bottom: none;
  border-right: none;
}
.drop_down_search .el-input-group__prepend {
  border: none;
}

.drop_down_search .el-input > input:first-child::-webkit-input-placeholder {
  color: black;
  padding-left: 0.1rem;
}

.drop_down_search .el-select .el-input {
  width: 1rem;
  background-color: white;
  border-top-left-radius: 0.06rem;
  border-bottom-left-radius: 0.06rem;
}
.drop_down_search .el-input-group__append {
  border: none;
  background-color: #ff9024;
  border-top-right-radius: 0.06rem;
  border-bottom-right-radius: 0.06rem;
  text-align: center;
}
.drop_down_search .el-icon-search::before {
  content: "马上找房";
  color: white;
  font-size: 0.22rem;
}
.drop_down_search .el-input__inner {
  color: black !important;
  padding: 0 0.25rem;
}
.drop_down_search .el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: #dcdfe6;
}
.drop_down_search .el-input__inner:hover {
  border-color: #dcdfe6;
}

.recommend .el-carousel__arrow {
  background: none;
}
.recommend .el-carousel__arrow--left {
  width: 0.35rem;
  height: 0.67rem;
  background: url(../assets/images/index//index_prev_c.png) left center
    no-repeat;
  background-size: 0.35rem 0.67rem;
}
.recommend .el-carousel__arrow--right {
  width: 0.35rem;
  height: 0.67rem;
  background: url(../assets/images/index//index_next_c.png) left center
    no-repeat;
  background-size: 0.35rem 0.67rem;
}
.recommend .el-icon-arrow-left {
  display: none;
}
.recommend .el-icon-arrow-right {
  display: none;
}
.renting-mode.selected {
  color: #ff9024;
}
.renting-mode {
  font-size: 0.14rem;
  padding: 0 0.2rem;
}
</style>

<style scoped>
.main {
  width: 100%;
}
.banner {
  overflow: hidden;
  height: 4.46rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url("../assets/images/index//banner.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
.no_message{
  height:3.88rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.no_message img{
  margin-top: 0.9rem;
}
.no_message p{
      font-size: 0.3rem;
    color: #8998a0;
    margin-top: 0.2rem;
}
.no_message span{
    font-size: 0.18rem;
    color: #b8c1c7;
    margin-top: 0.2rem;
}
.nav {
  text-align: center;
  width: 95%;
  height: 2rem;
  margin: 0.56rem auto;
}
.nav .nav_main li {
  float: left;
  list-style: none;
  width: 25%;
}
.nav .nav_main li img {
  width: 1.11rem;
  height: 1rem;
}
.nav .nav_main li p {
  font-size: 0.22rem;
  line-height: 0.22rem;
  color: #2c3236;
  font-weight: bold;
  margin: 0.16rem auto;
}
.nav .nav_main li span {
  font-size: 0.14rem;
  line-height: 0.22rem;
  color: #8998a0;
}
.recommend {
  margin-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.recommend .recomTit {
  display: inline-block;
  background: url(../assets/images/index//house.png) no-repeat;
  background-size: 0.47rem 0.47rem;
  padding-left: 0.6rem;
  padding-right: 0.4rem;
  vertical-align: middle;
  font-size: 0.36rem;
  color: #282828;
}
.tab_menu {
  margin: 0 auto;
  width: 12rem;
  position: relative;
  padding: 0.24rem 0;
}

.tab_menu ul {
  list-style-type: none;
  display: inline-block;
  vertical-align: middle;
  max-width: 7.7rem;
}

.tab_menu li {
  float: left;
  padding: 0 0.15rem;
  height: 0.4rem;
  font-size: 0.18rem;
  line-height: 0.4rem;
  letter-spacing: 0rem;
  color: #666666;
  margin-right: 0.2rem;
  text-align: center;
  cursor: pointer;
}

.tab_menu li.on01 {
  background-color: #ff9024;
  border-radius: 0.05rem;
  color: #ffffff;
}

.tab_menu .more {
  position: absolute;
  top: 0.35rem;
  right: 0rem;
  width: 1rem;
  height: 0.18rem;
  background: url(../assets/images/index//index_next.png) right 0.19rem
    no-repeat;
  background-size: 0.08rem 0.14rem;
  background-position: 0.8rem 0.03rem;
  font-size: 0.18rem;
  line-height: 0.18rem;
  letter-spacing: 0rem;
  color: #ff9024;
  margin: 0;
  cursor: pointer;
  text-decoration: none;
}
.common_house_model {
  margin: 0 auto;
}

.common_house_model .house_zheng,
.common_house_model .house_he {
  width: 100%;
  max-height: 7.1rem;
  overflow: hidden;
  *zoom: 1;
  margin-bottom: 0.5rem;
}

.common_house_model .house_zheng:before,
.common_house_model .house_he:before,
.common_house_model .house_zheng:after,
.common_house_model .house_he:after {
  display: table;
  content: "";
  line-height: 0;
}

.common_house_model .house_zheng:after,
.common_house_model .house_he:after {
  clear: both;
}

.common_house_model .house_zheng a,
.common_house_model .house_he a {
  display: block;
  width: 2.85rem;
  float: left;
  margin-right: 0.2rem;
  overflow: hidden;
  position: relative;
  border-top-right-radius: 0.03rem;
  border-top-left-radius: 0.03rem;
  margin-bottom: 0.5rem;
}

.common_house_model .house_zheng a:nth-child(4n),
.common_house_model .house_he a:nth-child(4n) {
  margin: 0;
}

.common_house_model .house_zheng a.more_message,
.common_house_model .house_he a.more_message {
  height: 3.23rem;
  background: #ff9024;
  text-align: center;
  overflow: hidden;
}

.common_house_model .house_zheng a.more_message p,
.common_house_model .house_he a.more_message p {
  font-size: 0.22rem;
  color: #fff;
  line-height: 1.6;
  padding-top: 0.8rem;
}

.common_house_model .house_zheng a.more_message span,
.common_house_model .house_he a.more_message span {
  display: block;
  width: 1.4rem;
  height: 0.44rem;
  color: #fff;
  font-size: 0.18rem;
  border: 0.01rem solid #fff;
  line-height: 0.44rem;
  box-sizing: border-box;
  margin: 0.3rem auto;
  border-radius: 0.03rem;
}

.common_house_model .img {
  display: block;
  width: 95%;
  height: 2.1rem;
  position: relative;
  overflow: hidden;
  border-radius: 0.03rem;
}

.common_house_model .img img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  color: #2c3236;
  text-align: center;
}

.common_house_model .price {
  color: #ff9024;
  font-size: 0.14rem;
  line-height: 1;
  margin: 0.14rem 0;
}

.common_house_model .price span {
  font-size: 0.3rem;
  line-height: 1;
  display: inline-block;
  vertical-align: -0.02rem;
}

.common_house_model .intro {
  *zoom: 1;
  height: 0.2rem;
  overflow: hidden;
}

.common_house_model .intro:before,
.common_house_model .intro:after {
  display: table;
  content: "";
  line-height: 0;
}

.common_house_model .intro:after {
  clear: both;
}

.common_house_model .intro span {
  display: block;
  float: left;
  font-size: 0.18rem;
  line-height: 0.2rem;
  color: #2c3236;
}

.common_house_model .intro span.address {
  max-width: 1.5rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.common_house_model .intro i {
  display: block;
  float: left;
  height: 0.18rem;
  line-height: 0.16rem;
  font-size: 0.32rem;
  margin: 0 0.04rem;
  color: #2c3236;
  font-style: normal;
}

.common_house_model .label {
  *zoom: 1;
  margin-top: 0.14rem;
  width: 100%;
  overflow: hidden;
  height: 0.26rem;
}

.common_house_model .label:before,
.common_house_model .label:after {
  display: table;
  content: "";
  line-height: 0;
}

.common_house_model .label:after {
  clear: both;
}

.common_house_model .label span {
  float: left;
  height: 0.26rem;
  min-width: 0.66rem;
  padding: 0 0.05rem;
  box-sizing: border-box;
  border: 0.01rem solid #d9e3f3;
  border-radius: 0.03rem;
  margin-right: 0.1rem;
  text-align: center;
  font-size: 0.14rem;
  color: #8998a0;
  line-height: 0.24rem;
}

.common_house_model a {
  text-decoration: none;
}
.my-autocomplete1 li {
  line-height: normal;
  padding: 0.07rem;
}
.my-autocomplete1 .name {
  text-overflow: ellipsis;
  overflow: hidden;
}
.my-autocomplete1 .addr {
  font-size: 0.12rem;
  color: #b4b4b4;
}

.my-autocomplete1 .highlighted .addr {
  color: #ddd;
}
</style>

<script>
import Entrance from "@/components/Entrance";
import Carousel from "@/components/Carousel";

export default {
  data() {
    return {
      district_number: "",
      sq_number:"b0",
      subwayLine_number: "",
      subwayStation_number:"b0",
      searchForm: {
        select: "全部",
        searchValue: "",
        city: this.$route.params.city,
        pageNumberHouse: 1
      },
      input: "",
      districtHouseList: [],
      subwayLineHouseList: [],
      houses: [
        [
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "1居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "2居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "3居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "4居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "5居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "6居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "7居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "8居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          }
        ],
        [
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "9居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "10居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "11居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "12居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "13居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "14居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          },
          {
            url:
              "http://www.hizhu.com/guangzhou/roomDetail/2C90AC8D6DFD634B016E1A76A4E97514.html",
            imgurl:
              "https://imagecdn.hizhu.com/fang/01/66/01060113F7EEE849E81E6CBF604C1E647366.jpg?x-oss-process=style/w500",
            price: "1760",
            rentype: "合租",
            address: "骏景花园",
            room: "15居室",
            label1: "蛋壳公寓",
            label2: "付一押一",
            label3: "精装修"
          }
        ]
      ],
      districtList: [],
      sqList: [],
      subwayLineList: [],
      subwayStationList: [],
      recommend: [],
      restaurants: [],
      loadAllData: [],
      onindex: 0
    };
  },
  methods: {
    getDistrictHouseList() {
      function split_array(arr, len) {
        let arr_length = arr.length;
        let newArr = [];
        for (let i = 0; i < arr_length; i += len) {
          newArr.push(arr.slice(i, i + len));
        }
        return newArr;
      }
      this.$http
        .get("api/houses/getDistrictHouseList", {
          params: {
            city: this.$route.params.city,
            aindex: this.district_number,
            bindex:this.sq_number
          }
        })
        .then(response => {
          var districtHouseList=response.data.districtHouseList
         for (var i = 0; i < districtHouseList.length; i++) {
              districtHouseList[i].house_img = JSON.parse(districtHouseList[i].house_img);
            }
          this.districtHouseList = split_array(
            districtHouseList,
            8
          );
        });
    },
     getSubwayLineHouseList() {
      function split_array(arr, len) {
        let arr_length = arr.length;
        let newArr = [];
        for (let i = 0; i < arr_length; i += len) {
          newArr.push(arr.slice(i, i + len));
        }
        return newArr;
      }
      this.$http
        .get("api/houses/getSubwayLineHouseList", {
          params: {
            city: this.$route.params.city,
            aindex: this.subwayLine_number,
            bindex:this.subwayStation_number
          }
        })
        .then(response => {
          var subwayLineHouseList=response.data.subwayLineHouseList
         for (var i = 0; i < subwayLineHouseList.length; i++) {
              subwayLineHouseList[i].house_img = JSON.parse(subwayLineHouseList[i].house_img);
            }
          this.subwayLineHouseList = split_array(
            subwayLineHouseList,
            8
          );
          console.log(this.subwayLineHouseList);
        });
    },
    getDistrict() {
      this.$http
        .get("api/citys/getDistrict", {
          params: {
            city: this.$route.params.city
          }
        })
        .then(response => {
          this.districtList = response.data.districtList;
          this.district_number = response.data.districtList[0].district_number;
          this.getSq();
          this.getDistrictHouseList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSq() {
      this.$http
        .get("api/citys/getSq", {
          params: {
            district: this.district_number
          }
        })
        .then(response => {
          this.sqList = response.data.sqList;
        });
    },
    getSubwayLine() {
      this.$http
        .get("api/citys/getSubwayLine", {
          params: {
            city: this.$route.params.city
          }
        })
        .then(response => {
          this.subwayLineList = response.data.subwayLineList;
          this.subwayLine_number =
            response.data.subwayLineList[0].subwayLine_number;
          this.getSubwayStation();
          this.getSubwayLineHouseList()
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSubwayStation() {
      this.$http
        .get("api/citys/getSubwayStation", {
          params: {
            subwayLine: this.subwayLine_number
          }
        })
        .then(response => {
          this.subwayStationList = response.data.subwayStationList;
        });
    },
    changeNumber1(params) {
      this.district_number = params;
      this.getDistrictHouseList()
      this.getSq();
    },
    changeNumber2(params) {
      this.subwayLine_number = params;
      this.getSubwayStation();
      this.getSubwayLineHouseList()
    },
    changeNumber3(params) {
      this.sq_number = params; 
      this.getDistrictHouseList()
    },
    changeNumber4(params) {
      this.subwayStation_number = params;
      this.getSubwayLineHouseList()
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
    handleSelect(item) {
      console.log(item);
    },
    handleIconClick(ev) {
      console.log(ev);
    },
    choiceSearch() {
      var map = new BMap.Map("l-map-search");
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
      local.search(this.searchForm.searchValue);
    },
    loadAll() {
      return this.loadAllData;
    },
    submitForm(formName) {
      this.$router.push({
        name: "List",
        params: {
          style: "area",
          aindex: "a0",
          bindex: "b0",
          cindex: "c0",
          dindex: "d0",
          eindex: "e0",
          findex: "f0",
          gindex: "g0",
          hindex: "h0",
          iindex: "i0",
          searchForm: this.searchForm
        }
      });
    },
    clickindex(index) {
      this.onindex = index;
    },
    getRecommendList(index) {
      this.recommend = [];
      this.$http
        .get("api/houses/getRecommendList", {
          params: {
            city: this.$route.params.city,
            index: index
          }
        })
        .then(response => {
          function getRandomArrayElements(arr, count) {
            var shuffled = arr.slice(0),
              i = arr.length,
              min = i - count,
              temp,
              index;
            while (i-- > min) {
              index = Math.floor((i + 1) * Math.random());
              temp = shuffled[index];
              shuffled[index] = shuffled[i];
              shuffled[i] = temp;
            }
            return shuffled.slice(min);
          }
          function split_array(arr, len) {
            let arr_length = arr.length;
            let newArr = [];
            for (let i = 0; i < arr_length; i += len) {
              newArr.push(arr.slice(i, i + len));
            }
            return newArr;
          }
          if (index != 2) {
            if (response.data.recommendList.length > 8) {
              var firstList = getRandomArrayElements(
                response.data.recommendList,
                8
              );
            } else {
              var firstList = response.data.recommendList;
            }
            for (var i = 0; i < firstList.length; i++) {
              firstList[i].house_img = JSON.parse(firstList[i].house_img);
            }
            this.recommend = split_array(firstList, 4);
          } else {
            for (var i = 0; i < response.data.recommendList.length; i++) {
              this.recommend.push(response.data.recommendList[i].house_id);
              Object.assign(this.recommend[i], {
                collectionNumber: response.data.collectionNumber[i]
              });
            }
            for (var i = 0; i < this.recommend.length; i++) {
              this.recommend[i].house_img = JSON.parse(
                this.recommend[i].house_img
              );
            }
            function sortId(a, b) {
              return b.collectionNumber - a.collectionNumber;
            }
            this.recommend.sort(sortId);
            this.recommend = split_array(this.recommend, 4);
          }
        });
    },
    imgtitle(val) {
      let pos = Object.values(val).indexOf(1);
      return Object.keys(val)[pos];
    },
    moreHouse() {
      if (this.onindex == 0) {
        this.$router.push({
          name: "List",
          params: {
            city: this.$route.params.city,
            style: "area",
            aindex: "a0",
            bindex: "b0",
            cindex: "c0",
            dindex: "d0",
            eindex: "e0",
            findex: "f0",
            gindex: "g0",
            hindex: "h1",
            iindex: "i0"
          }
        });
      } else if (this.onindex == 1) {
        this.$router.push({
          name: "List",
          params: {
            city: this.$route.params.city,
            style: "area",
            aindex: "a0",
            bindex: "b0",
            cindex: "c0",
            dindex: "d0",
            eindex: "e0",
            findex: "f0",
            gindex: "g0",
            hindex: "h3",
            iindex: "i0"
          }
        });
      }
    }
  },
  mounted() {
    this.restaurants = this.loadAll();
    this.choiceSearch();
    this.getDistrict();
    this.getSubwayLine();
    this.getRecommendList(0);
  },
  components: {
    Entrance,
    Carousel
  },
  watch: {
    $route(to, from) {
      this.getDistrict();
      this.getSq();
      this.getSubwayLine();
      this.getSubwayStation();
      this.getRecommendList(0);
      this.getDistrictHouseList();
      this.getSubwayLineHouseList();
    }
  },
  computed: {
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
  }
};
</script>