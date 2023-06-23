/*
 * @Description: chart 实例默认 mixin 配置
 * 引入基础图表模板
 */
// import { defaultLineOption, defaultPieOption, defaultMapOption} from  '../js/default-options'
// const chartOptions = { defaultLineOption, defaultPieOption, defaultMapOption }
import '@/assets/js/test.js'
import { ValidationError } from 'ajv'
// debounce方法 防止抖动字节流
const debounce = function (func, wait, immediate) {
  let timeout, args, context, timestamp, result
  const later = function () {
    const last = +new Date() - timestamp
    if (last < wait && last > 0) {
      // time = setTimeout(later, wait - last)
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = agrs = null
      }
    }
  }
  return function (...args) {
    context = this
    timestamp = +new Date()
    if (!timeout) timeout = setTimeout(later, wait)
    // if (callNow) {
    result = func.apply(context, args)
    context = args = null
    // }
    return result
  }
}

export default {
  props: {
    chartId: String
  },
  methods: {
    // 同时还接受父组件传来的 option
    setOption(option) {
      this.$nextTick(() => {
        this.$$chartInstance && this.$$chartInstance.setOption(option)
        this.$$chartInstance.hideLoading()
      })
    },
    initChart(refName) {
      const chartDom = this.$refs[refName]
      this.$$chartInstance = this.$echarts.init(chartDom, 'test')
      this.$$chartInstance.showLoading()
      // 监听双击事件
      this.$$chartInstance.on('dblclick', function (params) {
        // console.log('双击了图表');
      });
      
      this.$$chartInstance.on('mouseover', (params) => {
        this.$emit('echartMouseover', params)
      });
      // 监听点击事件
      this.$$chartInstance.on('click', (params) => {
        this.$emit('echartClick', params)
      });
      // 监听鼠标移出事件
      this.$$chartInstance.on('mouseout', (params) => {
        this.$emit('echartMouseout', params)
      });
    },
    handleResize() {
      if(this.$$chartInstance){
        this.$nextTick(() => {
          typeof this.$$chartInstance === 'object' && this.$$chartInstance.resize()
        })
      }
    },
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') { this.handleResize() }
    },
    addResizeListener() {
      this.$$events.resize = debounce(this.handleResize, 100, true)
      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm && sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
      const tabs = document.getElementsByClassName('tabs-switch')[0];
      tabs.addEventListener('click',this.tabClick)
      window.addEventListener('resize', this.$$events.resize)
    },
    tabClick(e){
      this.handleResize()
    }
  },
  // 将echarts实例统一挂到chart对象上
  computed: {
    myCharts: function () {
      return this.$$chartInstance
    }
  },
  watch: {
    pos: function () {
      this.handleResize()
    },
    optionName: function (val) {
      if (val) {
        this.myCharts.setOption(val);
      }
    }
  },
  mounted() {
    this.$$chartInstance = null;
    this.$$events = {
      resize: null
    }
    this.initChart(this.chartId)
    this.setOption(this.optionName)
    this.$emit('reload', this.$$chartInstance)
    this.addResizeListener()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$$events.resize)
    const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    sidebarElm && sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)
    this.$$chartInstance, this.$$chartInstance.dispose()
    this.$$chartInstance = null;
    this.$$events.resize = null;
    this.$$events = null;
  }
}
