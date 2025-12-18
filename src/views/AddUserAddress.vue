<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>新增送货地址</p>
    </header>

    <!-- 表单部分 -->
    <ul class="form-box">
      <li>
        <div class="title">联系人：</div>
        <div class="content">
          <input
            type="text"
            v-model="deliveryAddress.contactName"
            placeholder="联系人姓名"
          />
        </div>
      </li>

      <li>
        <div class="title">性别：</div>
        <div class="content sex-box">
          <input
            type="radio"
            v-model="deliveryAddress.contactSex"
            :value="1"
          /> 男
          <input
            type="radio"
            v-model="deliveryAddress.contactSex"
            :value="0"
          /> 女
        </div>
      </li>

      <li>
        <div class="title">电话：</div>
        <div class="content">
          <input
            type="tel"
            v-model="deliveryAddress.contactTel"
            placeholder="电话"
          />
        </div>
      </li>

      <li>
        <div class="title">收货地址：</div>
        <div class="content">
          <input
            type="text"
            v-model="deliveryAddress.address"
            placeholder="收货地址"
          />
        </div>
      </li>
    </ul>

    <!-- 保存按钮 -->
    <div class="button-add">
      <button @click="addUserAddress">
        保存
      </button>
    </div>

    <!-- 底部菜单部分 -->
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
    console.error(error)
  }
}

onMounted(() => {
  // 确保用户已登录
  const user = getSessionStorage('user')
  if (!user) {
    router.push('/login')
  }
})
</script>

<style scoped>
/*************** 总容器 ***************/
.wrapper {
  width: 100%;
  height: 100%;
}

/*************** header ***************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background-color: #0097ff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #fff;
  font-size: 4.8vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

/*************** 表单 ***************/
.wrapper .form-box {
  width: 100%;
  margin-top: 12vw;
}

.wrapper .form-box li {
  box-sizing: border-box;
  padding: 4vw 3vw 0;
  display: flex;
}

.wrapper .form-box .title {
  flex: 0 0 18vw;
  font-size: 3vw;
  font-weight: 700;
  color: #666;
}

.wrapper .form-box .content {
  flex: 1;
  display: flex;
  align-items: center;
}

.wrapper .form-box .content input {
  border: none;
  outline: none;
  width: 100%;
  height: 4vw;
  font-size: 3vw;
}

.wrapper .form-box .sex-box input {
  width: 6vw;
  height: 3.2vw;
  margin-right: 1vw;
}

/*************** 保存按钮 ***************/
.wrapper .button-add {
  box-sizing: border-box;
  padding: 4vw 3vw 0;
}

.wrapper .button-add button {
  width: 100%;
  height: 10vw;
  font-size: 3.8vw;
  font-weight: 700;
  border: none;
  outline: none;
  border-radius: 4px;
  color: #fff;
  background-color: #38ca73;
}
</style>