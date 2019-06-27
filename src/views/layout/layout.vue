<template>
  <Content class="layout">
    <Layout style="height:100%">
      <Sider
        ref="side1"
        class="slider"
        hide-trigger
        collapsible
        :collapsed-width="78"
        v-model="isCollapsed"
      >
        <!-- logo -->
        <template>
          <div :class="logoClass">
            <img src="../../common/images/vueLogo.png" class="sidebar-logo">
            <h1 v-if="!isCollapsed" class="sidebar-title">{{ title }}</h1>
          </div>
        </template>
        <!-- 菜单 -->
        <Menu
          :active-name="$route.name"
          theme="dark"
          width="auto"
          :class="menuitemClasses"
          accordion
          @on-select="changeMenu"
        >
          <template v-for="item, index in routeList" v-if="item.show && !item.hidden">
            <MenuItem
              v-if="item.children.length <= 1"
              :name="item.children[0].name"
              :key="item.children[0].name"
            >
              <Icon v-if="item.children[0].meta.icon" :type="item.children[0].meta.icon"></Icon>
              <span>{{item.children[0].meta.title}}</span>
            </MenuItem>
            <Submenu v-else :name="item.name" :key="item.name">
              <template slot="title">
                <Icon v-if="item.meta.icon" :type="item.meta.icon"></Icon>
                <span>{{item.meta.title}}</span>
              </template>
              <template v-for="child in item.children" v-if="child.show && !child.hidden">
                <MenuItem :name="child.name" :key="child.name">
                  <Icon v-if="child.meta.icon" :type="child.meta.icon"></Icon>
                  <span>{{child.meta.title}}</span>
                </MenuItem>
              </template>
            </Submenu>
          </template>
        </Menu>
      </Sider>
      <Layout>
        <!-- 头部 -->
        <Header :style="{padding: 0}" :class="headerClass">
          <div class="flex-row">
            <div class="flex-grow-0">
              <Icon
                @click.native="collapsedSider"
                :class="rotateIcon"
                :style="{margin: '0 20px'}"
                type="md-menu"
                size="24"
              ></Icon>
            </div>
            <div class="flex-grow-1 tags-inner-scroll-body">
              <Tag
                type="dot"
                v-for="item in pageTagsList"
                :key="item.name"
                :name="item.name"
                @click.native="linkTo(item)"
                @on-close="closePage"
                :closable="item.name==='home'?false:true"
                :color="item.children?(item.children[0].name===currentPageName?'primary':'default'):(item.name===currentPageName?'primary':'default')"
              >{{item.meta.title}}</Tag>
            </div>
            <div class="flex-grow-0" style="margin: 0px 10px;">
              <!-- 标签页清除 -->
              <span>
                <Dropdown style="margin: 0px 10px" @on-click="handleTagsOption">
                  <Button type="primary">LabelOptions
                    <Icon type="ios-arrow-down"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                    <DropdownItem name="clearAll">清除全部</DropdownItem>
                    <DropdownItem name="clearOthers">清除其他</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </span>
              <!-- 用户信息 -->
              <span>
                <Dropdown transfer trigger="hover" @on-click="handleClickUserDropdown">
                  <template>
                    <div>
                      <img class="avatar" src="../../common/images/usericon.jpg">
                      <a href="javascript:void(0)" style="padding-left:5px;">
                        <span style="color:#1890ff">{{userName}}</span>
                      </a>
                    </div>
                  </template>
                  <DropdownMenu slot="list">
                    <DropdownItem name="UserProfile">个人信息</DropdownItem>
                    <DropdownItem name="loginout" divided>注销</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </span>
            </div>
          </div>
        </Header>
        <Content
          :style="{margin: '80px 15px 15px', background: '#fff', minHeight: '260px',overflow: 'auto'}"
        >
          <router-view :key="key"></router-view>
        </Content>
      </Layout>
    </Layout>
  </Content>
