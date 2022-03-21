<template>
  <div class="nav-carousel">
    <section class="common_model">
      <section class="common_width">
        <!-- 头部导航栏信息 -->
        <div class="common_model_nav">
          <div class="common_model_nav_top cf">
            <h2 class="fl">
              <slot name="common_fl"></slot>
            </h2>
            <ul class="fl cf">
              <li
                v-for="(item,index) in navtop"
                :key="index"
                :class="{cur:index==cur_ins_a}"
                @click="changecura(index),changeNumbera(item.district_number),changeNumberb(item.subwayLine_number)"
              >
                <a v-if="item.district_name">{{item.district_name}}</a>
                <a v-else>{{item.subwayLine_name}}</a>
              </li>
            </ul>
            <router-link class="fr more" :to="{ name: 'List', params: { city:this.$store.state.city,style:'area',aindex:'a0',bindex:'b0',cindex:'c0',dindex:'d0',eindex:'e0',findex:'f0',gindex:'g0',hindex:'h0',iindex:'i0'}}">更多区域</router-link>
          </div>
          <div class="common_model_nav_b cf">
            <ol class="cf fl" id="js_parent">
              <li :class="{cur:0==cur_ins_b}" @click="changecurb(0),changeNumberc('b0'),changeNumberd('b0')">
                <a>全部</a>
              </li>
              <li
                v-for="(item,index) in navtopb"
                :key="index"
                :class="{cur:index+1==cur_ins_b}"
                @click="changecurb(index+1),changeNumberc(item.sq_number),changeNumberd(item.subwayStation_number)"
              >
                <a v-if="item.sq_name">{{item.sq_name}}</a>
                <a v-else>{{item.subwayStation_name}}</a>
              </li>
            </ol>
            <a class="fl more_mess">更多板块&gt;</a>
          </div>
        </div>
        <div class="outswiper" id="js_room_data">
          <div class="house_swiper_container" v-if="houses.length!=0">
            <el-carousel
              indicator-position="outside"
              height="7.3rem"
              trigger="click"
              :autoplay="false"
              arrow="always"
              :loop="false"
            >
              <el-carousel-item v-for="(items, indexs) in houses" :key="indexs">
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
          </div>
          <div v-else class="no_message">
            <img src="../assets/images/index/no_message.png" alt="">
            <p>该地区暂无房源</p>
            <span>我们每天都在更新房源，明天再来试试看吧~~~</span>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<style>
.outswiper .el-carousel__arrow {
  background: none;
}
.outswiper .el-carousel__arrow--left {
  width: 0.35rem;
  height: 0.67rem;
  background: url(../assets/images/index/index_prev_c.png) left center no-repeat;
  background-size: 0.35rem 0.67rem;
}
.outswiper .el-carousel__arrow--right {
  width: 0.35rem;
  height: 0.67rem;
  background: url(../assets/images/index/index_next_c.png) left center no-repeat;
  background-size: 0.35rem 0.67rem;
}
.outswiper .el-icon-arrow-left {
  display: none;
}
.outswiper .el-icon-arrow-right {
  display: none;
}
.outswiper .el-carousel__button {
  background-color: #ff9024;
}
</style>

