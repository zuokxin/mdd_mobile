<template>
  <div class="container">
    <!-- ---------- -->
    <div class="test">
      <div class="progress" >
        <div class="text" v-if="allData.showProgress">测试进度: {{allData.id + 1}} / {{allData.questionTotal}}</div>
        <van-progress :percentage="process" stroke-width="5px" color="#34B7B9" v-if="allData.showProgress" :show-pivot="false" />
      </div>
      <div class="question-box" v-if="tableCode === 'psqi'">
        <!-- {{end}}{{allData.id}} -->
        <div class="question">{{(allData.id + 1)? (allData.id + 1): ''}}.{{allData.title}}</div>
        <div class="psqi" v-if="options.style === 'psqi-1'">
          <div class="items" v-for="(item,myindex) in options.formItems" :key="myindex">
            <div class="plaintext" v-if="item.type === 'plaintext'">{{ item.plaintext}}</div>
            <div class="select" v-if="item.type === 'select'" @click="popoutTrue(myindex, item.options)">{{ getChecked(item) }}</div>
            <div class="suffix" v-if="item.type === 'select'">{{ item.suffix }}</div>
            <van-action-sheet v-model="tempValue" close-on-click-action cancel-text="取消" :actions="sheetOptions" @select="onSelect" />
          </div>
        </div>
        <div  v-if="options.style === 'radio-column-1'">
          <div v-for="(it,index) in options.formItems[0].options" :key="index">
            <div class="each-choice" :class="{'each-choice-active':it.checked}" @click="psqiDispose(index)">
              <span class="left-title">{{it.name}}</span>
              <span class="right-choice">
                <img class="uncheck" v-if="!it.checked"  src="@/assets/uncheck.png">
                <img class="check" v-else src="@/assets/checked.png">
              </span>
            </div>
            <div class="isCommentIsNecessary" v-if="it.checked && it.commentIsNecessary">
              <van-field v-model.trim="it.comment" @input="psqiDisposeComment(index)" rows="2" autosize  label="" type="textarea" :placeholder="it.commentHint" show-word-limit/>
            </div>
          </div>
        </div>
      </div>
      <div class="question-box" v-else>
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
    <div class="bnts" v-if="allData.title && tableCode !== 'psqi'">
      <van-button round block type="primary" :disabled="allData.id === 0" @click="prev">上一题</van-button>
      <van-button round block type="primary" v-if="(allData.id + 1) !== allData.questionTotal" :disabled="!end" @click="next">下一题</van-button>
      <van-button round block type="primary" v-else @click="finished" :disabled="!end">完成</van-button>
    </div>
    <div class="bnts" v-else>
      <van-button round block type="primary" :disabled="allData.id === 0" @click="prev">上一题</van-button>
      <van-button round block type="primary" v-if="psqiFinish" :disabled="!end" @click="finished">完成</van-button>
      <van-button round block type="primary" v-else :disabled="!end"  @click="next">下一题</van-button>
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
      needSend: false,
      tempValue: false,
      sheetOptions: [],
      sheetindex: '',
      psqiFinish: false
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
        if (this.tableCode === 'psqi') {
          this.psqiFinish = false
          if (res.data.id === 18) {
            if (res.data.isEnd) {
              this.psqiFinish = true
              this.end = true
            }
            this.needSend = false
            this.allData = res.data
            this.options = res.data.form
          } else if (res.data.id === 23) {
            this.needSend = false
            this.end = false
            this.allData = res.data
            this.options = res.data.form
            // console.log(this.options)
            this.checkpsqi()
          } else if (res.data.id !== -1) {
            this.needSend = false
            this.end = false
            this.allData = res.data
            this.options = res.data.form
            // console.log(this.options)
            this.checkpsqi()
          } else {
            this.psqiFinish = true
            this.end = true
          }
        } else {
          this.needSend = false
          this.end = false
          this.allData = res.data
          this.options = res.data.form.formItems[0].options
          this.currentCheck()
        }
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
    psqiDispose (index) {
      this.options.formItems[0].options.forEach((e, ind) => {
        if (ind === index) {
          e.checked = true
          this.psqiFinish = false
        } else {
          e.checked = false
          e.comment = ''
        }
      })
      const item = this.options.formItems[0].options.find(e => e.checked)
      // console.log(item)
      if (item.checked && item.commentIsNecessary) {
        this.end = false
      } else if (item.checked && !item.commentIsNecessary) {
        this.next()
      }
    },
    psqiDisposeComment (index) {
      const item = this.options.formItems[0].options[index]
      if (item.checked && item.commentIsNecessary && item.comment !== '') {
        this.end = true
      } else {
        this.end = false
      }
    },
    getChecked (item) {
      const e = item.options.find(e => e.checked === true)
      return (e && e.name) || ''
    },
    popoutTrue (index, list) {
      this.sheetindex = index
      this.tempValue = true
      this.sheetOptions = list
      // console.log(index, list)
    },
    clearSheet () {
      this.sheetindex = 'index'
      this.tempValue = false
      this.sheetOptions = []
    },
    onSelect (e) {
      this.options.formItems[this.sheetindex].options.forEach(item => {
        if (item.id === e.id) {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      this.clearSheet()
      this.checkpsqi()
      // console.log(this.options)
    },
    checkpsqi () {
      // console.log(this.options.style)
      if (this.options.style === 'psqi-1') {
        const list = this.options.formItems.filter(e => e.type === 'select')
        const arr = []
        list.forEach(e => {
          e.options.forEach(e => {
            if (e.checked) {
              arr.push(true)
            }
          })
        })
        if (arr.length === 2) {
          this.end = true
        }
      } else if (this.options.style === 'radio-column-1') {
        const item = this.options.formItems[0].options.find(e => e.checked)
        // console.log(item)
        if (this.allData.id === 23) {
          // console.log('上')
          // console.log(item)
          if (item && item.checked && !item.commentIsNecessary) {
            this.psqiFinish = true
            this.end = true
          } else if (item && item.checked && item.commentIsNecessary && item.comment) {
            this.psqiFinish = true
            this.end = true
          }
        } else {
          // console.log('下')
          // 非23题  19题简单单选 最后一题不一样
          if (item && item.checked && item.commentIsNecessary) {
            this.psqiFinish = false
            this.end = true
          } else if (item && item.checked) {
            this.end = true
          } else {
            this.psqiFinish = false
            this.end = false
          }
        }
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
      if (this.tableCode === 'psqi') {
        this.psqiFinish = false
      }
      const data = {
        questionId: this.allData.id - 1,
        sessionId: this.sessionId,
        tableCode: this.tableCode
      }
      const res = await getTableQues(data)
      if (res.code === 0) {
        this.end = false
        this.allData = res.data
        if (this.tableCode === 'psqi') {
          this.options = res.data.form
          this.checkpsqi()
        } else {
          this.options = res.data.form.formItems[0].options
          this.currentCheck()
        }
      } else {
        this.$toast(res.message)
      }
    },
    // 下一题
    async next () {
      // console.log(this.options)
      const data = {
        id: this.allData.id,
        sessionId: this.sessionId,
        tableCode: this.tableCode
        // form: this.allData.form
      }
      if (this.tableCode === 'psqi') {
        data.form = JSON.parse(JSON.stringify(this.options))
        data.title = this.allData.title
        this.checkpsqi()
      } else {
        this.allData.form.formItems[0].options = JSON.parse(JSON.stringify(this.options))
        data.form = this.allData.form
      }
      const res = await postTableQues(data)
      if (res.code === 0) {
        if (this.tableCode === 'psqi') {
          this.getQues(this.allData.id + 1)
        }
        // console.log(res)
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
      .each-choice-active{
        border: 1px solid #34B7B9 !important;
      }
      .isCommentIsNecessary{
        width: 7.066667rem;
        height: 1.6rem;
        background-color: pink;
        margin-left: auto;
        margin-right: auto;
        padding: 0;
        margin-bottom: .426667rem;
        border-radius: 0.426667rem;
        border: 1px solid #F6F6F6;
        overflow: hidden;
        .van-cell{
          padding: 0;
          height: 100%;
          background-color: #F6F6F6;
          /deep/.van-field__body{
            height: 100%;
            padding-left: 1em;
            padding-right: 1em;
          }
        }
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
      .psqi{
        display: flex;
        padding: 0 .32rem;
        color: #333333;
        font-size: .5333rem;
        flex-wrap: wrap;
        .items{
          display: flex;
          .select{
            width: .96rem;
            height: .6933rem;
            padding-top: 2px;
            border: 1px solid #000000;
            border-radius: .16rem;
            text-align: center;
            box-sizing: border-box;
          }
          /deep/.van-overlay{
            background-color: rgba(0, 0, 0, 0.3);
          }
        }
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
