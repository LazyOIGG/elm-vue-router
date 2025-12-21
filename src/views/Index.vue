<template>
  <div class="wrapper">
    <!-- header -->
    <header>
      <div class="icon-location-box">
        <div class="icon-location"></div>
      </div>
      <div class="location-text">
        沈阳市规划大厦
        <i class="fa fa-caret-down"></i>
      </div>
    </header>

    <!-- search -->
    <div class="search">
      <div class="search-fixed-top" ref="fixedBox">
        <div class="search-box">
          <i class="fa fa-search"></i>
          搜索饿了么商家、商品名称
        </div>
      </div>
    </div>

    <!-- food type -->
    <ul class="foodtype">
      <li @click="toBusinessList(1)">
        <img src="../assets/img/dcfl01.png" />
        <p>美食</p>
      </li>
      <li @click="toBusinessList(2)">
        <img src="../assets/img/dcfl02.png" />
        <p>早餐</p>
      </li>
      <li @click="toBusinessList(3)">
        <img src="../assets/img/dcfl03.png" />
        <p>跑腿代购</p>
      </li>
      <li @click="toBusinessList(4)">
        <img src="../assets/img/dcfl04.png" />
        <p>汉堡披萨</p>
      </li>
      <li @click="toBusinessList(5)">
        <img src="../assets/img/dcfl05.png" />
        <p>甜品饮品</p>
      </li>
      <li @click="toBusinessList(6)">
        <img src="../assets/img/dcfl06.png" />
        <p>速食简餐</p>
      </li>
      <li @click="toBusinessList(7)">
        <img src="../assets/img/dcfl07.png" />
        <p>地方小吃</p>
      </li>
      <li @click="toBusinessList(8)">
        <img src="../assets/img/dcfl08.png" />
        <p>米粉面馆</p>
      </li>
      <li @click="toBusinessList(9)">
        <img src="../assets/img/dcfl09.png" />
        <p>包子粥铺</p>
      </li>
      <li @click="toBusinessList(10)">
        <img src="../assets/img/dcfl10.png" />
        <p>炸鸡炸串</p>
      </li>
    </ul>

    <!-- banner -->
    <div class="banner">
      <h3>品质套餐</h3>
      <p>搭配齐全吃得好</p>
      <a>立即抢购 &gt;</a>
    </div>

    <!-- super member -->
    <div class="supermember">
      <div class="left">
        <img src="../assets/img/super_member.png" />
        <div>
          <h3>超级会员</h3>
          <p>• 每月享超值权益</p>
        </div>
      </div>
      <div class="right">立即开通 &gt;</div>
    </div>

    <!-- recommend title -->
    <div class="recommend">
      <div class="recommend-line"></div>
      <p>推荐商家</p>
      <div class="recommend-line"></div>
    </div>

    <!-- recommend type -->
    <ul class="recommendtype">
      <li>综合排序 <i class="fa fa-caret-down"></i></li>
      <li>距离最近</li>
      <li>销量最高</li>
      <li>筛选 <i class="fa fa-filter"></i></li>
    </ul>

    <!-- business list（静态示例） -->
    <ul class="business">
      <li>
        <img src="../assets/img/sj01.png" />
        <div class="business-info">
          <h3>万家饺子（软件园E18店）</h3>
          <p>￥15起送 | ￥3配送</p>
        </div>
      </li>
      <li>
        <img src="../assets/img/sj02.png" />
        <div class="business-info">
          <h3>小锅饭豆腐馆（全运店）</h3>
          <p>￥15起送 | ￥3配送</p>
        </div>
      </li>
    </ul>

    <!-- footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Footer from '../components/Footer.vue'

const router = useRouter()
const fixedBox = ref(null)

// 跳转到商家列表页面
const toBusinessList = (orderTypeId) => {
  router.push({
    path: '/businessList',
    query: { orderTypeId }
  })
}

// 滚动处理
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const width = document.documentElement.clientWidth
  const search = fixedBox.value

  if (search) {
    if (scrollTop > width * 0.12) {
      search.style.position = 'fixed'
      search.style.top = '0'
      search.style.left = '0'
      search.style.zIndex = '999'
    } else {
      search.style.position = 'static'
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
}

/****************** header部分 ******************/
.wrapper header {
  height: 12vw;
  background-color: #0097ff;
  display: flex;
  align-items: center;
  color: #fff;
  padding-left: 3vw;
}

.wrapper header .location-text {
  font-size: 4.5vw;
  font-weight: bold;
}

/****************** 搜索部分 ******************/
.wrapper .search {
  height: 13vw;
}

.wrapper .search .search-fixed-top {
  height: 13vw;
  background-color: #0097ff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper .search .search-fixed-top .search-box {
  width: 90%;
  height: 9vw;
  background: #fff;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5vw;
  color: #aaa;
}

/****************** 食品分类部分 ******************/
.wrapper .foodtype {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 3vw 0;
}

.wrapper .foodtype li {
  width: 18vw;
  text-align: center;
  margin-bottom: 3vw;
  cursor: pointer;
}

.wrapper .foodtype li img {
  width: 12vw;
}

/****************** 横幅部分 ******************/
.wrapper .banner {
  width: 95%;
  margin: 2vw auto;
  height: 29vw;
  background: url("../assets/img/index_banner.png") no-repeat center/cover;
  padding: 3vw;
}

/****************** 超级会员部分 ******************/
.wrapper .supermember {
  width: 95%;
  margin: 2vw auto;
  height: 11vw;
  background: #feedc1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3vw;
}

.wrapper .supermember .left {
  display: flex;
  align-items: center;
}

.wrapper .supermember .left img {
  width: 8vw;
  height: 8vw;
  margin-right: 2vw;
}

.wrapper .supermember .right {
  color: #ff6600;
  font-weight: bold;
}

/****************** 推荐商家标题 ******************/
.wrapper .recommend {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4vw 0;
}

.wrapper .recommend .recommend-line {
  width: 20%;
  height: 1px;
  background: #ccc;
}

.wrapper .recommend p {
  margin: 0 2vw;
  font-size: 4vw;
  color: #555;
}

/****************** 推荐类型筛选 ******************/
.wrapper .recommendtype {
  display: flex;
  justify-content: space-around;
  padding: 2vw 0;
  border-bottom: 1px solid #eee;
}

.wrapper .recommendtype li {
  font-size: 3.5vw;
  color: #666;
  padding: 1vw 2vw;
  border-radius: 3vw;
  background: #f5f5f5;
  cursor: pointer;
}

/****************** 商家列表部分 ******************/
.wrapper .business {
  width: 100%;
  margin-top: 2vw;
  margin-bottom: 14vw;
}

.wrapper .business li {
  display: flex;
  padding: 3vw;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.wrapper .business li img {
  width: 20vw;
  height: 20vw;
  margin-right: 3vw;
  border-radius: 2vw;
}

.wrapper .business li .business-info h3 {
  font-size: 4vw;
  color: #333;
  margin-bottom: 1vw;
}

.wrapper .business li .business-info p {
  font-size: 3.2vw;
  color: #888;
}
</style>