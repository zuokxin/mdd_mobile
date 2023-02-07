<template>
  <div>
    <div class="main">
      <div class="boxRight">
        {{ textRight }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialog-box-right',
  props: {
    textRight: String
  }
}
</script>
<style lang="less" scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.boxRight {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  width:100px;
  height:30px;
  margin: 10px 45px 10px 0;
  padding: 5px 11px;
  font-size: 14px;
  color: #fff;
  font-weight: 700;
  background: #34B7B9;
  border-radius: 8px;
}
.boxRight:after {
    content: '';
    position: absolute;
    right: -16px;
    bottom: -7px;
    width: 15px;
    height: 26px;
    border-width: 0;
    border-style: solid;
    border-color: transparent;
    margin-right: -1px;
    border-bottom-width: 8px;
    border-bottom-color: currentColor;
    border-radius: 0 0 58px 0;
    color: #34B7B9;
    transform: rotateZ(75deg);
}
</style>
