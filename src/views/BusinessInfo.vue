<template>
  <div class="w-full h-full bg-gray-100">
    <!-- 头部 -->
    <header class="w-full h-12vw bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-between px-4vw fixed top-0 left-0 z-1000 shadow-md">
      <div class="flex-1 flex items-center">
        <el-button
          @click="router.back()"
          type="primary"
          :icon="ArrowLeft"
          size="large"
          circle
          class="!p-0 !w-8vw !h-8vw !bg-transparent !border-0 !shadow-none hover:!bg-blue-400"
        />
      </div>

      <div class="flex-1 text-center">
        <h1 class="text-4.5vw text-white font-bold tracking-wider">{{ business.businessName || '商家信息' }}</h1>
      </div>

      <div class="flex-1 flex justify-end">
        <el-button
          type="primary"
          :icon="Promotion"
          size="large"
          circle
          class="!p-0 !w-8vw !h-8vw !bg-transparent !border-0 !shadow-none hover:!bg-blue-400"
        />
      </div>
    </header>

    <!-- 商家信息主体 -->
    <div class="w-full mt-12vw pb-22vw">
      <!-- 商家顶部信息卡片 -->
      <div class="m-3vw bg-white rounded-3vw shadow-md overflow-hidden">
        <!-- 商家logo -->
        <div class="relative">
          <img
            :src="business.businessImg"
            class="w-full h-40vw object-cover"
            @error="handleImageError"
          />
          <!-- 商家标签 -->
          <div v-if="business.isRecommended" class="absolute top-3vw left-3vw bg-gradient-to-r from-orange-500 to-red-500 text-white text-3vw font-bold px-3vw py-1vw rounded-2vw shadow-lg">
            推荐商家
          </div>
        </div>

        <!-- 商家基本信息 -->
        <div class="p-4vw">
          <h1 class="text-5vw text-gray-800 mb-3vw font-bold text-center">{{ business.businessName }}</h1>

          <div class="flex items-center justify-center mb-3vw">
            <el-rate
              v-model="business.rating"
              disabled
              size="small"
              class="!text-3.5vw !mr-2vw"
            />
            <span class="text-3.5vw text-orange-500 font-medium">{{ business.rating?.toFixed(1) || '4.5' }}</span>
            <span class="text-3vw text-gray-400 ml-2vw">月售{{ business.monthlySales || '1000+' }}</span>
          </div>

          <div class="grid grid-cols-2 gap-3vw mb-3vw">
            <div class="flex items-center bg-blue-50 p-2vw rounded-2vw">
              <el-icon class="text-blue-500 mr-1.5vw text-4vw">
                <Money />
              </el-icon>
              <div>
                <p class="text-3vw text-gray-600 font-medium">起送费</p>
                <p class="text-3.5vw text-gray-800 font-bold">¥{{ business.starPrice || 0 }}</p>
              </div>
            </div>

            <div class="flex items-center bg-green-50 p-2vw rounded-2vw">
              <el-icon class="text-green-500 mr-1.5vw text-4vw">
                <Bicycle />
              </el-icon>
              <div>
                <p class="text-3vw text-gray-600 font-medium">配送费</p>
                <p class="text-3.5vw text-gray-800 font-bold">¥{{ business.deliveryPrice || 0 }}</p>
              </div>
            </div>
          </div>

          <div class="flex items-center bg-purple-50 p-2vw rounded-2vw mb-3vw">
            <el-icon class="text-purple-500 mr-1.5vw text-4vw">
              <Clock />
            </el-icon>
            <div class="flex-1">
              <p class="text-3vw text-gray-600 font-medium">配送时间</p>
              <p class="text-3.5vw text-gray-800 font-bold">约{{ business.deliveryTime || 30 }}分钟送达</p>
            </div>
          </div>

          <!-- 商家描述 -->
          <div class="bg-gray-50 p-3vw rounded-2vw">
            <h3 class="text-3.5vw text-gray-700 font-bold mb-2vw">商家介绍</h3>
            <p class="text-3.2vw text-gray-600 leading-relaxed">{{ business.businessExplain }}</p>
          </div>
        </div>
      </div>

      <!-- 食品列表 -->
      <div class="m-3vw">
        <h2 class="text-4.5vw text-gray-800 font-bold mb-3vw px-2vw">菜品列表</h2>

        <!-- 食品列表为空时的提示 -->
        <el-empty
          v-if="foodArr.length === 0"
          description="暂无菜品信息"
          :image-size="120"
          class="bg-white rounded-3vw py-8vw"
        >
          <template #image>
            <el-icon size="18vw" color="#909399">
              <Food />
            </el-icon>
          </template>
        </el-empty>

        <!-- 食品列表 -->
        <ul v-else class="w-full">
          <li
            v-for="(item, index) in foodArr"
            :key="item.foodId"
            class="flex p-3vw mb-3vw bg-white rounded-3vw shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <!-- 菜品图片 -->
            <div class="relative flex-shrink-0">
              <img
                :src="item.foodImg"
                class="w-25vw h-25vw rounded-2vw object-cover shadow-sm"
                @error="handleImageError"
              />
              <!-- 菜品数量标签 -->
              <div
                v-show="item.quantity > 0"
                class="absolute -top-1.5vw -right-1.5vw bg-red-500 text-white text-3vw font-bold w-5vw h-5vw rounded-full flex-center shadow-md"
              >
                {{ item.quantity }}
              </div>
            </div>

            <!-- 菜品信息 -->
            <div class="ml-3vw flex-1 min-w-0 flex flex-col">
              <!-- 菜品名称和价格 -->
              <div class="flex-between mb-1.5vw">
                <h3 class="text-4vw text-gray-800 font-bold truncate mr-2vw">{{ item.foodName }}</h3>
                <span class="text-4vw text-orange-500 font-bold flex-shrink-0">¥{{ item.foodPrice }}</span>
              </div>

              <!-- 菜品描述 -->
              <p class="text-3.2vw text-gray-500 line-clamp-2 mb-3vw flex-1">{{ item.foodExplain }}</p>

              <!-- 加减按钮 -->
              <div class="flex items-center justify-end">
                <div @click="minus(index)" v-show="item.quantity !== 0" class="cursor-pointer">
                  <el-icon class="text-5vw text-red-500 hover:text-red-600 transition-colors">
                    <Minus />
                  </el-icon>
                </div>
                <span
                  v-show="item.quantity !== 0"
                  class="text-4vw font-bold text-gray-800 mx-3vw min-w-6vw text-center"
                >
                  {{ item.quantity }}
                </span>
                <div @click="add(index)" class="cursor-pointer">
                  <el-icon class="text-5vw text-blue-500 hover:text-blue-600 transition-colors">
                    <Plus />
                  </el-icon>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 购物车底部栏 -->
    <div class="w-full h-16vw fixed left-0 bottom-0 flex bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-1000">
      <div class="flex-1 bg-gray-800 flex items-center p-3vw">
        <!-- 购物车图标 -->
        <div class="relative ml-2vw">
          <div :class="totalQuantity === 0 ? 'bg-gray-600' : 'bg-blue-500'"
               class="w-12vw h-12vw rounded-full flex-center transition-colors duration-300 shadow-lg">
            <el-icon class="text-6vw text-white">
              <ShoppingCart />
            </el-icon>
            <!-- 购物车数量气泡 -->
            <div v-show="totalQuantity !== 0"
                 class="absolute -top-1.5vw -right-1.5vw bg-red-500 text-white text-3.2vw font-bold w-5.5vw h-5.5vw rounded-full flex-center border-2 border-white shadow-md">
              {{ totalQuantity }}
            </div>
          </div>
        </div>

        <!-- 价格信息 -->
        <div class="ml-3vw text-white">
          <p class="text-4.8vw font-bold mb-0.5vw">¥{{ totalPrice }}</p>
          <p class="text-2.8vw text-gray-300">另需配送费 ¥{{ business.deliveryPrice || 0 }}</p>
        </div>
      </div>

      <!-- 结算按钮 -->
      <div class="flex-1">
        <div v-show="totalSettle < business.starPrice"
             class="w-full h-full bg-gradient-to-r from-gray-500 to-gray-600 text-white text-4.5vw font-bold flex-center cursor-not-allowed">
          ¥{{ business.starPrice || 0 }}起送
        </div>
        <div v-show="totalSettle >= business.starPrice"
             @click="toOrder"
             class="w-full h-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-4.5vw font-bold flex-center cursor-pointer hover:opacity-90 transition-opacity duration-300">
          去结算
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '../utils/request'
import {
  ArrowLeft,
  Promotion,
  Money,
  Bicycle,
  Clock,
  Plus,
  Minus,
  ShoppingCart,
  Food
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const businessId = ref(route.query.businessId)
const business = ref({
  starPrice: 0,
  deliveryPrice: 0,
  rating: 4.5,
  monthlySales: 1000,
  deliveryTime: 30
})
const foodArr = ref([])
const user = ref({})
const loading = ref(false)

// SessionStorage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

// 图片加载失败处理
const handleImageError = (e) => {
  const defaultImage = 'https://via.placeholder.com/300x200/F3F4F6/6B7280?text=No+Image'
  e.target.src = defaultImage
}

onMounted(async () => {
  user.value = getSessionStorage('user')

  if (!businessId.value) {
    ElMessage.error('商家ID不能为空！')
    router.back()
    return
  }

  await fetchBusinessInfo()
  await fetchFoodList()
})

// 获取商家信息
const fetchBusinessInfo = async () => {
  try {
    const response = await request.post(
      '/BusinessController/getBusinessById',
      { businessId: businessId.value }
    )

    if (response && response.data) {
      business.value = {
        ...response.data,
        rating: 4.5 - Math.random() * 0.5,
        monthlySales: Math.floor(Math.random() * 2000) + 500,
        deliveryTime: Math.floor(Math.random() * 20) + 20,
        isRecommended: Math.random() > 0.7
      }
    } else {
      business.value = {
        ...response,
        rating: 4.5 - Math.random() * 0.5,
        monthlySales: Math.floor(Math.random() * 2000) + 500,
        deliveryTime: Math.floor(Math.random() * 20) + 20,
        isRecommended: Math.random() > 0.7
      }
    }
  } catch (error) {
    console.error('获取商家信息失败:', error)
    ElMessage.error('加载商家信息失败，请稍后重试！')
  }
}

// 获取食品列表
const fetchFoodList = async () => {
  loading.value = true
  try {
    const response = await request.post(
      '/FoodController/listFoodByBusinessId',
      { businessId: businessId.value }
    )

    const data = response.data || response
    foodArr.value = Array.isArray(data)
      ? data.map(item => ({ ...item, quantity: 0 }))
      : []

    if (user.value && user.value.userId) {
      await listCart()
    }
  } catch (error) {
    console.error('获取食品列表失败:', error)
    ElMessage.error('加载菜品列表失败，请稍后重试！')
  } finally {
    loading.value = false
  }
}

// 购物车相关方法
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
      ElMessage.error('添加菜品失败！')
    }
  } catch (error) {
    console.error('添加购物车失败:', error)
    ElMessage.error('网络错误，请稍后重试！')
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
      ElMessage.error('更新数量失败！')
    }
  } catch (error) {
    console.error('更新购物车失败:', error)
    ElMessage.error('网络错误，请稍后重试！')
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
      ElMessage.error('移除菜品失败！')
    }
  } catch (error) {
    console.error('移除购物车失败:', error)
    ElMessage.error('网络错误，请稍后重试！')
  }
}

const toOrder = () => {
  if (!user.value || !user.value.userId) {
    router.push({ path: '/login' })
    return
  }

  const selectedItems = foodArr.value.filter(item => item.quantity > 0)
  if (selectedItems.length === 0) {
    ElMessage.warning('请选择要购买的商品！')
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
/* 自定义样式 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 自定义滚动条 */
ul {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

ul::-webkit-scrollbar {
  width: 3px;
}

ul::-webkit-scrollbar-track {
  background: #f1f1f1;
}

ul::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

ul::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>