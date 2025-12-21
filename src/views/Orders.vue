<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>确认订单</p>
    </header>

    <!-- 订单信息部分 -->
    <div class="order-info">
      <h5>订单配送至：</h5>

      <div
        class="order-info-address"
        @click="toUserAddress"
      >
        <p>
          {{ deliveryAddress
            ? deliveryAddress.address
            : '请选择送货地址' }}
        </p>
        <i class="fa fa-angle-right"></i>
      </div>

      <!-- 修改：显示地址中的联系人信息，而不是登录用户信息 -->
      <p v-if="deliveryAddress">
        {{ deliveryAddress.contactName }}
        {{ sexFilter(deliveryAddress.contactSex) }}
        {{ deliveryAddress.contactTel }}
      </p>
      <p v-else>
        {{ user.userName }}
        {{ sexFilter(user.userSex) }}
        {{ user.userPhone || user.userId }}
      </p>
    </div>

    <h3>{{ business.businessName }}</h3>

    <!-- 订单明细部分 -->
    <ul class="order-detailed">
      <li
        v-for="item in foodArr"
        :key="item.foodId"
        v-show="item.quantity > 0"
      >
        <div class="order-detailed-left">
          <img :src="item.foodImg" />
          <p>
            {{ item.foodName }} × {{ item.quantity }}
          </p>
        </div>
        <p>
          &#165;{{ (item.foodPrice * item.quantity).toFixed(2) }}
        </p>
      </li>
    </ul>

    <!-- 配送费 -->
    <div class="order-deliveryfee">
      <p>配送费</p>
      <p>&#165;{{ business.deliveryPrice }}</p>
    </div>

    <!-- 合计部分 -->
    <div class="total">
      <div class="total-left">
        &#165;{{ totalPrice.toFixed(2) }}
      </div>
      <div
        class="total-right"
        @click="toPayment"
        :style="!deliveryAddress ? 'background-color:#ccc;cursor:not-allowed;' : 'background-color:#38ca73;'"
      >
        去支付
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '../utils/request'

const route = useRoute()
const router = useRouter()

const businessId = ref(route.query.businessId)
const business = ref({
  deliveryPrice: 0
})
const user = ref({})
const foodArr = ref([])
const deliveryAddress = ref(null) // 改为更明确的变量名

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
  // 获取用户信息
  user.value = getSessionStorage('user')

  if (!user.value || !user.value.userId) {
    alert('请先登录！')
    router.push({ path: '/login' })
    return
  }

  // 获取地址信息 - 这里应该获取的是用户选择的送货地址
  // 通常地址信息存储在 localStorage 中，键为 userId + '_address' 或其他约定格式
  deliveryAddress.value = getLocalStorage(`${user.value.userId}_selected_address`)

  // 如果没有选择的地址，尝试从 localStorage 获取默认地址
  if (!deliveryAddress.value) {
    deliveryAddress.value = getLocalStorage(user.value.userId)
  }

  if (!businessId.value) {
    alert('商家ID不能为空！')
    router.back()
    return
  }

  try {
    // 查询当前商家信息
    const businessRes = await request.post(
      '/BusinessController/getBusinessById',
      { businessId: businessId.value }
    )

    if (businessRes && businessRes.data) {
      business.value = businessRes.data
    } else {
      business.value = businessRes
    }

    // 查询商家所有食品
    const foodRes = await request.post(
      '/FoodController/listFoodByBusinessId',
      { businessId: businessId.value }
    )

    // 初始化食品数组
    if (foodRes && foodRes.data) {
      foodArr.value = foodRes.data.map(item => ({ ...item, quantity: 0 }))
    } else {
      foodArr.value = foodRes.map(item => ({ ...item, quantity: 0 }))
    }

    // 查询购物车数据
    await listCart()
  } catch (error) {
    console.error('加载订单信息失败:', error)
    alert('加载订单信息失败，请稍后重试！')
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

    // 更新食品数量
    foodArr.value.forEach(foodItem => {
      foodItem.quantity = 0
      cartArr.forEach(cartItem => {
        if (cartItem.foodId === foodItem.foodId) {
          foodItem.quantity = cartItem.quantity || 0
        }
      })
    })
  } catch (error) {
    console.error('获取购物车失败:', error)
  }
}

const sexFilter = (value) => {
  // 假设1: 先生, 2: 女士
  return value === 1 ? '先生' :
         value === 2 ? '女士' : ''
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
      fromPage: 'orders' // 添加标识，让地址选择页面知道返回后要刷新数据
    }
  })
}

const toPayment = async () => {
  if (!deliveryAddress.value) {
    alert('请选择送货地址！')
    return
  }

  // 检查是否有选择的商品
  const selectedItems = foodArr.value.filter(item => item.quantity > 0)
  if (selectedItems.length === 0) {
    alert('请选择要购买的商品！')
    return
  }

  try {
    const response = await request.post(
      '/OrdersController/createOrders',
      {
        userId: user.value.userId,
        businessId: businessId.value,
        daId: deliveryAddress.value.daId, // 使用地址ID
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
      alert('创建订单失败！')
    }
  } catch (error) {
    console.error('创建订单失败:', error)
    alert('创建订单失败，请稍后重试！')
  }
}
</script>

<style scoped>
/* 样式保持不变 */
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
}

/****************** header部分 ******************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background-color: #0097ff;
  color: #fff;
  font-size: 4.8vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

/****************** 订单信息部分 ******************/
.wrapper .order-info {
  width: 100%;
  margin-top: 12vw;
  background-color: #0097ef;
  box-sizing: border-box;
  padding: 2vw;
  color: #fff;
}

.wrapper .order-info h5 {
  font-size: 3vw;
  font-weight: 300;
}

.wrapper .order-info .order-info-address {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  user-select: none;
  cursor: pointer;
  margin: 1vw 0;
}

.wrapper .order-info .order-info-address p {
  width: 90%;
  font-size: 5vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wrapper .order-info .order-info-address i {
  font-size: 6vw;
}

.wrapper .order-info p {
  font-size: 3vw;
  margin-top: 1vw;
}

.wrapper h3 {
  box-sizing: border-box;
  padding: 3vw;
  font-size: 4vw;
  color: #666;
  border-bottom: solid 1px #ddd;
  background-color: #fff;
}

/****************** 订单明细部分 ******************/
.wrapper .order-detailed {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #fff;
}

.wrapper .order-detailed li {
  width: 100%;
  height: 16vw;
  box-sizing: border-box;
  padding: 3vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  border-bottom: solid 1px #eee;
}

.wrapper .order-detailed-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.wrapper .order-detailed-left img {
  width: 10vw;
  height: 10vw;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.wrapper .order-detailed-left p {
  font-size: 3.5vw;
  margin-left: 3vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wrapper .order-detailed li p {
  font-size: 3.5vw;
  font-weight: bold;
  color: #ff6000;
  flex-shrink: 0;
}

.wrapper .order-deliveryfee {
  width: 100%;
  height: 16vw;
  box-sizing: border-box;
  padding: 3vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 3.5vw;
  color: #666;
  background-color: #fff;
  border-bottom: solid 1px #eee;
}

/****************** 订单合计部分 ******************/
.wrapper .total {
  width: 100%;
  height: 14vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  z-index: 1000;
}

.wrapper .total .total-left {
  flex: 2;
  background-color: #505051;
  color: #fff;
  font-size: 4.5vw;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper .total .total-right {
  flex: 1;
  background-color: #38ca73;
  color: #fff;
  font-size: 4.5vw;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s;
}

.wrapper .total .total-right:active {
  background-color: #2da85c;
}
</style>