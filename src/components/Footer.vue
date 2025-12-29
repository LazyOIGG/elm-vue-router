<template>
  <ul class="w-full h-14vw border-t border-gray-300 bg-white fixed left-0 bottom-0 flex justify-around items-center p-0 m-0 list-none z-50">
    <li
      @click="toIndex"
      :class="['flex flex-col justify-center items-center cursor-pointer user-select-none flex-1', isActive('/index') ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500']"
    >
      <el-icon class="text-5vw mb-1vw">
        <HomeFilled />
      </el-icon>
      <span class="text-2.8vw">首页</span>
    </li>

    <li
      @click="toDiscover"
      :class="['flex flex-col justify-center items-center cursor-pointer user-select-none flex-1', isActive('/discover') ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500']"
    >
      <el-icon class="text-5vw mb-1vw">
        <Compass />
      </el-icon>
      <span class="text-2.8vw">发现</span>
    </li>

    <li
      @click="toOrderList"
      :class="['flex flex-col justify-center items-center cursor-pointer user-select-none flex-1', isActive('/orderList') ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500']"
    >
      <el-icon class="text-5vw mb-1vw">
        <Document />
      </el-icon>
      <span class="text-2.8vw">订单</span>
    </li>

    <li
      @click="toProfile"
      :class="['flex flex-col justify-center items-center cursor-pointer user-select-none flex-1', isActive('/profile') ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500']"
    >
      <el-icon class="text-5vw mb-1vw">
        <User />
      </el-icon>
      <span class="text-2.8vw">我的</span>
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

const toDiscover = () => {
  router.push({ path: '/discover' })
}

const toOrderList = () => {
  router.push({ path: '/orderList' })
}

const toProfile = () => {
  router.push({ path: '/profile' })
}
</script>