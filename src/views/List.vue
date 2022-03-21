<template>
  <div class="area">
    <div class="main">
      <div class="breadcrumb_search">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ name: 'Index', params: { city:this.$store.state.city}}">嗨租租房</el-breadcrumb-item>
            <el-breadcrumb-item>
              <a href="/">{{hanzicity}}租房</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{choicemode}}租房</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <nav-search @searchfun="searchResult"></nav-search>
      </div>
      <div class="content">
        <div class="filter_tab">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane name="area_tabs">
              <span slot="label">
                <i class="el-icon-location"></i> 区域
              </span>
              <div class="panel_filter">
                <div class="filter_style">
                  <div class="filter_style_name">区域</div>
                  <div class="filter_style_options">
                    <span :class="{filter_active:0==a_ins}" @click="a_active(0),getHouseList(0)">
                      <router-link :to="{name:'List', params: { aindex: 'a0',bindex:'b0' }}">不限</router-link>
                    </span>
                    <span
                      v-for="(item,index) in districtList"
                      :key="index"
                      :class="{filter_active:index+1==a_ins}"
                      @click="a_active(index+1),push_tag('a_tag',item.district_name),getHouseList(0)"
                    >
                      <router-link
                        :to="{name:'List', params: { aindex: item.district_number,bindex:'b0' }}"
                      >{{item.district_name}}</router-link>
                    </span>
                    <div class="filter_style_options_children" v-if="this.isa!='a0'">
                      <span :class="{filter_active:0==b_ins}" @click="b_active(0),getHouseList(0)">
                        <router-link :to="{name:'List', params: { bindex:'b0' }}">不限</router-link>
                      </span>
                      <span v-for="(item1,index1) in letter" :key="index1">
                        <span style="color:#ff9024;font-weight:bold;padding-right: 0.1rem">{{item1}}</span>
                        <span
                          v-for="(item,index) in sqList"
                          :key="index"
                          :class="{filter_active:index+1==b_ins}"
                          @click="b_active(index+1),push_tag('b_tag',item.sq_name),getHouseList(0)"
                        >
                          <router-link
                            :to="{name:'List', params: { bindex:item.sq_number }}"
                            v-if="item.initial==item1"
                          >{{item.sq_name}}</router-link>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">方式</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in c_item"
                      :key="index"
                      :class="{filter_active:index==c_ins}"
                      @click="c_active(index),push_tag('c_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { cindex:'c'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">类型</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in d_item"
                      :key="index"
                      :class="{filter_active:index==d_ins}"
                      @click="d_active(index),push_tag('d_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { dindex:'d'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">户型</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in e_item"
                      :key="index"
                      :class="{filter_active:index==e_ins}"
                      @click="e_active(index),push_tag('e_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { eindex:'e'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">租金</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in f_item"
                      :key="index"
                      :class="{filter_active:index==f_ins}"
                      @click="f_active(index),push_tag('f_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { findex:'f'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">朝向</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in g_item"
                      :key="index"
                      :class="{filter_active:index==g_ins}"
                      @click="g_active(index),push_tag('g_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { gindex:'g'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">特色</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in h_item"
                      :key="index"
                      :class="{filter_active:index==h_ins}"
                      @click="h_active(index),push_tag('h_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { hindex:'h'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">更多</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in i_item"
                      :key="index"
                      :class="{filter_active:index==i_ins}"
                      @click="i_active(index),push_tag('i_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { iindex:'i'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane name="subway_tabs">
              <span slot="label">
                <i class="el-icon-s-platform"></i> 地铁
              </span>
              <div class="panel_filter">
                <div class="filter_style">
                  <div class="filter_style_name">区域</div>
                  <div class="filter_style_options">
                    <span :class="{filter_active:0==a_ins}" @click="a_active(0),getHouseList(0)">
                      <router-link
                        :to="{name:'List', params: { style:'subway',aindex: 'a0',bindex:'b0' }}"
                      >不限</router-link>
                    </span>
                    <span
                      v-for="(item,index) in subwayLineList"
                      :key="index"
                      :class="{filter_active:index+1==a_ins}"
                      @click="a_active(index+1),push_tag('a_tag',item.subwayLine_name),getHouseList(0)"
                    >
                      <router-link
                        :to="{name:'List', params: { aindex: item.subwayLine_number,bindex:'b0' }}"
                      >{{item.subwayLine_name}}</router-link>
                    </span>
                    <div class="filter_style_options_children" v-if="this.isa!='a0'">
                      <span :class="{filter_active:0==b_ins}" @click="b_active(0),getHouseList(0)">
                        <router-link :to="{name:'List', params: { bindex:'b0' }}">不限</router-link>
                      </span>
                      <span
                        v-for="(item,index) in subwayStationList"
                        :key="index"
                        :class="{filter_active:index+1==b_ins}"
                        @click="b_active(index+1),push_tag('b_tag',item.subwayStation_name),getHouseList(0)"
                      >
                        <router-link
                          :to="{name:'List', params: { bindex:item.subwayStation_number }}"
                        >{{item.subwayStation_name}}</router-link>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">方式</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in c_item"
                      :key="index"
                      :class="{filter_active:index==c_ins}"
                      @click="c_active(index),push_tag('c_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { cindex:'c'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">类型</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in d_item"
                      :key="index"
                      :class="{filter_active:index==d_ins}"
                      @click="d_active(index),push_tag('d_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { dindex:'d'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">户型</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in e_item"
                      :key="index"
                      :class="{filter_active:index==e_ins}"
                      @click="e_active(index),push_tag('e_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { eindex:'e'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">租金</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in f_item"
                      :key="index"
                      :class="{filter_active:index==f_ins}"
                      @click="f_active(index),push_tag('f_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { findex:'f'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">朝向</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in g_item"
                      :key="index"
                      :class="{filter_active:index==g_ins}"
                      @click="g_active(index),push_tag('g_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { gindex:'g'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">特色</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in h_item"
                      :key="index"
                      :class="{filter_active:index==h_ins}"
                      @click="h_active(index),push_tag('h_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { hindex:'h'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
                <div class="filter_style">
                  <div class="filter_style_name">更多</div>
                  <div class="filter_style_options">
                    <span
                      v-for="(item,index) in i_item"
                      :key="index"
                      :class="{filter_active:index==i_ins}"
                      @click="i_active(index),push_tag('i_tag',item.name),getHouseList(0)"
                    >
                      <router-link :to="{name:'List', params: { iindex:'i'+index }}">{{item.name}}</router-link>
                    </span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="filter_tag" v-if="tags.length!=0">
          <div>筛选条件</div>
          <div class="filter_el-tag">
            <el-tag v-for="tag in tags" :key="tag" closable @close="handleClose(tag)">{{tag}}</el-tag>
          </div>
          <div @click="emptyScreening(),getHouseList(0)">清空筛选</div>
        </div>
        <div class="list_sidebar">
          <div class="list_main">
            <div class="list_sort">
              <div class="sort_left">找到了{{totalCountHouse }}套房</div>
              <div class="sort_right">
                <span>排序：</span>
                <span @click="getHouseList(0)" :class="{sort_color:0==sortType}">默认</span>
                <span @click="getHouseList(1)" v-if="sortType!=1" :class="{sort_color:2==sortType}">
                  租金
                  <i class="el-icon-top"></i>
                </span>
                <span @click="getHouseList(2)" v-if="sortType==1" :class="{sort_color:1==sortType}">
                  租金
                  <i class="el-icon-bottom"></i>
                </span>
                <span @click="getHouseList(3)" v-if="sortType!=3" :class="{sort_color:4==sortType}">
                  面积
                  <i class="el-icon-top"></i>
                </span>
                <span @click="getHouseList(4)" v-if="sortType==3" :class="{sort_color:3==sortType}">
                  面积
                  <i class="el-icon-bottom"></i>
                </span>
              </div>
            </div>
            <div class="list_main_data" v-if="promotionHouse!=''&&houseList.length!=0">
              <router-link
                :to="{name:'Detail', params: { houseid: promotionHouse._id }}"
                class="list_data_a"
                v-if="promotionHouse!=''"
                style="position: relative;"
              >
                <div class="list_data">
                  <div class="advertisement">推广</div>
                  <div class="list_data_img">
                    <img :src="imgtitle(promotionHouse.house_img)" alt />
                  </div>
                  <div class="list_data_content">
                    <div
                      class="data_content_title"
                    >{{promotionHouse.rental_mode}} · {{promotionHouse.community_name}} · {{promotionHouse.room}}居室</div>
                    <div class="data_content_info">
                      <span>{{promotionHouse.room}}室{{promotionHouse.hall}}厅{{promotionHouse.toilet}}卫</span>
                      <span class="divider">|</span>
                      <span>{{promotionHouse.floorage}}平米</span>
                      <span class="divider">|</span>
                      <span>{{promotionHouse.house_orientation}}</span>
                      <span class="divider">|</span>
                      <span>{{promotionHouse.floor}}/{{promotionHouse.floor_all}}层</span>
                    </div>
                    <div
                      class="data_content_address"
                    >{{promotionHouse.sq_value.district_id.district_name}}-{{promotionHouse.sq_value.sq_name}}</div>
                    <div class="data_content_tag">
                      <el-tag type="danger" size="mini">{{promotionHouse.payment_method}}</el-tag>
                      <el-tag
                        v-if="promotionHouse.subway_checked==true"
                        type="success"
                        size="mini"
                      >近地铁</el-tag>
                      <el-tag
                        type="info"
                        size="mini"
                        v-if="promotionHouse.configuration_includes.indexOf('独立卫生间')>-1"
                      >独卫</el-tag>
                      <el-tag
                        type="warning"
                        size="mini"
                        v-if="promotionHouse.configuration_includes.indexOf('厨房')>-1"
                      >厨房</el-tag>
                      <el-tag size="mini">{{promotionHouse.renovation}}</el-tag>
                    </div>
                  </div>
                  <div class="list_data_price">
                    <span>{{promotionHouse.price}}</span> 元/月
                  </div>
                </div>
              </router-link>
            </div>
            <div class="list_main_data" v-if="houseList.length!=0">
              <router-link
                :to="{name:'Detail', params: { houseid: item._id }}"
                class="list_data_a"
                v-for="(item,index) in houseList"
                :key="index"
              >
                <div class="list_data">
                  <div class="list_data_img">
                    <img :src="imgtitle(item.house_img)" alt />
                  </div>
                  <div class="list_data_content">
                    <div
                      class="data_content_title"
                    >{{item.rental_mode}} · {{item.community_name}} · {{item.room}}居室</div>
                    <div class="data_content_info">
                      <span>{{item.room}}室{{item.hall}}厅{{item.toilet}}</span>
                      <span class="divider">|</span>
                      <span>{{item.floorage}}平米</span>
                      <span class="divider">|</span>
                      <span>{{item.house_orientation}}</span>
                      <span class="divider">|</span>
                      <span>{{item.floor}}/{{item.floor_all}}层</span>
                    </div>
                    <div
                      class="data_content_address"
                    >{{item.sq_value.district_id.district_name}}-{{item.sq_value.sq_name}}</div>
                    <div class="data_content_tag">
                      <el-tag type="danger" size="mini">{{item.payment_method}}</el-tag>
                      <el-tag v-if="item.subway_checked==true" type="success" size="mini">近地铁</el-tag>
                      <el-tag
                        type="info"
                        size="mini"
                        v-if="item.configuration_includes.indexOf('独立卫生间')>-1"
                      >独卫</el-tag>
                      <el-tag
                        type="warning"
                        size="mini"
                        v-if="item.configuration_includes.indexOf('厨房')>-1"
                      >厨房</el-tag>
                      <el-tag size="mini">{{item.renovation}}</el-tag>
                    </div>
                  </div>
                  <div class="list_data_price">
                    <span>{{item.price}}</span> 元/月
                  </div>
                </div>
              </router-link>
            </div>
            <div class="pagination" v-if="houseList.length!=0">
              <el-pagination
                layout="prev, pager, next "
                :total="totalCountHouse"
                background
                @current-change="handleHouseCurrentChange"
                :page-size="pageSizeHouse"
              ></el-pagination>
            </div>
            <div v-if="houseList.length==0" class="none_list" style="background:white">
              <img src="../assets/images/list/none.png" alt />
              <div>
                <p>找不到与您的搜索条件匹配的结果，但是调整您的搜索条件可能会有所帮助</p>
                <ul>
                  <li>删除一些筛选条件</li>
                  <li>调整您输入的关键词</li>
                  <li>请扩大您的搜索范围</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="sidebar" v-if="promotionHouse!=''&&houseList.length!=0">
            <h3>推广房源</h3>
            <div class="promotion_list">
              <router-link
                :to="{name:'Detail', params: { houseid: item._id }}"
                class="promotion_list_data_a"
                v-for="(item,index) in promotionList"
                :key="index"
              >
                <div class="promotion_list_data">
                  <img :src="imgtitle(item.house_img)" alt />
                  <div
                    class="promotion_data_content_title"
                  >{{item.rental_mode}} · {{item.community_name}}</div>
                  <div
                    class="promotion_data_content_info"
                  >{{item.sq_value.district_id.district_name}}/{{promotionHouse.room}}室{{promotionHouse.hall}}厅{{promotionHouse.toilet}}卫</div>
                  <div class="promotion_list_data_price">
                    <span>{{promotionHouse.price}}</span> 元/月
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
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
.breadcrumb_search .breadcrumb .el-breadcrumb__inner a:hover,
.el-breadcrumb__inner.is-link:hover {
  color: #ff9024;
}

