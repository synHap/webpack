<script>
export default {
  render() {
    return (
      <div class="form-container">
        <h1>{this.conf.title}</h1>
        <el-form ref="form" props={{ model: this.form }} label-width="80px">
          {this.renderRows()}
          <div>
            <el-form-item>
              <el-button type="primary" onClick="submit">
                提交
              </el-button>
              <el-button onClick="cancel">取消</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    );
  },
  created() {
    this.conf.items.forEach(row => {
      row.forEach(obj => {
        this.$set(this.form, obj.name, obj.value);
      });
    });
    console.log(this.form);
  },

  props: {
    conf: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      form: {}
    };
  },
  methods: {
    submit() {
      this.$emit("submit", this.form);
    },
    cancel() {
      this.$emit("cancel");
    },
    renderRows() {
      return this.conf.items.map(row => {
        return <el-row>{this.renderColumn(row)}</el-row>;
      });
    },
    renderColumn(row) {
      console.log(row);
      return row.map(element => {
        let styles = !element.col
          ? [
              { position: "absolute" },
              { left: element.x + "px" },
              { top: element.y + "px" }
            ]
          : null;
        return (
          <div class="row-container" style={styles}>
            <el-form-item label={element.label}>
              <el-col span={element.col}>{this.renderItem(element)}</el-col>
            </el-form-item>
          </div>
        );
      });
    },
    renderItem(element) {
      switch (element.type) {
        case "input":
          return (
            <el-input
              onInput={e => (this.form[element.name] = e)}
              value={this.form[element.name]}
            ></el-input>
          );
        case "select":
          return (
            <el-select
              onChange={e => (this.form[element.name] = e)}
              value={this.form[element.name]}
              placeholder="请选择"
            >
              {element.options.map(e => {
                return <el-option label={e.label} value={e.value}></el-option>;
              })}
            </el-select>
          );
        case "DatePicker":
          return (
            <el-date-picker
              onChange={e => (this.form[element.name] = e)}
              value={this.form[element.name]}
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          )
      }
    }
  }
};
</script>

<style></style>
