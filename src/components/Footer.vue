<template>
  <ul class="footer">
    <li @click="toIndex" :class="{ 'active': isActive('/index') }">
      <el-icon class="footer-icon">
        <HomeFilled />
      </el-icon>
      <span class="footer-text">首页</span>
    </li>
    <li :class="{ 'active': isActive('/discover') }">
      <el-icon class="footer-icon">
        <Compass />
      </el-icon>
      <span class="footer-text">发现</span>
    </li>
    <li @click="toOrderList" :class="{ 'active': isActive('/orderList') }">
      <el-icon class="footer-icon">
        <Document />
      </el-icon>
      <span class="footer-text">订单</span>
    </li>
    <li @click="toProfile" :class="{ 'active': isActive('/profile') }">
      <el-icon class="footer-icon">
        <User />
      </el-icon>
      <span class="footer-text">我的</span>
    </li>
  </ul>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import {
  HomeFilled,
  Compass,
  Document,
  User
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isActive = (path) => {
  return route.path === path
}

const toIndex = () => {
  router.push({ path: '/index' })
}

const toOrderList = () => {
  router.push({ path: '/orderList' })
}

const toProfile = () => {
  router.push({ path: '/profile' })
}
</script>

<style scoped>
.footer {
  width: 100%;
  height: 14vw;
  border-top: 1px solid #DDD;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  user-select: none;
  cursor: pointer;
  flex: 1;
}

.footer li.active {
  color: #0097ff;
}

.footer li:hover {
  color: #0097ff;
}

.footer-icon {
  font-size: 5vw;
  margin-bottom: 1vw;
}

.footer-text {
  font-size: 2.8vw;
}
</style>