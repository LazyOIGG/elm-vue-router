<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <div class="header-title">商家信息</div>
      <div class="header-right"></div>
    </header>

    <!-- 商家logo部分 -->
    <div class="business-logo">
      <img :src="business.businessImg" />
    </div>

    <!-- 商家信息部分 -->
    <div class="business-info">
      <h1>{{ business.businessName }}</h1>
      <p>
        &#165;{{ business.starPrice }}起送
        &#165;{{ business.deliveryPrice }}配送
      </p>
      <p>{{ business.businessExplain }}</p>
    </div>

    <!-- 食品列表部分 -->
    <div class="food-container">
      <ul class="food">
        <li v-for="(item, index) in foodArr" :key="item.foodId">
          <div class="food-left">
            <img :src="item.foodImg" />
            <div class="food-left-info">
              <h3>{{ item.foodName }}</h3>
              <p>{{ item.foodExplain }}</p>
              <p>&#165;{{ item.foodPrice }}</p>
            </div>
          </div>

          <div class="food-right">
            <div>
              <i
                class="fa fa-minus-circle"
                v-show="item.quantity !== 0"
                @click="minus(index)"
              ></i>
            </div>
            <p>
              <span v-show="item.quantity !== 0">
                {{ item.quantity }}
              </span>
            </p>
            <div>
              <i
                class="fa fa-plus-circle"
                @click="add(index)"
              ></i>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 购物车部分 -->
    <div class="cart">
      <div class="cart-left">
        <div
          class="cart-left-icon"
          :style="totalQuantity === 0
            ? 'background-color:#505051;'
            : 'background-color:#3190E8;'"
        >
          <i class="fa fa-shopping-cart"></i>
          <div
            class="cart-left-icon-quantity"
            v-show="totalQuantity !== 0"
          >
            {{ totalQuantity }}
          </div>
        </div>

        <div class="cart-left-info">
          <p>&#165;{{ totalPrice }}</p>
          <p>另需配送费{{ business.deliveryPrice }}元</p>
        </div>
      </div>

      <div class="cart-right">
        <!-- 不够起送费 -->
        <div
          class="cart-right-item"
          v-show="totalSettle < business.starPrice"
          style="background-color:#535356;cursor:default;"
        >
          &#165;{{ business.starPrice }}起送
        </div>

        <!-- 达到起送费 -->
        <div
          class="cart-right-item"
          v-show="totalSettle >= business.starPrice"
          @click="toOrder"
        >
          去结算
        </div>
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
  starPrice: 0,
  deliveryPrice: 0
})
const foodArr = ref([])
const user = ref({})

// SessionStorage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

onMounted(async () => {
  user.value = getSessionStorage('user')

  if (!businessId.value) {
    alert('商家ID不能为空！')
    router.back()
    return
  }

  try {
    const businessRes = await request.post(
      '/BusinessController/getBusinessById',
      { businessId: businessId.value }
    )

    if (businessRes && businessRes.data) {
      business.value = businessRes.data
    } else {
      business.value = businessRes
    }

    const foodRes = await request.post(
      '/FoodController/listFoodByBusinessId',
      { businessId: businessId.value }
    )

    if (foodRes && foodRes.data) {
      foodArr.value = foodRes.data.map(item => ({ ...item, quantity: 0 }))
    } else {
      foodArr.value = foodRes.map(item => ({ ...item, quantity: 0 }))
    }

    if (user.value && user.value.userId) {
      await listCart()
    }
  } catch (error) {
    console.error('加载商家信息失败:', error)
    alert('加载商家信息失败，请稍后重试！')
  }
})

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
    console.error('获取购物车失败:', error)
  }
}

const add = async (index) => {
  if (!user.value || !user.value.userId) {
    router.push({ path: '/login' })
    return
  }

  if (foodArr.value[index].quantity === 0) {
    await saveCart(index)
  } else {
    await updateCart(index, 1)
  }
}

