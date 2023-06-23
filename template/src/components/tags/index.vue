<template>
  <div class="tag-page" id="tagers">
    <div class="tabs-switch">

      <el-tabs v-model="activePath" type="card">
        <el-tab-pane
          v-for="(item, index) in tagList"
          :key="item.name"
          :label="item.name"
          :name="item.name"
          class="ce"
        >
          <span slot="label" class="tabChange" @click="changeMenu(item, index)">
            <span>{{ item.name }}</span>
            <i
              @click.stop.prevent="handleClose(item, index)"
              class="el-icon-close"
            >
            </i>
          </span>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  computed: {
    ...mapGetters(["tagList"]),
    ...mapState({
      activePath: state => state.permission.activePath,
      firstTag: state => state.permission.firstTag,
      catch_components: state => state.permission.catch_components
    })
  },
  methods: {
    // 关闭当前页
    handleClose(tag, index) {

      //用于清缓存
      let catchName = tag.path.split("/")[2] ? tag.path.split("/")[2] : "";

      //只剩下最后一个
      if (this.tagList.length == 1) {
        //最后一个是默认路由的话不能关闭
        if (tag.name == this.firstTag.name) {
          return;
        }
        //默认路由
        this.$store.commit("REMOVE_TAG", index);
        this.$store.commit("SET_TAG_LIST", this.firstTag);
        this.$store.commit("SET_ACTIVEPATH", this.firstTag.name);

        this.$store.commit("REMOVE_CATCH", catchName);
        this.$router.push({
          path: this.firstTag.path
        });
      } else {
        // 关闭当前页跳转下一页或前一页
        if (this.activePath == tag.name) {
          let nextTag = this.tagList[index + 1] || this.tagList[index - 1];
          this.$store.commit("SET_ACTIVEPATH", nextTag.name);


          this.$store.commit("REMOVE_TAG", index);
          this.$router.push({
            path: nextTag.path
          });

        } else {
          this.$store.commit("REMOVE_TAG", index);
        }
        let flag = false;
        for (var i = 0; i < this.tagList.length; i++) {
          if (this.tagList[i].path.indexOf(catchName) != -1) {
            // console.log(this.tagList[i])
            flag = true;
            break;
          }
        }
        if (!flag) {
          // console.log(catchName)
          this.$store.commit("REMOVE_CATCH", catchName);
        }
      }
    },

    // 切换tag
    changeMenu(tag, index) {

      //点当前页无操作
      if (tag.name == this.activePath) return;
      this.$router.push({
        path: tag.path
      });
      this.$store.commit("SET_ACTIVEPATH", tag.name);
    },


    // 缓存组件
    saveCatch() {
      //要求页面name属性名与路由中name名相同
      let { name } = this.$route;
      let result = this.catch_components.some(item => item == name);
      if (!result) {
        this.$store.commit("ADD_CATCH", name);
      }
    },
    // 存储用户默认路由
    getFirstRoute() {
      if (Object.keys(this.firstTag).length) return;
      const FirstRoute = this.$store.getters.addRouters[0];
      const FirstChildRoute =
        FirstRoute && FirstRoute.children && FirstRoute.children[0]
          ? FirstRoute.children[0].path
            ? `/${FirstRoute.children[0].path}`
            : ""
          : "";
      const FirstPage = (FirstRoute ? FirstRoute.path : "") + FirstChildRoute;
      let tag = {
        name: FirstRoute.children[0].meta.title,
        path: FirstPage
      };
      this.$store.commit("SET_FIRST_TAG", tag);
    }
  },
  mounted() {
    this.getFirstRoute();
    this.saveCatch();
  },
  watch: {
    $route() {
      this.saveCatch();
    }
  }
};
</script>

<style lang="scss">
.tag-page {
  background: #fff;
  color: #000;
  // position:fixed;
  // top:110px;
  // left: 70px;
  .tabs-switch {
    // overflow: auto;
    margin: 0 5px;
    white-space: nowrap;
    height: 40px;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    .el-tag {
      cursor: pointer;
      margin-left: 5px;
      margin-bottom: 2px;
    }
    .el-tabs {
      .el-tabs__item {
        padding: 0;
        font-size: 13px !important;
        &:last-child {
          padding-right: 0;
        }
        &:nth-child(2) {
          padding-left: 0;
        }
        .tabChange {
          display: inline-block;
          height: 100%;
          padding: 0 10px;
          font-size: 16px;
        }
        .el-icon-close {
          width: 12px;
          &::before {
            transform: scale(1.1);
          }
        }
      }
    }
  }
}
</style>
