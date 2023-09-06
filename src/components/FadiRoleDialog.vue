<template>
  <van-dialog
    className="detail-dialog fadi-dialog-select"
    v-model="show"
    theme="round-button"
    confirmButtonText="确定"
    confirmButtonColor="#34B7B9"
    @confirm="confirm"
  >
    <p class="title">请您选择小愈虚拟形象后开始下个量表</p>
    <van-row type="flex" justify="center" gutter="30">
      <van-col span="10">
        <van-image
          :class="{ 'select' : gender === 'woman' }"
          fit="contain"
          :src="require('@/assets/img/fadi-famale.png')"
          @click="selectGender('woman')"
        />
      </van-col>
      <van-col span="10">
        <van-image
          :class="{ 'select' : gender === 'man' }"
          fit="contain"
          :src="require('@/assets/img/fadi-male.png')"
          @click="selectGender('man')"
        />
      </van-col>
    </van-row>
  </van-dialog>
</template>

<script>
export default {
  name: 'FadiRoleDialog',
  data () {
    return {
      show: false,
      gender: 'woman'
    }
  },
  methods: {
    // 选择性别
    selectGender (gender) {
      if (this.gender === gender) return
      this.gender = gender
    },
    // 确认
    confirm () {
      this.show = false
      sessionStorage.fadiGender = this.gender
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less">
@w: 37.5;
.fadi-dialog-select {
  .title {
    margin-top: 28rem / @w;
    margin-bottom: 21rem / @w;
    font-size: 16rem / @w;
    font-weight: 400;
    text-align: center;
    color: #333333;
  }
  .van-image {
    border: 1px solid #666;
  }
  .select {
    border: 2px solid #34B7B9;
  }
  .van-dialog__footer {
    padding-top: 30rem / @w;
    padding-bottom: 28rem / @w;
  }
}
</style>
