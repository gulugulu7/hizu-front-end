<template>
  <div id="app">
    <nav-header></nav-header>
    <router-view />
    <nav-footer></nav-footer>
    <div class="backtop">
      <el-backtop></el-backtop>
    </div>
  </div>
</template>

<script>
import NavHeader from "@/components/NavHeader";
import NavFooter from "@/components/NavFooter";

export default {
  name: "App",
  components: {
    NavHeader,
    NavFooter
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-size: 0.16rem;
  font-family: "微软雅黑";
}
* {
  margin: 0;
  padding: 0;
}

.backtop .el-backtop {
  z-index: 500;
}

.backtop .el-backtop,
.el-calendar-table td.is-today {
  color: #ff9024;
}
</style>
