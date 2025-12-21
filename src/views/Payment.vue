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
          {{ item.foodName || item.food?.foodName }} × {{ item.quantity }}
        </p>
        <p>
          &#165;{{ ((item.foodPrice || item.food?.foodPrice || 0) * item.quantity).toFixed(2) }}
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '../utils/request'
import Footer from '../components/Footer.vue'

const route = useRoute()
const router = useRouter()

const orderId = ref(route.query.orderId)
const orderData = ref({
  business: {},
  orderTotal: 0
})
const showDetail = ref(false)
const selectedPayment = ref('alipay')
const isPaying = ref(false)

// 计算订单明细项
const orderItems = computed(() => {
  if (!orderData.value) return []

  // 尝试从不同字段获取订单明细
  const items = orderData.value.list || orderData.value.orderDetailList || []
  return items.map(item => {
    if (item.food) {
      return {
        foodId: item.food.foodId,
        foodName: item.food.foodName,
        foodPrice: item.food.foodPrice,
        quantity: item.quantity
      }
    } else if (item.foodName) {
      return {
        foodId: item.foodId,
        foodName: item.foodName,
        foodPrice: item.foodPrice,
        quantity: item.quantity
      }
    } else {
      return {
        foodId: item.foodId,
        foodName: '',
        foodPrice: 0,
        quantity: item.quantity
      }
    }
  }).filter(item => item.quantity > 0) // 过滤掉数量为0的项
})

// 获取订单信息
const fetchOrder = async () => {
  if (!orderId.value) {
    alert('订单ID不能为空！')
    router.push({ path: '/index' })
    return
  }

  try {
    console.log('正在获取订单信息，订单ID:', orderId.value)

    // 尝试两种方式获取订单信息
    let response
    try {
      // 方式1：使用完整的订单详情接口
      response = await request.post(
        '/OrdersController/getOrdersById',
        { orderId: orderId.value }
      )
    } catch (error) {
      console.log('第一种方式失败，尝试第二种方式...', error)
      // 方式2：使用简单查询接口
      response = await request.post(
        '/OrdersController/getOrdersByIdSimple',
        null,
        { params: { orderId: orderId.value } }
      )
    }

    // 处理不同的返回数据结构
    if (response && response.data) {
      orderData.value = response.data
    } else if (response && response.code === 200) {
      orderData.value = response.data || response.result || response
    } else {
      orderData.value = response || {}
    }

    console.log('订单数据:', orderData.value)

    // 如果订单信息为空，提示错误
    if (!orderData.value || Object.keys(orderData.value).length === 0) {
      alert('订单信息不存在或已过期！')
      router.push({ path: '/OrderList' })
    }
  } catch (error) {
    console.error('获取订单信息失败:', error)

    // 检查是否是网络错误
    if (!error.response) {
      alert('网络连接失败，请检查服务器是否运行！')
    } else if (error.response.status === 500) {
      alert('服务器内部错误，请联系管理员！')
    } else if (error.response.status === 404) {
      alert('订单不存在！')
    } else {
      alert('获取订单信息失败，请稍后重试！')
    }

    // 回退到首页
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
  if (!orderId.value) {
    alert('订单信息错误！')
    return
  }

  // 检查订单状态
  if (orderData.value.orderState === 1) {
    alert('订单已支付！')
    router.push({ path: '/orderList' })
    return
  }

  // 添加确认对话框
  const confirmPay = confirm(`确定要支付 ¥${(orderData.value.orderTotal || 0).toFixed(2)} 吗？`)
  if (!confirmPay) {
    return
  }

  isPaying.value = true

  try {
    console.log('开始支付，订单ID:', orderId.value)

    // 方法1：使用FormData传递参数（确保参数正确传递）
    const formData = new FormData()
    formData.append('orderId', orderId.value)

    // 方法2：直接使用URL参数 - 选择一种合适的方式
    // const response = await request.post(`/OrdersController/payOrders?orderId=${orderId.value}`)

    // 方法3：使用params对象 - 这是最常用的方式
    const response = await request({
      method: 'post',
      url: '/OrdersController/payOrders',
      params: {
        orderId: orderId.value
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    console.log('支付接口响应:', response)

    // 处理响应
    let result
    if (response && response.data !== undefined) {
      result = response.data
    } else {
      result = response
    }

    console.log('支付结果:', result, '类型:', typeof result)

    // 判断支付是否成功（根据后端返回的格式）
    let success = false
    if (result === 1 || result === true || result === '1') {
      success = true
    } else if (typeof result === 'object') {
      // 如果是对象，检查可能的成功字段
      if (result.success !== undefined) {
        success = result.success
      } else if (result.code !== undefined && result.code === 200) {
        success = true
      } else if (result.status !== undefined && result.status === 1) {
        success = true
      }
    }

    if (success) {
      alert('支付成功！')

      // 更新本地订单状态
      orderData.value.orderState = 1

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push({
          path: '/orderList',
          query: {
            paymentSuccess: 'true',
            orderId: orderId.value
          }
        })
      }, 800)
    } else {
      alert(`支付失败！返回结果: ${JSON.stringify(result)}`)
      isPaying.value = false
    }
  } catch (error) {
    console.error('支付失败:', error)

    // 更详细的错误处理
    let errorMessage = '支付失败，请稍后重试！'

    if (error.response) {
      console.error('错误响应:', error.response)
      if (error.response.status === 500) {
        errorMessage = '服务器内部错误，请联系管理员！'
      } else if (error.response.status === 400) {
        errorMessage = '请求参数错误！'
      } else if (error.response.data) {
        errorMessage = `支付失败: ${JSON.stringify(error.response.data)}`
      }
    } else if (error.request) {
      console.error('错误请求:', error.request)
      errorMessage = '网络连接失败，请检查网络设置！'
    } else {
      console.error('错误信息:', error.message)
      errorMessage = `支付失败: ${error.message}`
    }

    alert(errorMessage)
    isPaying.value = false
  }
}

// 处理浏览器返回按钮
const handlePopState = (event) => {
  event.preventDefault()
  history.replaceState({ page: 'payment' }, '', window.location.href)
  router.push({ path: '/index' })
}

onMounted(() => {
  fetchOrder()

  const state = { page: 'payment', orderId: orderId.value }
  history.pushState(state, '', window.location.href)
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
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
  transition: background-color 0.2s;
}

.wrapper .order-info:active {
  background-color: #f9f9f9;
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
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  transition: background-color 0.2s;
}

.wrapper .payment-type li:active {
  background-color: #f9f9f9;
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
  transition: all 0.2s;
}

.wrapper .payment-button button:hover {
  background-color: #32b867;
}

.wrapper .payment-button button:active {
  background-color: #2da85c;
  transform: scale(0.98);
}

.wrapper .payment-button button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
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