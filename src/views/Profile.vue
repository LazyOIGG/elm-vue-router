<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>我的信息</p>
    </header>

    <!-- 用户信息卡片 -->
    <div class="profile-card" v-if="user">
      <div class="avatar-section">
        <div class="avatar">
          <i class="fa fa-user-circle"></i>
        </div>
        <div class="user-info">
          <h3>{{ user.userName }}</h3>
          <p>{{ user.userId }} {{ sexFilter(user.userSex) }}</p>
        </div>
      </div>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-number">{{ orderCount || 0 }}</span>
          <span class="stat-label">总订单</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ unpaidOrderCount || 0 }}</span>
          <span class="stat-label">待支付</span>
        </div>
      </div>
    </div>

    <!-- 功能列表 -->
    <ul class="menu-list" v-if="user">
      <li @click="toOrderList">
        <i class="fa fa-file-text-o"></i>
        <span>我的订单</span>
        <i class="fa fa-angle-right"></i>
      </li>
      <li @click="toAddressManagement">
        <i class="fa fa-map-marker"></i>
        <span>地址管理</span>
        <i class="fa fa-angle-right"></i>
      </li>
      <li @click="logout">
        <i class="fa fa-sign-out"></i>
        <span>退出登录</span>
        <i class="fa fa-angle-right"></i>
      </li>
    </ul>

    <!-- 未登录状态 -->
    <div class="login-prompt" v-else>
      <div class="prompt-content">
        <i class="fa fa-user-circle"></i>
        <h3>请登录</h3>
        <p>登录后查看个人信息和订单</p>
        <div class="button-group">
          <button class="login-btn" @click="toLogin">立即登录</button>
          <button class="register-btn" @click="toRegister">注册账号</button>
        </div>
      </div>
    </div>

    <!-- 底部菜单部分 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import request from '../utils/request'
import Footer from '../components/Footer.vue'

const router = useRouter()
const user = ref(null)
const orderCount = ref(0)
const unpaidOrderCount = ref(0)

// 从sessionStorage获取用户信息
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

// 性别过滤器
const sexFilter = (value) => {
  return value === 1 ? '先生' : '女士'
}

// 获取订单统计
const fetchOrderStats = async () => {
  if (!user.value) return

  try {
    const response = await request.post(
      'OrdersController/listOrdersByUserId',
      { userId: user.value.userId }
    )

    if (response && Array.isArray(response)) {
      orderCount.value = response.length
      unpaidOrderCount.value = response.filter(order => order.orderState === 0).length
    }
  } catch (error) {
    alert('获取订单统计失败')
  }
}

// 跳转订单列表
const toOrderList = () => {
  router.push({ path: '/orderList' })
}

// 跳转地址管理
const toAddressManagement = () => {
  router.push({ path: '/userAddress' })
}

// 跳转登录页
const toLogin = () => {
  router.push({ path: '/login' })
}

// 跳转注册页
const toRegister = () => {
  router.push({ path: '/register' })
}

// 退出登录
const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    sessionStorage.removeItem('user')
    user.value = null
    router.push({ path: '/index' })
  }
}

onMounted(() => {
  user.value = getSessionStorage('user')
  if (user.value) {
    fetchOrderStats()
  }
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
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 4.8vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
}

/*************** 个人信息卡片 ***************/
.wrapper .profile-card {
  margin-top: 12vw;
  background-color: #fff;
  padding: 4vw;
  border-bottom: 1px solid #eee;
}

.wrapper .profile-card .avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 4vw;
}

.wrapper .profile-card .avatar {
  width: 18vw;
  height: 18vw;
  border-radius: 50%;
  background-color: #0097ff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4vw;
}

.wrapper .profile-card .avatar i {
  font-size: 12vw;
  color: #fff;
}

.wrapper .profile-card .user-info h3 {
  font-size: 5vw;
  color: #333;
  margin-bottom: 1vw;
}

.wrapper .profile-card .user-info p {
  font-size: 3.5vw;
  color: #666;
}

.wrapper .profile-card .stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #eee;
  padding-top: 4vw;
}

.wrapper .profile-card .stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wrapper .profile-card .stat-number {
  font-size: 5vw;
  font-weight: bold;
  color: #0097ff;
  margin-bottom: 1vw;
}

.wrapper .profile-card .stat-label {
  font-size: 3.2vw;
  color: #666;
}

/*************** 功能菜单列表 ***************/
.wrapper .menu-list {
  margin-top: 4vw;
  background-color: #fff;
}

.wrapper .menu-list li {
  display: flex;
  align-items: center;
  padding: 4vw;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.wrapper .menu-list li:active {
  background-color: #f9f9f9;
}

.wrapper .menu-list li i:first-child {
  font-size: 5vw;
  color: #0097ff;
  width: 8vw;
  text-align: center;
  margin-right: 3vw;
}

.wrapper .menu-list li span {
  flex: 1;
  font-size: 4vw;
  color: #333;
}

.wrapper .menu-list li i:last-child {
  font-size: 5vw;
  color: #999;
}

/*************** 未登录提示 ***************/
.wrapper .login-prompt {
  margin-top: 12vw;
  background-color: #fff;
  padding: 8vw 4vw;
  text-align: center;
}

.wrapper .login-prompt .prompt-content i {
  font-size: 20vw;
  color: #ccc;
  margin-bottom: 4vw;
}

.wrapper .login-prompt .prompt-content h3 {
  font-size: 5vw;
  color: #333;
  margin-bottom: 2vw;
}

.wrapper .login-prompt .prompt-content p {
  font-size: 3.8vw;
  color: #666;
  margin-bottom: 6vw;
}

.wrapper .login-prompt .button-group {
  display: flex;
  gap: 4vw;
  justify-content: center;
}

.wrapper .login-prompt .login-btn,
.wrapper .login-prompt .register-btn {
  padding: 3vw 6vw;
  border: none;
  border-radius: 6px;
  font-size: 4vw;
  font-weight: bold;
  cursor: pointer;
}

.wrapper .login-prompt .login-btn {
  background-color: #0097ff;
  color: #fff;
}

.wrapper .login-prompt .register-btn {
  background-color: #f0f0f0;
  color: #666;
  border: 1px solid #ddd;
}
</style>