.filter_tab .el-tabs__item {
  padding: 0 0.3rem;
  height: 0.5rem;
  line-height: 0.5rem;
  font-size: 0.16rem;
  font-weight: bold;
  letter-spacing: 0.02rem;
  color: #667580;
}
.filter_tab .el-tabs__item.is-active {
  color: #ff9024;
}
.filter_tab .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
  padding-left: 0.3rem;
}

.filter_tab .el-tabs__header {
  margin: 0;
}
.filter_tag {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 0.14rem;
  padding-top: 0.26rem;
}
.filter_tag div:nth-of-type(1) {
  color: #8f9ba5;
  padding-right: 0.3rem;
}
.filter_tag div:nth-of-type(2) {
  width: 86%;
}
.filter_el-tag .el-tag {
  margin-right: 0.2rem;
}
.filter_tag div:nth-of-type(3) {
  color: #ff9024;
  cursor: pointer;
}
</style>

<style scoped>
.advertisement {
  position: absolute;
  top: 1.4rem;
  left: 8rem;
  display: block;
  width: 0.4rem;
  font-size: 0.14rem;
}
.area {
  background: #f5f5f6;
  width: 100%;
}
.main {
  margin: 0 auto;
  width: 80%;
}
.content {
  width: 100%;
}
.filter_tab {
  background-color: #fff;
}
.filter_style {
  width: 96%;
  margin: 0 auto;
  border-bottom: solid 0.01rem #ebeef5;
  display: flex;
  font-size: 0.14rem;
}
.filter_style:last-child {
  border-bottom: none;
}
.filter_style_name {
  flex: 1;
  color: #8f9ba5;
  padding: 0.18rem 0.05rem 0 0;
}
.filter_style_options {
  flex: 20;
  padding-top: 0.18rem;
}
.filter_style_options a {
  color: #2c3236;
  display: inline-block;
  padding: 0 0.25rem 0.18rem 0;
  text-decoration: none;
}

