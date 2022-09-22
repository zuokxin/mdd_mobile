<template>
  <div class="mini-box">
    <!-- 共有X种类型 渲染出不同的 选择器 -->
    <!-- 单选 下拉-->
    <div class="my-select my-selectRange" v-if="miniQInfo.type === 'select'">
      <div class="selectRange-block">
        <div class="fixed">
          <span class="choice" v-if="select !== '' ">{{select}}</span>
          <span class="default" v-else>请选择</span>
          <span class="down-arrow"><img src="../assets/down-arrow.png"></span>
        </div>
        <div class="panel" @click="selectShow = true">
        </div>
      </div>
    </div>
    <van-action-sheet v-model="selectShow" :actions="miniQInfo.miniSelects" cancel-text="取消" close-on-click-action @select="selectSelect($event)" />
    <!-- 单选 圆点-->
    <div class="my-radio public-select" v-if="miniQInfo.type === 'radio' && mid !== 171">
      <div class="each-choice" v-for="(it,index) in miniQInfo.miniRadios" :key="index" @click="selectRadios(it.checked, index)">
        <span class="left-title">{{it.name}}</span>
        <span class="right-choice">
          <img class="uncheck" v-if="!it.checked"  src="@/assets/uncheck.png">
          <img class="check" v-else src="@/assets/checked.png">
        </span>
      </div>
    </div>
    <!-- 多选 -->
    <div class="my-check public-select" v-if="miniQInfo.type === 'check'">
      <div class="each-choice" v-for="(it,index) in miniQInfo.miniChecks" :key="index" @click="selectCheck(index)">
        <span class="left-title">{{it.name}}</span>
        <span class="right-choice">
          <img class="uncheck" v-if="!it.checked"  src="@/assets/uncheck1.png">
          <img class="check" v-else src="@/assets/checked1.png">
        </span>
      </div>
    </div>
    <!-- 单选+多选组合 方点多选-->
    <div class="my-specselect" v-if="miniQInfo.type === 'radio' && mid === 171">
      <div class="each-choice" v-for="(item1,index1) in miniQInfo.miniRadios" :key="index1" :class="{'get': item1.checked}" >
        <div class="row"  @click="disponseSpecial(index1)">
          <span class="left-title">{{item1.name}}</span>
          <span class="right-choice">
            <img class="uncheck" v-if="!item1.checked" src="@/assets/uncheck.png">
            <img class="check" v-else src="@/assets/checked.png">
          </span>
        </div>
        <div class="line" v-if="item1.items" :class="{'line-get': item1.checked}"></div>
        <template v-if="item1.items">
          <div class="block" v-for="(item2,index2) in item1.items" :key="index2">
          <div class="title">——{{item2.name}}</div>
          <div class="choice-list">
            <div class="mid-block" v-for="(item3, index3) in item2.elements" :key="index3" @click="toggleClick(index1, index2, index3)">
              <img class="uncheck" v-if="!item3.checked"  src="@/assets/uncheck1.png" >
              <img class="check" v-else src="@/assets/checked1.png">
              <span>{{item3.name}}</span>
            </div>
          </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 171有关题 圆点单选-->
    <div class="my-specradioGroup " v-if="miniQInfo.type === 'radioGroup'">
      <div class="block" v-for="(item,index) in miniQInfo.miniRadioGroup" :key="index">
          <div class="title">——{{item.name}}</div>
          <div class="choice-list">
            <div class="mid-block" v-for="(it, ind) in item.elements" :key="ind" @click="selectRadioGroup(index, ind)">
              <span class="img-box">
                <img class="uncheck" v-if="!it.checked"  src="@/assets/uncheck.png" >
                <img class="check" v-else src="@/assets/checked.png">
              </span>
              <span>{{it.name}}</span>
            </div>
          </div>
      </div>
    </div>
    <!-- 选择时间 -->
    <div class="my-dateRange" v-if="miniQInfo.type === 'dateRange'">
      <div class="time-block">
        <div class="time time1"><van-cell is-link @click="timeFlag1 = true"></van-cell><span class="choice" v-if="time1">{{disponseTime(time1)}}</span><span v-else class="default">请选择</span></div>
        <div class="time-icon"><img src="../assets/timeicon.png"></div>
        <div class="to">至</div>
        <div class="time time2"><van-cell is-link @click="timeFlag2 = true"></van-cell><span class="choice" v-if="time2">{{disponseTime(time2)}}</span><span v-else class="default">请选择</span></div>
        <div class="time-icon"><img src="../assets/timeicon.png"></div>
      </div>
    </div>
    <van-popup v-model="timeFlag1" position="bottom" :close-on-click-overlay="false">
        <van-datetime-picker
          type="year-month"
          :min-date="minDate"
          :max-date="maxDate"
          v-model="time1"
          @confirm="onConfirm1"
          @cancel="cancel1"
        />
    </van-popup>
    <van-popup v-model="timeFlag2" position="bottom" :close-on-click-overlay="false">
        <van-datetime-picker
          type="year-month"
          :min-date="minDate"
          :max-date="maxDate"
          v-model="time2"
          @confirm="onConfirm2"
          @cancel="cancel2"
        />
    </van-popup>
    <!-- 选择时间 end -->
    <!-- 对应下拉选择 -->
    <div class="my-selectRange" v-if="miniQInfo.type === 'selectRange'">
      <div class="selectRange-block">
        <div class="fixed">
          <span class="choice" v-if="choice">{{choice}}</span>
          <span class="default" v-else>请选择</span>
          <span class="down-arrow"><img src="../assets/down-arrow.png"></span>
        </div>
        <div class="panel" @click="selectRangeShow = true">
        </div>
      </div>
      <span>{{miniQInfo.miniSelectRange.suffix}}</span>
    </div>
    <van-action-sheet v-model="selectRangeShow" :actions="selectRangeList" cancel-text="取消" close-on-click-action  @select="selectSelectRange($event)" />
  </div>
