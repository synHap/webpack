<template>
  <!-- 没有数据处理 -->
  <!-- 后台分页 -->
  <!--
  border 1有边框 2无边框
  resizable 1可拉宽 2不可拉宽
 -->
  <div>
    <div>
      <div class="textalignR padBottom10" v-if="tableData.showDown">
        <el-button type="warning" @click="downloadTable">下载表格</el-button>
      </div>
      <el-table
        ref="flexTable"
        :header-row-class-name="tableData.className ? tableData.className : ''"
        :data="tableData.list"
        @row-click="handleRowChange"
        @select-all="allHandleSelectionChange"
        @select="selectData"
        :row-class-name="rowClassName"
        v-loading="loading"
        :header-cell-style="{ background: 'rgb(243, 230, 219)' }"
        :border="tableData.border && tableData.border == 1 ? true : false"
        style="width:100%"
        :resizable="
          tableData.resizable && tableData.resizable == 1 ? true : false
        "
        :max-height="tableData.maxHeight ? tableData.maxHeight : null"
      >
        <el-table-column
          v-if="tableData.showSelect"
          :label="tableData.selectLabel"
          width="80"
          :align="'center'"
        >
          <template slot-scope="scope">
            <el-checkbox @change="handleClick(scope.row)"> </el-checkbox>
            {{ pageSize * (currentPage - 1) + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          :width="tableData.selectWid ? tableData.selectWid : 55"
          v-if="tableData.select"
        >
        </el-table-column>
        <el-table-column
          v-if="tableData.showindex"
          type="index"
          :index="indexMethod"
          :label="tableData.indexlabel"
          :fixed="tableData.indexFixed || false"
          :width="tableData.indexWid || 80"
          :align="'center'"
        >
        </el-table-column>
        <el-table-column
          v-for="(val, ide) in tableData.header"
          :min-width="val.width"
          :width="val.columnWidth"
          :key="val.type"
          :prop="val.type"
          :label="val.name"
          :class-name="val.columnClassName"
          :fixed="val.fixed || false"
          :align="val.align || 'center'"
          :header-align="val.headerAlign || 'center'"
          :show-overflow-tooltip="
            val.showTip && val.showTip == 'false' ? false : true
          "
        >
          <el-table-column
            v-for="(item, idx) in val.cli"
            :min-width="item.width"
            :key="idx"
            :prop="item.type"
            :label="item.name"
            align="center"
            :show-overflow-tooltip="
              item.showTip && item.showTip == 'false' ? false : true
            "
          >
            <template slot-scope="scope">
              <slot
                v-if="item.slot"
                :name="item.slotname"
                :rowdata="scope.row"
              ></slot>
              <div v-else>
                <span
                  :class="changeClass(item.className, scope.row.showClass)"
                  v-if="item.className"
                  @click="jumpDetail(scope.row)"
                >
                  {{ scope.row[item.type] }}
                </span>
                <span v-else>{{ scope.row[item.type] }}</span>
              </div>
            </template>
          </el-table-column>
          <template slot-scope="scope">
            <slot
              v-if="val.slot"
              :name="val.slotname"
              :rowdata="scope.row"
            ></slot>
            <div v-else>
              <span
                :class="changeClass(val.className, scope.row.showClass)"
                v-if="val.className"
                @click="jumpDetail(scope.row, val)"
              >
                {{ scope.row[val.type] }}
              </span>
              <span v-else>{{ scope.row[val.type] }}</span>
            </div>
          </template>
        </el-table-column>
        <!-- 单按钮 -->
        <el-table-column
          v-if="tableData.showbutton"
          width="120"
          :prop="tableData.btnTitle"
          :label="tableData.btnTitle"
        >
          <template slot-scope="scope">
            <el-button
              @click.native.stop="handleRowChange1(scope.row)"
              :type="tableData.btnType"
              v-text="tableData.btnName"
            ></el-button>
          </template>
        </el-table-column>
        <!-- 多按钮 -->
        <el-table-column
          v-if="tableData.showButtonArr"
          :label="tableData.btnTitle"
          :width="tableData.btnWidth ? tableData.btnWidth : 120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-for="(item, btnIndex) in tableData.btnName"
              :key="btnIndex"
              @click.native.stop="handleBtn(scope.row, item)"
              type="text"
              v-text="item"
            ></el-button>
          </template>
        </el-table-column>
        <!-- 多按钮带有按钮状态 -->
        <el-table-column
          v-if="tableData.showStateButtonArr"
          :label="tableData.btnTitle"
          :width="tableData.btnWidth ? tableData.btnWidth : 120"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-for="(item, btnIndex) in tableData.btnName"
              :key="btnIndex"
              @click.native.stop="handleBtn(scope.row, item.name)"
              type="text"
              :disabled="item.isDisabled && scope.row.freezeState"
              v-text="item.name"
            ></el-button>
          </template>
        </el-table-column>
        <!-- 多列单按钮 -->
        <template v-if="tableData.btnTitleArr && tableData.btnTitleArr.length">
          <el-table-column
            :key="item"
            v-for="item in tableData.btnTitleArr"
            :label="item.btnName"
            :width="tableData.btnWidth ? tableData.btnWidth : 120"
          >
            <template slot-scope="scope">
              <el-button
                @click.native.stop="handleBtn(scope.row, item.btnTitle)"
                type="text"
                v-text="item.btnTitle"
              ></el-button>
            </template>
          </el-table-column>
        </template>

        <!-- 插入结构 -->
        <!-- <template slot="append">
          <div class="shadowModule" v-if="tableData.showSummary">
            <el-table
              ref="summary"
              :data="tableData.summary?tableData.summary:[]"
              v-loading="loading"
              :show-header="false"
              style="width:100%"
              :border="tableData.border&&tableData.border == 1?true:false"
              :resizable="tableData.resizable&&tableData.resizable == 1?true:false"
            >
              <el-table-column
                v-if="tableData.showindex"
                :label="tableData.indexlabel"
                width="80"
              >
              </el-table-column>
              <el-table-column
                v-for="(val, ide) in tableData.header"
                :min-width="val.width"
                :key="ide"
                :prop="val.type"
                :label="val.name"
                show-overflow-tooltip
              >
              </el-table-column>
            </el-table>
          </div>
        </template> -->
      </el-table>
    </div>
    <!-- 点击查看：模板等 -->
    <slot name="demo"></slot>
    <div
      class="block marginTop20"
      v-show="
        tableData.showPagination && tableData.showPagination == 'false'
          ? false
          : true
      "
    >
      <el-pagination
        background
        :class="{ textalignC: pageposition == 'center' }"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :layout="layout"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // flag: true,
    };
  },
  props: {
    layout: {
      type: String,
      default: "total, sizes, prev, pager, next"
    },
    tableData: Object,
    pageSize: {
      type: Number,
      dafault: 10
    },
    pageSizes: {
      type: Array,
      dafault: () => {
        return [10, 20, 30, 40, 50, 100];
      }
    },
    loading: {
      type: Boolean,
      dafault: false
    },
    total: {
      type: Number,
      dafault: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageposition: {
      type: String,
      default: "right"
    },
    rowClassName: {
      type: Function,
      default: function() {}
    }
  },
  methods: {
    // 全选按钮
    allHandleSelectionChange(val) {
      this.$emit("allHandleSelectionChange", val);
    },
    // 勾选每条数据时触发的数据
    selectData(selection, row) {
      this.$emit("alongHandleSelectionChange", row);
    },
    downloadTable() {
      this.$emit("downloadTable", this.tableData);
    },
    changeClass(val, showClass) {
      if (val && showClass !== false) {
        return val;
      }
    },
    jumpDetail(row, headerval) {
      // console.log(headerval)
      this.$emit("jumpDetail", row, headerval);
    },
    indexMethod(index) {
      let num = index;
      if (this.pageSize != undefined) {
        if (
          this.tableData.showSummary &&
          index == this.tableData.list.length - 1
        ) {
          num = "";
        } else {
          num = num + 1 + (this.currentPage - 1) * this.pageSize;
        }
      } else {
        if (
          this.tableData.showSummary &&
          index == this.tableData.list.length - 1
        ) {
          num = "";
        } else {
          num = num + 1;
        }
      }
      return num;
    },
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
    handleRowChange(val) {
      // if (this.flag) {
      this.$emit("handleRowChange", {
        num: val.ide,
        name: this.tableData.title,
        data: val
      });
      // } else {
      //   this.$emit("showMsg", {
      //     num: val.ide,
      //     name: this.tableData.title,
      //     data: val,
      //   });
      // }
    },
    handleBtn(data, name) {
      this.$emit("actioner", data, name);
    },
    handleRowChange1(val) {
      // this.flag = false;
      this.$emit("showMsg", {
        num: val.ide,
        name: this.tableData.title,
        data: val
      });
    },
    // 是否高亮展示第一行
    setCurrent() {
      this.$refs.flexTable.setCurrentRow(this.tableData.list[0]);
    },
    toggleSelection(row) {
      this.$refs.flexTable.clearSelection();
      this.$refs.flexTable.toggleRowSelection(row);
    }
  }
};
</script>
<style>
.el-tooltip__popper {
  max-width: 70%;
}
.el-table__append-wrapper {
  min-width: 100%;
}
.padBottom10 {
  padding-bottom: 10px;
}
.linkstyle:hover {
  color: #ea8e5f;
  cursor: pointer;
}
</style>
<style scoped></style>
