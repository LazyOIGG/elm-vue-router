<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>商家列表</p>
    </header>

    <!-- 商家列表部分 -->
    <ul class="business">
      <li
        v-for="item in businessArr"
        :key="item.businessId"
        @click="toBusinessInfo(item.businessId)"
      >
        <div class="business-img">
          <img :src="item.businessImg" />
          <div
            class="business-img-quantity"
            v-show="item.quantity > 0"
          >
            {{ item.quantity }}
          </div>
        </div>

        <div class="business-info">
          <h3>{{ item.businessName }}</h3>
          <p>
            &#165;{{ item.starPrice }}起送 |
            &#165;{{ item.deliveryPrice }}配送
          </p>
          <p>{{ item.businessExplain }}</p>
        </div>
      </li>
    </ul>

    <!-- 底部菜单部分 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import request from '../utils/request'
import Footer from '../components/Footer.vue'

const route = useRoute()
const router = useRouter()

const orderTypeId = ref(route.query.orderTypeId)
const businessArr = ref([])

// SessionStorage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

// 获取商家列表
const fetchBusinesses = async () => {
  try {
    const response = await request.post(
      'BusinessController/listBusinessByOrderTypeId',
      { orderTypeId: orderTypeId.value }
    )
    businessArr.value = response

    const user = getSessionStorage('user')
    if (user) {
      await fetchCart(user)
    }
  } catch (error) {
    alert('获取商家列表失败')
  }
}

// 查询购物车，统计每个商家的商品数量
const fetchCart = async (user) => {
  try {
    const response = await request.post(
      'CartController/listCart',
      { userId: user.userId }
    )
    const cartArr = response

    businessArr.value.forEach(businessItem => {
      businessItem.quantity = 0
      cartArr.forEach(cartItem => {
        if (cartItem.businessId === businessItem.businessId) {
          businessItem.quantity += cartItem.quantity
        }
      })
    })
  } catch (error) {
    alert('获取购物车失败')
  }
}

// 跳转商家详情页
const toBusinessInfo = (businessId) => {
  router.push({
    path: '/businessInfo',
    query: { businessId }
  })
}

onMounted(() => {
  fetchBusinesses()
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

/****************** 商家列表部分 ******************/
.wrapper .business {
  width: 100%;
  margin-top: 12vw;
  margin-bottom: 14vw;
}

.wrapper .business li {
  width: 100%;
  box-sizing: border-box;
  padding: 2.5vw;
  border-bottom: solid 1px #ddd;
  user-select: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.wrapper .business li .business-img {
  position: relative;
}

.wrapper .business li .business-img img {
  width: 20vw;
  height: 20vw;
}

.wrapper .business li .business-img .business-img-quantity {
  width: 5vw;
  height: 5vw;
  background-color: red;
  color: #fff;
  font-size: 3.6vw;
  border-radius: 2.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: -1.5vw;
  top: -1.5vw;
}

.wrapper .business li .business-info {
  margin-left: 3vw;
}

.wrapper .business li .business-info h3 {
  font-size: 3.8vw;
  color: #555;
}

.wrapper .business li .business-info p {
  font-size: 3vw;
  color: #888;
  margin-top: 2vw;
}
</style>