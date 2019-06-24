<template>
    <div class="layout">
        <Layout style="height:100%">
            <Sider
                ref="side1"
                class="slider"
                hide-trigger
                collapsible
                :collapsed-width="78"
                v-model="isCollapsed"
            >
                <Menu :active-name="$route.meta.name" theme="dark" width="auto" :class="menuitemClasses">
                    <template v-for="item, index in routeList" v-if="item.show">
                        <MenuItem
                            v-if="item.children.length <= 1"
                            :name="item.children[0].meta.name"
                            :key="item.children[0].meta.name"
                        >
                            <Icon v-if="item.children[0].meta.icon" :type="item.children[0].meta.icon"></Icon>
                            <span>{{item.children[0].meta.name}}</span>
                        </MenuItem>
                        <Submenu v-else :name="item.meta.name" :key="item.meta.name">
                            <template slot="title">
                                <Icon v-if="item.meta.icon" :type="item.meta.icon"></Icon>
                                <span>{{item.meta.title}}</span>
                            </template>
                            <template v-for="child in item.children" v-if="child.show">
                                <MenuItem :name="child.meta.name" :key="child.meta.name">
                                    <Icon v-if="child.meta.icon" :type="child.meta.icon"></Icon>
                                    <span>{{child.meta.title}}</span>
                                </MenuItem>
                            </template>
                        </Submenu>
                    </template>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon
                        @click.native="collapsedSider"
                        :class="rotateIcon"
                        :style="{margin: '0 20px'}"
                        type="md-menu"
                        size="24"
                    ></Icon>
                </Header>
                <Content :style="{margin: '15px', background: '#fff', minHeight: '260px'}">
                    <router-view :key="key"></router-view>
                    <p>{{routeList}}</p>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
export default {
  data() {
    return {
      isCollapsed: false
    };
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.isCollapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    key() {
      return this.$route.fullPath;
    },
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
    de() {
      console.log("route", this.$route);
    }
  },
  created() {
    this.de();
  }
};
</script>

<style scoped>
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
