<template>
  <div class="w-full h-full">
    <!-- 顶部定位栏 -->
    <header class="h-12vw bg-primary flex items-center text-white pl-3vw">
      <div class="mr-2vw">
        <el-icon class="text-5vw">
          <Location/>
        </el-icon>
      </div>
      <div class="flex items-center text-4.5vw font-bold">
        沈阳市规划大厦
        <el-icon class="ml-1vw text-3.5vw">
          <ArrowDown/>
        </el-icon>
      </div>
    </header>

    <!-- 搜索栏（吸顶效果） -->
    <div class="h-13vw">
      <div
          ref="fixedBox"
          class="h-13vw bg-primary flex-center"
      >
        <div
            class="w-90% h-9vw bg-white rounded-2vw flex-center text-3.5vw text-gray-400 cursor-pointer"
            @click="showSearchDialog"
        >
          <el-icon class="mr-2vw text-4vw">
            <Search/>
          </el-icon>
          搜索饿了么商家、商品名称
        </div>
      </div>
    </div>

    <!-- 分类图标区 -->
    <ul class="flex flex-wrap justify-around py-3vw">
      <li
          v-for="item in foodTypes"
          :key="item.id"
          @click="toBusinessList(item.id)"
          class="w-18vw text-center mb-3vw cursor-pointer hover:scale-105 transition-transform"
      >
        <img
            :src="getImageUrl(item.img)"
            class="w-12vw h-12vw mb-1vw rounded-full"
        />
        <p class="text-3.2vw text-gray-800">
          {{ item.name }}
        </p>
      </li>
    </ul>

    <!-- 品质套餐横幅 -->
    <div
        class="w-95% h-29vw mx-auto my-2vw rounded-2vw p-3vw text-white banner-bg shadow-md"
    >
      <h3 class="text-5vw mb-1vw font-bold">品质套餐</h3>
      <p class="text-3.5vw mb-2vw">搭配齐全吃得好</p>
      <a
          class="inline-block text-3.2vw bg-secondary px-3vw py-1vw rounded-2vw hover:bg-orange-600 transition-colors"
      >
        立即抢购 &gt;
      </a>
    </div>

    <!-- 超级会员横幅 -->
    <div
        class="w-95% h-11vw mx-auto my-2vw bg-yellow-100 rounded-2vw flex-between px-3vw shadow-sm"
    >
      <div class="flex items-center">
        <img
            :src="getImageUrl('super_member.png')"
            class="w-8vw h-8vw mr-2vw rounded-full"
        />
        <div>
          <h3 class="text-4vw text-gray-800 mb-0.5vw font-bold">
            超级会员
          </h3>
          <p class="text-3vw text-gray-600">
            • 每月享超值权益
          </p>
        </div>
      </div>
      <div class="text-secondary text-3.2vw font-bold hover:text-orange-600 cursor-pointer">
        立即开通 &gt;
      </div>
    </div>

    <!-- 附近商家 -->
    <div class="w-full px-3vw mt-5vw">
      <h2 class="text-4.5vw text-gray-800 font-bold mb-3vw">附近商家</h2>
      
      <!-- 商家列表为空时的提示 -->
      <el-empty
          v-if="businessArr.length === 0"
          description="暂无商家信息"
          :image-size="100"
          class="mt-5vw"
      >
        <template #image>
          <el-icon size="15vw" color="#909399">
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
            class="flex p-3vw mb-3vw bg-white rounded-2vw cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-gray-100 hover:border-blue-200"
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

    <!-- 底部导航栏 -->
    <Footer/>

    <!-- 搜索对话框 -->
    <el-dialog
        v-model="searchDialogVisible"
        title="搜索商家"
        width="90%"
        align-center
        class="rounded-3vw"
    >
      <div class="px-2vw">
        <el-input
            v-model="searchKeyword"
            placeholder="请输入商家名称、商品名称"
            size="large"
            class="mb-3vw"
            @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button type="primary" @click="handleSearch">
              <el-icon>
                <Search/>
              </el-icon>
            </el-button>
          </template>
        </el-input>

        <div v-if="searchResult.length > 0">
          <h3 class="text-4vw text-gray-800 font-bold mb-2vw">搜索结果</h3>
          <ul class="max-h-50vh overflow-y-auto">
            <li
                v-for="item in searchResult"
                :key="item.businessId"
                @click="toBusinessInfo(item.businessId)"
                class="flex p-2vw mb-2vw bg-gray-50 rounded-2vw cursor-pointer hover:bg-blue-50 transition-colors"
            >
              <img :src="item.businessImg" class="w-12vw h-12vw rounded-2vw object-cover mr-2vw"/>
              <div>
                <h4 class="text-3.5vw text-gray-800 font-bold mb-0.5vw">{{ item.businessName }}</h4>
                <p class="text-3vw text-gray-500">{{ item.businessExplain }}</p>
              </div>
            </li>
          </ul>
        </div>

        <div v-else-if="searchKeyword && !searching">
          <p class="text-3.5vw text-gray-500 text-center py-5vw">未找到相关商家</p>
        </div>

        <!-- 热门搜索 -->
        <div v-if="!searchKeyword && searchResult.length === 0" class="mt-3vw">
          <h3 class="text-4vw text-gray-800 font-bold mb-2vw">热门搜索</h3>
          <div class="flex flex-wrap gap-2vw">
            <span
                v-for="tag in hotSearchTags"
                :key="tag"
                @click="searchKeyword = tag; handleSearch()"
                class="px-3vw py-1.5vw bg-gray-100 text-3.2vw text-gray-700 rounded-2vw cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition-colors"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted, computed} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElDialog, ElInput} from 'element-plus'
