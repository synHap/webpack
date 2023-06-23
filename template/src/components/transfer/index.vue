<!-- 穿梭框 -->
<template>
  <div class="my-transfer">
    <transList
      ref="leftList"
      :title="titles[0]"
      @checked-change="onSourceCheckedChange"
      :subTitle="SubTitles[0]"
      v-bind="$props"
      :data="sourceData"
    >
    </transList>
    <div class="my-transfer__buttons">
      <!-- <button  @click="addToLeft">**</button> -->
      <el-button
        type="primary"
        class="my-transfer__button"
        @click.native="addToLeft"
        :disabled="rightChecked.length === 0"
      >
        <i class="el-icon-arrow-left"></i>
        <!-- <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span> -->
      </el-button>
      <el-button
        type="primary"
        class="my-transfer__button"
        @click.native="addToRight"
        :disabled="leftChecked.length === 0"
      >
        <i class="el-icon-arrow-right"></i>
        <!-- <span v-if="buttonTexts[0] !== undefined">{{ buttonTexts[0] }}</span> -->
      </el-button>
      <!-- <button class="my-transfer__button" @click="addToRight">></button> -->
    </div>
    <transList
      ref="righttList"
      :title="titles[1]"
      @checked-change="onTargetCheckedChange"
      :subTitle="SubTitles[1]"
      v-bind="$props"
      :data="targetData"
    >
    </transList>
  </div>
</template>

<script>
import transList from "./transList.vue";
export default {
  data() {
    return {
      leftChecked: [],
      rightChecked: [],
      targetData: []
    };
  },

  components: {
    transList
    // transButton,
  },

  created() {},

  computed: {
    sourceData() {
      return this.data;
    }
  },

  mounted() {},

  methods: {
    addToLeft() {
      let currentValue = this.value.slice();
      const key = this.props.key;
      this.rightChecked.forEach(item => {
        // const index = currentValue.indexOf(item);

        let index = currentValue.findIndex(items => items[key] === item);
        if (index !== -1) {
          currentValue.splice(index, 1);
          this.targetData.splice(index, 1);
        }
      });

      this.$emit("input", currentValue);
    },
    addToRight() {
      let currentValue = this.value.slice();
      const key = this.props.key;
      const itemsToBeMoved = [];
      this.leftChecked.forEach(item => {
        const currentItem = this.targetData.find(
          targetItem => targetItem[key] === item
        );
        if (!currentItem) {
          let data = this.data.find(originItem => originItem[key] === item);
          // 右侧数据增加，存放item
          this.targetData.push(data);

          itemsToBeMoved.push(data);
        }
      });
      // 移动之后清空左侧选中的
      this.$refs.leftList.reset();
      this.leftChecked = [];

      currentValue = currentValue.concat(itemsToBeMoved);

      this.$emit("input", currentValue);
    },
    onSourceCheckedChange(val) {
      this.leftChecked = val;
    },
    onTargetCheckedChange(val) {
      this.rightChecked = val;
    }
  },
  props: {
    titles: {
      type: Array,
      default: () => {
        return ["列表1", "列表2"];
      }
    },
    SubTitles: {
      type: Array,
      default: () => {
        return ["姓名", "姓名"];
      }
    },
    showSubTitle: false,
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    props: {
      type: Object,
      default() {
        return {
          label: "label",
          key: "key",
          disabled: "disabled"
        };
      }
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.my-transfer__buttons {
  display: inline-block;
  vertical-align: middle;
  // padding: 0 30px;
  // .my-transfer__button {
  //   color: #fff;
  //   background-color: #409eff;
  //   border-color: #409eff;
  //   padding: 12px 20px;
  //   outline: none;
  // }
}
</style>
