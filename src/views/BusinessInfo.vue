<template>
  <div class="wrapper">
    <!-- header部分 -->
    <header>
      <p>商家信息</p>
    </header>

    <!-- 商家logo部分 -->
    <div class="business-logo">
      <img :src="business.businessImg" />
    </div>

    <!-- 商家信息部分 -->
    <div class="business-info">
      <h1>{{ business.businessName }}</h1>
      <p>
        &#165;{{ business.starPrice }}起送
        &#165;{{ business.deliveryPrice }}配送
      </p>
      <p>{{ business.businessExplain }}</p>
    </div>

    <!-- 食品列表部分 -->
    <ul class="food">
      <li v-for="(item, index) in foodArr" :key="item.foodId">
        <div class="food-left">
          <img :src="item.foodImg" />
          <div class="food-left-info">
            <h3>{{ item.foodName }}</h3>
            <p>{{ item.foodExplain }}</p>
            <p>&#165;{{ item.foodPrice }}</p>
          </div>
        </div>

        <div class="food-right">
          <div>
            <i
              class="fa fa-minus-circle"
              v-show="item.quantity !== 0"
              @click="minus(index)"
            ></i>
          </div>
          <p>
            <span v-show="item.quantity !== 0">
              {{ item.quantity }}
            </span>
          </p>
          <div>
            <i
              class="fa fa-plus-circle"
              @click="add(index)"
            ></i>
          </div>
        </div>
      </li>
    </ul>

    <!-- 购物车部分 -->
    <div class="cart">
      <div class="cart-left">
        <div
          class="cart-left-icon"
          :style="totalQuantity === 0
            ? 'background-color:#505051;'
            : 'background-color:#3190E8;'"
        >
          <i class="fa fa-shopping-cart"></i>
          <div
            class="cart-left-icon-quantity"
            v-show="totalQuantity !== 0"
          >
            {{ totalQuantity }}
          </div>
        </div>

        <div class="cart-left-info">
          <p>&#165;{{ totalPrice }}</p>
          <p>另需配送费{{ business.deliveryPrice }}元</p>
        </div>
      </div>

      <div class="cart-right">
        <!-- 不够起送费 -->
        <div
          class="cart-right-item"
          v-show="totalSettle < business.starPrice"
          style="background-color:#535356;cursor:default;"
        >
          &#165;{{ business.starPrice }}起送
        </div>

        <!-- 达到起送费 -->
        <div
          class="cart-right-item"
          v-show="totalSettle >= business.starPrice"
          @click="toOrder"
        >
          去结算
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BusinessInfo',
  data() {
    return {
      businessId: this.$route.query.businessId,
      business: {},
      foodArr: [],
      user: {}
    };
  },
  created() {
    this.user = this.$getSessionStorage('user');

    // 根据 businessId 查询商家信息
    this.$axios
      .post(
        'BusinessController/getBusinessById',
        this.$qs.stringify({
          businessId: this.businessId
        })
      )
      .then(response => {
        this.business = response.data;
      })
      .catch(error => {
        console.error(error);
      });

    // 根据 businessId 查询食品信息
    this.$axios
      .post(
        'FoodController/listFoodByBusinessId',
        this.$qs.stringify({
          businessId: this.businessId
        })
      )
      .then(response => {
        this.foodArr = response.data;

        for (let item of this.foodArr) {
          item.quantity = 0;
        }

        if (this.user != null) {
          this.listCart();
        }
      })
      .catch(error => {
        console.error(error);
      });
  },
  methods: {
    listCart() {
      this.$axios
        .post(
          'CartController/listCart',
          this.$qs.stringify({
            businessId: this.businessId,
            userId: this.user.userId
          })
        )
        .then(response => {
          const cartArr = response.data;

          for (let foodItem of this.foodArr) {
            foodItem.quantity = 0;
            for (let cartItem of cartArr) {
              if (cartItem.foodId === foodItem.foodId) {
                foodItem.quantity = cartItem.quantity;
              }
            }
          }
        })
        .catch(error => {
          console.error(error);
        });
    },

    add(index) {
      if (this.user == null) {
        this.$router.push({ path: '/login' });
        return;
      }

      if (this.foodArr[index].quantity === 0) {
        this.saveCart(index);
      } else {
        this.updateCart(index, 1);
      }
    },

    minus(index) {
      if (this.user == null) {
        this.$router.push({ path: '/login' });
        return;
      }

      if (this.foodArr[index].quantity > 1) {
        this.updateCart(index, -1);
      } else {
        this.removeCart(index);
      }
    },

    saveCart(index) {
      this.$axios
        .post(
          'CartController/saveCart',
          this.$qs.stringify({
            businessId: this.businessId,
            userId: this.user.userId,
            foodId: this.foodArr[index].foodId
          })
        )
        .then(response => {
          if (response.data === 1) {
            this.foodArr[index].quantity = 1;
          } else {
            alert('向购物车中添加食品失败！');
          }
        })
        .catch(error => {
          console.error(error);
        });
    },

    updateCart(index, num) {
      this.$axios
        .post(
          'CartController/updateCart',
          this.$qs.stringify({
            businessId: this.businessId,
            userId: this.user.userId,
            foodId: this.foodArr[index].foodId,
            quantity: this.foodArr[index].quantity + num
          })
        )
        .then(response => {
          if (response.data === 1) {
            this.foodArr[index].quantity += num;
          } else {
            alert('向购物车中更新食品失败！');
          }
        })
        .catch(error => {
          console.error(error);
        });
    },

    removeCart(index) {
      this.$axios
        .post(
          'CartController/removeCart',
          this.$qs.stringify({
            businessId: this.businessId,
            userId: this.user.userId,
            foodId: this.foodArr[index].foodId
          })
        )
        .then(response => {
          if (response.data === 1) {
            this.foodArr[index].quantity = 0;
          } else {
            alert('从购物车中删除食品失败！');
          }
        })
        .catch(error => {
          console.error(error);
        });
    },

    toOrder() {
      this.$router.push({
        path: '/orders',
        query: {
          businessId: this.business.businessId
        }
      });
    }
  },
  computed: {
    totalPrice() {
      let total = 0;
      for (let item of this.foodArr) {
        total += item.foodPrice * item.quantity;
      }
      return total;
    },
    totalQuantity() {
      let quantity = 0;
      for (let item of this.foodArr) {
        quantity += item.quantity;
      }
      return quantity;
    },
    totalSettle() {
      return this.totalPrice + this.business.deliveryPrice;
    }
  }
};
</script>

