<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>地址管理</p>
    </header>

    <!-- 地址列表部分 -->
    <ul class="addresslist">
      <li
        v-for="item in deliveryAddressArr"
        :key="item.daId"
      >
        <div
          class="addresslist-left"
          @click="setDeliveryAddress(item)"
        >
          <h3>
            {{ item.contactName }}
            {{ sexFilter(item.contactSex) }}
            {{ item.contactTel }}
          </h3>
          <p>{{ item.address }}</p>
        </div>

        <div class="addresslist-right">
          <i
            class="fa fa-edit"
            @click="editUserAddress(item.daId)"
          ></i>
          <i
            class="fa fa-remove"
            @click="removeUserAddress(item.daId)"
          ></i>
        </div>
      </li>
    </ul>

    <!-- 新增地址部分 -->
    <div
      class="addbtn"
      @click="toAddUserAddress"
    >
      <i class="fa fa-plus-circle"></i>
      <p>新增收货地址</p>
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
  if (!user) return

  try {
    const response = await request.post(
      'DeliveryAddressController/listDeliveryAddressByUserId',
      { userId: user.userId }
    )
    deliveryAddressArr.value = response
  } catch (error) {
    alert('获取地址列表失败')
  }
}

// 设置默认送货地址
const setDeliveryAddress = (deliveryAddress) => {
  const user = getSessionStorage('user')
  if (!user) return

  setLocalStorage(user.userId, deliveryAddress)
  router.push({
    path: '/orders',
    query: { businessId: businessId.value }
  })
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
  if (!confirm('确认要删除此送货地址吗？')) {
    return
  }

  try {
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
    } else {
      alert('删除地址失败！')
    }
  } catch (error) {
    alert('删除地址失败')
  }
}

onMounted(() => {
  fetchDeliveryAddresses()
})
</script>

<style scoped>
/*************** 总容器 ***************/
.wrapper {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
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

/*************** 地址列表 ***************/
.wrapper .addresslist {
  width: 100%;
  margin-top: 12vw;
  background-color: #fff;
}

.wrapper .addresslist li {
  width: 100%;
  box-sizing: border-box;
  border-bottom: solid 1px #ddd;
  padding: 3vw;
  display: flex;
}

.wrapper .addresslist-left {
  flex: 5;
  user-select: none;
  cursor: pointer;
}

.wrapper .addresslist-left h3 {
  font-size: 4.6vw;
  font-weight: 300;
  color: #666;
}

.wrapper .addresslist-left p {
  font-size: 4vw;
  color: #666;
}

.wrapper .addresslist-right {
  flex: 1;
  font-size: 5.6vw;
  color: #999;
  cursor: pointer;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

/*************** 新增地址 ***************/
.wrapper .addbtn {
  width: 100%;
  height: 14vw;
  border-top: solid 1px #ddd;
  border-bottom: solid 1px #ddd;
  background-color: #fff;
  margin-top: 4vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4.5vw;
  color: #0097ff;
  user-select: none;
  cursor: pointer;
}

.wrapper .addbtn p {
  margin-left: 2vw;
}
</style>