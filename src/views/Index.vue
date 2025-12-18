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
        <img src="../assets/dcfl01.png" />
        <p>美食</p>
      </li>
      <li @click="toBusinessList(2)">
        <img src="../assets/dcfl02.png" />
        <p>早餐</p>
      </li>
      <li @click="toBusinessList(3)">
        <img src="../assets/dcfl03.png" />
        <p>跑腿代购</p>
      </li>
      <li @click="toBusinessList(4)">
        <img src="../assets/dcfl04.png" />
        <p>汉堡披萨</p>
      </li>
      <li @click="toBusinessList(5)">
        <img src="../assets/dcfl05.png" />
        <p>甜品饮品</p>
      </li>
      <li @click="toBusinessList(6)">
        <img src="../assets/dcfl06.png" />
        <p>速食简餐</p>
      </li>
      <li @click="toBusinessList(7)">
        <img src="../assets/dcfl07.png" />
        <p>地方小吃</p>
      </li>
      <li @click="toBusinessList(8)">
        <img src="../assets/dcfl08.png" />
        <p>米粉面馆</p>
      </li>
      <li @click="toBusinessList(9)">
        <img src="../assets/dcfl09.png" />
        <p>包子粥铺</p>
      </li>
      <li @click="toBusinessList(10)">
        <img src="../assets/dcfl10.png" />
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
        <img src="../assets/super_member.png" />
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
        <img src="../assets/sj01.png" />
        <div class="business-info">
          <h3>万家饺子（软件园E18店）</h3>
          <p>￥15起送 | ￥3配送</p>
        </div>
      </li>
      <li>
        <img src="../assets/sj02.png" />
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

<script>
import Footer from "../components/Footer.vue";

export default {
  name: "Index",
  components: {
    Footer,
  },
  mounted() {
    document.onscroll = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const width = document.documentElement.clientWidth;
      const search = this.$refs.fixedBox;

      if (scrollTop > width * 0.12) {
        search.style.position = "fixed";
        search.style.top = "0";
        search.style.left = "0";
        search.style.zIndex = "999";
      } else {
        search.style.position = "static";
      }
    };
  },
  beforeDestroy() {
    document.onscroll = null;
  },
  methods: {
    toBusinessList(orderTypeId) {
      this.$router.push({
        path: "/businessList",
        query: { orderTypeId },
      });
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
}

header {
  height: 12vw;
  background-color: #0097ff;
  display: flex;
  align-items: center;
  color: #fff;
  padding-left: 3vw;
}

.location-text {
  font-size: 4.5vw;
  font-weight: bold;
}

.search {
  height: 13vw;
}

.search-fixed-top {
  height: 13vw;
  background-color: #0097ff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.search-box {
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

.foodtype {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 3vw 0;
}

.foodtype li {
  width: 18vw;
  text-align: center;
  margin-bottom: 3vw;
}

.foodtype img {
  width: 12vw;
}

.banner {
  width: 95%;
  margin: 2vw auto;
  height: 29vw;
  background: url("../assets/index_banner.png") no-repeat center/cover;
  padding: 3vw;
}

.supermember {
  width: 95%;
  margin: 2vw auto;
  height: 11vw;
  background: #feedc1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 3vw;
}

.recommend {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4vw 0;
}

.recommend-line {
  width: 20%;
  height: 1px;
  background: #ccc;
}

.recommend p {
  margin: 0 2vw;
}

.business li {
  display: flex;
  padding: 3vw;
  border-bottom: 1px solid #eee;
}

.business img {
  width: 20vw;
  height: 20vw;
  margin-right: 3vw;
}
</style>