import request from '../utils/request'
import Footer from '../components/Footer.vue'

import {
  Location,
  ArrowDown,
  Search,
  Filter,
  Shop,
  Money,
  Clock
} from '@element-plus/icons-vue'

const router = useRouter()
const fixedBox = ref(null)
const searchDialogVisible = ref(false)
const searchKeyword = ref('')
const searchResult = ref([])
const searching = ref(false)

// 动态获取图片URL
const getImageUrl = (name) =>
    new URL(`../assets/img/${name}`, import.meta.url).href

// 分类数据
const foodTypes = ref([
  {id: 1, img: 'dcfl01.png', name: '美食'},
  {id: 2, img: 'dcfl02.png', name: '早餐'},
  {id: 3, img: 'dcfl03.png', name: '跑腿代购'},
  {id: 4, img: 'dcfl04.png', name: '汉堡披萨'},
  {id: 5, img: 'dcfl05.png', name: '甜品饮品'},
  {id: 6, img: 'dcfl06.png', name: '速食简餐'},
  {id: 7, img: 'dcfl07.png', name: '地方小吃'},
  {id: 8, img: 'dcfl08.png', name: '米粉面馆'},
  {id: 9, img: 'dcfl09.png', name: '包子粥铺'},
  {id: 10, img: 'dcfl10.png', name: '炸鸡炸串'}
])

// 热门搜索标签
const hotSearchTags = ref([
  '火锅', '奶茶', '炸鸡', '披萨', '烧烤',
  '寿司', '咖啡', '甜品', '快餐', '小吃'
])

// 商家数据
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

// 搜索商家
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  searching.value = true
  try {
    // 模拟搜索，实际应该调用后端搜索接口
    // 这里先用前端过滤的方式实现
    searchResult.value = businessArr.value.filter(item => {
      const keyword = searchKeyword.value.toLowerCase()
      return item.businessName.toLowerCase().includes(keyword) ||
             item.businessExplain.toLowerCase().includes(keyword)
    })

    if (searchResult.value.length === 0) {
      ElMessage.info('未找到相关商家')
    }
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请稍后重试')
  } finally {
    searching.value = false
  }
}

// 显示搜索对话框
const showSearchDialog = () => {
  searchDialogVisible.value = true
  searchKeyword.value = ''
  searchResult.value = []
}

// 跳转到商家列表
const toBusinessList = (orderTypeId) => {
  router.push({
    path: '/businessList',
    query: {orderTypeId}
  })
}

// 跳转商家详情页
const toBusinessInfo = (businessId) => {
  searchDialogVisible.value = false
  router.push({
    path: '/businessInfo',
    query: {businessId}
  })
}

// 处理滚动，实现搜索栏吸顶
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const width = document.documentElement.clientWidth
  const search = fixedBox.value

  if (!search) return

  if (scrollTop > width * 0.12) {
    search.style.position = 'fixed'
    search.style.top = '0'
    search.style.left = '0'
    search.style.zIndex = '999'
    search.style.width = '100%'
  } else {
    search.style.position = 'static'
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchAllBusinesses()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 横幅背景图 - 添加渐变覆盖 */
.banner-bg {
  background:
    linear-gradient(135deg, rgba(255, 107, 107, 0.5) 0%, rgba(255, 142, 83, 0.50) 100%),
    url("../assets/img/index_banner.png") no-repeat center / cover;
}

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