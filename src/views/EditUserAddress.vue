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
      <h1 class="text-4.5vw text-white font-bold">编辑送货地址</h1>
      <div class="w-8vw"></div>
    </header>

    <!-- 表单部分 -->
    <div class="w-full mt-12vw bg-white rounded-lg shadow-sm mx-3vw">
      <div class="flex items-center p-4vw border-b border-gray-200">
        <div class="w-20vw text-3.5vw text-gray-700 font-medium">联系人：</div>
        <el-input
          v-model="deliveryAddress.contactName"
          placeholder="请输入联系人姓名"
          size="large"
          class="flex-1"
          :input-style="{ fontSize: '4vw' }"
        />
      </div>

      <div class="flex items-center p-4vw border-b border-gray-200">
        <div class="w-20vw text-3.5vw text-gray-700 font-medium">性别：</div>
        <el-radio-group v-model="deliveryAddress.contactSex" size="large">
          <el-radio :value="1" class="!text-3.5vw !mr-4vw">男</el-radio>
          <el-radio :value="0" class="!text-3.5vw">女</el-radio>
        </el-radio-group>
      </div>

      <div class="flex items-center p-4vw border-b border-gray-200">
        <div class="w-20vw text-3.5vw text-gray-700 font-medium">电话：</div>
        <el-input
          v-model="deliveryAddress.contactTel"
          placeholder="请输入联系电话"
          size="large"
          type="tel"
          class="flex-1"
          :input-style="{ fontSize: '4vw' }"
        />
      </div>

      <div class="flex items-center p-4vw">
        <div class="w-20vw text-3.5vw text-gray-700 font-medium">收货地址：</div>
        <el-input
          v-model="deliveryAddress.address"
          placeholder="请输入详细收货地址"
          size="large"
          class="flex-1"
          :input-style="{ fontSize: '4vw' }"
        />
      </div>
    </div>

    <!-- 更新按钮 -->
    <div class="p-4vw mt-6vw">
      <el-button
        @click="editUserAddress"
        type="primary"
        size="large"
        class="w-full !h-12vw !text-4.5vw !font-bold !rounded-2vw"
      >
        更新地址
      </el-button>
    </div>

    <!-- 底部菜单 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import request from '../utils/request'
import Footer from '../components/Footer.vue'

const route = useRoute()
const router = useRouter()

const businessId = ref(route.query.businessId)
const daId = ref(route.query.daId)
const deliveryAddress = ref({})

// SessionStorage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

// 获取地址详情
const fetchDeliveryAddress = async () => {
  try {
    const response = await request.post(
      'DeliveryAddressController/getDeliveryAddressById',
      { daId: daId.value }
    )
    deliveryAddress.value = response
  } catch (error) {
    ElMessage.error('获取地址详情失败')
  }
}

// 编辑用户地址
const editUserAddress = async () => {
  if (!deliveryAddress.value.contactName?.trim()) {
    ElMessage.warning('联系人姓名不能为空！')
    return
  }
  if (!deliveryAddress.value.contactTel?.trim()) {
    ElMessage.warning('联系人电话不能为空！')
    return
  }
  if (!deliveryAddress.value.address?.trim()) {
    ElMessage.warning('收货地址不能为空！')
    return
  }

  try {
    const response = await request.put(
      'DeliveryAddressController/updateDeliveryAddress',
      deliveryAddress.value
    )
    if (response > 0) {
      ElMessage.success('地址更新成功！')
      router.push({
        path: '/userAddress',
        query: { businessId: businessId.value }
      })
    } else {
      ElMessage.error('更新地址失败！')
    }
  } catch (error) {
    ElMessage.error('更新地址失败')
  }
}

onMounted(() => {
  const user = getSessionStorage('user')
  if (!user) {
    router.push('/login')
    return
  }

  fetchDeliveryAddress()
})
</script>

<style scoped>
.header-primary {
  @apply w-full h-12vw bg-gradient-to-r from-blue-500 to-blue-600
         flex items-center justify-between px-4vw fixed top-0 left-0 z-1000 shadow-md;
}

:deep(.el-radio__label) {
  font-size: 3.5vw !important;
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid #dcdfe6 !important;
  border-radius: 2vw !important;
  padding: 0 3vw !important;
}

:deep(.el-input__wrapper:hover) {
  border-color: #c0c4cc !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409eff !important;
}
</style>