.filter_style_options_children {
  border-top: solid 0.01rem #ebeef5;
  padding-top: 0.16rem;
}
.filter_style_options_children a {
  color: #5b6975;
}

.filter_active a {
  color: #ff9024;
}

.list_sidebar {
  display: flex;
  padding-bottom: 0.5rem;
}
.list_main {
  flex: 4;
  /* background-color: white; */
  margin-top: 0.3rem;
  min-height: 0.2rem;
}
.list_sort {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-size: 0.14rem;
  border-bottom: solid 0.01rem #e6e6e6;
  background-color: white;
}
.sort_left {
  padding: 0.2rem;
}
.sort_right {
  padding: 0.2rem;
}

.sort_right span {
  padding-right: 0.25rem;
  cursor: pointer;
}
.sort_right span:first-child {
  padding: 0;
}
.sort_right span:last-child {
  padding: 0;
}
.list_data_a {
  text-decoration: none;
}
.list_data_a:hover .list_data {
  background: #f9f9f9;
}
.list_data_a:hover .data_content_title {
  color: #ff9024;
  text-decoration: underline;
}
.list_data {
  padding: 0.16rem 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 0.01rem dashed #e6e6e6;
  background-color: white;
}
.list_data_img {
  width: 1.8rem;
  height: 1.4rem;
  padding-left: 0.2rem;
}
.list_data_img img {
  width: 100%;
  height: 100%;
}
.list_data_content {
  color: #797979;
  font-size: 0.14rem;
  padding-left: 0.22rem;
  width: 5.2rem;
}
.data_content_title {
  font-size: 0.16rem;
  color: rgb(53, 47, 47);
  font-weight: bolder;
}
.data_content_info {
  padding-top: 0.22rem;
}
.data_content_info .divider {
  padding: 0 0.05rem;
  height: 0.12rem;
  color: #cccccc;
  display: inline-block;
  overflow: hidden;
}
.data_content_address {
  padding-top: 0.15rem;
}
.data_content_tag {
  padding-top: 0.15rem;
}
.list_data_price {
  color: #ff9024;
  font-size: 0.14rem;
}
.list_data_price span {
  font-size: 0.22rem;
  font-weight: bolder;
}

