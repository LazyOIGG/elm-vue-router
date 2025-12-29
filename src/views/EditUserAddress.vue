<template>
  <div class="w-full h-full bg-gray-100">
    <!-- 头部 -->
    <header class="header-primary">
      <p>编辑送货地址</p>
    </header>

    <!-- 表单部分 -->
    <ul class="w-full mt-12vw bg-white">
      <li class="flex p-3vw border-b border-gray-200">
        <div class="w-18vw text-3vw font-bold text-gray-600 pt-1vw">联系人：</div>
        <div class="flex-1">
          <input
            type="text"
            v-model="deliveryAddress.contactName"
            placeholder="联系人姓名"
            class="form-input"
          />
        </div>
      </li>

      <li class="flex p-3vw border-b border-gray-200">
        <div class="w-18vw text-3vw font-bold text-gray-600 pt-1vw">性别：</div>
        <div class="flex-1 flex items-center gap-3vw text-3vw">
          <label class="flex items-center gap-1vw">
            <input
              type="radio"
              v-model="deliveryAddress.contactSex"
              :value="1"
              class="w-4vw h-4vw"
            />
            男
          </label>
          <label class="flex items-center gap-1vw">
            <input
              type="radio"
              v-model="deliveryAddress.contactSex"
              :value="0"
              class="w-4vw h-4vw"
            />
            女
          </label>
        </div>
      </li>

      <li class="flex p-3vw border-b border-gray-200">
        <div class="w-18vw text-3vw font-bold text-gray-600 pt-1vw">电话：</div>
        <div class="flex-1">
          <input
            type="tel"
            v-model="deliveryAddress.contactTel"
            placeholder="电话"
            class="form-input"
          />
        </div>
      </li>

      <li class="flex p-3vw border-b border-gray-200">
        <div class="w-18vw text-3vw font-bold text-gray-600 pt-1vw">收货地址：</div>
        <div class="flex-1">
          <input
            type="text"
            v-model="deliveryAddress.address"
            placeholder="收货地址"
            class="form-input"
          />
        </div>
      </li>
    </ul>

    <!-- 更新按钮 -->
    <div class="p-3vw mt-3vw">
      <button @click="editUserAddress" class="button-primary">
        更新
      </button>
    </div>

    <!-- 底部菜单 -->
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
    alert('获取地址详情失败')
  }
}

// 编辑用户地址
const editUserAddress = async () => {
  if (!deliveryAddress.value.contactName) {
    alert('联系人姓名不能为空！')
    return
  }
  if (!deliveryAddress.value.contactTel) {
    alert('联系人电话不能为空！')
    return
  }
  if (!deliveryAddress.value.address) {
    alert('联系人地址不能为空！')
    return
  }

  try {
    const response = await request.put(
      'DeliveryAddressController/updateDeliveryAddress',
      deliveryAddress.value
    )
    if (response > 0) {
      router.push({
        path: '/userAddress',
        query: { businessId: businessId.value }
      })
    } else {
      alert('更新地址失败！')
    }
  } catch (error) {
    alert('更新地址失败')
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