const minus = async (index) => {
  if (!user.value || !user.value.userId) {
    router.push({ path: '/login' })
    return
  }

  if (foodArr.value[index].quantity > 1) {
    await updateCart(index, -1)
  } else {
    await removeCart(index)
  }
}

const saveCart = async (index) => {
  try {
    const response = await request.post(
      '/CartController/saveCart',
      {
        businessId: businessId.value,
        userId: user.value.userId,
        foodId: foodArr.value[index].foodId
      }
    )

    const result = response.data || response
    if (result === 1) {
      foodArr.value[index].quantity = 1
    } else {
      alert('向购物车中添加食品失败！')
    }
  } catch (error) {
    console.error('添加购物车失败:', error)
    alert('网络错误，请稍后重试！')
  }
}

const updateCart = async (index, num) => {
  try {
    const response = await request.put(
      '/CartController/updateCart',
      {
        businessId: businessId.value,
        userId: user.value.userId,
        foodId: foodArr.value[index].foodId,
        quantity: foodArr.value[index].quantity + num
      }
    )

    const result = response.data || response
    if (result === 1) {
      foodArr.value[index].quantity += num
    } else {
      alert('更新购物车数量失败！')
    }
  } catch (error) {
    console.error('更新购物车失败:', error)
    alert('网络错误，请稍后重试！')
  }
}

const removeCart = async (index) => {
  try {
    const response = await request.delete(
      '/CartController/removeCart',
      {
        data: {
          businessId: businessId.value,
          userId: user.value.userId,
          foodId: foodArr.value[index].foodId
        }
      }
    )

    const result = response.data || response
    if (result === 1) {
      foodArr.value[index].quantity = 0
    } else {
      alert('从购物车中删除食品失败！')
    }
  } catch (error) {
    console.error('删除购物车失败:', error)
    alert('网络错误，请稍后重试！')
  }
}

const toOrder = () => {
  if (!user.value || !user.value.userId) {
    router.push({ path: '/login' })
    return
  }

  // 检查是否有选择的商品
  const selectedItems = foodArr.value.filter(item => item.quantity > 0)
  if (selectedItems.length === 0) {
    alert('请选择要购买的商品！')
    return
  }

  router.push({
    path: '/orders',
    query: {
      businessId: business.value.businessId,
      businessName: business.value.businessName
    }
  })
}

// 计算属性
const totalPrice = computed(() => {
  return foodArr.value.reduce((total, item) => {
    return total + (item.foodPrice || 0) * (item.quantity || 0)
  }, 0).toFixed(2)
})

const totalQuantity = computed(() => {
  return foodArr.value.reduce((quantity, item) => {
    return quantity + (item.quantity || 0)
  }, 0)
})

