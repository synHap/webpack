<template>
  <div :ref="chartId" class="default-chart-style" :id="divId"/>
</template>
<script>
import chartDefault from "./mixins/chart-default";
export default {
  props: {
    optionName: Object,
    chartId: String,
    divId: String
  },
  name: "default-chart-container",
  mixins: [chartDefault],
};
</script>
<style scoped >
.default-chart-style {
  width: 100%;
  height: 100%;
  min-height: 100px;
  box-sizing: border-box;
}
</style>
