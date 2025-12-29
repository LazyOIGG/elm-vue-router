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
      <h1 class="text-4.5vw text-white font-bold">用户注册</h1>
      <div class="w-8vw"></div>
    </header>

    <!-- 表单部分 -->
    <div class="w-full h-[calc(100%-12vw)] flex flex-col">
      <div class="flex-1 overflow-y-auto">
        <div class="w-full pt-6vw px-6vw pb-8vw">
          <div class="bg-white rounded-3vw shadow-lg p-6vw">
            <!-- 手机号码 -->
            <div class="mb-6vw">
              <label class="block text-3.5vw text-gray-700 font-medium mb-2vw">手机号码</label>
              <el-input
                  v-model="user.userId"
                  @blur="checkUserId"
                  placeholder="请输入手机号码"
                  size="large"
                  :input-style="{ fontSize: '4vw', height: '12vw' }"
                  class="w-full"
              >
                <template #prefix>
                  <el-icon class="text-gray-400 mr-2vw">
                    <Phone/>
                  </el-icon>
                </template>
              </el-input>
            </div>

            <!-- 密码 -->
            <div class="mb-6vw">
              <label class="block text-3.5vw text-gray-700 font-medium mb-2vw">密码</label>
              <el-input
                  v-model="user.password"
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

            <!-- 确认密码 -->
            <div class="mb-6vw">
              <label class="block text-3.5vw text-gray-700 font-medium mb-2vw">确认密码</label>
              <el-input
                  v-model="confirmPassword"
                  placeholder="请再次输入密码"
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

            <!-- 用户名称 -->
            <div class="mb-6vw">
              <label class="block text-3.5vw text-gray-700 font-medium mb-2vw">用户名称</label>
              <el-input
                  v-model="user.userName"
                  placeholder="请输入用户名称"
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

            <!-- 性别 -->
            <div class="mb-8vw">
              <label class="block text-3.5vw text-gray-700 font-medium mb-2vw">性别</label>
              <el-radio-group v-model="user.userSex" size="large" class="w-full">
                <div class="flex gap-6vw">
                  <el-radio :value="1" label="男" class="!text-3.8vw !flex-1 !h-12vw !justify-center"/>
                  <el-radio :value="0" label="女" class="!text-3.8vw !flex-1 !h-12vw !justify-center"/>
                </div>
              </el-radio-group>
            </div>

            <!-- 注册按钮 -->
            <div class="flex justify-center">
              <el-button
                  @click="register"
                  type="primary"
                  size="large"
                  class="w-full !h-12vw !text-4.5vw !font-bold !rounded-3vw"
              >
                注册
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
import {ref, onMounted, onUnmounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {ArrowLeft, Phone, Lock, User} from '@element-plus/icons-vue'
import request from '../utils/request'
import Footer from '../components/Footer.vue'

const router = useRouter()
const route = useRoute()

const user = ref({
  userId: '',
  password: '',
  userName: '',
  userSex: 1
})
const confirmPassword = ref('')

let stopRouteWatcher = null

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

// 处理返回
const handleBack = () => {
  enableScroll()
  router.back()
}

// 手机号校验
const checkUserId = async () => {
  if (!user.value.userId.trim()) return

  try {
    const response = await request.post(
        'UserController/getUserById',
        {userId: user.value.userId}
    )
    if (response == 1) {
      user.value.userId = ''
      ElMessage.warning('此手机号码已存在！')
    }
  } catch (error) {
    ElMessage.error('检查用户ID失败')
  }
}

// 注册方法
const register = async () => {
  if (!user.value.userId.trim()) {
    ElMessage.warning('手机号码不能为空！')
    return
  }
  if (!user.value.password.trim()) {
    ElMessage.warning('密码不能为空！')
    return
  }
  if (user.value.password !== confirmPassword.value) {
    ElMessage.warning('两次输入的密码不一致！')
    return
  }
  if (!user.value.userName.trim()) {
    ElMessage.warning('用户名不能为空！')
    return
  }

  try {
    const response = await request.post(
        'UserController/saveUser',
        user.value
    )
    if (response > 0) {
      ElMessage.success('注册成功！')
      enableScroll()

      // 如果有返回路径，则返回
      if (route.query.redirect) {
        router.push(route.query.redirect)
      } else {
        router.push('/login')
      }
    } else {
      ElMessage.error('注册失败！')
    }
  } catch (error) {
    ElMessage.error('注册失败')
  }
}

onMounted(() => {
  // 禁用页面滚动
  disableScroll()

  // 监听路由离开事件，恢复滚动
  stopRouteWatcher = router.beforeEach((to, from, next) => {
    if (from.name === 'register' || from.path === '/register') {
      enableScroll()
    }
    next()
  })
})

onUnmounted(() => {
  enableScroll()
  if (stopRouteWatcher) {
    stopRouteWatcher()
  }
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

/* 修复按钮样式 */
:deep(.el-button) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
}

/* 修复单选按钮样式 */
:deep(.el-radio) {
  display: flex !important;
  align-items: center !important;
  height: 12vw !important;
}

:deep(.el-radio__label) {
  font-size: 3.8vw !important;
}

/* 单选按钮组布局 */
:deep(.el-radio-group) {
  display: flex !important;
  width: 100% !important;
}

.flex.gap-6vw {
  display: flex !important;
  width: 100% !important;
}

/* 隐藏滚动条但保持滚动功能 */
:deep(::-webkit-scrollbar) {
  width: 0;
  background: transparent;
}

.header-primary {
  @apply w-full h-12vw bg-gradient-to-r from-blue-500 to-blue-600
  flex items-center justify-between px-4vw fixed top-0 left-0 z-1000 shadow-md;
}
</style>