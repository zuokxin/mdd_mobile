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
  width: 45px;
  height: 45px;
  background: #FFFFFF;
  box-shadow: 0px 4px 8px 1px rgba(0,0,0,0.16);
  border-radius: 50%;
  margin: 0 12px;
  .in {
    width: 15px;
    height: 15px;
    background: #DA6254;
    border-radius: 5px;
  }
  &.disabled {
    .in {
      background: #DCDCDC;
    }
  }
}
</style>
