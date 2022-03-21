<template>
  <div class="user_content">
    <div class="user_content_title">
      <p class="select_title">收藏房源</p>
    </div>
    <div class="no_user_msg" v-if="collectionLen=='0'">
      <div class="no_msg_img"></div>
      <div class="no_msg_text">您还没有收藏哟~</div>
    </div>
    <div class="collection_data" v-else>
      <div v-for="(item,index) in collectionList" :key="index">
      <router-link
        :to="{name:'Detail', params: { houseid: item.house_id._id }}"
        class="list_data_a">
        <div class="list_data">
          <div class="list_data_img">
            <img :src="imgtitle(item.house_id.house_img)" alt />
          </div>
          <div class="list_data_content">
            <div
              class="data_content_title"
            >{{item.house_id.rental_mode}} · {{item.house_id.community_name}} · {{item.house_id.room}}居室</div>
            <div class="data_content_info">
              <span>{{item.house_id.room}}室{{item.house_id.hall}}厅{{item.house_id.toilet}}</span>
              <span class="divider">|</span>
              <span>{{item.house_id.floorage}}平米</span>
              <span class="divider">|</span>
              <span>{{item.house_id.house_orientation}}</span>
              <span class="divider">|</span>
              <span>{{item.house_id.floor}}/{{item.house_id.floor_all}}层</span>
            </div>
            <div
              class="data_content_address"
            >{{item.house_id.sq_value.district_id.district_name}}-{{item.house_id.sq_value.sq_name}}</div>
            <div class="data_content_tag">
              <el-tag type="danger" size="mini">{{item.house_id.payment_method}}</el-tag>
              <el-tag v-if="item.house_id.subway_checked==true" type="success" size="mini">近地铁</el-tag>
              <el-tag
                type="info"
                size="mini"
                v-if="item.house_id.configuration_includes.indexOf('独立卫生间')>-1"
              >独卫</el-tag>
              <el-tag
                type="warning"
                size="mini"
                v-if="item.house_id.configuration_includes.indexOf('厨房')>-1"
              >厨房</el-tag>
              <el-tag size="mini">{{item.house_id.renovation}}</el-tag>
            </div>
          </div>
          <div class="list_data_price">
            <span>{{item.house_id.price}}</span> 元/月
          </div>
        </div>        
      </router-link>
      <el-button class="cancel_collection" type="primary" plain  @click="deleteCollection(item.house_id._id)">取消收藏</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      collectionList: new Array(),
      collectionLen:'',
    };
  },
  methods: {
    getCollection() {
      this.$http.get("api/users/getCollection").then(response => {
        this.collectionList = response.data.collectionList;
        this.collectionLen=this.collectionList.length
        for (var i = 0; i < this.collectionLen; i++) {
          this.collectionList[i].house_id.house_img = JSON.parse(this.collectionList[i].house_id.house_img);
        }
      });
    },
      imgtitle(val) {
      let pos = Object.values(val).indexOf(1);
      return Object.keys(val)[pos];
    },
     deleteCollection(houseId){
      this.$http.get('api/users/deleteCollection',{
        params:{
          houseId:houseId
        }
      }).then(response=>{
         this.getCollection()
      })    
    },
  },
  mounted() {
    this.getCollection();
  }
};
</script>

<style scoped>
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
.list_data_a:hover~.cancel_collection{
  display: block;
}
.cancel_collection:hover{
  display: block;
}
.list_data {
  padding: 0.16rem 0;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 0.01rem dashed #e6e6e6;
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
  width: 5.6rem;
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
.collection_data:last-child{
  margin-bottom: 0.5rem;
}
.cancel_collection{
  position: absolute;
  margin-top: -1.6rem;
  margin-left: 8.2rem;
}
.cancel_collection{
  display: none;
}
</style>