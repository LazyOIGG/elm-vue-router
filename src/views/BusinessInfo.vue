<template>
  <div class="w-full h-100vh flex flex-col bg-gray-100">
    <!-- 头部 -->
    <header class="header-primary">
      <div class="flex-1 text-center text-4.8vw font-bold">商家信息</div>
    </header>

    <!-- 商家logo -->
    <div class="w-full h-35vw bg-white flex-center p-3vw">
      <img :src="business.businessImg" class="w-40vw h-30vw rounded-1vw object-cover shadow-md" />
    </div>

    <!-- 商家信息 -->
    <div class="w-full p-3vw bg-white border-b border-gray-200 mb-2vw">
      <h1 class="text-5vw text-gray-800 mb-2vw font-bold text-center">{{ business.businessName }}</h1>
      <p class="text-3.2vw text-gray-600 text-center mb-1vw">
        ¥{{ business.starPrice }}起送 ¥{{ business.deliveryPrice }}配送
      </p>
      <p class="text-3.2vw text-gray-600 text-center">{{ business.businessExplain }}</p>
    </div>

    <!-- 食品列表 -->
    <div class="flex-1 overflow-y-auto pb-16vw">
      <ul class="w-full bg-white">
        <li
          v-for="(item, index) in foodArr"
          :key="item.foodId"
          class="flex p-4vw border-b border-gray-100"
        >
          <div class="flex-1 flex">
            <img :src="item.foodImg" class="w-22vw h-22vw rounded-1vw object-cover mr-3vw" />
            <div class="flex-1">
              <h3 class="text-4vw text-gray-800 mb-1.5vw font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                {{ item.foodName }}
              </h3>
              <p class="text-3.2vw text-gray-500 mb-1.5vw line-clamp-2">{{ item.foodExplain }}</p>
              <p class="text-3.8vw text-orange-500 font-bold">¥{{ item.foodPrice }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3vw">
            <div @click="minus(index)" v-show="item.quantity !== 0">
              <el-icon class="text-6vw text-red-500 cursor-pointer">
                <Minus />
              </el-icon>
            </div>
            <p class="text-4.2vw font-bold text-gray-800 min-w-8vw text-center">
              <span v-show="item.quantity !== 0">{{ item.quantity }}</span>
            </p>
            <div @click="add(index)">
              <el-icon class="text-6vw text-blue-500 cursor-pointer">
                <Plus />
              </el-icon>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 购物车 -->
    <div class="w-full h-16vw fixed left-0 bottom-0 flex bg-white shadow-lg z-1000">
      <div class="flex-2 bg-gray-800 flex items-center p-4vw">
        <div class="relative">
          <div :class="totalQuantity === 0 ? 'bg-gray-600' : 'bg-blue-500'"
               class="w-12vw h-12vw rounded-full flex-center">
            <el-icon class="text-6vw text-white">
              <ShoppingCart />
            </el-icon>
            <div v-show="totalQuantity !== 0"
                 class="absolute top--1vw right--1vw bg-red-500 text-white text-3vw font-bold w-6vw h-6vw rounded-full flex-center border border-white">
              {{ totalQuantity }}
            </div>
          </div>
        </div>
        <div class="ml-3vw text-white">
          <p class="text-4.8vw font-bold mb-1vw">¥{{ totalPrice }}</p>
          <p class="text-3vw text-gray-300">另需配送费{{ business.deliveryPrice }}元</p>
        </div>
      </div>

      <div class="flex-1">
        <div v-show="totalSettle < business.starPrice"
             class="w-full h-full bg-gray-600 text-white text-4.5vw font-bold flex-center">
          ¥{{ business.starPrice }}起送
        </div>
        <div v-show="totalSettle >= business.starPrice"
             @click="toOrder"
             class="w-full h-full bg-blue-500 text-white text-4.5vw font-bold flex-center cursor-pointer hover:bg-blue-600">
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
import { Plus, Minus, ShoppingCart } from '@element-plus/icons-vue'

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
    alert('获取购物车失败')
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
    alert('网络错误，请稍后重试！')
  }
}

const toOrder = () => {
  if (!user.value || !user.value.userId) {
    router.push({ path: '/login' })
    return
  }

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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>