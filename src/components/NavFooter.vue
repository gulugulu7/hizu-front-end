<template>
  <footer class="common_footer">
    <section class="flowLay">
      <div class="flowList">
        <div class="flowIcon01">
          <img src="../assets/images/index/flowBg01.png" />
          <span>挑选房屋</span>
        </div>
        <div class="flowIcon02">
          <img src="../assets/images/index/flowBg02.png" />
          <span>预定看房</span>
        </div>
        <div class="flowIcon03">
          <img src="../assets/images/index/flowBg03.png" />
          <span>了解入住须知</span>
        </div>
        <div class="flowIcon04">
          <img src="../assets/images/index/flowBg04.png" />
          <span>签约付款</span>
        </div>
        <div class="flowIcon05">
          <img src="../assets/images/index/flowBg05.png" />
          <span>开始入住</span>
        </div>
      </div>
    </section>
    <section class="common_width">
      <h3>站点导航</h3>
      <div class="nav_list">
        <!-- 按区域 -->
        <dl class="cf">
          <dt>按区域：</dt>
          <dd v-for="(item,index) in districtList" :key="index">
            <router-link
              :to="{ name: 'List', params: { city:city,style:'area',aindex:item.district_url,bindex:'b0',cindex:'c0',dindex:'d0',eindex:'e0',findex:'f0',gindex:'g0',hindex:'h0',iindex:'i0'}}"
            >{{item.district_name}}</router-link>
          </dd>
        </dl>
        <!-- 按地铁 -->
        <dl class="cf">
          <dt>按地铁：</dt>

          <dd v-for="(item,index) in subwayLineList" :key="index">
            <router-link
              :to="{ name: 'List', params: { city:city,style:'subway',aindex:item.subwayLine_url,bindex:'b0',cindex:'c0',dindex:'d0',eindex:'e0',findex:'f0',gindex:'g0',hindex:'h0',iindex:'i0'}}"
            >{{item.subwayLine_name}}</router-link>
          </dd>
        </dl>
        <!-- 按类型 -->
        <dl class="cf">
          <dt>按类型：</dt>
          <dd>
            <router-link
              :to="{ name: 'List', params: { city:this.$store.state.city,style:'area',aindex:'a0',bindex:'b0',cindex:'c1',dindex:'d0',eindex:'e0',findex:'f0',gindex:'g0',hindex:'h0',iindex:'i0'}}"
            >{{hanzicity}}整租</router-link>
          </dd>
          <dd>
            <router-link
              :to="{ name: 'List', params: { city:this.$store.state.city,style:'area',aindex:'a0',bindex:'b0',cindex:'c2',dindex:'d0',eindex:'e0',findex:'f0',gindex:'g0',hindex:'h0',iindex:'i0'}}"
            >{{hanzicity}}合租</router-link>
          </dd>
        </dl>
        <!-- 按城市 -->
        <dl class="cf">
          <dt>按城市：</dt>
          <dd v-for="(item,index) in cityList" :key="index">
            <router-link :to="{ name: 'Index', params: { city:item.city_url}}">{{item.city_name}}租房</router-link>
          </dd>
        </dl>
      </div>
    </section>
  </footer>
</template>

