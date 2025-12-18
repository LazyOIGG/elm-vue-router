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
        {{ orders.business.businessName }}
        <i
          class="fa fa-caret-down"
          @click="detailetShow"
        ></i>
      </p>
      <p>&#165;{{ orders.orderTotal }}</p>
    </div>

    <!-- 订单明细部分 -->
    <ul
      class="order-detailet"
      v-show="isShowDetailet"
    >
      <li
        v-for="item in orders.list"
        :key="item.food.foodId"
      >
        <p>
          {{ item.food.foodName }} x {{ item.quantity }}
        </p>
        <p>
          &#165;{{ item.food.foodPrice * item.quantity }}
        </p>
      </li>

      <li>
        <p>配送费</p>
        <p>&#165;{{ orders.business.deliveryPrice }}</p>
      </li>
    </ul>

    <!-- 支付方式部分 -->
    <ul class="payment-type">
      <li>
        <img src="../assets/img/alipay.png" />
        <i class="fa fa-check-circle"></i>
      </li>
      <li>
        <img src="../assets/img/wechat.png" />
      </li>
    </ul>

    <!-- 支付按钮 -->
    <div class="payment-button">
      <button>确认支付</button>
    </div>

    <!-- 底部菜单部分 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import qs from 'qs'
import Footer from '../components/Footer.vue'

const route = useRoute()
const router = useRouter()

const orderId = ref(route.query.orderId)
const orders = ref({
  business: {}
})
const isShowDetailet = ref(false)

// 获取订单信息
const fetchOrder = async () => {
  try {
    const response = await axios.post(
      'OrdersController/getOrdersById',
      qs.stringify({ orderId: orderId.value })
    )
    orders.value = response.data
  } catch (error) {
    console.error(error)
  }
}

// 显示/隐藏订单明细
const detailetShow = () => {
  isShowDetailet.value = !isShowDetailet.value
}

// 禁止从支付页返回订单确认页
const handlePopState = () => {
  router.push({ path: '/index' })
}

onMounted(() => {
  fetchOrder()

  // 禁止返回
  history.pushState(null, null, document.URL)
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
  color: #999;
}

.wrapper .order-info {
  box-sizing: border-box;
  padding: 4vw;
  font-size: 4vw;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .order-info p:last-child {
  color: orangered;
}

/****************** 订单明细部分 ******************/
.wrapper .order-detailet li {
  width: 100%;
  box-sizing: border-box;
  padding: 1vw 4vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .order-detailet li p {
  font-size: 3vw;
  color: #666;
}

/****************** 支付方式部分 ******************/
.wrapper .payment-type li {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .payment-type li img {
  width: 33vw;
  height: 8.9vw;
}

.wrapper .payment-type li .fa-check-circle {
  font-size: 5vw;
  color: #38ca73;
}

/****************** 支付按钮 ******************/
.wrapper .payment-button {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw;
}

.wrapper .payment-button button {
  width: 100%;
  height: 10vw;
  border: none;
  outline: none;
  border-radius: 4px;
  background-color: #38ca73;
  color: #fff;
}
</style>