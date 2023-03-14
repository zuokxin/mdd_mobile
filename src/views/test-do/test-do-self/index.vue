<template>
  <div class="container">
    <!-- ---------- -->
    <div class="test">
      <div class="progress" >
        <div class="text" v-if="allData.showProgress">测试进度: {{allData.id + 1}} / {{allData.questionTotal}}</div>
        <van-progress :percentage="process" stroke-width="5px" color="#34B7B9" v-if="allData.showProgress" :show-pivot="false" />
      </div>
      <div class="question-box">
        <!-- {{end}}{{allData.id}} -->
        <div class="question">{{(allData.id + 1)? (allData.id + 1): ''}}.{{allData.title}}</div>
        <div v-for="(it,index) in options" :key="index">
          <div class="each-choice" @click="dispose(index)">
            <span class="left-title">{{it.name}}</span>
            <span class="right-choice">
              <img class="uncheck" v-if="!it.checked"  src="@/assets/uncheck.png">
              <img class="check" v-else src="@/assets/checked.png">
            </span>
          </div>
          <span v-if="it.commentHint && it.requiredComment && it.checked" class="commentHint">{{it.commentHint}}:</span>
          <van-field class="each-comment" maxlength="100" @input="theInput(it.requiredComment)" type="textarea" v-if="it.requiredComment && it.checked" v-model="it.comment"/>
        </div>
      </div>
    </div>
    <!-- ---------- -->
    <div class="bnts" v-if="allData.title">
      <van-button round block type="primary" :disabled="allData.id === 0" @click="prev">上一题</van-button>
      <van-button round block type="primary" v-if="(allData.id + 1) !== allData.questionTotal" :disabled="!end" @click="next">下一题</van-button>
      <van-button round block type="primary" v-else @click="finished" :disabled="!end">完成</van-button>
    </div>
  </div>
</template>

