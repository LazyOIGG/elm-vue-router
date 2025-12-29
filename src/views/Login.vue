<template>
  <div class="w-full h-full bg-gray-100 fixed inset-0 overflow-hidden">
    <!-- 头部 -->
    <header class="header-primary">
      <el-button
          v-if="hasBack"
          @click="handleBack"
          type="primary"
          :icon="ArrowLeft"
          size="large"
          circle
          class="!p-0 !w-8vw !h-8vw !bg-transparent !border-0 !shadow-none hover:!bg-blue-400"
      />
      <div v-else class="w-8vw"></div>
      <h1 class="text-4.5vw text-white font-bold">用户登录</h1>
      <div class="w-8vw"></div>
    </header>

    <!-- 表单部分 -->
    <div class="w-full h-[calc(100%-12vw)] flex flex-col">
      <div class="flex-1 overflow-y-auto">
        <div class="w-full pt-10vw px-6vw">
          <div class="bg-white rounded-3vw shadow-lg p-6vw">
            <div class="mb-8vw">
              <label class="block text-3.5vw text-gray-700 font-medium mb-2vw">手机号码</label>
              <el-input
                  v-model="userId"
                  placeholder="请输入手机号码"
                  size="large"
                  :input-style="{ fontSize: '4vw', height: '12vw' }"
                  class="w-full"
              >
                <template #prefix>
                  <el-icon class="text-gray-400 mr-2vw">
                    <User/>
                  </el-icon>
                </template>
              </el-input>
            </div>

            <div class="mb-10vw">
              <label class="block text-3.5vw text-gray-700 font-medium mb-2vw">密码</label>
              <el-input
                  v-model="password"
                  placeholder="请输入密码"
                  type="password"
                  size="large"
                  :input-style="{ fontSize: '4vw', height: '12vw' }"
                  class="w-full"
                  show-password
              >
                <template #prefix>
                  <el-icon class="text-gray-400 mr-2vw">
                    <Lock/>
                  </el-icon>
                </template>
              </el-input>
            </div>
            <div class="flex justify-center">

              <el-button
                  @click="login"
                  type="primary"
                  size="large"
                  class="w-full !h-12vw !text-4.5vw !font-bold !rounded-3vw !mb-4vw"
              >
                登录
              </el-button>
            </div>
            <div class="flex justify-center mt-4vw">

              <el-button
                  @click="register"
                  type="primary"
                  plain
                  size="large"
                  class="w-full !h-12vw !text-4.5vw !font-bold !rounded-3vw !border-gray-300"
              >
                去注册
              </el-button>
            </div>

          </div>
        </div>
      </div>

      <!-- 底部菜单 -->
      <Footer/>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {ArrowLeft, User, Lock} from '@element-plus/icons-vue'
import request from '../utils/request'
import Footer from '../components/Footer.vue'

const router = useRouter()
const route = useRoute()
const userId = ref('')
const password = ref('')
const hasBack = ref(true)

// 禁用页面滚动
const disableScroll = () => {
  document.body.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
}

// 启用页面滚动
const enableScroll = () => {
  document.body.style.overflow = ''
  document.documentElement.style.overflow = ''
}

// SessionStorage 方法
const getSessionStorage = (key) => {
  const item = sessionStorage.getItem(key)
  return item ? JSON.parse(item) : null
}

const setSessionStorage = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value))
}

// 处理返回
const handleBack = () => {
  enableScroll()
  router.back()
}

const login = async () => {
  if (!userId.value.trim()) {
    ElMessage.warning('手机号码不能为空！')
    return
  }
  if (!password.value.trim()) {
    ElMessage.warning('密码不能为空！')
    return
  }

  try {
    const response = await request.post(
        'UserController/getUserByIdByPass',
        {userId: userId.value, password: password.value}
    )

    let user = response
    if (!user) {
      ElMessage.error('用户名或密码不正确！')
    } else {
      user.userImg = ''
      setSessionStorage('user', user)
      ElMessage.success('登录成功！')
      enableScroll()

      // 如果有返回路径，则返回
      if (route.query.redirect) {
        router.push(route.query.redirect)
      } else {
        router.push('/index')
      }
    }
  } catch (error) {
    ElMessage.error('登录失败，请重试')
  }
}

const register = () => {
  enableScroll()
  router.push({
    path: '/register',
    query: {redirect: route.fullPath}
  })
}

onMounted(() => {
  // 禁用页面滚动
  disableScroll()

  // 检查是否从特定页面跳转过来，决定是否显示返回按钮
  const referrer = document.referrer
  if (!referrer || referrer.includes(window.location.origin)) {
    hasBack.value = true
  } else {
    hasBack.value = false
  }

  // 检查用户是否已登录
  const user = getSessionStorage('user')
  if (user) {
    enableScroll()
    router.push('/index')
  }
})

// 监听路由离开事件，恢复滚动
const stopRouteWatcher = router.beforeEach((to, from, next) => {
  if (from.name === 'login' || from.path === '/login') {
    enableScroll()
  }
  next()
})

// 组件销毁时清理
import {onUnmounted} from 'vue'

onUnmounted(() => {
  enableScroll()
  stopRouteWatcher()
})
</script>

<style scoped>
.header-primary {
  @apply w-full h-12vw bg-gradient-to-r from-blue-500 to-blue-600
  flex items-center justify-between px-4vw fixed top-0 left-0 z-1000 shadow-md;
}

/* 修复 Element Plus 输入框样式 */
:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid #dcdfe6 !important;
  border-radius: 2.5vw !important;
  padding: 0 3vw !important;
  height: 12vw !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.el-input__wrapper:hover) {
  border-color: #c0c4cc !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409eff !important;
  box-shadow: 0 0 0 1px rgba(64, 158, 255, 0.2) !important;
}

:deep(.el-input__prefix) {
  display: flex !important;
  align-items: center !important;
  margin-right: 2vw !important;
}

/* 修复按钮高度和对齐 */
:deep(.el-button) {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* 隐藏滚动条但保持滚动功能 */
:deep(::-webkit-scrollbar) {
  width: 0;
  background: transparent;
}
</style>