<template>
  <div class="likes-action">
    <img :src="curIcon" alt="likes-icon" @click="getLikes">
    <span>{{ currNum }}</span>
  </div>
</template>

<script>
import { postTableKudos } from '@/api/modules/table'
export default {
  name: 'likes-action',
  props: {
    num: {
      type: Number,
      default: 0
    },
    hasLikes: {
      type: Boolean,
      default: false
    },
    tableCode: String
  },
  data () {
    return {
      isLikes: false,
      likeNum: 0
    }
  },
  created () {
    if (sessionStorage[this.tableCode + 'IsLikes']) this.isLikes = true
  },
  computed: {
    // 数量
    currNum () {
      const sum = this.num + this.likeNum
      if (sum < 10000) return sum
      else {
        const tenThousand = sum / 10000
        if (tenThousand >= 10000) return '9999.9w'
        const curString = tenThousand.toFixed(1)
        return curString + 'w'
      }
    },
    // 点赞按钮
    curIcon () {
      if (this.hasLikes) return require('@/assets/img/likes.png')
      else if (this.isLikes) return require('@/assets/img/likes.png')
      else return require('@/assets/img/likes-normal.png')
    }
  },
  methods: {
    // 点赞
    getLikes () {
      if (this.hasLikes) return
      if (this.isLikes) return
      postTableKudos(this.tableCode).then(
        () => {
          this.isLikes = true
          sessionStorage[this.tableCode + 'IsLikes'] = 'true'
          this.likeNum++
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
@w: 37.5;
.likes-action {
  font-size: 14rem / @w;
  color: #F5B54C;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 14rem / @w;
  }
  span {
    margin-top: 5rem / @w;
  }
}
</style>
