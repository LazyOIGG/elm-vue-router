<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>商家信息</p>
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
const business = ref({})
const foodArr = ref([])
const user = ref({})

// SessionStorage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

onMounted(async () => {
  user.value = getSessionStorage('user')

  try {
    // 获取商家信息
    const businessRes = await request.post(
      'BusinessController/getBusinessById',
      { businessId: businessId.value }
    )
    business.value = businessRes

    // 获取食品信息
    const foodRes = await request.post(
      'FoodController/listFoodByBusinessId',
      { businessId: businessId.value }
    )
    foodArr.value = foodRes.map(item => ({ ...item, quantity: 0 }))

    if (user.value) {
      await listCart()
    }
  } catch (error) {
    console.error(error)
  }
})

const listCart = async () => {
  try {
    const response = await request.post(
      'CartController/listCart',
      {
        businessId: businessId.value,
        userId: user.value.userId
      }
    )

    const cartArr = response
    foodArr.value.forEach(foodItem => {
      foodItem.quantity = 0
      cartArr.forEach(cartItem => {
        if (cartItem.foodId === foodItem.foodId) {
          foodItem.quantity = cartItem.quantity
        }
      })
    })
  } catch (error) {
    console.error(error)
  }
}

const add = async (index) => {
  if (!user.value) {
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
  if (!user.value) {
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
      'CartController/saveCart',
      {
        businessId: businessId.value,
        userId: user.value.userId,
        foodId: foodArr.value[index].foodId
      }
    )

    if (response === 1) {
      foodArr.value[index].quantity = 1
    } else {
      alert('向购物车中添加食品失败！')
    }
  } catch (error) {
    console.error(error)
  }
}

const updateCart = async (index, num) => {
  try {
    const response = await request.put(
      'CartController/updateCart',
      {
        businessId: businessId.value,
        userId: user.value.userId,
        foodId: foodArr.value[index].foodId,
        quantity: foodArr.value[index].quantity + num
      }
    )

    if (response === 1) {
      foodArr.value[index].quantity += num
    } else {
      alert('向购物车中更新食品失败！')
    }
  } catch (error) {
    console.error(error)
  }
}

const removeCart = async (index) => {
  try {
    const response = await request.delete(
      'CartController/removeCart',
      {
        data: {
          businessId: businessId.value,
          userId: user.value.userId,
          foodId: foodArr.value[index].foodId
        }
      }
    )

    if (response === 1) {
      foodArr.value[index].quantity = 0
    } else {
      alert('从购物车中删除食品失败！')
    }
  } catch (error) {
    console.error(error)
  }
}

const toOrder = () => {
  router.push({
    path: '/orders',
    query: { businessId: business.value.businessId }
  })
}

// 计算属性
const totalPrice = computed(() => {
  return foodArr.value.reduce((total, item) => {
    return total + item.foodPrice * item.quantity
  }, 0)
})

const totalQuantity = computed(() => {
  return foodArr.value.reduce((quantity, item) => {
    return quantity + item.quantity
  }, 0)
})

const totalSettle = computed(() => {
  return totalPrice.value + business.value.deliveryPrice
})
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

/****************** 商家logo部分 ******************/
.wrapper .business-logo {
  width: 100%;
  height: 35vw;
  margin-top: 12vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper .business-logo img {
  width: 40vw;
  height: 30vw;
  border-radius: 5px;
}

/****************** 商家信息部分 ******************/
.wrapper .business-info {
  width: 100%;
  height: 20vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.wrapper .business-info h1 {
  font-size: 5vw;
}

.wrapper .business-info p {
  font-size: 3vw;
  color: #666;
  margin-top: 1vw;
}

/****************** 食品列表部分 ******************/
.wrapper .food {
  width: 100%;
  margin-bottom: 14vw;
}

.wrapper .food li {
  width: 100%;
  box-sizing: border-box;
  padding: 2.5vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .food li .food-left {
  display: flex;
  align-items: center;
}

.wrapper .food li .food-left img {
  width: 20vw;
  height: 20vw;
}

.wrapper .food li .food-left-info {
  margin-left: 3vw;
}

.wrapper .food li .food-left-info h3 {
  font-size: 3.8vw;
  color: #555;
}

.wrapper .food li .food-left-info p {
  font-size: 3vw;
  color: #888;
  margin-top: 2vw;
}

/****************** 购物车部分 ******************/
.wrapper .cart {
  width: 100%;
  height: 14vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
}
</style>