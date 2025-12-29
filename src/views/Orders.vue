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
      <h1 class="text-4.5vw text-white font-bold">确认订单</h1>
      <div class="w-8vw"></div>
    </header>

    <!-- 订单内容 -->
    <div class="w-full mt-12vw pb-20vw">
      <!-- 配送地址 -->
      <div
        @click="toUserAddress"
        class="mx-3vw mt-3vw bg-gradient-to-r from-blue-500 to-blue-600 rounded-2vw p-4vw text-white cursor-pointer"
      >
        <div class="flex items-center justify-between mb-2vw">
          <div class="flex items-center">
            <el-icon size="4.5vw" class="mr-2vw"><Location /></el-icon>
            <span class="text-3.5vw font-medium">订单配送至</span>
          </div>
          <el-icon size="4.5vw"><ArrowRight /></el-icon>
        </div>

        <p class="text-4.5vw font-bold truncate mb-1vw">
          {{ deliveryAddress ? deliveryAddress.address : '请选择送货地址' }}
        </p>

        <p class="text-3.2vw opacity-90">
          {{ deliveryAddress
            ? `${deliveryAddress.contactName} ${sexFilter(deliveryAddress.contactSex)} ${deliveryAddress.contactTel}`
            : `${user.userName} ${sexFilter(user.userSex)} ${user.userPhone || user.userId}`
          }}
        </p>
      </div>

      <!-- 商家信息 -->
      <div class="mx-3vw mt-4vw bg-white rounded-2vw shadow-sm p-3vw">
        <div class="flex items-center mb-3vw">
          <el-icon class="text-blue-500 mr-2vw"><Shop /></el-icon>
          <h3 class="text-4vw font-bold text-gray-800">{{ business.businessName }}</h3>
        </div>

        <!-- 商品列表 -->
        <div class="space-y-3vw">
          <div
            v-for="item in foodArr"
            :key="item.foodId"
            v-show="item.quantity > 0"
            class="flex items-center p-2vw border-b border-gray-100 last:border-0"
          >
            <img :src="item.foodImg" class="w-16vw h-16vw rounded-2vw object-cover flex-shrink-0" />
            <div class="ml-3vw flex-1 min-w-0">
              <p class="text-3.8vw text-gray-800 font-medium truncate">{{ item.foodName }}</p>
              <p class="text-3.2vw text-gray-500">× {{ item.quantity }}</p>
            </div>
            <span class="text-3.8vw text-gray-800 font-bold">¥{{ (item.foodPrice * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <!-- 配送费 -->
        <div class="flex justify-between items-center pt-3vw mt-3vw border-t border-gray-200">
          <span class="text-3.5vw text-gray-700">配送费</span>
          <span class="text-3.8vw text-gray-800 font-bold">¥{{ business.deliveryPrice }}</span>
        </div>
      </div>

      <!-- 合计金额 -->
      <div class="fixed bottom-16vw left-0 w-full px-3vw z-100">
        <div class="bg-white rounded-2vw shadow-lg p-3vw">
          <div class="flex justify-between items-center">
            <div>
              <p class="text-3.5vw text-gray-500">合计</p>
              <p class="text-4.5vw text-orange-500 font-bold">¥{{ totalPrice.toFixed(2) }}</p>
            </div>
            <el-button
              @click="toPayment"
              type="primary"
              size="large"
              :disabled="!deliveryAddress || foodArr.every(item => item.quantity <= 0)"
              class="!h-12vw !text-4vw !font-bold !rounded-2vw !px-6vw"
            >
              去支付
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Location,
  ArrowRight,
  Shop
} from '@element-plus/icons-vue'
import request from '../utils/request'

const route = useRoute()
const router = useRouter()

const businessId = ref(route.query.businessId)
const business = ref({
  deliveryPrice: 0
})
const user = ref({})
const foodArr = ref([])
const deliveryAddress = ref(null)

// SessionStorage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

// LocalStorage 方法
const getLocalStorage = (key) => {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

onMounted(async () => {
  user.value = getSessionStorage('user')

  if (!user.value || !user.value.userId) {
    ElMessage.warning('请先登录！')
    router.push({ path: '/login' })
    return
  }

  deliveryAddress.value = getLocalStorage(`${user.value.userId}_selected_address`)
  if (!deliveryAddress.value) {
    deliveryAddress.value = getLocalStorage(user.value.userId)
  }

  if (!businessId.value) {
    ElMessage.warning('商家ID不能为空！')
    router.back()
    return
  }

  try {
    const businessRes = await request.post(
      '/BusinessController/getBusinessById',
      { businessId: businessId.value }
    )

    business.value = businessRes.data || businessRes

    const foodRes = await request.post(
      '/FoodController/listFoodByBusinessId',
      { businessId: businessId.value }
    )

    const foodData = foodRes.data || foodRes
    foodArr.value = foodData.map(item => ({ ...item, quantity: 0 }))

    await listCart()
  } catch (error) {
    ElMessage.error('加载订单信息失败，请稍后重试！')
  }
})

// 获取购物车数据
const listCart = async () => {
  try {
    const response = await request.post(
      '/CartController/listCart',
      {
        businessId: businessId.value,
        userId: user.value.userId
      }
    )

    const cartArr = response.data || response

    foodArr.value.forEach(foodItem => {
      foodItem.quantity = 0
      cartArr.forEach(cartItem => {
        if (cartItem.foodId === foodItem.foodId) {
          foodItem.quantity = cartItem.quantity || 0
        }
      })
    })
  } catch (error) {
    ElMessage.error('获取购物车失败')
  }
}

const sexFilter = (value) => {
  return value === 1 ? '先生' : '女士'
}

// 计算总价
const totalPrice = computed(() => {
  const foodTotal = foodArr.value.reduce((total, item) => {
    return total + (item.foodPrice || 0) * (item.quantity || 0)
  }, 0)

  const deliveryPrice = parseFloat(business.value.deliveryPrice || 0)
  return foodTotal + deliveryPrice
})

const toUserAddress = () => {
  router.push({
    path: '/userAddress',
    query: {
      businessId: businessId.value,
      businessName: business.value.businessName,
      fromPage: 'orders'
    }
  })
}

const toPayment = async () => {
  if (!deliveryAddress.value) {
    ElMessage.warning('请选择送货地址！')
    return
  }

  const selectedItems = foodArr.value.filter(item => item.quantity > 0)
  if (selectedItems.length === 0) {
    ElMessage.warning('请选择要购买的商品！')
    return
  }

  try {
    const response = await request.post(
      '/OrdersController/createOrders',
      {
        userId: user.value.userId,
        businessId: businessId.value,
        daId: deliveryAddress.value.daId,
        orderTotal: totalPrice.value
      }
    )

    const result = response.data || response
    const orderId = result.orderId || result

    if (orderId > 0) {
      router.push({
        path: '/payment',
        query: { orderId }
      })
    } else {
      ElMessage.error('创建订单失败！')
    }
  } catch (error) {
    ElMessage.error('创建订单失败，请稍后重试！')
  }
}
</script>

<style scoped>
.header-primary {
  @apply w-full h-12vw bg-gradient-to-r from-blue-500 to-blue-600
         flex items-center justify-between px-4vw fixed top-0 left-0 z-1000 shadow-md;
}

:deep(.el-button.is-disabled) {
  background-color: #ccc !important;
  border-color: #ccc !important;
  cursor: not-allowed !important;
}
</style>