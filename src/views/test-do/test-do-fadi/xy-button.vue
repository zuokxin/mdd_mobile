<template>
  <div class="xy-button" :class="{'disabled': disabled}">
    <div class="in"></div>
  </div>
</template>

<script>
export default {
  name: 'xy-button',
  props: {
    disabled: Boolean
  }
}
</script>
<style scoped lang="less">
.xy-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: #FFFFFF;
  box-shadow: 0px 4px 8px 1px rgba(0,0,0,0.16);
  border-radius: 50%;
  margin: 0 12px;
  .in {
    width: 28px;
    height: 28px;
    background: #DA6254;
    border-radius: 8px;
  }
  &.disabled {
    .in {
      background: #DCDCDC;
    }
  }
}
</style>