<style scoped>
/****************** 总容器 ******************/
.wrapper {
  width: 100%;
  height: 100%;
}

/****************** header部分 ******************/
.wrapper header {
  width: 100%;
  height: 12vw;
  background-color: #0097ff;
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

/****************** 商家logo部分 ******************/
.wrapper .business-logo {
  width: 100%;
  height: 35vw;
  margin-top: 12vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper .business-logo img {
  width: 40vw;
  height: 30vw;
  border-radius: 5px;
}

/****************** 商家信息部分 ******************/
.wrapper .business-info {
  width: 100%;
  height: 20vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.wrapper .business-info h1 {
  font-size: 5vw;
}

.wrapper .business-info p {
  font-size: 3vw;
  color: #666;
  margin-top: 1vw;
}

/****************** 食品列表部分 ******************/
.wrapper .food {
  width: 100%;
  margin-bottom: 14vw;
}

.wrapper .food li {
  width: 100%;
  box-sizing: border-box;
  padding: 2.5vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.wrapper .food li .food-left {
  display: flex;
  align-items: center;
}

.wrapper .food li .food-left img {
  width: 20vw;
  height: 20vw;
}

.wrapper .food li .food-left-info {
  margin-left: 3vw;
}

.wrapper .food li .food-left-info h3 {
  font-size: 3.8vw;
  color: #555;
}

.wrapper .food li .food-left-info p {
  font-size: 3vw;
  color: #888;
  margin-top: 2vw;
}

/****************** 购物车部分 ******************/
.wrapper .cart {
  width: 100%;
  height: 14vw;
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
}
</style>
