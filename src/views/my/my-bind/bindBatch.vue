<template>
  <div>
    <div class="orgBox">
      <h3>机构绑定</h3>
      <van-form @submit="onSubmit" class="formBox">
        <van-cell-group inset>
          <van-field
            v-model="batchId"
            name="批次号"
            label="批次号"
            placeholder="请输入批次号"
          />
          <van-field
            v-model="userNumber"
            name="用户编号"
            label="用户编号"
            placeholder="请输入用户编号"
          />
        </van-cell-group>
        <div style="margin-top: 16px;">
          <van-button round block type="primary" :disabled="!userNumber || !batchId" native-type="submit">
            绑定
          </van-button>
        </div>
      </van-form>
    </div>
    <BindDailog :show.sync="showDailog" :showKefu.sync="showKefu" :detail="orgMsg" @sureAdd="sureAdd"></BindDailog>
  </div>
</template>

<script>
import { orgBind, orgBindAdd } from '@/api/modules/user'
import BindDailog from './dailog.vue'
import { Dialog } from 'vant'
export default {
  name: 'bindBatch',
  components: {
    BindDailog
  },
  props: {
    id: String,
    number: String
  },
  data () {
    return {
      showDailog: false,
      showKefu: false,
      orgMsg: {},
      batchId: this.id,
      userNumber: this.number
    }
  },
  methods: {
    onSubmit () {
      const form = {
        batchId: this.batchId,
        userNumber: this.userNumber
      }
      orgBind(form).then(res => {
        this.showDailog = true
        const { data } = res
        this.orgMsg = data
      }).catch(err => {
        this.thisDialog(err.response.data.message)
      })
    },
    sureAdd () {
      const form = {
        batchId: this.batchId,
        userNumber: this.userNumber
      }
      this.showDailog = false
      orgBindAdd(form).then(res => {
        this.thisDialog('您已成功绑定机构，可以开始做题啦~').then(() => {
          this.$emit('bindSuccess', res.data)
          this.batchId = ''
          this.userNumber = ''
        })
      }).catch(err => {
        if (err.response.data.code === 2302) {
          this.showKefu = true
        } else {
          this.thisDialog(err.response.data.message)
        }
      })
    },
    // 弹窗封装
    thisDialog (message) {
      return Dialog.alert({
        message,
        theme: 'round-button',
        className: 'detail-dialog',
        confirmButtonText: '确定',
        confirmButtonColor: '#34B7B9'
      })
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
h3{
    height: 20rem / @w;
    display: flex;
    align-items: center;
    font-size: 14rem / @w;
    font-weight: 500;
    color: #333333;
    margin: 0;
    margin-bottom: 14rem/@w;
    &:before{
      content: "";
      display: inline-block;
      width: 3px;
      height: 14rem / @w;
      background: #34B7B9;
      border-radius: 0px 11rem / @w 11rem / @w 0px;
      margin-right: 5rem / @w;
    }
}
.orgBox{
    padding: 14rem/@w 20rem/@w  18rem/@w;
    .formBox{
      background: #FFFFFF;
      border-radius: 10px 10px 10px 10px;
      padding: 24rem/@w;
      padding-top: 0;
      .van-cell-group--inset{
        margin: 0;
      }
      .van-cell{
        padding: 24rem/@w 0 16rem/@w;
      }
      .van-field__label{
        width: 80rem/@w;
        margin-right: 0;
        color: #666;
      }
      .van-button--disabled{
        background: #DEDEDE;
        border: 0;
        color: #FFFFFF;
      }
    }
}
</style>