<style scoped>
.no_message{
  height: 5rem;
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
.common_model * {
  margin: 0;
  padding: 0;
}
.common_model {
  margin: 0.8rem 0;
  overflow: hidden;
}

.common_width {
  width: 100%;
  margin: 0 auto;
}
.common_model_nav {
  width: 12rem;
  margin: 0 auto;
  margin-bottom: 0.5rem;
}
.common_model_nav_top {
  height: 0.5rem;
  border-bottom: 0.04rem solid #b8c1c7;
}

.common_model_nav_top h2 {
  font-size: 0.3rem;
  color: #2c3236;
  line-height: 0.5rem;
  margin-right: 0.45rem;
}
.common_model_nav_top .more {
  display: block;
  padding-right: 0.2rem;
  margin-right: 0.1rem;
  color: #ff9024;
  line-height: 0.5rem;
  background: url(../assets/images/index/index_next.png) right 0.19rem no-repeat;
  background-size: 0.08rem 0.13rem;
  text-decoration: none;
  cursor: pointer;
}

.common_model_nav_top .more:hover {
  text-decoration: underline;
}

.common_model_nav_top ul {
  width: 9rem;
  height: 0.54rem;
  overflow: hidden;
  list-style-type: none;
}

.common_model_nav_top li {
  float: left;
  line-height: 0.54rem;
  height: 0.54rem;
}

.common_model_nav_top li a {
  display: block;
  padding: 0 0.12rem;
  color: #2c3236;
  position: relative;
  text-decoration: none;
  cursor: pointer;
}

.common_model_nav_top li a:hover {
  color: #ff9024;
}

.common_model_nav_top li.cur a {
  color: #ff9024;
}

.common_model_nav_top li.cur a:after {
  content: "";
  position: absolute;
  z-index: 2;
  bottom: 0rem;
  left: 50%;
  transform: translate(-50%);
  height: 0.04rem;
  width: 0.4rem;
  background: #ff9024;
}

.common_model_nav_top li.cur a:before {
  content: "";
  position: absolute;
  z-index: 2;
  bottom: -0.04rem;
  left: 50%;
  width: 0.08rem;
  height: 0.08rem;
  background: #ff9024;
  transform: rotate(45deg) translate(-50%);
}
.cf {
  zoom: 1;
}

.cf:after {
  display: block;
  content: ".";
  clear: both;
  line-height: 0;
  visibility: hidden;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.common_model_nav_b {
  margin-top: 0.14rem;
}

.common_model_nav_b ol {
  margin-left: -0.07rem;
  max-width: 9.8rem;
  height: 0.16rem;
  line-height: 0.16rem;
  overflow: hidden;
  list-style-type: none;
}

.common_model_nav_b ol li {
  float: left;
}

.common_model_nav_b ol li a {
  display: block;
  padding: 0 0.07rem;
  color: #2c3236;
  font-size: 0.14rem;
  text-decoration: none;
  cursor: pointer;
}

.common_model_nav_b ol li a:hover {
  color: #ff9024;
}

.common_model_nav_b ol li.cur a {
  color: #ff9024;
}
.common_width a {
  text-decoration: none;
}

.common_model_nav_b .more_mess {
  display: block;
  color: #ff9024;
  font-size: 0.14rem;
  line-height: 0.16rem;
  padding-left: 0.1rem;
}

.common_model_nav_b .more_mess:hover {
  text-decoration: underline;
}
.outswiper {
  width: 100%;
  position: relative;
}

.house_swiper_container {
  position: static;
}

.house_swiper_container .swiper-pagination-bullet {
  background: #ccc;
}

.house_swiper_container .swiper-pagination-bullet-active {
  background: #ff9024;
  opacity: 1;
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

.common_house_model .house_zheng a.more_message .more_message_text,
.common_house_model .house_he a.more_message .more_message_text {
  width: 100%;
  height: 100%;
  background: url(../assets/images/index/more_bg.png) bottom center no-repeat;
  background-size: 2.85rem 0.92rem;
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
  display: block;
  width: 100%;
  height: 100%;
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
</style>
<script>
export default {
  data() {
    return {
      cur_ins_a: 0,
      cur_ins_b: 0
    };
  },
  props: {
    houses: {
      type: Array
    },
    navtop: {
      type: Array
    },
    navtopb: {
      type: Array
    }
  },
  methods: {
    changecura(index) {
      this.cur_ins_a = index;
    },
    changecurb(index) {
      this.cur_ins_b = index;
    },
    changeNumbera(number) {
      this.$emit("changeNumber1", number);
    },
    changeNumberb(number) {
      this.$emit("changeNumber2", number);
    },
    changeNumberc(number){
      this.$emit("changeNumber3", number);
    },
      changeNumberd(number){
      this.$emit("changeNumber4", number);
    },
    imgtitle(val) {
      let pos = Object.values(val).indexOf(1);
      return Object.keys(val)[pos];
    }
  }
};
</script>