.sidebar {
  flex:0.1;
  margin-top: 0.2rem;
  padding-left: 0.3rem;
}
.sidebar > h3 {
  padding-top: 0.26rem;
  padding-bottom: 0.26rem;
}
.promotion_list_data_a img {
  width: 1.8rem;
  height: 1.4rem;
}
.promotion_list_data_a {
  text-decoration: none;
}
.promotion_data_content_title {
  font-size: 0.16rem;
  color: black;
  padding-top: 0.1rem;
}
.promotion_list_data_price {
  color: #ff9024;
  font-size: 0.18rem;
  padding-bottom: 0.3rem;
}
.promotion_data_content_info {
  font-size: 0.16rem;
  padding: 0.04rem 0;
  color: #9399a5;
}
.pagination {
  text-align: right;
  background: #f5f5f6;
  padding: 0.2rem 0.1rem 0 0;
}
.none_list > img {
  margin: 0.24rem;
  display: inline-block;
}
.none_list > div {
  display: inline-block;
  vertical-align: top;
}
.none_list > div > p {
  font-size: 0.18rem;
  color: #5b6975;
  margin-top: 0.6rem;
}
.none_list > div > ul {
  font-size: 0.14rem;
  color: #35b9f1;
  margin-left: 0.2rem;
}
.none_list > div > ul > li {
  margin-top: 0.2rem;
}
.sort_color {
  color: #ff9024;
}
</style>

