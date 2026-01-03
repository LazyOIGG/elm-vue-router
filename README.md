# 饿了么外卖系统 - 前端项目

## 项目概述

这是一个基于 Vue 3 + Element Plus 构建的移动端外卖系统前端应用，模拟饿了么核心功能，包括商家浏览、购物车管理、订单处理、用户登录注册等完整业务流程。

## 项目结构

```txt
src/
├── components/          # 通用组件
│   └── Footer.vue      # 底部导航栏
├── views/              # 页面组件
│   ├── Index.vue       # 首页
│   ├── Discover.vue    # 发现页面
│   ├── BusinessList.vue # 商家列表
│   ├── BusinessInfo.vue # 商家详情
│   ├── Login.vue       # 登录页
│   ├── Register.vue    # 注册页
│   ├── Orders.vue      # 订单确认页
│   ├── Payment.vue     # 支付页
│   ├── OrderList.vue   # 订单列表
│   ├── UserAddress.vue # 地址管理
│   ├── AddUserAddress.vue # 添加地址
│   ├── EditUserAddress.vue # 编辑地址
│   └── Profile.vue     # 个人中心
├── router/             # 路由配置
│   └── index.js        # 路由定义
├── utils/              # 工具函数
│   ├── common.js       # 本地存储工具
│   └── request.js      # HTTP请求封装
├── App.vue             # 根组件
└── main.js             # 应用入口
```

## 核心模块关系

### 1. **路由系统 (router/index.js)**

- 定义了所有页面的路由映射
- 采用懒加载优化性能
- 路由守卫实现页面跳转控制

### 2. **状态管理 (SessionStorage/LocalStorage)**

- **SessionStorage**: 存储用户登录状态、临时数据
- **LocalStorage**: 存储用户偏好设置、地址信息
- **工具封装**: 在 `common.js` 中统一管理存储操作

### 3. **HTTP请求层 (request.js)**

- 基于 axios 封装的统一请求实例
- 请求/响应拦截器处理统一逻辑
- 错误处理和状态码管理

### 4. **UI组件库 (Element Plus)**

- 统一使用 Element Plus 组件
- 图标库来自 `@element-plus/icons-vue`
- 响应式设计适配移动端

### 5. **核心业务流**

```txt
用户浏览流程：
首页(Index) → 商家列表(BusinessList) → 商家详情(BusinessInfo)

下单流程：
商品加购 → 订单确认(Orders) → 地址选择(UserAddress) → 支付(Payment) → 订单查看(OrderList)

用户流程：
登录/注册 → 个人中心(Profile) → 地址管理 → 订单管理
```

## 代码重点解析

### 1. **响应式设计**

- 使用 `vw` 单位实现移动端适配
- 媒体查询和弹性布局
- Element Plus 的响应式组件

### 2. **状态持久化**

```javascript
// 存储用户信息
sessionStorage.setItem('user', JSON.stringify(user))

// 获取用户信息
const user = JSON.parse(sessionStorage.getItem('user'))
```

### 3. **API 调用规范**

```javascript
// 使用封装的 request 实例
import request from '../utils/request'

// 统一调用方式
const response = await request.post('/api/endpoint', data)
```

### 4. **路由跳转逻辑**

```javascript
// 带参数跳转
router.push({
  path: '/businessInfo',
  query: { businessId: id }
})

// 返回上一页
router.back()
```

### 5. **购物车管理**

- 实时计算商品总数和总价
- 本地缓存购物车状态
- 与后端同步购物车数据

### 6. **表单验证**

- Element Plus 表单组件内置验证
- 自定义验证规则
- 前后端双重验证

## 🛠️ 技术栈

- **框架**: Vue 3 + Composition API
- **UI 库**: Element Plus
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **CSS 工具**: UnoCSS
- **图标**: Element Plus Icons
- **构建工具**: Vite

## 功能特性

### 已实现功能

- 用户注册登录
- 商家浏览与搜索
- 购物车管理
- 订单创建与支付
- 地址管理
- 订单历史查看
- 响应式移动端设计

### 🔧 核心组件

#### Footer.vue

- 底部导航栏组件
- 路由高亮显示
- 全局页面跳转

#### 页面组件

- 每个视图对应一个业务功能
- 统一的头部设计风格
- 状态驱动的UI更新

## 数据流

1. **用户认证**

   ```txt
   登录页 → 验证用户 → 存储session → 全局可用
   ```

2. **购物车同步**

   ```txt
   商品操作 → 更新本地状态 → 同步到后端 → 其他页面获取
   ```

3. **订单流程**

   ```txt
   选择商品 → 确认订单 → 选择地址 → 支付 → 更新订单状态
   ```

## 样式系统

- **Tailwind-like 原子类**: 使用 UnoCSS
- **响应式断点**: 移动端优先
- **颜色系统**: 统一的调色板
- **组件样式**: scoped CSS + 深度选择器

##  配置说明

### 环境配置

```javascript
// 创建 axios 实例
/*
通过在这里切换后端端口使用不同版本的后端服务
1. localhost:8084: Servlet版
2. localhost:8085: SpringBoot版
*/

const request = axios.create({
  baseURL: 'http://localhost:8085/elm_api',
  timeout: 10000
})
```

### 路由配置

```javascript
// 路由懒加载
component: () => import('../views/Index.vue')
```

## 开发指南

### 运行项目

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build
```

### 添加新页面

1. 在 `views/` 目录创建 Vue 组件
2. 在 `router/index.js` 中注册路由
3. 按需添加到 `Footer.vue` 导航中

### API 调用规范

1. 始终从 `utils/request` 导入请求实例
2. 使用 async/await 处理异步
3. 统一错误处理

## 注意事项

1. **存储管理**
   - SessionStorage 用于会话数据
   - LocalStorage 用于持久化数据
   - 注意存储大小限制

2. **性能优化**
   - 路由懒加载
   - 图片懒加载
   - 请求节流

3. **安全考虑**
   - 输入验证
   - XSS 防护
   - 敏感信息不存储在前端

4. **兼容性**
   - 现代浏览器支持
   - 移动端适配
   - 触摸事件处理

## 后端对接

项目默认对接以下 API 接口：

- 用户相关：`UserController`
- 商家相关：`BusinessController`
- 食品相关：`FoodController`
- 购物车：`CartController`
- 订单：`OrdersController`
- 地址：`DeliveryAddressController`

## 项目亮点

1. **模块化设计**: 清晰的组件分离
2. **代码复用**: 工具函数和组件高度复用
3. **错误处理**: 完善的异常处理机制
4. **用户体验**: 流畅的页面过渡和交互
5. **代码规范**: 统一的代码风格和命名约定

