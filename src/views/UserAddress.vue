<template>
  <div class="w-full h-full bg-gray-100">
    <!-- 头部 -->
    <header class="header-primary">
      <el-button
        @click="router.back()"
        type="primary"
        :icon="ArrowLeft"
        size="large"
        circle
        class="!p-0 !w-8vw !h-8vw !bg-transparent !border-0 !shadow-none hover:!bg-blue-400"
      />
      <h1 class="text-4.5vw text-white font-bold">地址管理</h1>
      <div class="w-8vw"></div>
    </header>

    <!-- 地址列表 -->
    <div class="w-full mt-12vw px-3vw pb-16vw">
      <!-- 地址列表 -->
      <div v-if="deliveryAddressArr.length > 0" class="space-y-2vw">
        <div
          v-for="item in deliveryAddressArr"
          :key="item.daId"
          class="bg-white rounded-2vw shadow-sm overflow-hidden"
        >
          <div class="p-4vw">
            <div
              @click="setDeliveryAddress(item)"
              class="mb-3vw cursor-pointer"
            >
              <h3 class="text-4vw text-gray-800 font-bold mb-1vw">
                {{ item.contactName }} {{ sexFilter(item.contactSex) }}
              </h3>
              <p class="text-3.8vw text-gray-700 font-medium">{{ item.contactTel }}</p>
              <p class="text-3.5vw text-gray-600 mt-2vw line-clamp-2">{{ item.address }}</p>
            </div>

            <div class="flex justify-end items-center pt-3vw border-t border-gray-200">
              <el-button
                @click.stop="editUserAddress(item.daId)"
                type="primary"
                size="small"
                class="!h-8vw !text-3.2vw !px-4vw !mr-2vw"
              >
                编辑
              </el-button>
              <el-button
                @click.stop="removeUserAddress(item.daId)"
                type="danger"
                size="small"
                class="!h-8vw !text-3.2vw !px-4vw"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="mt-15vw text-center">
        <el-icon size="20vw" color="#909399">
          <Location />
        </el-icon>
        <p class="text-4vw text-gray-500 mt-4vw">暂无地址信息</p>
        <p class="text-3.2vw text-gray-400 mt-2vw">请添加收货地址</p>
      </div>

      <!-- 新增地址按钮 -->
      <div class="fixed bottom-16vw left-0 w-full px-3vw z-100">
        <el-button
          @click="toAddUserAddress"
          type="primary"
          size="large"
          class="w-full !h-12vw !text-4.5vw !font-bold !rounded-2vw shadow-lg"
        >
          <el-icon class="mr-2vw">
            <Plus />
          </el-icon>
          新增收货地址
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Location,
  Plus
} from '@element-plus/icons-vue'
import request from '../utils/request'

const route = useRoute()
const router = useRouter()

const businessId = ref(route.query.businessId)
const deliveryAddressArr = ref([])

// Storage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

const getLocalStorage = (key) => {
  const item = localStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const removeLocalStorage = (key) => {
  localStorage.removeItem(key)
}

// 性别过滤器
const sexFilter = (value) => {
  return value === 1 ? '先生' : '女士'
}

// 获取用户地址列表
const fetchDeliveryAddresses = async () => {
  const user = getSessionStorage('user')
  if (!user) {
    router.push('/login')
    return
  }

  try {
    const response = await request.post(
      'DeliveryAddressController/listDeliveryAddressByUserId',
      { userId: user.userId }
    )
    deliveryAddressArr.value = response
  } catch (error) {
    ElMessage.error('获取地址列表失败')
  }
}

// 设置默认送货地址
const setDeliveryAddress = (deliveryAddress) => {
  const user = getSessionStorage('user')
  if (!user) return

  setLocalStorage(user.userId, deliveryAddress)

  // 如果是从订单页面跳转过来的，返回订单页面
  if (businessId.value) {
    router.push({
      path: '/orders',
      query: { businessId: businessId.value }
    })
  } else {
    ElMessage.success('默认地址已设置')
  }
}

// 跳转新增地址页
const toAddUserAddress = () => {
  router.push({
    path: '/addUserAddress',
    query: { businessId: businessId.value }
  })
}

// 跳转编辑地址页
const editUserAddress = (daId) => {
  router.push({
    path: '/editUserAddress',
    query: {
      businessId: businessId.value,
      daId
    }
  })
}

// 删除地址
const removeUserAddress = async (daId) => {
  try {
    await ElMessageBox.confirm(
      '确认要删除此送货地址吗？',
      '删除地址',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )

    const response = await request.delete(
      'DeliveryAddressController/removeDeliveryAddress',
      { data: { daId } }
    )

    if (response > 0) {
      const user = getSessionStorage('user')
      if (user) {
        const deliveryAddress = getLocalStorage(user.userId)
        if (deliveryAddress && deliveryAddress.daId === daId) {
          removeLocalStorage(user.userId)
        }
      }
      await fetchDeliveryAddresses()
      ElMessage.success('地址删除成功')
    } else {
      ElMessage.error('删除地址失败！')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除地址失败')
    }
  }
}

onMounted(() => {
  fetchDeliveryAddresses()
})
</script>

<style scoped>
.header-primary {
  @apply w-full h-12vw bg-gradient-to-r from-blue-500 to-blue-600
         flex items-center justify-between px-4vw fixed top-0 left-0 z-1000 shadow-md;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>