<style scoped>
.common_footer {
  background: #fff;
  min-width: 12rem;
}
.flowLay {
  width: 100%;
  height: 1.7rem;
  overflow: hidden;
  background-color: #ff9024;
}
.flowList {
  width: 95%;
  height: 100%;
  margin: 0 1.3rem;
}
.flowList > div {
  float: left;
  width: 20%;
  padding-top: 0.4rem;
}
.flowList > div > span {
  padding-top: 0.2rem;
  color: #fff;
  font-size: 0.18rem;
  display: block;
  margin-left: -0.07rem;
}
.flowList .flowIcon03 span {
  margin-left: -0.23rem;
}
.flowList img {
  width: 0.57rem;
  height: 0.57rem;
}
.flowList .flowIcon01 {
  background: url(../assets/images/index/flowLine.png) no-repeat 0.64rem 0.68rem;
}
.flowList .flowIcon02 {
  background: url(../assets/images/index/flowLine.png) no-repeat 0.64rem 0.68rem;
}
.flowList .flowIcon03 {
  background: url(../assets/images/index/flowLine.png) no-repeat 0.64rem 0.68rem;
}
.flowList .flowIcon04 {
  background: url(../assets/images/index/flowLine.png) no-repeat 0.64rem 0.68rem;
}
.common_width {
  width: 12rem;
  margin: 0 auto;
}
.common_width * {
  margin: 0;
  padding: 0;
}
.common_footer a {
  text-decoration: none;
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
.common_footer h3 {
  font-size: 0.18rem;
  color: black;
  font-weight: normal;
  line-height: 1;
  padding: 0.3rem 0 0.2rem;
  border-bottom: 0.01rem dashed #3d424c;
}

.common_footer dl {
  padding-left: 0.6rem;
}

.common_footer dl dt {
  display: block;
  float: left;
  margin-left: -0.6rem;
  font-size: 0.12rem;
  color: black;
  line-height: 0.4rem;
}

.common_footer dl dd {
  display: block;
  float: left;
}

.common_footer dl dd a {
  padding-right: 0.12rem;
  display: block;
  color: #666c7f;
  font-size: 0.12rem;
  line-height: 0.4rem;
}

.common_footer dl dd a:hover {
  text-decoration: underline;
  color: #ff9024;
}

.common_footer .nav_list {
  padding-bottom: 0.3rem;
  border-bottom: 0.01rem solid #3d424c;
}

.footer_bottom_list {
  margin-left: -0.2rem;
}

.footer_bottom_list a {
  display: inline-block;
  /* float: left; */
  padding: 0 0.2rem;
  color: black;
  font-size: 0.16rem;
  line-height: 0.7rem;
  position: relative;
}

.footer_bottom {
  background: url(../assets/images/index/footer_bg.png) 7rem bottom no-repeat;
  position: relative;
}

.footer_bottom_list a:after {
  position: absolute;
  right: 0;
  top: 0.29rem;
  height: 0.12rem;
  width: 0.01rem;
  background: #3d424c;
  content: "";
}

.footer_bottom_list a:last-child:after {
  width: 0;
}

.footer_bottom_list a:hover {
  text-decoration: underline;
  color: #ff9024;
}
</style>

<script>
export default {
  data() {
    return {
      cityList: [],
      districtList: [],
      subwayLineList: [],
      city: this.$store.state.city
    };
  },
  methods: {
    getCity() {
      this.cityList = [];
      this.util
        .getCity()
        .then(response => {
          var cityList = response;
          for (var i = 0; i < cityList.length; i++) {
            var addcity = {};
            Object.assign(
              addcity,
              { city_name: cityList[i].city_name },
              { city_url: cityList[i].city_number }
            );
            this.cityList.push(addcity);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDistrict() {
      this.districtList = [];
      this.$http
        .get("api/citys/getDistrict", {
          params: {
            city: this.$route.params.city
          }
        })
        .then(response => {
          var districtList = response.data.districtList;
          for (var i = 0; i < districtList.length; i++) {
            var adddistrict = {};
            Object.assign(
              adddistrict,
              { district_name: districtList[i].district_name },
              { district_url: districtList[i].district_number }
            );
            this.districtList.push(adddistrict);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSubwayLine() {
      this.subwayLineList = [];
      this.$http
        .get("api/citys/getSubwayLine", {
          params: {
            city: this.$route.params.city
          }
        })
        .then(response => {
          var subwayLineList = response.data.subwayLineList;
          for (var i = 0; i < subwayLineList.length; i++) {
            var addsubwayLine = {};
            Object.assign(
              addsubwayLine,
              { subwayLine_name: subwayLineList[i].subwayLine_name },
              { subwayLine_url: subwayLineList[i].subwayLine_number }
            );
            this.subwayLineList.push(addsubwayLine);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.getCity();
    this.getDistrict();
    this.getSubwayLine();
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
  watch: {
    $route(to, from) {
      if (to.params.city != from.params.city) {
        this.getCity();
        this.getDistrict();
        this.getSubwayLine();
      }
    }
  }
};
</script>>