<script>
import { getTableQues, postTableQues, postTableRes } from '@/api/modules/user'
import wxShare from '@/utils/wxShare'
// import { findIndexByKeyValue } from '@/utils/checkFinish'
import { mapGetters } from 'vuex'
import { Dialog } from 'vant'
export default {
  name: 'do-self',
  data () {
    return {
      sessionId: '',
      allData: {},
      tableCode: '',
      options: [],
      end: false,
      needSend: false
    }
  },
  computed: {
    process () {
      const num = (this.allData.id + 1) / this.allData.questionTotal
      const percentNum = (num * 100).toFixed(0)
      return percentNum
    },
    // 当前表名
    thisTable () {
      return this.$route.query.tableCode
    },
    ...mapGetters([
      'nextTable'
    ]),
    routerPath () {
      // 测试表未完成
      // console.log(this.thisTable, 'this.$route.query.tableCode')
      const next = this.nextTable(this.thisTable)
      // console.log(next, '自评')
      if (next) {
        if (next.table.tableType === 1) {
          return `/test-do-self?sessionId=${this.sessionId}&tableCode=${next.tableCode}`
        } else {
          return `/environment?sessionId=${this.sessionId}&tableCode=${next.tableCode}`
        }
      } else {
        return `/test-do-wait?sessionId=${this.sessionId}&s=5`
      }
    }
  },
  mounted () {
    this.sessionId = this.$route.query.sessionId
    this.tableCode = this.$route.query.tableCode
    if (localStorage.getItem('phone')) {
      this.getQues()
    } else {
      this.$router.replace('/login')
    }
    wxShare.hiddenShare()
  },
  methods: {
    // 获取题目
    async getQues (id) {
      const data = {
        sessionId: this.sessionId,
        tableCode: this.tableCode,
        questionId: id || this.allData.id
      }
      if (!id) {
        delete data.questionId
      }
      const res = await getTableQues(data)
      if (res.code === 0) {
        this.needSend = false
        this.end = false
        this.allData = res.data
        this.options = res.data.form.formItems[0].options
        this.currentCheck()
      }
    },
    // 检查是否可以下一题了
    currentCheck (index) {
      if (this.allData.form.formItems[0].type === 'radio') {
        this.end = this.options.some(e => e.checked)
      }
      if (index >= 0) {
        if (this.options[index].checked && this.options[index].commentIsNecessary) {
          if (this.options[index].comment) {
            this.end = true
          } else {
            this.end = false
          }
        }
      }
    },
    // 处理选项
    dispose (index) {
      this.options.forEach((e, ind) => {
        if (index === ind) {
          e.checked = true
        } else {
          e.checked = false
          e.comment = ''
        }
      })
      this.currentCheck(index)
      if (!this.options[index].commentIsNecessary) {
        this.next()
      } else {
        this.needSend = true
      }
    },
    // 文本内容
    theInput (text) {
      if (text) {
        this.end = true
      } else {
        this.end = false
      }
    },
    // 上一题
    async prev () {
      const data = {
        questionId: this.allData.id - 1,
        sessionId: this.sessionId,
        tableCode: this.tableCode
      }
      const res = await getTableQues(data)
      if (res.code === 0) {
        this.end = false
        this.allData = res.data
        this.options = res.data.form.formItems[0].options
        this.currentCheck()
      } else {
        this.$toast(res.message)
      }
    },
    // 下一题
    async next () {
      this.allData.form.formItems[0].options = this.options
      const data = {
        id: this.allData.id,
        sessionId: this.sessionId,
        tableCode: this.tableCode,
        form: this.allData.form
      }
      const res = await postTableQues(data)
      if (res.code === 0) {
        if ((this.allData.id + 1) !== this.allData.questionTotal) {
          this.getQues(this.allData.id + 1)
        }
      } else {
        this.$toast(res.message)
      }
    },
    // 完成
    async finished () {
      const next = this.nextTable(this.thisTable)
      // console.log(next)
      // console.log(this.thisTable)
      if (this.needSend) {
        this.allData.form.formItems[0].options = this.options
        const data = {
          id: this.allData.id,
          sessionId: this.sessionId,
          tableCode: this.tableCode,
          form: this.allData.form
        }
        postTableQues(data).then(res => {
          if (res.code === 0) {
            const data = {
              tableCode: this.tableCode,
              sessionId: this.sessionId
            }
            postTableRes(data).then(resp => {
              if (resp.code === 0) {
                if (next) {
                  this.thisDialog('您将进入下一个量表进行测试').then(() => {
                    this.$router.replace(this.routerPath)
                  })
                } else {
                  this.$router.replace(this.routerPath)
                }
                // this.$router.replace({ path: '/test-do-wait?s=5', query: { sessionId: this.sessionId } })
              } else {
                this.$toast(resp.message)
              }
            })
          } else {
            this.$toast(res.message)
          }
        })
      } else {
        const data = {
          tableCode: this.tableCode,
          sessionId: this.sessionId
        }
        const res = await postTableRes(data)
        if (res.code === 0) {
          // this.$router.replace({ path: '/test-do-wait?s=5', query: { sessionId: this.sessionId } })
          if (next) {
            this.thisDialog('您将进入下一个量表进行测试').then(() => {
              this.$router.replace(this.routerPath)
            })
          } else {
            this.$router.replace(this.routerPath)
          }
        } else {
          this.$toast(res.message)
        }
      }
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
@import '../../../assets/style/reset-vant.less';
.container{
  background-color: #F6F6F6;
  max-height: 100vh;
  min-height: 100vh;
  padding: 0 .533333rem;
  .test{
    text-align: center;
    .progress{
      color: #000000;
      padding: .426667rem .32rem;
      .text{
        margin-bottom: .266667rem;
      }
    }
    .question-box{
      background-color: #FFFFFF;
      max-height: 70vh;
      min-height: 70vh;
      overflow: hidden;
      overflow-y: scroll;
      border-radius: .266667rem;
      &::-webkit-scrollbar {
        display: none;
      }
      .question{
        font-size: .533333rem;
        padding: .426667rem.32rem;
        color: #000000;
        font-weight: 600;
        text-align: left;
      }
      .commentHint {
        display: block;
        width: 6.066667rem;
        margin-left: auto;
        margin-right: auto;
        text-align: left;
        font-size: 12px;
        font-weight: 700;
        line-height: 2;
        color: #999999;
      }
      .each-choice{
        width: 7.066667rem;
        min-height: 1.6rem;
        border: 1px solid #D5D5D5;
        margin-bottom: .426667rem;
        border-radius: .426667rem;
        box-sizing: border-box;
        margin-left: auto;
        margin-right: auto;
        padding: .426667rem .533333rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left-title{
          width: 70%;
          word-break: break-all;
          word-wrap: break-word;
          color: #000000;
          text-align: left;
          font-size: .373333rem;
        }
        .right-choice{
          width: .746667rem;
          height: .746667rem;
          .uncheck{
            width: .48rem;
            height: .48rem;
          }
          .check{
            width: .746667rem;
            height: .746667rem;
          }
        }
      }
      .each-comment{
        width: 7.066667rem;
        height: 1.6rem;
        border: 1px solid #F6F6F6;
        background-color: #F6F6F6;
        margin-bottom: .426667rem;
        border-radius: .426667rem;
        box-sizing: border-box;
        margin-left: auto;
        margin-right: auto;
      }
      .checked{
        border: 1px solid @green;
      }
    }
  }
  .bnts{
    width: calc(100% - 1rem);
    position: fixed;
    bottom: .5rem;
    display: flex;
    justify-content: center;
    .van-button{
      width: 2.88rem;
      height: 1.066667rem;
      background-color: @green;
      border-color: @green;
      margin: 0 .24rem;
    }
    .van-button--disabled{
      background-color: #D5D5D5;
      border-color: #D5D5D5;
    }
  }
}
</style>