</template>

<script>
export default {
  name: 'miniChoice',
  props: {
    miniQInfo: Object,
    mid: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      maxDate: new Date(),
      timeFlag1: false,
      timeFlag2: false,
      time1: '',
      time2: '',
      myTime: ['', ''],
      choice: '',
      select: '',
      selectShow: false,
      selectRangeShow: false
    }
  },
  computed: {
    minDate () {
      const date = new Date()
      const y = date.getFullYear() - 100
      const m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 0) : (date.getMonth() + 0)
      const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return new Date(y, m, d)
    },
    selectRangeList () {
      if (this.miniQInfo.type === 'selectRange') {
        const arr = []
        for (let i = this.miniQInfo.miniSelectRange.min; i <= this.miniQInfo.miniSelectRange.max; i++) {
          arr.push({ name: i })
        }
        return arr
      } else {
        return []
      }
    }
  },
  watch: {
    mid (newV, oldV) {
      if (newV !== oldV) {
        this.clearData()
      }
    },
    timeFlag1 (newV, oldV) {
      if (newV) {
        if (!this.time1) {
          this.time1 = new Date()
        }
      }
    },
    timeFlag2 (newV, oldV) {
      if (newV) {
        if (!this.time2) {
          this.time2 = new Date()
        }
      }
    }
  },
  methods: {
    // 栓Q设计图
    // 这些在做题过程中触发人脸弹窗 删数据
    // 处理选项Select Radios Checks SelectRadioGroup
    selectRadios (flag, index) {
      if (flag === true) {
        return false
      }
      this.miniQInfo.miniRadios.forEach((e, ind) => {
        if (index === ind) {
          e.checked = true
        } else {
          e.checked = false
        }
      })
      this.$emit('sendData', this.miniQInfo)
    },
    selectCheck (index) {
      this.miniQInfo.miniChecks[index].checked = !this.miniQInfo.miniChecks[index].checked
      const collectArr = []
      this.miniQInfo.miniChecks.forEach(e => {
        collectArr.push(e.checked)
      })
      if (collectArr.includes(true)) {
        this.$emit('sendData', this.miniQInfo)
      } else {
        this.$emit('sendFalse')
      }
    },
    // 下拉单选
    selectSelect (e) {
      this.select = e.name
      this.miniQInfo.miniSelects.forEach(it => {
        if (it.name === e.name) {
          it.checked = true
          this.$emit('sendData', this.miniQInfo)
        } else {
          it.checked = false
        }
      })
    },
    // 组合题型
    toggleClick (mark1, mark2, mark3) {
      // console.log(this.miniQInfo.miniRadios[mark1].items[mark2].elements[mark3])
      if (this.miniQInfo.miniRadios[1].checked) {
        this.miniQInfo.miniRadios[mark1].items[mark2].elements[mark3].checked = !this.miniQInfo.miniRadios[mark1].items[mark2].elements[mark3].checked
        const collectArr = []
        this.miniQInfo.miniRadios[1].items.forEach(e => {
          e.elements.forEach(it => {
            collectArr.push(it.checked)
          })
        })
        if (collectArr.includes(true)) {
          this.$emit('sendData', this.miniQInfo)
        } else {
          this.$emit('sendFalse')
        }
      }
    },
    disponseSpecial (index1) {
      this.miniQInfo.miniRadios.forEach((e, ind) => {
        if (index1 === ind) {
          e.checked = true
          // element全部处理掉
          this.miniQInfo.miniRadios[1].items.forEach(e => {
            e.elements.forEach(it => {
              it.checked = false
            })
          })
        } else {
          e.checked = false
        }
      })
      if (this.miniQInfo.miniRadios[0].checked) {
        this.$emit('sendData', this.miniQInfo)
      } else {
        this.$emit('sendFalse')
      }
    },
    // ====
    selectRadioGroup (index1, index2) {
      this.miniQInfo.miniRadioGroup.forEach((it1, ind1) => {
        it1.elements.forEach((it2, ind2) => {
          if (ind1 === index1 && ind2 === index2) {
            this.$emit('sendData', this.miniQInfo)
            it2.checked = true
          } else {
            it2.checked = false
          }
        })
      })
    },
    disponseTime (t) {
      if (t) {
        const d = new Date(t)
        const datetime = d.getFullYear() + '' + '-' + '' + ((d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1)
        return datetime
      }
    },
    onConfirm1 () {
      this.myTime[0] = new Date(this.time1).getTime() / 1000
      this.sureTime()
      this.timeFlag1 = false
    },
    cancel1 () {
      this.time1 = ''
      this.timeFlag1 = false
    },
    onConfirm2 () {
      this.myTime[1] = new Date(this.time2).getTime() / 1000
      this.sureTime()
      this.timeFlag2 = false
    },
    cancel2 () {
      this.time2 = ''
      this.timeFlag2 = false
    },
    sureTime () {
      if (this.time1 && this.time2) {
        this.miniQInfo.dateRange.result = this.myTime
        this.$emit('sendData', this.miniQInfo)
      }
    },
    // 时间
    // 对应下拉选择题自己处理选项的
    selectSelectRange (e) {
      console.log(e)
      this.choice = e.name
      this.selectRangeShow = false
      this.miniQInfo.miniSelectRange.result = this.choice
      this.$emit('sendData', this.miniQInfo)
    },
    clearData () {
      this.select = ''
      this.timeFlag1 = false
      this.timeFlag2 = false
      this.time1 = ''
      this.time2 = ''
      this.myTime = ['', '']
      this.choice = ''
      this.selectShow = false
      this.selectRangeShow = false
      console.log(this.miniQInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.mini-box{
  width: 100%;
  // 单选
  .public-select{
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
        display: flex;
        justify-content: center;
        align-items: center;
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
  }
  // 单选+多选
  .my-specselect{
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
      .row{
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
      .line{
        height: 1px;
        background: #666666 ;
        margin-top: 5px;
        margin-bottom: 5px;
      }
      .line-get{
        background: #34B7B9 ;
      }
      .block{
        .title{
          color: #555555;
          font-weight: 500;
          margin-bottom: .3243rem;
        }
        .choice-list{
          display: flex;
          flex-wrap: wrap;
          width: calc(100% + 0.5rem);
          .mid-block{
            img{
              width: .4865rem;
              height: .4865rem;
              margin-right: .1622rem;
            }
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: .2703rem;
            margin-right: .5405rem;
          }
        }
      }
    }
    .get{
      border-color: #34B7B9;
    }
  }
  .my-check{
    .each-choice{
      .right-choice{
        .uncheck{
          width: .7568rem;
          height: .7568rem;
        }
        .check{
          width: .7568rem;
          height: .7568rem;
        }
      }
    }
  }
  .my-specradioGroup{
    padding: .3243rem;
    overflow-x: hidden;
    .block{
      .title{
        color: #555555;
        font-weight: 500;
        margin-bottom: .3243rem;
      }
      .choice-list{
        display: flex;
        flex-wrap: wrap;
        width: calc(100% + 0.5rem);
        .mid-block{
          .img-box{
            width: .4865rem;
            height: .4865rem;
            display: flex;
            justify-content: center;
            align-items: center;
            .uncheck{
              width: .48rem;
              height: .48rem;
            }
            .check{
              width: .746667rem;
              height: .746667rem;
            }
            margin-right: .1622rem;
          }
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: .2703rem;
          margin-right: .5405rem;
        }
      }
    }
  }
  .my-dateRange{
    padding: 0 .3243rem;
    .time-block{
      height: 1.2973rem;
      background: #F9F9F9;
      border-radius: .3243rem;
      overflow: hidden;
      padding-left: .2432rem;
      padding-right: .2703rem;
      display: flex;
      align-items: center;
      .time{
        flex: 1;
        font-size: 14px;
        .default{
          color: #E2E2E2 ;
        }
        .choice{
          color: #333333;
        }
        padding-left: .2162rem;
        position: relative;
        .van-cell{
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: transparent;
          i{
            display: none;
          }
        }
      }
      .time-icon{
        width: .6486rem;
        height: .6486rem;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .to{
        padding: 0 .2162rem;
        color: #333333;
        font-size: 14px;
      }
    }
  }
  .my-selectRange{
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 0 .3243rem;
    .selectRange-block{
      position: relative;
      width: 5.2703rem;
      height: 1.2973rem;
      border-radius: .3243rem;
      background: #F9F9F9;
      .fixed{
        display: flex;
        padding: 0 .5405rem;
        height: 100%;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        .choice{
          color: #333333;
        }
        .default{
          color: #555555;
        }
        .down-arrow{
          width: .4595rem;
          height: .2432rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .panel{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
    span{
      color: #555555;
      padding-left: .2703rem;
      font-size: 14px;
    }
  }
  .van-action-sheet{
    max-height: 60%;
  }
}
</style>
