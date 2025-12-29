<template>
  <div class="w-full h-full bg-gray-100">
    <!-- 头部 -->
    <header class="header-primary">
      <el-button
          @click="router.back()"
          type="primary"
          :icon="ArrowLeft"
          size="large"
          circle
          class="!p-0 !w-8vw !h-8vw !bg-transparent !border-0 !shadow-none hover:!bg-blue-400"
      />
      <h1 class="text-4.5vw text-white font-bold">我的信息</h1>
      <div class="w-8vw"></div>
    </header>

    <!-- 用户信息 -->
    <div class="w-full mt-12vw px-3vw pb-16vw">
      <!-- 已登录状态 -->
      <div v-if="user" class="space-y-3vw">
        <!-- 用户信息卡片 -->
        <div class="bg-white rounded-2vw shadow-sm p-4vw">
          <div class="flex items-center mb-4vw">
            <div
                class="w-18vw h-18vw bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4vw">
              <el-icon size="10vw" color="white">
                <User/>
              </el-icon>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-4.5vw text-gray-800 font-bold truncate">{{ user.userName }}</h3>
              <p class="text-3.5vw text-gray-600 mt-1vw">
                {{ user.userId }} {{ sexFilter(user.userSex) }}
              </p>
            </div>
          </div>

          <div class="flex justify-around pt-4vw border-t border-gray-200">
            <div class="text-center">
              <p class="text-5vw text-blue-500 font-bold">{{ orderCount || 0 }}</p>
              <p class="text-3.2vw text-gray-600 mt-1vw">总订单</p>
            </div>
            <div class="text-center">
              <p class="text-5vw text-orange-500 font-bold">{{ unpaidOrderCount || 0 }}</p>
              <p class="text-3.2vw text-gray-600 mt-1vw">待支付</p>
            </div>
          </div>
        </div>

        <!-- 功能菜单 -->
        <div class="bg-white rounded-2vw shadow-sm overflow-hidden">
          <div
              @click="toOrderList"
              class="flex items-center justify-between p-4vw border-b border-gray-200 cursor-pointer hover:bg-gray-50"
          >
            <div class="flex items-center">
              <el-icon class="text-blue-500 mr-3vw" size="5vw">
                <Document/>
              </el-icon>
              <span class="text-4vw text-gray-800">我的订单</span>
            </div>
            <el-icon class="text-gray-400" size="4vw">
              <ArrowRight/>
            </el-icon>
          </div>

          <div
              @click="toAddressManagement"
              class="flex items-center justify-between p-4vw border-b border-gray-200 cursor-pointer hover:bg-gray-50"
          >
            <div class="flex items-center">
              <el-icon class="text-green-500 mr-3vw" size="5vw">
                <Location/>
              </el-icon>
              <span class="text-4vw text-gray-800">地址管理</span>
            </div>
            <el-icon class="text-gray-400" size="4vw">
              <ArrowRight/>
            </el-icon>
          </div>

          <div
              @click="logout"
              class="flex items-center justify-between p-4vw cursor-pointer hover:bg-gray-50"
          >
            <div class="flex items-center">
              <el-icon class="text-red-500 mr-3vw" size="5vw">
                <SwitchButton/>
              </el-icon>
              <span class="text-4vw text-gray-800">退出登录</span>
            </div>
            <el-icon class="text-gray-400" size="4vw">
              <ArrowRight/>
            </el-icon>
          </div>
        </div>
      </div>

      <!-- 未登录状态 -->
      <div v-else class="mt-10vw">
        <div class="bg-white rounded-2vw shadow-sm p-6vw text-center">
          <div class="w-25vw h-25vw bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4vw">
            <el-icon size="15vw" color="#909399">
              <User/>
            </el-icon>
          </div>
          <h3 class="text-4.5vw text-gray-800 font-bold mb-2vw">请登录</h3>
          <p class="text-3.5vw text-gray-600 mb-6vw">登录后查看个人信息和订单</p>
          <div class="flex justify-center">
            <el-button
                @click="toLogin"
                type="primary"
                size="large"
                class="w-full !h-12vw !text-4.5vw !font-bold !rounded-3vw !mb-4vw"
            >
              登录
            </el-button>
          </div>
          <div class="flex justify-center mt-4vw">
            <el-button
                @click="toRegister"
                type="primary"
                plain
                size="large"
                class="w-full !h-12vw !text-4.5vw !font-bold !rounded-3vw !border-gray-300"
            >
              去注册
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部菜单 -->
    <Footer/>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import {
  ArrowLeft,
  User,
  Document,
  Location,
  ArrowRight,
  SwitchButton
} from '@element-plus/icons-vue'
import request from '../utils/request'
import Footer from '../components/Footer.vue'

const router = useRouter()
const user = ref(null)
const orderCount = ref(0)
const unpaidOrderCount = ref(0)

// 从sessionStorage获取用户信息
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

// 性别过滤器
const sexFilter = (value) => {
  return value === 1 ? '先生' : '女士'
}

// 获取订单统计
const fetchOrderStats = async () => {
  if (!user.value) return

  try {
    const response = await request.post(
        'OrdersController/listOrdersByUserId',
        {userId: user.value.userId}
    )

    if (response && Array.isArray(response)) {
      orderCount.value = response.length
      unpaidOrderCount.value = response.filter(order => order.orderState === 0).length
    }
  } catch (error) {
    ElMessage.error('获取订单统计失败')
  }
}

// 跳转订单列表
const toOrderList = () => {
  router.push({path: '/orderList'})
}

// 跳转地址管理
const toAddressManagement = () => {
  router.push({path: '/userAddress'})
}

// 跳转登录页
const toLogin = () => {
  router.push({
    path: '/login',
    query: {redirect: '/profile'}
  })
}

// 跳转注册页
const toRegister = () => {
  router.push({
    path: '/register',
    query: {redirect: '/profile'}
  })
}

// 退出登录
const logout = async () => {
  try {
    await ElMessageBox.confirm(
        '确定要退出登录吗？',
        '退出登录',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
    )

    sessionStorage.removeItem('user')
    user.value = null
    ElMessage.success('已退出登录')
    router.push({path: '/index'})
  } catch (error) {
    // 用户取消退出
  }
}

onMounted(() => {
  user.value = getSessionStorage('user')
  if (user.value) {
    fetchOrderStats()
  }
})
</script>

<style scoped>
.header-primary {
  @apply w-full h-12vw bg-gradient-to-r from-blue-500 to-blue-600
  flex items-center justify-between px-4vw fixed top-0 left-0 z-1000 shadow-md;
}
</style>