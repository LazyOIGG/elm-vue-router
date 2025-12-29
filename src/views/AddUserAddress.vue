<template>
  <div class="w-full h-full bg-gray-100">
    <!-- 头部 -->
    <header class="header-primary">
      <p>新增送货地址</p>
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

    <!-- 保存按钮 -->
    <div class="p-3vw mt-3vw">
      <button @click="addUserAddress" class="button-primary">
        保存
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
const deliveryAddress = ref({
  contactName: '',
  contactSex: 1,
  contactTel: '',
  address: ''
})

// SessionStorage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

// 添加用户地址
const addUserAddress = async () => {
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

  const user = getSessionStorage('user')
  if (!user) {
    alert('用户未登录')
    return
  }

  const addressData = {
    ...deliveryAddress.value,
    userId: user.userId
  }

  try {
    const response = await request.post(
      'DeliveryAddressController/saveDeliveryAddress',
      addressData
    )
    if (response > 0) {
      router.push({
        path: '/userAddress',
        query: { businessId: businessId.value }
      })
    } else {
      alert('新增地址失败！')
    }
  } catch (error) {
    alert('请求失败')
  }
}

onMounted(() => {
  const user = getSessionStorage('user')
  if (!user) {
    router.push('/login')
  }
})
</script>