<script>
import NavSearch from "@/components/NavSearch";
import pinyin from "js-pinyin";

export default {
  data() {
    return {
      tags: [],
      objtags: {},
      city: window.sessionStorage.getItem("city"),
      restaurants: [],
      districtList: [],
      sqList: [],
      subwayLineList: [],
      subwayStationList: [],
      houseList: [],
      sortType: 0,
      pageNumberHouse: "1",
      pageSizeHouse: new Number(),
      totalCountHouse: new Number(),
      a_ins: this.$route.params.aindex.substr(1),
      b_ins: this.$route.params.bindex.substr(1),
      c_ins: this.$route.params.cindex.substr(1),
      d_ins: this.$route.params.dindex.substr(1),
      e_ins: this.$route.params.eindex.substr(1),
      f_ins: this.$route.params.findex.substr(1),
      g_ins: this.$route.params.gindex.substr(1),
      h_ins: this.$route.params.hindex.substr(1),
      i_ins: this.$route.params.iindex.substr(1),
      c_item: [{ name: "不限" }, { name: "整租" }, { name: "合租" }],
      d_item: [
        { name: "不限" },
        { name: "公寓" },
        { name: "小区" },
        { name: "别墅" }
      ],
      e_item: [
        { name: "不限" },
        { name: "一室" },
        { name: "二室" },
        { name: "三室" },
        { name: "四室以上" }
      ],
      f_item: [
        { name: "不限" },
        { name: "1000以下" },
        { name: "1000-2000" },
        { name: "2000-3000" },
        { name: "3000-4000" },
        { name: "4000-8000" },
        { name: "8000以上" }
      ],
      g_item: [
        { name: "不限" },
        { name: "朝东" },
        { name: "朝南" },
        { name: "朝西" },
        { name: "朝北" },
        { name: "南北" },
        { name: "东南" },
        { name: "东北" },
        { name: "西南" },
        { name: "西北" },
        { name: "东西" }
      ],
      h_item: [
        { name: "不限" },
        { name: "热门推广" },
        { name: "押一付一" },
        { name: "新上房源" }
      ],
      i_item: [
        { name: "不限" },
        { name: "近地铁" },
        { name: "厨房" },
        { name: "独立卫生间" }
      ],
      letter: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ],
      isa: this.$route.params.aindex,
      promotionList: [],
      promotionHouse: ""
    };
  },

  computed: {
    activeName: {
      get() {
        switch (this.$route.params.style) {
          case "area":
            return "area_tabs";
            break;
          case "subway":
            return "subway_tabs";
            break;
        }
      },
      set() {}
    },
    hanzicity: function() {
      switch (this.city) {
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
    choicemode: function() {
      switch (this.$route.params.style) {
        case "area":
          return "区域";
          break;
        case "subway":
          return "地铁";
          break;
      }
    }
  },
  methods: {
    imgtitle(val) {
      let pos = Object.values(val).indexOf(1);
      return Object.keys(val)[pos];
    },
    handleClick(tab) {
      if (tab.index == 0) {
        this.$router.push({
          name: "List",
          params: { style: "area", aindex: "a0", bindex: "b0" }
        });
      } else {
        this.$router.push({
          name: "List",
          params: { style: "subway", aindex: "a0", bindex: "b0" }
        });
      }
      this.emptyScreening();
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
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSq() {
      this.$http
        .get("api/citys/getSq", {
          params: {
            district: this.$route.params.aindex
          }
        })
        .then(response => {
          this.sqList = response.data.sqList;
          for (var i = 0; i < this.sqList.length; i++) {
            this.sqList[i]["initial"] = pinyin
              .getFullChars(this.sqList[i].sq_name)
              .substr(0, 1);
          }
          for (var a = 0; a < this.letter.length; a++) {
            var letter = 0;
            for (var b = 0; b < this.sqList.length; b++) {
              if (this.sqList[b].initial == this.letter[a]) {
                letter = letter + 1;
              }
            }
            if (letter == 0) {
              this.letter.splice(a, 1);
              a = a - 1;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    a_active(index) {
      this.a_ins = index;
    },
    b_active(index) {
      this.b_ins = index;
    },
    c_active(index) {
      this.c_ins = index;
    },
    d_active(index) {
      this.d_ins = index;
    },
    e_active(index) {
      this.e_ins = index;
    },
    f_active(index) {
      this.f_ins = index;
    },
    g_active(index) {
      this.g_ins = index;
    },
    h_active(index) {
      this.h_ins = index;
    },
    i_active(index) {
      this.i_ins = index;
    },
    push_tag(key, val) {
      var obj = { [key]: val };
      if (val != "不限") {
        this.objtags = Object.assign(this.objtags, obj);
        this.tags = Object.values(this.objtags);
      } else {
        delete this.objtags[key];
        this.tags = Object.values(this.objtags);
      }
    },
    handleClose(tag) {
      let pos = Object.keys(this.objtags)[
        Object.values(this.objtags).indexOf(tag)
      ];
      let index = pos.slice(0, 1);
      this[index + "_ins"] = 0;
      this.$router.push({
        name: "List",
        params: { [index + "index"]: index + "0" }
      });
      delete this.objtags[pos];
      this.tags = Object.values(this.objtags);
      this.getHouseList(0);
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
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSubwayStation() {
      this.$http
        .get("api/citys/getSubwayStation", {
          params: {
            subwayLine: this.$route.params.aindex
          }
        })
        .then(response => {
          this.subwayStationList = response.data.subwayStationList;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getHouseList(sortType) {
      this.sortType = sortType;
      this.$http
        .get("api/houses/getHouseList", {
          params: {
            city: this.$route.params.city,
            pageNumberHouse: this.pageNumberHouse,
            sortType: sortType,
            aindex: this.$route.params.aindex,
            bindex: this.$route.params.bindex,
            cindex: this.$route.params.cindex,
            dindex: this.$route.params.dindex,
            eindex: this.$route.params.eindex,
            findex: this.$route.params.findex,
            gindex: this.$route.params.gindex,
            hindex: this.$route.params.hindex,
            iindex: this.$route.params.iindex,
            style: this.$route.params.style
          }
        })
        .then(response => {
          this.houseList = response.data.houseList;
          this.totalCountHouse = response.data.totalCountHouse; //总数据条数
          this.pageSizeHouse = response.data.pageSizeHouse; //单页数据量
          for (var i = 0; i < this.houseList.length; i++) {
            this.houseList[i].house_img = JSON.parse(
              this.houseList[i].house_img
            );
          }
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
          var promotionHouseList = response.data.promotionHouseList;
          var promotionHouseLen = promotionHouseList.length;
          if (promotionHouseLen != 0) {
            for (var i = 0; i < promotionHouseList.length; i++) {
              promotionHouseList[i].house_img = JSON.parse(
                promotionHouseList[i].house_img
              );
            }
            this.promotionHouse =
              promotionHouseList[Math.floor(Math.random() * promotionHouseLen)];
            if(promotionHouseLen<3){
              this.promotionList = getRandomArrayElements(promotionHouseList, promotionHouseLen);
            }else{
              this.promotionList = getRandomArrayElements(promotionHouseList, 3);
            }
            
          }
        });
    },
    handleHouseCurrentChange(value) {
      this.pageNumberHouse = value;
      this.getHouseList(0);
    },
    imgtitle(val) {
      let pos = Object.values(val).indexOf(1);
      return Object.keys(val)[pos];
    },
    emptyScreening() {
      this.objtags = {};
      this.tags = [];
      this.$router.push({
        name: "List",
        params: {
          aindex: "a0",
          bindex: "b0",
          cindex: "c0",
          dindex: "d0",
          eindex: "e0",
          findex: "f0",
          gindex: "g0",
          hindex: "h0",
          iindex: "i0"
        }
      });
      this.a_ins = 0;
      this.b_ins = 0;
      this.c_ins = 0;
      this.d_ins = 0;
      this.e_ins = 0;
      this.f_ins = 0;
      this.g_ins = 0;
      this.h_ins = 0;
      this.i_ins = 0;
    },
    searchResult(data) {
      this.houseList = data.houseList;
      this.totalCountHouse = data.totalCountHouse; //总数据条数
      this.pageSizeHouse = data.pageSizeHouse; //单页数据量
      for (var i = 0; i < this.houseList.length; i++) {
        this.houseList[i].house_img = JSON.parse(this.houseList[i].house_img);
      }
      this.$forceUpdate();
    },
    searchResultIndex() {
      this.$http
        .post("api/houses/searchCellIndex", this.$route.params.searchForm)
        .then(response => {
          this.houseList = response.data.houseList;
          this.totalCountHouse = response.data.totalCountHouse; //总数据条数
          this.pageSizeHouse = response.data.pageSizeHouse; //单页数据量
          for (var i = 0; i < this.houseList.length; i++) {
            this.houseList[i].house_img = JSON.parse(
              this.houseList[i].house_img
            );
          }
          this.$forceUpdate();
        });
    }
  },
  mounted() {
    this.getDistrict();
    this.getSq();
    this.getSubwayLine();
    this.getSubwayStation();

    if (this.$route.params.searchForm) {
      this.searchResultIndex();
    } else {
      this.getHouseList(0);
    }
  },

  watch: {
    $route(to, from) {
      this.getDistrict();
      this.getSq();
      this.getSubwayLine();
      this.getSubwayStation();
      this.isa = to.params.aindex;
      this.a_ins = to.params.aindex.substr(1);
      this.b_ins = to.params.bindex.substr(1);
      this.c_ins = to.params.cindex.substr(1);
      this.d_ins = to.params.dindex.substr(1);
      this.e_ins = to.params.eindex.substr(1);
      this.f_ins = to.params.findex.substr(1);
      this.g_ins = to.params.gindex.substr(1);
      this.h_ins = to.params.hindex.substr(1);
      this.i_ins = to.params.iindex.substr(1);
      this.getHouseList(0);
      this.letter = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
      ];
    }
  },

  components: {
    NavSearch
  }
};
</script>