const totalSettle = computed(() => {
  const price = parseFloat(totalPrice.value)
  const delivery = parseFloat(business.value.deliveryPrice || 0)
  return price + delivery
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/****************** header部分 ******************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background-color: #0097ff;
  color: #fff;
  font-size: 4.8vw;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4vw;
  flex-shrink: 0;
}

.wrapper header .header-left,
.wrapper header .header-right {
  width: 10vw;
  height: 10vw;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.wrapper header .header-left i {
  font-size: 6vw;
  font-weight: bold;
}

.wrapper header .header-title {
  flex: 1;
  text-align: center;
  font-weight: bold;
  letter-spacing: 0.5vw;
}

/****************** 商家logo部分 ******************/
.wrapper .business-logo {
  width: 100%;
  height: 35vw;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 3vw 0;
}

.wrapper .business-logo img {
  width: 40vw;
  height: 30vw;
  border-radius: 5px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/****************** 商家信息部分 ******************/
.wrapper .business-info {
  width: 100%;
  padding: 3vw 4vw;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
  margin-bottom: 2vw;
}

.wrapper .business-info h1 {
  font-size: 5vw;
  margin-bottom: 2vw;
  color: #333;
  font-weight: bold;
}

.wrapper .business-info p {
  font-size: 3.2vw;
  color: #666;
  margin-top: 1vw;
  line-height: 1.4;
}

/****************** 食品列表容器 ******************/
.wrapper .food-container {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 16vw; /* 为底部购物车留出空间 */
}

/****************** 食品列表部分 ******************/
.wrapper .food {
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #fff;
}

.wrapper .food li {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.wrapper .food li:active {
  background-color: #f9f9f9;
}

.wrapper .food li .food-left {
  display: flex;
  align-items: flex-start;
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.wrapper .food li .food-left img {
  width: 22vw;
  height: 22vw;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.wrapper .food li .food-left-info {
  margin-left: 4vw;
  flex: 1;
  overflow: hidden;
}

.wrapper .food li .food-left-info h3 {
  font-size: 4vw;
  color: #333;
  margin-bottom: 1.5vw;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wrapper .food li .food-left-info p {
  font-size: 3.2vw;
  color: #888;
  margin-top: 1.5vw;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.wrapper .food li .food-left-info p:last-child {
  color: #ff6000;
  font-size: 3.8vw;
  font-weight: bold;
  margin-top: 2vw;
}

.wrapper .food li .food-right {
  display: flex;
  align-items: center;
  gap: 3vw;
  flex-shrink: 0;
  margin-left: 2vw;
}

.wrapper .food li .food-right i {
  font-size: 6vw;
  cursor: pointer;
  transition: transform 0.2s;
}

.wrapper .food li .food-right i:active {
  transform: scale(0.9);
}

.wrapper .food li .food-right i.fa-plus-circle {
  color: #3190E8;
}

.wrapper .food li .food-right i.fa-minus-circle {
  color: #FF4444;
}

.wrapper .food li .food-right p {
  width: 8vw;
  text-align: center;
  font-size: 4.2vw;
  font-weight: bold;
  color: #333;
  min-width: 8vw;
}

/****************** 购物车部分 ******************/
.wrapper .cart {
  width: 100%;
  height: 16vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  flex-shrink: 0;
}

.wrapper .cart .cart-left {
  flex: 2;
  display: flex;
  align-items: center;
  background-color: #3d3d3f;
  padding: 0 4vw;
}

.wrapper .cart .cart-left-icon {
  position: relative;
  width: 12vw;
  height: 12vw;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.wrapper .cart .cart-left-icon i {
  font-size: 6vw;
  color: #fff;
}

.wrapper .cart .cart-left-icon-quantity {
  position: absolute;
  top: -1vw;
  right: -1vw;
  background-color: #FF4444;
  color: #fff;
  font-size: 3vw;
  font-weight: bold;
  width: 6vw;
  height: 6vw;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #fff;
}

.wrapper .cart .cart-left-info {
  margin-left: 3vw;
  color: #fff;
  overflow: hidden;
}

.wrapper .cart .cart-left-info p:first-child {
  font-size: 4.8vw;
  font-weight: bold;
  margin-bottom: 1vw;
}

.wrapper .cart .cart-left-info p:last-child {
  font-size: 3vw;
  color: #aaa;
}

.wrapper .cart .cart-right {
  flex: 1;
  min-width: 0;
}

.wrapper .cart .cart-right-item {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4.5vw;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  padding: 0 2vw;
  text-align: center;
  transition: background-color 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wrapper .cart .cart-right-item[style*="background-color:#535356"] {
  background-color: #535356;
}

.wrapper .cart .cart-right-item:not([style*="background-color:#535356"]) {
  background-color: #3190E8;
}

.wrapper .cart .cart-right-item:not([style*="background-color:#535356"]):active {
  background-color: #2678c5;
}

/* 空列表提示 */
.wrapper .empty-tip {
  text-align: center;
  padding: 10vw;
  color: #999;
  font-size: 4vw;
}

/* 滚动条样式 */
.food-container::-webkit-scrollbar {
  width: 3px;
}

.food-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.food-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.food-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>