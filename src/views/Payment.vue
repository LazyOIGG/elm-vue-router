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
      <h1 class="text-4.5vw text-white font-bold">在线支付</h1>
      <div class="w-8vw"></div>
    </header>

    <!-- 订单内容 -->
    <div class="w-full mt-12vw px-3vw pb-16vw">
      <!-- 订单信息 -->
      <div class="bg-white rounded-2vw shadow-sm overflow-hidden mb-3vw">
        <div
          @click="toggleDetail"
          class="p-3vw border-b border-gray-200 cursor-pointer flex justify-between items-center"
        >
          <div class="flex items-center">
            <el-icon class="text-blue-500 mr-2vw"><Document /></el-icon>
            <span class="text-4vw font-bold text-gray-800 truncate">{{ orderData.business?.businessName || '加载中...' }}</span>
          </div>
          <div class="flex items-center">
            <span class="text-4.5vw text-orange-500 font-bold mr-2vw">¥{{ (orderData.orderTotal || 0).toFixed(2) }}</span>
            <el-icon :class="{ 'rotate-180': showDetail }" class="text-gray-500">
              <ArrowDown />
            </el-icon>
          </div>
        </div>

        <!-- 订单明细 -->
        <div v-show="showDetail" class="p-3vw bg-gray-50">
          <div
            v-for="(item, index) in orderItems"
            :key="index"
            class="flex justify-between items-center py-1.5vw border-b border-gray-200 last:border-0"
          >
            <span class="text-3.2vw text-gray-700">{{ item.foodName }} × {{ item.quantity }}</span>
            <span class="text-3.2vw text-gray-800 font-medium">¥{{ (item.foodPrice * item.quantity).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center py-1.5vw border-b border-gray-200">
            <span class="text-3.2vw text-gray-700">配送费</span>
            <span class="text-3.2vw text-gray-800 font-medium">¥{{ (orderData.business?.deliveryPrice || 0).toFixed(2) }}</span>
          </div>
          <div class="flex justify-between items-center py-2vw mt-1vw bg-gray-100 px-2vw rounded-1.5vw">
            <span class="text-3.5vw text-gray-800 font-bold">订单总价</span>
            <span class="text-3.8vw text-orange-500 font-bold">¥{{ (orderData.orderTotal || 0).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- 支付方式 -->
      <div class="bg-white rounded-2vw shadow-sm overflow-hidden mb-4vw">
        <div class="p-3vw border-b border-gray-200">
          <h3 class="text-4vw font-bold text-gray-800">选择支付方式</h3>
        </div>

        <div class="space-y-1vw">
          <div
            @click="selectPayment('alipay')"
            :class="{ 'bg-blue-50': selectedPayment === 'alipay' }"
            class="flex items-center justify-between p-3vw cursor-pointer hover:bg-gray-50"
          >
            <div class="flex items-center">
              <div class="w-10vw h-10vw bg-blue-500 rounded-2vw flex items-center justify-center mr-3vw">
                <span class="text-4.5vw text-white font-bold">支</span>
              </div>
              <div>
                <p class="text-4vw text-gray-800 font-medium">支付宝支付</p>
                <p class="text-3vw text-gray-500 mt-0.5vw">推荐使用支付宝</p>
              </div>
            </div>
            <el-icon v-if="selectedPayment === 'alipay'" class="text-blue-500" size="5vw">
              <CircleCheck />
            </el-icon>
          </div>

          <div
            @click="selectPayment('wechat')"
            :class="{ 'bg-blue-50': selectedPayment === 'wechat' }"
            class="flex items-center justify-between p-3vw cursor-pointer hover:bg-gray-50"
          >
            <div class="flex items-center">
              <div class="w-10vw h-10vw bg-green-500 rounded-2vw flex items-center justify-center mr-3vw">
                <span class="text-4.5vw text-white font-bold">微</span>
              </div>
              <div>
                <p class="text-4vw text-gray-800 font-medium">微信支付</p>
                <p class="text-3vw text-gray-500 mt-0.5vw">推荐使用微信</p>
              </div>
            </div>
            <el-icon v-if="selectedPayment === 'wechat'" class="text-green-500" size="5vw">
              <CircleCheck />
            </el-icon>
          </div>
        </div>
      </div>

      <!-- 支付按钮 -->
      <div class="p-3vw">
        <el-button
          @click="confirmPayment"
          :disabled="isPaying || !orderData.orderId"
          type="primary"
          size="large"
          class="w-full !h-12vw !text-4.5vw !font-bold !rounded-2vw"
        >
          {{ isPaying ? '支付中...' : `确认支付 ¥${(orderData.orderTotal || 0).toFixed(2)}` }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Document,
  ArrowDown,
  CircleCheck
} from '@element-plus/icons-vue'
import request from '../utils/request'

const route = useRoute()
const router = useRouter()

const orderId = ref(route.query.orderId)
const orderData = ref({})
const showDetail = ref(false)
const selectedPayment = ref('alipay')
const isPaying = ref(false)

// 计算订单明细项
const orderItems = computed(() => {
  if (!orderData.value) return []

  const items = orderData.value.list || []
  return items.map(item => ({
    foodId: item.food?.foodId || item.foodId,
    foodName: item.food?.foodName || item.foodName,
    foodPrice: item.food?.foodPrice || item.foodPrice || 0,
    quantity: item.quantity || 0
  })).filter(item => item.quantity > 0)
})

// 获取订单信息
const fetchOrder = async () => {
  if (!orderId.value) {
    ElMessage.warning('订单ID不能为空！')
    router.push({ path: '/index' })
    return
  }

  try {
    const response = await request.post(
      '/OrdersController/getOrdersById',
      { orderId: orderId.value }
    )

    orderData.value = response.data || response

    if (!orderData.value || !orderData.value.orderId) {
      ElMessage.warning('订单信息不存在或已过期！')
      router.push({ path: '/orderList' })
      return
    }

    if (orderData.value.orderState === 1) {
      ElMessage.warning('订单已支付！')
      router.push({ path: '/orderList' })
    }
  } catch (error) {
    ElMessage.error('获取订单信息失败！')
    router.push({ path: '/index' })
  }
}

// 显示/隐藏订单明细
const toggleDetail = () => {
  showDetail.value = !showDetail.value
}

// 选择支付方式
const selectPayment = (type) => {
  selectedPayment.value = type
}

// 确认支付
const confirmPayment = async () => {
  if (!orderId.value || !orderData.value.orderId) {
    ElMessage.error('订单信息错误！')
    return
  }

  if (orderData.value.orderState === 1) {
    ElMessage.warning('订单已支付！')
    router.push({ path: '/orderList' })
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定要支付 ¥${(orderData.value.orderTotal || 0).toFixed(2)} 吗？`,
      '确认支付',
      {
        confirmButtonText: '确认支付',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    isPaying.value = true

    const response = await request({
      method: 'post',
      url: '/OrdersController/payOrders',
      params: { orderId: orderId.value }
    })

    let success = false
    let result = response.data !== undefined ? response.data : response

    if (result === 1 || result === true || result === '1' || result === 'success') {
      success = true
    } else if (typeof result === 'object') {
      if (result.code === 200 || result.success === true || result.status === 1) {
        success = true
      }
    }

    if (success) {
      ElMessage.success('支付成功！')
      orderData.value.orderState = 1

      setTimeout(() => {
        router.push({ path: '/orderList' })
      }, 1500)
    } else {
      ElMessage.error('支付失败！')
      isPaying.value = false
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('支付失败，请稍后重试！')
      isPaying.value = false
    }
  }
}

onMounted(() => {
  fetchOrder()
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

:deep(.el-button.is-disabled) {
  background-color: #ccc !important;
  border-color: #ccc !important;
  cursor: not-allowed !important;
}
</style>