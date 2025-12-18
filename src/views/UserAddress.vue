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
            {{ item.contactSex | sexFilter }}
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

<script>
import Footer from '../components/Footer.vue';

export default {
  name: 'UserAddress',
  components: {
    Footer
  },
  data() {
    return {
      businessId: this.$route.query.businessId,
      user: {},
      deliveryAddressArr: []
    };
  },
  created() {
    this.user = this.$getSessionStorage('user');
    this.listDeliveryAddressByUserId();
  },
  filters: {
    sexFilter(value) {
      return value === 1 ? '先生' : '女士';
    }
  },
  methods: {
    // 查询用户的送货地址
    listDeliveryAddressByUserId() {
      this.$axios
        .post(
          'DeliveryAddressController/listDeliveryAddressByUserId',
          this.$qs.stringify({
            userId: this.user.userId
          })
        )
        .then(response => {
          this.deliveryAddressArr = response.data;
        })
        .catch(error => {
          console.error(error);
        });
    },

    // 设置默认送货地址
    setDeliveryAddress(deliveryAddress) {
      this.$setLocalStorage(
        this.user.userId,
        deliveryAddress
      );
      this.$router.push({
        path: '/orders',
        query: { businessId: this.businessId }
      });
    },

    // 跳转新增地址页
    toAddUserAddress() {
      this.$router.push({
        path: '/addUserAddress',
        query: { businessId: this.businessId }
      });
    },

    // 跳转编辑地址页
    editUserAddress(daId) {
      this.$router.push({
        path: '/editUserAddress',
        query: {
          businessId: this.businessId,
          daId
        }
      });
    },

    // 删除地址
    removeUserAddress(daId) {
      if (!confirm('确认要删除此送货地址吗？')) {
        return;
      }

      this.$axios
        .post(
          'DeliveryAddressController/removeDeliveryAddress',
          this.$qs.stringify({
            daId
          })
        )
        .then(response => {
          if (response.data > 0) {
            const deliveryAddress =
              this.$getLocalStorage(this.user.userId);

            if (
              deliveryAddress != null &&
              deliveryAddress.daId === daId
            ) {
              this.$removeLocalStorage(this.user.userId);
            }

            this.listDeliveryAddressByUserId();
          } else {
            alert('删除地址失败！');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }
};
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
