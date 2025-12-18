<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>用户登陆</p>
    </header>

    <!-- 表单部分 -->
    <ul class="form-box">
      <li>
        <div class="title">手机号码：</div>
        <div class="content">
          <input type="text" v-model="userId" placeholder="手机号码">
        </div>
      </li>
      <li>
        <div class="title">密码：</div>
        <div class="content">
          <input type="password" v-model="password" placeholder="密码">
        </div>
      </li>
    </ul>

    <!-- 按钮 -->
    <div class="button-login">
      <button @click="login">登陆</button>
    </div>
    <div class="button-register">
      <button @click="register">去注册</button>
    </div>

    <!-- 底部菜单部分 -->
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import qs from 'qs'
import Footer from '../components/Footer.vue'

const router = useRouter()
const userId = ref('')
const password = ref('')

// SessionStorage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

const setSessionStorage = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value))
}

const login = async () => {
  if (!userId.value) {
    alert('手机号码不能为空！')
    return
  }
  if (!password.value) {
    alert('密码不能为空！')
    return
  }

  try {
    const response = await axios.post(
      'UserController/getUserByIdByPass',
      qs.stringify({ userId: userId.value, password: password.value })
    )

    let user = response.data
    if (!user) {
      alert('用户名或密码不正确！')
    } else {
      // sessionstorage有容量限制，为防止数据溢出，不存储userImg
      user.userImg = ''
      setSessionStorage('user', user)
      router.back()
    }
  } catch (error) {
    console.error(error)
    alert('登录失败，请重试')
  }
}

const register = () => {
  router.push({ path: '/register' })
}
</script>

<style scoped>
/* 样式保持不变 */
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
}

/****************** header部分 ******************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background-color: #0097FF;
  color: #fff;
  font-size: 4.8vw;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

/****************** 表单部分 ******************/
.wrapper .form-box {
  width: 100%;
  margin-top: 12vw;
}

.wrapper .form-box li {
  box-sizing: border-box;
  padding: 4vw 3vw 0 3vw;
  display: flex;
  align-items: center;
}

.wrapper .form-box li .title {
  flex: 0 0 18vw;
  font-size: 3vw;
  font-weight: 700;
  color: #666;
}

.wrapper .form-box li .content {
  flex: 1;
}

.wrapper .form-box li .content input {
  border: none;
  outline: none;
  width: 100%;
  height: 4vw;
  font-size: 3vw;
}

/****************** 按钮 ******************/
.wrapper .button-login,
.wrapper .button-register {
  width: 100%;
  box-sizing: border-box;
  padding: 4vw 3vw 0 3vw;
}

.wrapper .button-login button {
  width: 100%;
  height: 10vw;
  font-size: 3.8vw;
  font-weight: 700;
  color: #fff;
  background-color: #38CA73;
  border-radius: 4px;
  border: none;
  outline: none;
}

.wrapper .button-register button {
  width: 100%;
  height: 10vw;
  font-size: 3.8vw;
  font-weight: 700;
  color: #666;
  background-color: #EEE;
  border: solid 1px #DDD;
  border-radius: 4px;
  border: none;
  outline: none;
}
</style>