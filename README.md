# 🍱 饿了么 SpringBoot + Vue 前后端分离项目

一个基于 SpringBoot 和 Vue 开发的前后端分离外卖点餐系统，模拟饿了么核心业务流程。

![Vue](https://img.shields.io/badge/Vue-3.2-green)
![SpringBoot](https://img.shields.io/badge/SpringBoot-2.7-blue)
![MySQL](https://img.shields.io/badge/MySQL-5.7-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📖 项目简介

本项目是一个完整的在线外卖点餐系统，实现了从商家浏览、食品选择、购物车管理、订单确认到在线支付的全流程功能。采用前后端分离架构，前端使用 Vue 3 + Vue Router + Axios，后端使用 SpringBoot + MyBatis，提供 RESTful API 接口。

## ✨ 功能特性

### 🏪 用户端功能

- ✅ **用户注册/登录** - 手机号注册，密码登录
- ✅ **首页浏览** - 商家分类展示，推荐商家
- ✅ **商家列表** - 按分类筛选商家，显示购物车状态
- ✅ **商家详情** - 查看商家信息，添加食品到购物车
- ✅ **购物车管理** - 实时计算总价，显示起送条件
- ✅ **地址管理** - 新增、编辑、删除送货地址
- ✅ **订单流程** - 确认订单、选择地址、在线支付
- ✅ **订单历史** - 查看已支付/未支付订单
- ✅ **个人中心** - 查看个人信息，订单统计

### 🛒 购物流程

```txt
首页 → 选择分类 → 商家列表 → 商家详情 → 添加食品 → 
购物车结算 → 确认订单 → 选择地址 → 在线支付 → 完成
```

## 🏗️ 技术栈

### 前端技术栈

- **Vue 3** - Composition API + `<script setup>`
- **Vue Router** - 路由管理
- **Axios** - HTTP 请求库
- **Font Awesome** - 图标库
- **原生 CSS** - 移动端适配样式
- **SessionStorage/LocalStorage** - 本地存储

### 后端技术栈

- **SpringBoot 2.7+** - 后端框架
- **MyBatis** - ORM 框架
- **MySQL 5.7+** - 数据库
- **Maven** - 依赖管理
- **Tomcat 8.5+** - 应用服务器

## 📁 项目结构

```txt
elm-vue-client/
├── public/
├── src/
│   ├── assets/          # 静态资源
│   │   └── img/        # 图片资源
│   ├── components/      # 公共组件
│   │   └── Footer.vue  # 底部导航栏
│   ├── views/          # 页面组件
│   │   ├── Index.vue           # 首页
│   │   ├── BusinessList.vue    # 商家列表
│   │   ├── BusinessInfo.vue    # 商家详情
│   │   ├── Orders.vue          # 确认订单
│   │   ├── Payment.vue         # 在线支付
│   │   ├── UserAddress.vue     # 地址管理
│   │   ├── AddUserAddress.vue  # 新增地址
│   │   ├── EditUserAddress.vue # 编辑地址
│   │   ├── Login.vue           # 登录
│   │   ├── Register.vue        # 注册
│   │   ├── OrderList.vue       # 订单历史
│   │   └── Profile.vue         # 个人中心
│   ├── utils/          # 工具类
│   │   ├── request.js  # Axios 配置
│   │   └── common.js   # 存储工具
│   ├── router/         # 路由配置
│   ├── App.vue         # 根组件
│   └── main.js         # 入口文件
└── ...配置文件
```

## 🗄️ 数据库设计

系统包含 7 张核心表：

- `user` - 用户表
- `business` - 商家表
- `food` - 食品表
- `cart` - 购物车表
- `deliveryaddress` - 送货地址表
- `orders` - 订单表
- `orderdetailed` - 订单明细表


## 🚀 快速开始

### 环境要求

- Node.js 16+
- Vue CLI 5+
- JDK 8+
- MySQL 5.7+
- Maven 3.6+

### 前端启动

```bash
# 1. 克隆项目
git clone <repository-url>

# 2. 进入项目目录
cd elm-vue-router

# 3. 安装依赖
npm install

# 4. 配置API地址
编辑 src/utils/request.js 修改 baseURL

# 5. 启动开发服务器
npm run serve

# 6. 访问应用
打开浏览器访问 http://localhost:8086
```

### 后端启动

（需要配合 SpringBoot 后端项目）

1. 导入数据库脚本 `elm.sql`
2. 配置数据库连接信息
3. 启动 SpringBoot 应用（默认端口 8085）
4. 确保前端请求地址配置正确

## 🔧 配置说明

### 前端配置

- **API 地址**: `src/utils/request.js`
- **路由配置**: `src/router/index.js`
- **全局样式**: `src/App.vue`

### 后端接口

项目使用 RESTful 风格接口，主要控制器：

- `UserController` - 用户相关
- `BusinessController` - 商家相关
- `FoodController` - 食品相关
- `CartController` - 购物车相关
- `OrdersController` - 订单相关
- `DeliveryAddressController` - 地址相关

## 📄 API 接口文档

| 模块  | 接口                                                       | 方法     | 说明         |
|-----|----------------------------------------------------------|--------|------------|
| 用户  | `/UserController/getUserById`                            | POST   | 检查用户ID是否存在 |
| 用户  | `/UserController/saveUser`                               | POST   | 用户注册       |
| 用户  | `/UserController/getUserByIdByPass`                      | POST   | 用户登录       |
| 商家  | `/BusinessController/listBusinessByOrderTypeId`          | POST   | 按分类获取商家    |
| 商家  | `/BusinessController/getBusinessById`                    | POST   | 获取商家详情     |
| 食品  | `/FoodController/listFoodByBusinessId`                   | POST   | 获取商家食品     |
| 购物车 | `/CartController/listCart`                               | POST   | 获取购物车      |
| 购物车 | `/CartController/saveCart`                               | POST   | 添加购物车      |
| 购物车 | `/CartController/updateCart`                             | PUT    | 更新购物车数量    |
| 购物车 | `/CartController/removeCart`                             | DELETE | 删除购物车项     |
| 地址  | `/DeliveryAddressController/listDeliveryAddressByUserId` | POST   | 获取用户地址     |
| 地址  | `/DeliveryAddressController/saveDeliveryAddress`         | POST   | 新增地址       |
| 地址  | `/DeliveryAddressController/updateDeliveryAddress`       | PUT    | 更新地址       |
| 地址  | `/DeliveryAddressController/removeDeliveryAddress`       | DELETE | 删除地址       |
| 订单  | `/OrdersController/createOrders`                         | POST   | 创建订单       |
| 订单  | `/OrdersController/listOrdersByUserId`                   | POST   | 获取用户订单     |
| 订单  | `/OrdersController/getOrdersById`                        | POST   | 获取订单详情     |
| 订单  | `/OrdersController/payOrders`                            | POST   | 支付订单       |

## 🎯 项目特点

### 技术特点

1. **前后端完全分离** - 通过 RESTful API 通信
2. **响应式设计** - 使用 vw 单位适配移动端
3. **状态管理** - 使用本地存储管理用户状态
4. **模块化组件** - 组件化开发，复用性高
5. **错误处理** - 统一的请求拦截和错误处理

### 业务特点

1. **完整的购物流程** - 从浏览到支付的完整链路
2. **实时计算** - 购物车价格实时计算
3. **地址管理** - 多地址支持，可设置默认
4. **订单状态** - 清晰区分已支付/未支付订单
5. **用户友好** - 简洁的UI，清晰的交互提示

## 🐛 常见问题

### Q: 跨域问题如何解决？

A: 后端需要配置 CORS，前端 `request.js` 中已配置跨域支持。

### Q: 图片加载失败怎么办？

A: 确保图片路径正确，或者配置默认图片占位符。

### Q: 登录状态如何保持？

A: 使用 `sessionStorage` 存储用户信息，请求时自动携带。

### Q: 如何修改API地址？

A: 修改 `src/utils/request.js` 中的 `baseURL`。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---
