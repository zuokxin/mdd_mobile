<template>
  <div class="wrap">
    <van-loading color="#1989fa" v-if="loading"></van-loading>
    <div class="main" v-else>
      <div class="tagList">
        <div class="tag" v-for="( item ) in tagList" :key="item" :class="{ selected: active === (item) }"
          @click="handleSelect(item)">{{ item }}</div>
      </div>
      <div class="train-box" v-for="item in cbtCourseList" :key="item.courseImage"
        @click="$router.push({ path: '/cbt-detail', query: { courseId: item.courseId } })">
        <div class="img">
          <img :src="item.courseImage" alt="专项疏导">
          <div class="tag" v-if="Number(item.price) === 1.99" style="background-color: #9E6BF5;">限时优惠</div>
          <div class="tag" v-if="Number(item.price) === 0">限时免费</div>
        </div>
        <div class="description">
          <div class="name">{{ item.courseName }}</div>
          <div class="subTitle">{{ item.title }}</div>
          <div class="discribe">
            {{ item.tag }}<span> &#124; </span>共1节<span> &#124; </span>{{ cnt(item.cnt) }}人已学
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cbtCourseList } from '@/api/modules/user'
export default {
  data () {
    return {
      loading: false,
      allCbtCourseList: [],
      cbtCourseList: [],
      flag: 0,
      orderTagList: ['爱情', '情绪', '家庭', '婚姻', '自我成长', '人际关系', '职业发展'],
      tagList: [],
      active: '',
      courseId: ''
    }
  },
  beforeRouteEnter (to, from, next) {
    if (from.path === '/cbt-detail') {
      next(vm => {
        vm.courseId = from.query.courseId
      })
    } else {
      next()
    }
  },
  mounted () {
    this.getCbtCourseList()
  },
  methods: {
    async getCbtCourseList () {
      this.loading = true
      const res = await cbtCourseList({ type: 'all' })
      console.log('res', res)
      if (res.code === 0) {
        this.allCbtCourseList = res.data.courseList
        const tagList = Array.from(new Set(this.allCbtCourseList.map(v => v.tag)))
        this.tagList = this.orderTagList.filter(v => {
          return tagList.indexOf(v) !== -1
        })
        this.tagList.unshift('全部')
        this.init()
        console.log('this.tagList ', this.tagList)
        console.log('cbtCourseList', this.cbtCourseList, 'this.tagList', this.tagList)
      }
      this.loading = false
    },
    handleSelect (tag) {
      this.active = tag
      if (this.active === '全部') {
        this.cbtCourseList = this.allCbtCourseList
      } else {
        this.cbtCourseList = this.allCbtCourseList.filter(v => v.tag === this.active)
      }
      console.log('this.allCbtCourseList', this.allCbtCourseList, 'this.cbtCourseList', this.cbtCourseList)
    },
    init () {
      let tag = this.tagList[0]
      if (this.courseId) {
        this.allCbtCourseList.forEach(v => {
          if (v.courseId === this.courseId) {
            tag = v.tag
          }
        })
      }
      this.handleSelect(tag)
    },
    cnt (value) {
      if (value < 10000) return value
      if ((value / 10000).toFixed(1) > 9999.9) {
        return 9999.9 + 'w'
      } else {
        return (value / 10000).toFixed(1) + 'w'
      }
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;

.van-loading {
  position: relative;
  color: #D5D5D5;
  font-size: 0;
  vertical-align: middle;
  width: 100%;
  height: calc(100 * var(--vh));
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0);
}

.wrap {
  height: calc(100 * var(--vh));
  overflow-y: scroll;
}

.main {
  min-height: calc(100 * var(--vh) - 28rem/@w);
  background-color: #f4f4f4;
  padding: 18rem/@w 20rem/@w 10rem/@w;
}

.tagList {
  margin-bottom: 6rem/@w;

  .tag {
    display: inline-block;
    border-radius: 10rem/@w;
    padding: 2rem/@w 10rem/@w;
    background-color: #fff;
    font-size: 14rem/@w;
    line-height: 20rem/@w;
    color: #000;
    margin: 0 16rem/@w 12rem/@w 0;

    &.selected {
      color: #34b7b9;
    }
  }

}

.train-box {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 10rem/@w;
  padding: 16rem/@w 10rem/@w;
  height: 116rem/@w;
  border-radius: 12rem/@w;
  background-color: #fff;
  display: flex;
  justify-content: space-between;

  .img {
    width: 124rem/@w;
    height: 100%;
    box-sizing: border-box;
    font-size: 0;
    position: relative;

    .tag {
      position: absolute;
      top: -3rem/@w;
      left: -4rem/@w;
      width: 48rem / @w;
      height: 20rem / @w;
      border-radius: 8rem/@w 0 8rem/@w 0;
      background-color: #e4a434;
      text-align: center;
      font-size: 10rem/@w;
      line-height: 20rem/@w;
      color: #fff;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  .description {
    flex: 1;
    margin-left: 10rem/@w;
    color: #666;
    position: relative;

    .name {
      margin-bottom: 4rem/@w;
      font-size: 14rem/@w;
      line-height: 20rem/@w;
      font-weight: bold;
      color: #333;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: baseline;
    }

    .subTitle {
      margin: 0;
      font-size: 12rem/@w;
      line-height: 16rem/@w;
      overflow: hidden;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }

    .discribe {
      position: absolute;
      bottom: 8rem/@w;
      font-size: 10rem/@w;
      line-height: 14rem/@w;
    }
  }
}

.train-box:last-child {
  margin-bottom: 0;
}</style>
