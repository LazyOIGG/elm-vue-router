<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>在线支付</p>
    </header>

    <!-- 订单信息部分 -->
    <h3>订单信息：</h3>
    <div class="order-info">
      <p>
        {{ orderData.business?.businessName || '加载中...' }}
        <i
          class="fa fa-caret-down"
          @click="toggleDetail"
          :class="{ 'rotated': showDetail }"
        ></i>
      </p>
      <p>&#165;{{ (orderData.orderTotal || 0).toFixed(2) }}</p>
    </div>

    <!-- 订单明细部分 -->
    <ul
      class="order-detail"
      v-show="showDetail"
    >
      <li
        v-for="(item, index) in orderItems"
        :key="index"
      >
        <p>
          {{ item.foodName }} × {{ item.quantity }}
        </p>
        <p>
          &#165;{{ (item.foodPrice * item.quantity).toFixed(2) }}
        </p>
      </li>

      <li>
        <p>配送费</p>
        <p>&#165;{{ (orderData.business?.deliveryPrice || 0).toFixed(2) }}</p>
      </li>

      <li class="order-total">
        <p>订单总价</p>
        <p>&#165;{{ (orderData.orderTotal || 0).toFixed(2) }}</p>
      </li>
    </ul>

    <!-- 支付方式部分 -->
    <ul class="payment-type">
      <li @click="selectPayment('alipay')" :class="{ 'selected': selectedPayment === 'alipay' }">
        <img src="../assets/img/alipay.png" alt="支付宝" />
        <i class="fa fa-check-circle" v-show="selectedPayment === 'alipay'"></i>
      </li>
      <li @click="selectPayment('wechat')" :class="{ 'selected': selectedPayment === 'wechat' }">
        <img src="../assets/img/wechat.png" alt="微信支付" />
        <i class="fa fa-check-circle" v-show="selectedPayment === 'wechat'"></i>
      </li>
    </ul>

    <!-- 支付按钮 -->
    <div class="payment-button">
      <button @click="confirmPayment" :disabled="isPaying || !orderData.orderId">
        {{ isPaying ? '支付中...' : '确认支付' }}
      </button>
    </div>

    <!-- 底部菜单部分 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '../utils/request'
import Footer from '../components/Footer.vue'

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
    alert('订单ID不能为空！')
    router.push({ path: '/index' })
    return
  }

  try {
    const response = await request.post(
      '/OrdersController/getOrdersById',
      { orderId: orderId.value }
    )

    if (response && response.data) {
      orderData.value = response.data
    } else if (response && typeof response === 'object') {
      orderData.value = response
    }

    if (!orderData.value || !orderData.value.orderId) {
      alert('订单信息不存在或已过期！')
      router.push({ path: '/orderList' })
      return
    }

    if (orderData.value.orderState === 1) {
      alert('订单已支付！')
      router.push({ path: '/orderList' })
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        alert('订单不存在！')
      } else {
        alert('获取订单信息失败！')
      }
    } else {
      alert('网络连接失败！')
    }
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
    alert('订单信息错误！')
    return
  }

  if (orderData.value.orderState === 1) {
    alert('订单已支付！')
    router.push({ path: '/orderList' })
    return
  }

  if (!confirm(`确定要支付 ¥${(orderData.value.orderTotal || 0).toFixed(2)} 吗？`)) {
    return
  }

  isPaying.value = true

  try {
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
      alert('支付成功！')
      orderData.value.orderState = 1

      setTimeout(() => {
        router.push({ path: '/orderList' })
      }, 800)
    } else {
      alert('支付失败！')
      isPaying.value = false
    }
  } catch (error) {
    alert('支付失败，请稍后重试！')
    isPaying.value = false
  }
}

onMounted(() => {
  fetchOrder()
  history.pushState({ page: 'payment' }, '', window.location.href)
  window.addEventListener('popstate', () => {
    router.push({ path: '/index' })
  })
})
</script>

<style scoped>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
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
.wrapper h3 {
  margin-top: 12vw;
  box-sizing: border-box;
  padding: 4vw 4vw 0;
  font-size: 4vw;
  font-weight: 300;
  color: #666;
  background-color: #fff;
}

.wrapper .order-info {
  box-sizing: border-box;
  padding: 4vw;
  font-size: 4.2vw;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.wrapper .order-info p:first-child {
  display: flex;
  align-items: center;
  gap: 2vw;
  font-weight: bold;
}

.wrapper .order-info p:last-child {
  color: #ff6000;
  font-weight: bold;
  font-size: 4.8vw;
}

.wrapper .order-info .fa-caret-down {
  font-size: 5vw;
  color: #999;
  transition: transform 0.3s;
}

.wrapper .order-info .fa-caret-down.rotated {
  transform: rotate(180deg);
}

/****************** 订单明细部分 ******************/
.wrapper .order-detail {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.wrapper .order-detail li {
  width: 100%;
  box-sizing: border-box;
  padding: 3vw 4vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
}

.wrapper .order-detail li:last-child {
  border-bottom: none;
}

.wrapper .order-detail li p {
  font-size: 3.6vw;
  color: #666;
}

.wrapper .order-detail li.order-total {
  background-color: #f9f9f9;
}

.wrapper .order-detail li.order-total p {
  font-weight: bold;
  color: #333;
}

.wrapper .order-detail li.order-total p:last-child {
  color: #ff6000;
  font-size: 4vw;
}

/****************** 支付方式部分 ******************/
.wrapper .payment-type {
  list-style: none;
  padding: 0;
  margin: 3vw 0 0;
  background-color: #fff;
}

.wrapper .payment-type li {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.wrapper .payment-type li.selected {
  background-color: #f0f9ff;
}

.wrapper .payment-type li img {
  width: 33vw;
  height: 8.9vw;
  object-fit: contain;
}

.wrapper .payment-type li .fa-check-circle {
  font-size: 5vw;
  color: #38ca73;
}

/****************** 支付按钮 ******************/
.wrapper .payment-button {
  width: 100%;
  box-sizing: border-box;
  padding: 6vw 4vw;
  background-color: #f5f5f5;
}

.wrapper .payment-button button {
  width: 100%;
  height: 12vw;
  border: none;
  outline: none;
  border-radius: 6px;
  background-color: #38ca73;
  color: #fff;
  font-size: 4.5vw;
  font-weight: bold;
  cursor: pointer;
}

.wrapper .payment-button button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .wrapper .order-info p:last-child {
    font-size: 4.2vw;
  }

  .wrapper .payment-button button {
    height: 10vw;
  }
}
</style>