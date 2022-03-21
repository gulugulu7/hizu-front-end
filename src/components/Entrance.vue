<template>
  <div class="entrance">
    <div class="containt">
      <div class="iconleft" @click="zuohua">
        <i></i>
      </div>
      <ul
        ref="carousel"
        :style="{'left':calleft + 'px'}"
        class="containt_ul"
        v-on:mouseover="stopmove()"
        v-on:mouseout="move()"
      >
        <li v-for="(item,index) in superurl" :key="index" class="containt_ul_li">
          <div class="shadow" @click="jump(item.urlindex)">{{item.shadowname}}</div>
          <img :src="item.img" />
        </li>
      </ul>
      <div class="iconright" @click="youhua">
        <i></i>
      </div>
    </div>
  </div>
</template>


<style scoped>
.containt {
  position: relative;
  width: 100%;
  height: 2.2rem;
  overflow: hidden;
  background: #ffaf62;
  box-sizing: border-box;
}

.containt::before,
.containt::after {
  width: 0.74rem;
  content: "";
  height: 100%;
  background-color: #ffaf62;
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
  margin-left: 0.74rem;
  position: absolute;
  left: 0;
  cursor: pointer;
  list-style-type: none;
  white-space: nowrap;
  background-color: #ffaf62;
  height: 2rem;
}

.containt ul li {
  position: relative;
  display: inline-block;
  width: 2.32rem;
  padding-right: 0.1rem;
  padding-top: 0.1rem;
  height: 100%;
}
.containt .shadow {
  display: none;
  position: absolute;
  top: 0.1rem;
  left: 0;
  width: 2.32rem;
  height: 2rem;
  background-color: rgba(0, 0, 0, 0.6);
  font-size: 0.26rem;
  letter-spacing: 0;
  color: #ffffff;
  text-align: center;
  line-height: 2rem;
}
.containt li:hover .shadow {
  display: block;
}
.containt img {
  width: 100%;
  height: 100%;
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
  top: 0.9rem;
  left: 0.15rem;
  width: 0.23rem;
  height: 0.42rem;
  background: url(../assets/images/index/left-arrow.png) no-repeat;
  background-size: 100%;
  cursor: pointer;
}

.containt .iconright {
  position: absolute;
  top: 0.9rem;
  right: 0.22rem;
  width: 0.23rem;
  height: 0.42rem;
  background: url(../assets/images/index/right-arrow.png) no-repeat;
  background-size: 100%;
  cursor: pointer;
}
</style>

<script>
export default {
  data() {
    return {
      children: null,
      nextShow: {},
      superurl: [
        {
          shadowname: "独卫",
          img: require("@/assets/images/index/en1.jpg"),
          urlindex: 1
        },
        {
          shadowname: "公寓",
          img: require("@/assets/images/index/en2.jpg"),
          urlindex: 2
        },
        {
          shadowname: "近地铁",
          img: require("@/assets/images/index/en3.jpg"),
          urlindex: 3
        },
        {
          shadowname: "整租",
          img: require("@/assets/images/index/en4.jpg"),
          urlindex: 4
        },
        {
          shadowname: "热门推广",
          img: require("@/assets/images/index/en5.jpg"),
          urlindex: 5
        },
        {
          shadowname: "独卫",
          img: require("@/assets/images/index/en1.jpg"),
          urlindex: 1
        },
        {
          shadowname: "公寓",
          img: require("@/assets/images/index/en2.jpg"),
          urlindex: 2
        },
        {
          shadowname: "近地铁",
          img: require("@/assets/images/index/en3.jpg"),
          urlindex: 3
        },
        {
          shadowname: "整租",
          img: require("@/assets/images/index/en4.jpg"),
          urlindex: 4
        },
        {
          shadowname: "热门推广",
          img: require("@/assets/images/index/en5.jpg"),
          urlindex: 5
        },
        {
          shadowname: "独卫",
          img: require("@/assets/images/index/en1.jpg"),
          urlindex: 1
        },
        {
          shadowname: "公寓",
          img: require("@/assets/images/index/en2.jpg"),
          urlindex: 2
        },
        {
          shadowname: "近地铁",
          img: require("@/assets/images/index/en3.jpg"),
          urlindex: 3
        },
        {
          shadowname: "整租",
          img: require("@/assets/images/index/en4.jpg"),
          urlindex: 4
        },
        {
          shadowname: "热门推广",
          img: require("@/assets/images/index/en5.jpg"),
          urlindex: 5
        }
      ],
      calleft: 0
    };
  },
  mounted() {
    this.move();
  },
  methods: {
    //移动
    move() {
      // this.timer = setInterval(this.starmove, 3000);
    },
    //开始移动
    starmove() {
      var ulwidth = document.getElementsByClassName(" containt_ul ")[0];
      var liwidth = document.getElementsByClassName(" containt_ul_li ")[0];
      if (this.calleft > -ulwidth.offsetWidth + 5 * liwidth.offsetWidth) {
        this.calleft = this.calleft - liwidth.offsetWidth;
      } else {
        this.calleft = 0;
      }
    },
    //鼠标悬停时停止移动
    stopmove() {
      clearInterval(this.timer);
    },
    //点击按钮左移
    zuohua() {
      var ulwidth = document.getElementsByClassName(" containt_ul ")[0];
      var liwidth = document.getElementsByClassName(" containt_ul_li ")[0];

      if (this.calleft >= 0) {
        this.calleft = -ulwidth.offsetWidth + 5 * liwidth.offsetWidth;
      } else {
        this.calleft = this.calleft + liwidth.offsetWidth;
      }
    },
    //点击按钮右移
    youhua() {
      var ulwidth = document.getElementsByClassName(" containt_ul ")[0];
      var liwidth = document.getElementsByClassName(" containt_ul_li ")[0];
      if (this.calleft > -ulwidth.offsetWidth + 5 * liwidth.offsetWidth) {
        this.calleft = this.calleft - liwidth.offsetWidth;
      } else {
        this.calleft = 0;
      }
      console.log("ulwidth", ulwidth.offsetWidth0);
      console.log("liwidth", liwidth.offsetWidth);
      console.log("calleft", this.calleft);
    },
    jump(urlindex) {
      if (urlindex == 1) {
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
            hindex: "h0",
            iindex: "i3"
          }
        });
      } else if (urlindex == 2) {
        this.$router.push({
          name: "List",
          params: {
            city: this.$route.params.city,
            style: "area",
            aindex: "a0",
            bindex: "b0",
            cindex: "c0",
            dindex: "d1",
            eindex: "e0",
            findex: "f0",
            gindex: "g0",
            hindex: "h0",
            iindex: "i0"
          }
        });
      } else if (urlindex == 3) {
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
            hindex: "h0",
            iindex: "i1"
          }
        });
      } else if (urlindex == 4) {
        this.$router.push({
          name: "List",
          params: {
            city: this.$route.params.city,
            style: "area",
            aindex: "a0",
            bindex: "b0",
            cindex: "c1",
            dindex: "d0",
            eindex: "e0",
            findex: "f0",
            gindex: "g0",
            hindex: "h0",
            iindex: "i0"
          }
        });
      } else if (urlindex == 5) {
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
      }
    }
  }
};
</script>

