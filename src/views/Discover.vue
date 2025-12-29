<template>
  <div class="w-full h-full bg-gray-100">
    <!-- 头部 -->
    <header
        class="w-full h-12vw bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-between px-4vw fixed top-0 left-0 z-1000 shadow-md">
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
        <h1 class="text-4.5vw text-white font-bold tracking-wider">发现商家</h1>
      </div>

      <div class="flex-1 flex justify-end">
        <el-button
            type="primary"
            :icon="Search"
            size="large"
            circle
            class="!p-0 !w-8vw !h-8vw !bg-transparent !border-0 !shadow-none hover:!bg-blue-400"
            @click="handleSearch"
        />
      </div>
    </header>

    <!-- 商家列表 -->
    <div class="w-full mt-12vw mb-16vw pb-20vw">
      <!-- 商家列表为空时的提示 -->
      <el-empty
          v-if="businessArr.length === 0"
          description="暂无商家信息"
          :image-size="150"
          class="mt-10vw"
      >
        <template #image>
          <el-icon size="20vw" color="#909399">
            <Shop/>
          </el-icon>
        </template>
        <el-button type="primary" @click="fetchAllBusinesses">
          重新加载
        </el-button>
      </el-empty>

      <!-- 商家列表 -->
      <ul v-else class="w-full">
        <li
            v-for="item in businessArr"
            :key="item.businessId"
            @click="toBusinessInfo(item.businessId)"
            class="flex p-3vw m-3vw bg-white rounded-2vw cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-blue-200"
        >
          <!-- 商家图片区域 -->
          <div class="relative flex-shrink-0">
            <img :src="item.businessImg" class="w-20vw h-20vw rounded-2vw object-cover shadow-sm"/>
            <div
                v-show="item.quantity > 0"
                class="absolute -top-1.5vw -right-1.5vw bg-red-500 text-white text-2.8vw font-bold w-4.5vw h-4.5vw rounded-full flex-center shadow-md"
            >
              {{ item.quantity }}
            </div>

            <!-- 商家标签 -->
            <div v-if="item.isRecommended"
                 class="absolute bottom-0 left-0 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-2.5vw text-center py-0.5vw rounded-b-2vw">
              推荐
            </div>
          </div>

          <!-- 商家信息区域 -->
          <div class="ml-3vw flex-1 min-w-0 flex flex-col">
            <!-- 第一行：店名和进店按钮 -->
            <div class="flex-between mb-0.5vw">
              <h3 class="text-4vw text-gray-800 font-bold truncate mr-2vw">{{ item.businessName }}</h3>
              <el-button
                  type="primary"
                  size="small"
                  class="!text-3vw !px-3vw !py-1vw !rounded-2vw !h-auto !min-h-6vw flex-shrink-0"
                  @click.stop="toBusinessInfo(item.businessId)"
              >
                进店
              </el-button>
            </div>

            <!-- 第二行：星级评分 -->
            <div class="flex items-center mb-1vw">
              <el-rate
                  v-model="item.rating"
                  disabled
                  size="small"
                  class="!text-3vw !mr-2vw"
              />
              <span class="text-3vw text-orange-500 font-medium">{{ item.rating.toFixed(1) }}</span>
              <span class="text-2.8vw text-gray-400 ml-1vw">月售{{ item.monthlySales || 1000 }}+</span>
            </div>

            <!-- 第三行：配送信息 -->
            <div class="flex items-center mb-0.5vw">
              <el-icon class="text-blue-500 mr-1vw text-3vw">
                <Money/>
              </el-icon>
              <span class="text-3vw text-gray-600">
                ¥{{ item.starPrice }}起送 | ¥{{ item.deliveryPrice }}配送
              </span>
            </div>

            <!-- 第四行：送达时间 -->
            <div class="flex items-center mb-1.5vw">
              <el-icon class="text-green-500 mr-1vw text-3vw">
                <Clock/>
              </el-icon>
              <span class="text-3vw text-gray-500">约{{ item.deliveryTime || 30 }}分钟送达</span>
            </div>

            <!-- 第五行：商家描述（可换行显示） -->
            <p class="text-3vw text-gray-500 line-clamp-2 flex-1">{{ item.businessExplain }}</p>
          </div>
        </li>
      </ul>
    </div>

    <!-- 底部菜单 -->
    <Footer/>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import request from '../utils/request'
import Footer from '../components/Footer.vue'
import {
  ArrowLeft,
  Search,
  Shop,
  Money,
  Clock
} from '@element-plus/icons-vue'

const router = useRouter()

const businessArr = ref([])
const loading = ref(false)

// SessionStorage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

// 获取所有商家列表（调用所有分类接口并合并结果）
const fetchAllBusinesses = async () => {
  if (loading.value) return
  loading.value = true

  try {
    // 存储所有商家的集合，使用 Map 防止重复
    const allBusinessesMap = new Map()

    // 遍历 1-10 的 orderTypeId
    const orderTypeIds = Array.from({length: 10}, (_, i) => i + 1)

    // 并发请求所有分类
    const promises = orderTypeIds.map(orderTypeId =>
      request.post('BusinessController/listBusinessByOrderTypeId', {orderTypeId})
    )

    // 等待所有请求完成
    const responses = await Promise.all(promises)

    // 合并所有结果
    responses.forEach(response => {
      if (Array.isArray(response)) {
        response.forEach(business => {
          // 使用 businessId 作为键，防止重复商家
          if (!allBusinessesMap.has(business.businessId)) {
            // 添加模拟数据
            allBusinessesMap.set(business.businessId, {
              ...business,
              rating: 4.5 - Math.random() * 0.5, // 4.0-4.5之间的随机评分
              monthlySales: Math.floor(Math.random() * 2000) + 500,
              deliveryTime: Math.floor(Math.random() * 20) + 20, // 20-40分钟送达
              isRecommended: Math.random() > 0.7,
              quantity: 0 // 初始化为0，后面会根据购物车更新
            })
          }
        })
      }
    })

    // 将 Map 转换为数组
    businessArr.value = Array.from(allBusinessesMap.values())

    // 获取购物车信息
    const user = getSessionStorage('user')
    if (user) {
      await fetchCart(user)
    }
  } catch (error) {
    console.error('获取商家列表失败:', error)
    ElMessage.error('获取商家列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 查询购物车，统计每个商家的商品数量
const fetchCart = async (user) => {
  try {
    const response = await request.post(
        'CartController/listCart',
        {userId: user.userId}
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
    console.error('获取购物车失败:', error)
  }
}

// 跳转商家详情页
const toBusinessInfo = (businessId) => {
  router.push({
    path: '/businessInfo',
    query: {businessId}
  })
}

// 搜索处理
const handleSearch = () => {
  ElMessage.info('搜索功能开发中...')
}

onMounted(() => {
  fetchAllBusinesses()
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

/* 调整星级组件样式 */
:deep(.el-rate__icon) {
  margin-right: 0.5vw !important;
}

:deep(.el-rate) {
  height: auto !important;
}

/* 覆盖 Element Plus 按钮样式 */
:deep(.el-button) {
  --el-button-hover-text-color: var(--el-color-white);
  --el-button-hover-bg-color: var(--el-color-primary-light-3);
  --el-button-hover-border-color: var(--el-color-primary-light-3);
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