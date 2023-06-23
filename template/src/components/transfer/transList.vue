<!--  -->
<template>
  <div class="my-transfer-panel">
    <p class="my-transfer-panel__header">
      <span>{{ title }}</span>
    </p>
    <p class="my-transfer-panal__sub_header" v-if="showSubTitle">
      <span>{{ subTitle }}</span>
    </p>
    <div class="my-transfer-panel__body">
      <!-- <div class="my-transfer-panel__list"> -->
      <el-checkbox-group
        v-model="checked"
        v-show="data.length > 0"
        class="my-transfer-panel__list"
      >
        <el-checkbox
          class="el-transfer-panel__item"
          :label="item[keyProp]"
          :key="item[keyProp]"
          v-for="item in data"
        >
          <option-content :option="item"></option-content>
        </el-checkbox>
      </el-checkbox-group>
      <p class="my-transfer-panel__empty" v-show="data.length === 0">
        暂无数据
      </p>
      <!-- <div class="el-transfer-panel__item" v-for="item in data" :key="item[keyProp]">
          <option-content :option="item"></option-content>
        </div> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: []
    };
  },
  componentName: "MYTransferPanel",
  components: {
    OptionContent: {
      props: {
        option: Object
      },
      render() {
        const getParent = vm => {
          if (vm.$options.componentName === "MYTransferPanel") {
            return vm;
          } else if (vm.$parent) {
            return getParent(vm.$parent);
          } else {
            return vm;
          }
        };
        const panel = getParent(this);
        // render函数里用jsx方式{}而不是vue里面的{{}}
        return <span>{this.option[panel.labelProp]}</span>;
      }
    }
  },

  created() {},

  computed: {
    keyProp() {
      return this.props.key || "key";
    },
    labelProp() {
      return this.props.label || "label";
    }
  },

  mounted() {},

  methods: {
    reset() {
      this.checked = [];
    }
  },
  props: {
    title: String,
    showSubTitle: Boolean,
    subTitle: String,
    data: {
      type: Array,
      default: () => {
        return [];
      }
    },
    props: Object
  },
  watch: {
    checked(val, oldVal) {
      this.$emit("checked-change", val);
    }
  }
};
</script>
<style lang="scss" scoped>
.my-transfer-panel {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  display: inline-block;
  vertical-align: middle;
  width: 200px;
  max-height: 100%;
  box-sizing: border-box;
  position: relative;
  .my-transfer-panel__header {
    height: 40px;
    line-height: 40px;
    background: #f5f7fa;
    margin: 0;
    padding-left: 15px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    color: #000;
  }
  .my-transfer-panal__sub_header {
    text-align: center;
    height: 30px;
    line-height: 30px;
    background: #f5f7fa;
    margin: 10px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
    color: #000;
  }
  .my-transfer-panel__body {
    height: 246px;
    .my-transfer-panel__list {
      height: 194px;
      overflow: auto;
      .el-transfer-panel__item {
        height: 30px;
        line-height: 30px;
        padding-left: 15px;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        margin-right: 30px;
        color: #606266;
      }
    }
    .my-transfer-panel__empty {
      margin: 0;
      height: 30px;
      line-height: 30px;
      padding: 6px 15px 0;
      color: #909399;
      text-align: center;
    }
  }
}
</style>
