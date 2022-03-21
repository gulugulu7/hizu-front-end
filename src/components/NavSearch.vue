<template>
  <div class="nav_search">
    <el-autocomplete
      popper-class="my-autocomplete1"
      class="inline-input"
      v-model="searchForm.searchValue"
      :fetch-suggestions="querySearch"
      placeholder="请选择小区"
      :trigger-on-focus="false"
      @select="handleSelect"
      @input="choiceSearch"
    >
      <i slot="suffix" @click="handleIconClick"></i>
      <template slot-scope="{ item }">
        <div class="name">{{ item.value }}</div>
        <span class="addr">{{ item.address }}</span>
      </template>
      <el-button slot="append" icon="el-icon-search" @click="submitForm(searchForm)"></el-button>
    </el-autocomplete>
    <div id="l-map-search" style="display:none"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchForm: {
        searchValue: "",
        city: this.$route.params.city,
        pageNumberHouse: 1
      },
      restaurants: [],
      loadAllData: []
    };
  },
  mounted() {
    this.restaurants = this.loadAll();
    this.choiceSearch();
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
    submitForm(formName){
      this.$http.post('api/houses/searchCellList',this.searchForm).then(response=>{
        this.$emit('searchfun',response.data)     
      })
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

<style>
.nav_search .el-input__inner {
  border-right: none;
  height: 0.45rem;
  width: 4rem;
}
.nav_search .el-input-group__append {
  border-left: none;
  background-color: #fff;
}
.nav_search .el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: #dcdfe6;
  outline: 0;
}
.nav_search .el-input__inner:hover {
  border-color: #dcdfe6;
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