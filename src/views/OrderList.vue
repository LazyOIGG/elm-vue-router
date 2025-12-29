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
      <h1 class="text-4.5vw text-white font-bold">我的订单</h1>
      <div class="w-8vw"></div>
    </header>

    <!-- 订单列表 -->
    <div class="w-full mt-12vw px-3vw pb-16vw">
      <!-- 未支付订单 -->
      <div v-if="unpaidOrders.length > 0" class="mb-6vw">
        <div class="flex items-center mb-3vw">
          <el-icon class="text-orange-500 mr-2vw"><Clock /></el-icon>
          <h3 class="text-4vw font-bold text-gray-800">待支付订单</h3>
          <span class="ml-2vw px-2vw py-0.5vw bg-orange-100 text-orange-600 text-2.5vw rounded-full">
            {{ unpaidOrders.length }}
          </span>
        </div>

        <div class="space-y-3vw">
          <div
            v-for="item in unpaidOrders"
            :key="item.orderId"
            class="bg-white rounded-2vw shadow-sm border border-gray-100 overflow-hidden"
          >
            <!-- 订单头部 -->
            <div class="p-3vw border-b border-gray-200">
              <div class="flex justify-between items-center mb-2vw">
                <div class="flex items-center">
                  <el-icon class="text-blue-500 mr-2vw"><Shop /></el-icon>
                  <span class="text-4vw font-bold text-gray-800">{{ item.business.businessName }}</span>
                </div>
                <el-button
                  @click="goToPayment(item.orderId)"
                  type="primary"
                  size="small"
                  class="!px-3vw !py-1.5vw !text-3vw !rounded-2vw"
                >
                  去支付
                </el-button>
              </div>
              <div class="flex justify-between text-3.2vw text-gray-600">
                <span>订单号: {{ item.orderId }}</span>
                <span class="text-orange-500 font-bold">¥{{ item.orderTotal }}</span>
              </div>
            </div>

            <!-- 订单明细 -->
            <div v-show="item.isShowDetailet" class="p-3vw bg-gray-50">
              <div
                v-for="odItem in item.list"
                :key="odItem.food.foodId"
                class="flex justify-between items-center py-1.5vw border-b border-gray-200 last:border-0"
              >
                <span class="text-3.2vw text-gray-700">{{ odItem.food.foodName }} × {{ odItem.quantity }}</span>
                <span class="text-3.2vw text-gray-800 font-medium">¥{{ odItem.food.foodPrice * odItem.quantity }}</span>
              </div>
              <div class="flex justify-between items-center py-1.5vw">
                <span class="text-3.2vw text-gray-700">配送费</span>
                <span class="text-3.2vw text-gray-800 font-medium">¥{{ item.business.deliveryPrice }}</span>
              </div>
            </div>

            <!-- 展开/收起按钮 -->
            <div
              @click="toggleDetail(item)"
              class="flex justify-center items-center py-2vw bg-gray-50 border-t border-gray-200 cursor-pointer"
            >
              <el-icon class="text-gray-500" :class="{ 'rotate-180': item.isShowDetailet }">
                <ArrowDown />
              </el-icon>
              <span class="ml-1vw text-3vw text-gray-500">{{ item.isShowDetailet ? '收起明细' : '查看明细' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 已支付订单 -->
      <div v-if="paidOrders.length > 0">
        <div class="flex items-center mb-3vw">
          <el-icon class="text-green-500 mr-2vw"><CircleCheck /></el-icon>
          <h3 class="text-4vw font-bold text-gray-800">已完成订单</h3>
          <span class="ml-2vw px-2vw py-0.5vw bg-green-100 text-green-600 text-2.5vw rounded-full">
            {{ paidOrders.length }}
          </span>
        </div>

        <div class="space-y-3vw">
          <div
            v-for="item in paidOrders"
            :key="item.orderId"
            class="bg-white rounded-2vw shadow-sm border border-gray-100 overflow-hidden"
          >
            <!-- 订单头部 -->
            <div class="p-3vw border-b border-gray-200">
              <div class="flex justify-between items-center mb-2vw">
                <div class="flex items-center">
                  <el-icon class="text-green-500 mr-2vw"><Shop /></el-icon>
                  <span class="text-4vw font-bold text-gray-800">{{ item.business.businessName }}</span>
                </div>
                <span class="px-2vw py-0.5vw bg-green-100 text-green-600 text-2.8vw rounded-full">
                  已支付
                </span>
              </div>
              <div class="flex justify-between text-3.2vw text-gray-600">
                <span>订单号: {{ item.orderId }}</span>
                <span class="text-green-500 font-bold">¥{{ item.orderTotal }}</span>
              </div>
            </div>

            <!-- 订单明细 -->
            <div v-show="item.isShowDetailet" class="p-3vw bg-gray-50">
              <div
                v-for="odItem in item.list"
                :key="odItem.food.foodId"
                class="flex justify-between items-center py-1.5vw border-b border-gray-200 last:border-0"
              >
                <span class="text-3.2vw text-gray-700">{{ odItem.food.foodName }} × {{ odItem.quantity }}</span>
                <span class="text-3.2vw text-gray-800 font-medium">¥{{ odItem.food.foodPrice * odItem.quantity }}</span>
              </div>
              <div class="flex justify-between items-center py-1.5vw">
                <span class="text-3.2vw text-gray-700">配送费</span>
                <span class="text-3.2vw text-gray-800 font-medium">¥{{ item.business.deliveryPrice }}</span>
              </div>
            </div>

            <!-- 展开/收起按钮 -->
            <div
              @click="toggleDetail(item)"
              class="flex justify-center items-center py-2vw bg-gray-50 border-t border-gray-200 cursor-pointer"
            >
              <el-icon class="text-gray-500" :class="{ 'rotate-180': item.isShowDetailet }">
                <ArrowDown />
              </el-icon>
              <span class="ml-1vw text-3vw text-gray-500">{{ item.isShowDetailet ? '收起明细' : '查看明细' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="orderArr.length === 0" class="mt-20vw text-center">
        <el-icon size="20vw" color="#909399">
          <Document />
        </el-icon>
        <p class="text-4vw text-gray-500 mt-4vw">暂无订单</p>
      </div>
    </div>

    <!-- 底部菜单 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Shop,
  Clock,
  CircleCheck,
  ArrowDown,
  Document
} from '@element-plus/icons-vue'
import request from '../utils/request'
import Footer from '../components/Footer.vue'

const router = useRouter()
const orderArr = ref([])

// SessionStorage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

// 计算属性：未支付订单
const unpaidOrders = computed(() => {
  return orderArr.value.filter(item => item.orderState === 0)
})

// 计算属性：已支付订单
const paidOrders = computed(() => {
  return orderArr.value.filter(item => item.orderState === 1)
})

// 获取订单列表
const fetchOrders = async () => {
  const user = getSessionStorage('user')
  if (!user) return

  try {
    const response = await request.post(
      'OrdersController/listOrdersByUserId',
      { userId: user.userId }
    )
    const result = response.map(order => ({
      ...order,
      isShowDetailet: false
    }))
    orderArr.value = result
  } catch (error) {
    ElMessage.error('获取订单列表失败')
  }
}

// 切换订单明细显示
const toggleDetail = (order) => {
  order.isShowDetailet = !order.isShowDetailet
}

// 跳转到支付页面
const goToPayment = (orderId) => {
  router.push({
    path: '/payment',
    query: { orderId }
  })
}

onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.header-primary {
  @apply w-full h-12vw bg-gradient-to-r from-blue-500 to-blue-600
         flex items-center justify-between px-4vw fixed top-0 left-0 z-1000 shadow-md;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}
</style>