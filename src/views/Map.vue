<template>
  <div>
    <div id="allmap1" v-if="district==''"></div>
    <div id="allmap2" v-else></div>
    <div class="main_mess" v-if="choiceCell!=''">
      <div class="mess_top">
        <div class="mess_top_a">
          <h3>{{choiceCell}}</h3>
          <span>共 <span class="houseNumber">{{houseNumber}}</span> 套可租房源</span>
        </div>
        <i class="el-icon-caret-top" @click="display=false" v-if="display==true"></i>
        <i class="el-icon-caret-bottom" @click="display=true" v-else></i>
      </div>
      <div class="mess_buttom" v-if="display==true">
        <router-link
          v-for="(item,index) in houseList"
          :key="index"
          :to="{name:'Detail', params: { houseid: item._id }}"
        >
          <div class="mess_data">
            <div class="mess_data_img">
              <img :src="imgtitle(item.house_img)" alt />
            </div>
            <div class="mess_data_content">
              <div
                class="mess_data_title"
              >{{item.rental_mode}} · {{item.community_name}} · {{item.room}}居室</div>
              <div
                class="mess_data_info"
              >{{item.floorage}}m² · {{item.house_orientation}} · {{item.floor}}/{{item.floor_all}}层</div>
              <div class="mess_data_price">{{item.price}}元/月</div>
              <div
                class="mess_data_add"
              >{{item.sq_value.district_id.district_name}}-{{item.sq_value.sq_name}}</div>
              <div class="data_content_tag">
                <el-tag type="info" size="mini">{{item.payment_method}}</el-tag>
                <el-tag type="info" size="mini">{{item.renovation}}</el-tag>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      district: "",
      display: true,
      houseList: [],
      choiceCell:"",
      houseNumber:Number
    };
  },
  methods: {
    map1() {
      const that = this;
      this.$http
        .get("api/citys/getDistrictHouse", {
          params: {
            city: this.$route.params.city
          }
        })
        .then(response => {
          var adds = response.data.districtList;
          for (var j = 0; j < adds.length; j++) {
            Object.assign(adds[j], {
              house_number: response.data.houseNumber[j]
            });
          }
          var map = new BMap.Map("allmap1", { enableMapClick: false });
          map.centerAndZoom(this.hanzicity, 12);
          // 百度地图API功能
          var point = new BMap.Point(116.404, 39.915);
          map.disableDoubleClickZoom();
          var top_left_control = new BMap.ScaleControl({
            anchor: BMAP_ANCHOR_TOP_LEFT
          }); // 左上角，添加比例尺
          var top_left_navigation = new BMap.NavigationControl();
          map.addControl(top_left_control);
          map.addControl(top_left_navigation);
          function districtAdd() {
            var myGeo = new BMap.Geocoder();
            for (var i = 0; i < adds.length; i++) {
              (function(i) {
                return myGeo.getPoint(
                  adds[i].district_name,
                  function(point) {
                    if (point) {
                      var circle = new BMap.Circle(point, 300, {
                        strokeColor: "#FF9800", //原型边框颜色
                        strokeWeight: 90,
                        strokeOpacity: 0.8,
                        fillColor: "#FF9800"
                      }); //创建圆
                      var opts = {
                        position: point, // 指定文本标注所在的地理位置
                        offset: new BMap.Size(-30, -30) //设置文本偏移量
                      };
                      var label = new BMap.Label(
                        adds[i].district_name +
                          "</br>" +
                          adds[i].house_number +
                          "套",
                        opts
                      ); // 创建文本标注对象
                      label.setStyle({
                        color: "#FFF",
                        backgroundColor: "transparent", //文本背景色
                        borderColor: "transparent", //文本框边框色
                        fontSize: "0.18rem",
                        lineHeight: "0.3rem",
                        fontFamily: "微软雅黑",
                        textAlign: "center"
                      }); //添加覆盖物
                      function add_overlay() {
                        map.addOverlay(circle); //增加圆
                        map.addOverlay(label); //增加圆
                      }
                      add_overlay();
                      label.addEventListener("mouseover", function() {
                        getBoundary(adds[i].district_name);
                      });
                      circle.addEventListener("click", function() {
                        thisDistrict(adds[i].district_name);
                      });
                    } else {
                      districtAdd();
                    }
                  },
                  that.hanzicity
                );
              })(i);
            }
          }
          districtAdd();
          //划区行政区
          function getBoundary(district) {
            map.clearOverlays();
            var bdary = new BMap.Boundary();
            bdary.get(district, function(rs) {
              //获取行政区域
              var count = rs.boundaries.length; //行政区域的点有多少个
              if (count === 0) {
                districtAdd();
                return;
              }
              for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {
                  strokeWeight: 2,
                  strokeColor: "#ff0000"
                }); //建立多边形覆盖物
                map.addOverlay(ply); //添加覆盖物
                districtAdd();
              }
            });
          }
          function thisDistrict(district) {
            that.district = district;
            that.map2();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    map2() {
      const that = this;
      this.$http
        .get("api/citys/getDistrictCell", {
          params: {
            district: this.district
          }
        })
        .then(response => {
          // 百度地图API功能
          var cellName = response.data.cellName;
          var cellNumber = response.data.cellNumber;
          var cells = [];
          for (var i = 0; i < cellName.length; i++) {
            var addcell = {};
            Object.assign(addcell, {
              cell_name: cellName[i]
            });
            Object.assign(addcell, {
              cell_number: cellNumber[i]
            });
            cells.push(addcell);
          }
          var mp = new BMap.Map("allmap2", { enableMapClick: false });
          mp.centerAndZoom(this.hanzicity + this.district, 14);
          mp.disableDoubleClickZoom();
          var top_left_control = new BMap.ScaleControl({
            anchor: BMAP_ANCHOR_TOP_LEFT
          }); // 左上角，添加比例尺
          var top_left_navigation = new BMap.NavigationControl();
          mp.addControl(top_left_control);
          mp.addControl(top_left_navigation);
          var point = new BMap.Point(116.404, 39.915);
          function cellAdd() {
            var myGeo = new BMap.Geocoder();
            function ComplexCustomOverlay(point, text) {
              this._point = point;
              this._text = text;
            }
            // 继承API的BMap.Overlay
            ComplexCustomOverlay.prototype = new BMap.Overlay();
            // 实现初始化方法
            ComplexCustomOverlay.prototype.initialize = function(map) {
              this._map = map;
              var div = (this._div = document.createElement("div"));
              div.style.position = "absolute";
              div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
              div.style.backgroundColor = "#ff9024";
              div.style.border = "0.01rem solid #ff9024";
              div.style.color = "white";
              div.style.borderRadius = "0.05rem";
              div.style.padding = "0.15rem 0.15rem";
              div.style.lineHeight = "0.18rem";
              div.style.whiteSpace = "nowrap";
              div.style.MozUserSelect = "none";
              div.style.fontSize = "0.22rem";
              var span = (this._span = document.createElement("span"));
              div.appendChild(span);
              span.appendChild(document.createTextNode(this._text));
              var that = this;
              var arrow = (this._arrow = document.createElement("div"));
              arrow.style.background = "url() no-repeat";
              arrow.style.position = "absolute";
              arrow.style.width = "0.11rem";
              arrow.style.height = "0.1rem";
              arrow.style.top = "0.22rem";
              arrow.style.left = "0.1rem";
              arrow.style.overflow = "hidden";
              div.appendChild(arrow);
              mp.getPanes().labelPane.appendChild(div);

              return div;
            };
            // 实现绘制方法
            ComplexCustomOverlay.prototype.draw = function() {
              var map = this._map;
              // 根据地理坐标转换为像素坐标，并设置给容器
              var pixel = map.pointToOverlayPixel(this._point);
              this._div.style.left =
                pixel.x - parseInt(this._arrow.style.left) + "px";
              this._div.style.top = pixel.y - 30 + "px";
            };
            //在调用聚合方法时会将会调用标注的getPosition方法
            //获取该覆盖物的位置
            ComplexCustomOverlay.prototype.getPosition = function() {
              return this._point;
            };
            // 自定义覆盖物添加事件方法
            ComplexCustomOverlay.prototype.addEventListener = function(
              event,
              fun
            ) {
              this._div["on" + event] = fun;
            };
            for (var i = 0; i < cells.length; i++) {
              (function(i) {
                return myGeo.getPoint(
                  cells[i].cell_name,
                  function(point) {
                    if (point) {
                      // 复杂的自定义覆盖物
                      var myCompOverlay = new ComplexCustomOverlay(
                        point,
                        cells[i].cell_name + " " + cells[i].cell_number + "套",
                        cells[i].cell_name
                      );
                      mp.addOverlay(myCompOverlay);
                      myCompOverlay.addEventListener("click", function() {
                        mapCellHouse(cells[i].cell_name);
                      });
                    } else {
                      cellAdd();
                    }
                  },
                  that.hanzicity
                );
              })(i);
            }
          }
          cellAdd();
          function mapCellHouse(cellName) {
            that.$http
              .get("api/houses/mapCellHouse", {
                params: {
                  cellName: cellName
                }
              })
              .then(response => {
                that.houseList = response.data.houseList;
                that.choiceCell=cellName
                that.houseNumber=that.houseList.length
                for (var i = 0; i < that.houseList.length; i++) {
                  that.houseList[i].house_img = JSON.parse(
                    that.houseList[i].house_img
                  );
                }
              });
          }
        });
    },
    imgtitle(val) {
      let pos = Object.values(val).indexOf(1);
      return Object.keys(val)[pos];
    },
  },
  mounted() {
    this.map1();
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
  }
};
</script>

<style scoped>
#allmap1 {
  height: 5.6rem;
  width: 100%;
}
#allmap2 {
  height: 5.6rem;
  width: 100%;
}
.main_mess {
  position: absolute;
  top: 1.2rem;
  left: 0.6rem;
  background-color: white;
  width: 4.3rem;
}
.mess_data {
  border-bottom: 0.01rem solid #e6e6e6;
}
.mess_top_a {
  display: inline-block;
  padding-bottom: 0.14rem;
}
.mess_top_a > h3 {
  color: #2c3236;
  padding: 0.2rem 0.14rem 0.1rem;
}
.mess_top_a > span {
  font-size: 0.14rem;
  padding-left: 0.14rem;
  color: #8998a0;
  padding-bottom: 0.2rem;
}
.mess_top > i {
  display: inline-block;
  vertical-align: top;
  margin-top: 0.3rem; 
  margin-left: 2.2rem;
  font-size: 0.22rem;
  color: #8998a0;
  cursor: pointer;
}
.mess_buttom {
  overflow: auto;
  height: 4rem;
}
.mess_buttom a {
  text-decoration: none;
}
.mess_data > .mess_data_img {
  width: 1.1rem;
  height: 1.1rem;
  display: inline-block;
  padding: 0.18rem 0.14rem;
}
.mess_data > .mess_data_img > img {
  width: 100%;
  height: 100%;
  border-radius: 0.05rem;
}
.mess_data_content {
  display: inline-block;
  vertical-align: top;
  color: #2c3236;
}
.mess_data_title {
  font-size: 0.2rem;
  font-weight: 600;
  padding-top: 0.18rem;
}
.mess_data_info {
  font-size: 0.14rem;
  display: inline-block;
  width: 1.6rem;
  padding: 0.1rem 0 0.06rem;
}
.mess_data_price {
  font-size: 0.18rem;
  display: inline-block;
  color: #ff9024;
  padding-right: 0.14rem;
}
.mess_data_add {
  font-size: 0.14rem;
  padding-bottom: 0.08rem;
}
.houseNumber{
  color: #ff9024;
}
</style>