</template>
<script>
export default {
  data() {
    return {
      currentPageName: null,
      isCollapsed: false,
      title: "Vue iView"
    };
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    headerClass() {
      return ["layout-header-bar", this.isCollapsed ? "collapsed-header" : ""];
    },
    logoClass() {
      return ["logo", this.isCollapsed ? "collapsed-logo" : ""];
    },
    key() {
      return this.$route.fullPath;
    },
    userName() {
      return this.$store.getters.userName || "未登录";
    },
    /** 返回页签列表 */
    pageTagsList() {
      return this.$store.getters.pageOpenedList || [];
    },
    /** 根据路由生成菜单项 */
    routeList() {
      const route = this.$router.options.routes || [];
      this.$store.dispatch("GenerateRoutes", route);
      return this.$store.getters.routeList;
    }
  },
  methods: {
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
    },
    /** 切换菜单 */
    changeMenu(name) {
      this.$router.push({ name: name });
    },
    /** 用户信息/注销 */
    handleClickUserDropdown(name) {
      if (name === "UserProfile") {
      } else if (name === "loginout") {
        localStorage.removeItem("userName");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");

        this.$router.replace({
          name: "login",
          query: {
            //路由传参时push和query搭配使用 ，作用时传递参数
            id: 1
          }
        });
      }
    },
    /** 关闭所选页签 */
    closePage(event, name) {
      this.$store.commit("removeTag", name);
      let pageOpenedList = this.$store.state.app.pageOpenedList;
      if (this.currentPageName === name) {
        let lastPageName = "";
        if (pageOpenedList.length > 1) {
          lastPageName = pageOpenedList[pageOpenedList.length - 1].name;
        } else {
          lastPageName = pageOpenedList[0].name;
        }
        this.$router.push({
          name: lastPageName
        });
      }
    },
    /** 跳转所选标签页 */
    linkTo(item) {
      if (item.name != this.currentPageName) {
        this.$router.push({
          name: item.name
        });
      }
    },
    /** 清除页签 */
    handleTagsOption(type) {
      if (type === "clearAll") {
        this.$store.commit("clearAllTags");
        this.$router.push({
          name: "home"
        });
      } else {
        this.$store.commit("clearOtherTags", this);
      }
    }
  },
  created() {
    this.currentPageName = this.$route.name;
    let obj = {
      meta: this.$route.meta,
      path: this.$route.path,
      name: this.$route.name
    };
    this.$store.dispatch("GeneratePageOpenedList", obj);
  },
  mounted() {},
  /** 监听,当路由发生变化的时候执行 */
  watch: {
    $route(to, from) {
      if (to.name != this.currentPageName) {
        this.currentPageName = to.name;
        let obj = {
          meta: to.meta,
          path: to.path,
          name: to.name
        };

        this.$store.dispatch("GeneratePageOpenedList", obj);
      }
    }
  }
};
</script>

<style>
body {
  overflow: hidden !important;
}
.collapsed-menu .ivu-icon-ios-arrow-down:before {
  content: none;
}
.ivu-menu-vertical .ivu-menu-item,
.ivu-menu-vertical .ivu-menu-submenu-title {
  padding: 20px 20px;
}
.collapsed-menu .ivu-menu-submenu .ivu-menu-item {
  padding-left: 35px !important;
  padding-bottom: 0 !important;
}
.ivu-menu-dark.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: none;
}
.ivu-tag-dot {
  padding: 0 12px !important;
}
.ivu-tag-primary span {
  color: #1890ff !important;
}
</style>
<style lang="less" scoped>
@import "../../common/style/flex.css";
.logo {
  padding: 10px 20px;
  background: #2b2f3a;
  display: flex;
  align-items: center;
}
.collapsed-logo {
  padding: 20px;
}
.sidebar-logo {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  margin-right: 12px;
}
.sidebar-title {
  display: inline-block;
  margin: 0;
  color: #fff;
  font-weight: 600;
  line-height: 50px;
  font-size: 14px;
  font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  vertical-align: middle;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  overflow: hidden;
}
.avatar {
  width: 32px;
  height: 32px;
  vertical-align: middle;
  border-radius: 50%;
}

.tags-inner-scroll-body {
  white-space: nowrap;
  transition: left 0.3s ease;
  overflow-y: auto;
}

.layout {
  background: #f5f7f9;
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.layout-header-bar {
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - 200px);
  -webkit-transition: width 0.28s;
  transition: width 0.28s;
}
.collapsed-header {
  width: calc(100% - 78px);
}
.layout-logo-left {
  width: 90%;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  margin: 15px auto;
}

.slider {
  height: 100%;
  overflow-y: auto;
}

.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
