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
          {{ deliveryaddress
            ? deliveryaddress.address
            : '请选择送货地址' }}
        </p>
        <i class="fa fa-angle-right"></i>
      </div>

      <p>
        {{ user.userName }}
        {{ sexFilter(user.userSex) }}
        {{ user.userId }}
      </p>
    </div>

    <h3>{{ business.businessName }}</h3>

    <!-- 订单明细部分 -->
    <ul class="order-detailed">
      <li
        v-for="item in cartArr"
        :key="item.food.foodId"
      >
        <div class="order-detailed-left">
          <img :src="item.food.foodImg" />
          <p>
            {{ item.food.foodName }} x {{ item.quantity }}
          </p>
        </div>
        <p>
          &#165;{{ item.food.foodPrice * item.quantity }}
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
        &#165;{{ totalPrice }}
      </div>
      <div
        class="total-right"
        @click="toPayment"
      >
        去支付
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import qs from 'qs'
import { getSessionStorage, getLocalStorage } from '../utils/storage'

const route = useRoute()
const router = useRouter()

const businessId = ref(route.query.businessId)
const business = ref({})
const user = ref({})
const cartArr = ref([])
const deliveryaddress = ref(null)

onMounted(async () => {
  user.value = getSessionStorage('user')
  deliveryaddress.value = getLocalStorage(user.value.userId)

  // 查询当前商家
  try {
    const businessRes = await axios.post(
      'BusinessController/getBusinessById',
      qs.stringify({ businessId: businessId.value })
    )
    business.value = businessRes.data
  } catch (error) {
    console.error(error)
  }

  // 查询购物车中当前商家的食品
  try {
    const cartRes = await axios.post(
      'CartController/listCart',
      qs.stringify({
        userId: user.value.userId,
        businessId: businessId.value
      })
    )
    cartArr.value = cartRes.data
  } catch (error) {
    console.error(error)
  }
})

const sexFilter = (value) => {
  return value === 1 ? '先生' : '女士'
}

const totalPrice = computed(() => {
  const subtotal = cartArr.value.reduce((total, cartItem) => {
    return total + cartItem.food.foodPrice * cartItem.quantity
  }, 0)
  return subtotal + business.value.deliveryPrice
})

const toUserAddress = () => {
  router.push({
    path: '/userAddress',
    query: { businessId: businessId.value }
  })
}

const toPayment = async () => {
  if (!deliveryaddress.value) {
    alert('请选择送货地址！')
    return
  }

  try {
    const response = await axios.post(
      'OrdersController/createOrders',
      qs.stringify({
        userId: user.value.userId,
        businessId: businessId.value,
        daId: deliveryaddress.value.daId,
        orderTotal: totalPrice.value
      })
    )

    const orderId = response.data
    if (orderId > 0) {
      router.push({
        path: '/payment',
        query: { orderId }
      })
    } else {
      alert('创建订单失败！')
    }
  } catch (error) {
    console.error(error)
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
}

.wrapper .order-info .order-info-address i {
  font-size: 6vw;
}

.wrapper .order-info p {
  font-size: 3vw;
}

.wrapper h3 {
  box-sizing: border-box;
  padding: 3vw;
  font-size: 4vw;
  color: #666;
  border-bottom: solid 1px #ddd;
}

/****************** 订单明细部分 ******************/
.wrapper .order-detailed li {
  width: 100%;
  height: 16vw;
  box-sizing: border-box;
  padding: 3vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
}

.wrapper .order-detailed-left {
  display: flex;
  align-items: center;
}

.wrapper .order-detailed-left img {
  width: 10vw;
  height: 10vw;
}

.wrapper .order-detailed-left p {
  font-size: 3.5vw;
  margin-left: 3vw;
}

.wrapper .order-detailed li p {
  font-size: 3.5vw;
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
}

/****************** 订单合计部分 ******************/
.wrapper .total {
  width: 100%;
  height: 14vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
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
}
</style>