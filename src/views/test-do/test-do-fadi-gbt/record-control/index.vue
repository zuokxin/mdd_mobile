<template>
  <div class="record-control">
    <p class="title">{{ title }}</p>
    <p class="message">{{ message }}</p>
    <div class="submit-btn">
      <VolumeIcon class="mr-3" v-show="volumeShow" :value="volumeVal" style="transform: rotateZ(180deg);"></VolumeIcon>
      <XyButton :disabled="disabled" @click.native="handleEvent"></XyButton>
      <VolumeIcon class="ml-3" v-show="volumeShow" :value="volumeVal" style="margin-bottom: -5px;"></VolumeIcon>
    </div>
  </div>
</template>
<script>
import XyButton from './xy-button'
import VolumeIcon from './volume-icon'
export default {
  name: 'record-control',
  components: {
    XyButton,
    VolumeIcon
  },
  props: {
    // 录音按钮禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 音量条显示
    volumeShow: {
      type: Boolean,
      default: true
    },
    // 音量大小
    volumeVal: {
      type: Number,
      default: 0
    },
    title: String,
    message: String
  },
  methods: {
    // 录音按钮点击事件
    handleEvent () {
      this.$emit('recordClick')
    }
  }
}
</script>
<style lang="less" scoped>
.record-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    line-height: 1;
    font-size: 14px;
    font-weight: 600;
    color: #000000;
    margin-bottom: 0;
  }
  .message {
    margin: 10px 0;
    font-size: 12px;
    color: #313131;
  }
  .submit-btn {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
