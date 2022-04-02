<template>
  <div class="main">
    <van-nav-bar
      class="header"
      title="测试"
      :border="false"/>
    <van-tree-select
      class="tree"
      ref="treeSelect"
      height="auto"
      :style="{'--beforeHeight': beforeHeight, '--afterHeight': afterHeight}"
      :items="items"
      :active-id.sync="items.activeId"
      :main-active-index.sync="items.activeId"
      @click-nav="onNavClick">
      <template slot="content">
        <div v-if="tableSelect.length > 0">
          <div class="m_box"
          v-for="item in tableSelect"
          :key="item.index"
          @click="$router.push({ path: '/test-detail', query:{ tableCode: item.tableCode } })">
            <img :src="item.tableLogo" alt="">
            <div class="b_content">
              <div class="b_title">{{item.tableName}}</div>
              <div class="b_price">￥{{item.price}}</div>
            </div>
          </div>
        </div>
        <div class="noTable" v-else>
          <img src="@/assets/img/my/noTable.png" alt="noTable">
          <span>暂无测试</span>
        </div>
      </template>
    </van-tree-select>
    <div class="footer"><MainTabbar></MainTabbar></div>
  </div>
</template>

<script>
import { tableTypeList, getAllTable } from '@/api/modules/user'
import MainTabbar from '@/components/MainTabbar'
export default {
  data () {
    return {
      items: [],
      tableAll: [],
      tableSelect: [],
      beforeHeight: '18px',
      afterHeight: '18px'
    }
  },
  components: {
    MainTabbar
  },
  mounted () {
    this.getTypeList()
    this.getAllTable()
  },
  methods: {
    async getTypeList () {
      const res = await tableTypeList({ page: -1, pageSize: 10 })
      if (res.code === 0) {
        const typeAll = res.data.tables.filter(v => v.name !== 'AI心理测评')
        typeAll.forEach(v => {
          this.items.push(
            {
              text: v.name,
              activeId: v.id
            }
          )
        })
      }
    },
    async getAllTable () {
      const res = await getAllTable()
      if (res.code === 0) {
        const all = res.data.filter(v => v.tableType !== 2)
        this.tableAll = all.filter(v => v.tableCode !== 'psqi')
        const id = this.items[0].activeId
        this.tableSelect = this.tableAll.filter(v => v.selfTableType.id === id)
      }
    },
    onNavClick (index) {
      const id = this.items[index].activeId
      this.tableSelect = this.tableAll.filter(v => v.selfTableType.id === id)
      const doc = document.querySelectorAll('.van-sidebar-item')
      doc.forEach(v => {
        v.style.borderRadius = 0
      })
      if (index !== 0) {
        doc[index - 1].style.borderBottomRightRadius = '0.24rem'
        this.beforeHeight = '0'
      } else {
        this.beforeHeight = '0.426667rem'
      }
      if (index !== doc.length - 1) {
        doc[index + 1].style.borderTopRightRadius = '0.24rem'
        this.afterHeight = '0'
      } else {
        this.afterHeight = '0.426667rem'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  .tree{
    flex: 1;
    overflow: auto;
    .van-tree-select__nav{
      flex:none;
      width: 1.68rem;
      white-space: nowrap;
      .van-sidebar-item{
        background-color: #fff;
        padding: .426667rem .213333rem;
        text-align: center;
        font-size: .32rem;
        color: #999999;
        font-weight: 500;
        .van-sidebar-item__text{
          height: .373333rem;
          line-height: .373333rem;
        }
      }
      .van-sidebar-item--select{
        background-color: #F4F4F4;
        padding: .213333rem;
        color: #34B7B9;
        font-weight: 600;
      }
      .van-sidebar-item--select::before{
        width: 4px;
        height: .88rem;
        background: #34B7B9;
        border-radius: 0px 4px 4px 0px;
      }
    }
    .van-tree-select__content{
      flex: 1;
      background: #F4F4F4;
      padding: 0 .266667rem;
      padding-bottom: .266667rem;
      .noTable{
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        top: 30%;
        img{
          width: 3.733333rem;
          height: 3.733333rem;
        }
        span{
          font-size: .48rem;
          color: #999999;
        }
      }
      .m_box{
        width: 7.093333rem;
        height: 1.813333rem;
        background: #FFFFFF;
        border-radius: .266667rem;
        margin-top: .266667rem;
        padding: .266667rem;
        display: flex;
        margin-right: 0;
        img{
          width: 1.813333rem;
          height: 1.813333rem;
        }
        .b_content{
          margin-left: .32rem;
          .b_title{
            width: 4.906667rem;
            font-size: .373333rem;
            color: #333333;
          }
          .b_price{
            font-size: .32rem;
            color: #666666;
            margin-top: .266667rem;
          }
        }
      }
    }
    .van-tree-select__nav::before{
      content: "";
      display:block;
      width: 100%;
      height: var(--beforeHeight);
      border-radius: 0 0 .24rem 0;
      background-color: #fff;
    }
    .van-tree-select__nav::after{
      content: "";
      display:block;
      width: 100%;
      height: var(--afterHeight);
      border-radius: 0 .24rem 0 0;
      background-color: #fff;
    }
  }
  .footer{
    height: 1.226667rem;
  }
}

</style>
