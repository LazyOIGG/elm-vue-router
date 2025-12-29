<template>
  <div class="w-full h-full">
    <!-- 顶部定位栏 -->
    <header class="h-12vw bg-primary flex items-center text-white pl-3vw">
      <div class="mr-2vw">
        <el-icon class="text-5vw">
          <Location />
        </el-icon>
      </div>
      <div class="flex items-center text-4.5vw font-bold">
        沈阳市规划大厦
        <el-icon class="ml-1vw text-3.5vw">
          <ArrowDown />
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
          class="w-90% h-9vw bg-white rounded-2vw flex-center text-3.5vw text-gray-400"
        >
          <el-icon class="mr-2vw text-4vw">
            <Search />
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

    <!-- 推荐商家标题 -->
    <div class="flex items-center justify-center my-4vw">
      <div class="w-20% h-1px bg-gray-300"></div>
      <p class="mx-2vw text-4vw text-gray-600 font-bold">
        推荐商家
      </p>
      <div class="w-20% h-1px bg-gray-300"></div>
    </div>

    <!-- 排序筛选栏 -->
    <ul
      class="flex justify-around py-2vw border-b-1px bg-white"
    >
      <li
        class="flex items-center bg-gray-100 px-2vw py-1vw rounded-3vw text-3.5vw text-gray-600 cursor-pointer hover:bg-gray-200"
      >
        综合排序
        <el-icon class="ml-1vw text-3vw">
          <ArrowDown />
        </el-icon>
      </li>
      <li class="text-3.5vw text-gray-600 cursor-pointer hover:text-gray-800">
        距离最近
      </li>
      <li class="text-3.5vw text-gray-600 cursor-pointer hover:text-gray-800">
        销量最高
      </li>
      <li
        class="flex items-center text-3.5vw text-gray-600 cursor-pointer hover:text-gray-800"
      >
        筛选
        <el-icon class="ml-1vw text-3vw">
          <Filter />
        </el-icon>
      </li>
    </ul>

    <!-- 商家列表 -->
    <ul class="mb-14vw">
      <li
        v-for="business in businesses"
        :key="business.id"
        class="flex p-3vw border-b-1px cursor-pointer hover:bg-gray-50"
      >
        <img
          :src="getImageUrl(business.img)"
          class="w-20vw h-20vw mr-3vw rounded-2vw object-cover"
        />
        <div class="flex flex-col justify-center">
          <h3 class="text-4vw text-gray-800 mb-1vw font-bold">
            {{ business.name }}
          </h3>
          <p class="text-3.2vw text-gray-500">
            {{ business.delivery }}
          </p>
        </div>
      </li>
    </ul>

    <!-- 底部导航栏 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'
import {
  Location,
  ArrowDown,
  Search,
  Filter
} from '@element-plus/icons-vue'

const router = useRouter()
const fixedBox = ref(null)

// 动态获取图片URL
const getImageUrl = (name) =>
  new URL(`../assets/img/${name}`, import.meta.url).href

// 分类数据
const foodTypes = ref([
  { id: 1, img: 'dcfl01.png', name: '美食' },
  { id: 2, img: 'dcfl02.png', name: '早餐' },
  { id: 3, img: 'dcfl03.png', name: '跑腿代购' },
  { id: 4, img: 'dcfl04.png', name: '汉堡披萨' },
  { id: 5, img: 'dcfl05.png', name: '甜品饮品' },
  { id: 6, img: 'dcfl06.png', name: '速食简餐' },
  { id: 7, img: 'dcfl07.png', name: '地方小吃' },
  { id: 8, img: 'dcfl08.png', name: '米粉面馆' },
  { id: 9, img: 'dcfl09.png', name: '包子粥铺' },
  { id: 10, img: 'dcfl10.png', name: '炸鸡炸串' }
])

// 商家数据
const businesses = ref([
  { id: 1, img: 'sj01.png', name: '万家饺子（软件园E18店）', delivery: '￥15起送 | ￥3配送' },
  { id: 2, img: 'sj02.png', name: '小锅饭豆腐馆（全运店）', delivery: '￥15起送 | ￥3配送' }
])

// 跳转到商家列表
const toBusinessList = (orderTypeId) => {
  router.push({
    path: '/businessList',
    query: { orderTypeId }
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
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* 横幅背景图 */
.banner-bg {
  background: url("../assets/img/index_banner.png") no-repeat center / cover;
}
</style>