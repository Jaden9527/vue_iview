<template>
  <div>
    <Button @click="show=true">点击选择</Button>
    <Modal
      v-model="show"
      title="选择经纬度"
      class-name="vertical-center-modal"
      :width="750"
      @on-cancel="onCloseMap"
      @on-ok="onCloseMap"
    >
      <div class="gaodemap">
        <div class="amap-page-container">
          <el-amap-search-box
            class="search-box"
            :search-option="searchOption"
            :on-search-result="onSearchResult"
          ></el-amap-search-box>
          <el-amap
            vid="amapDemo"
            :zoom="15"
            v-if="mapCenter"
            :center="mapCenter"
            :events="events"
            :plugin="plugin"
            @lnglathandler="lnglathandler"
          ></el-amap>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import VueAMap from 'vue-amap';
VueAMap.initAMapApiLoader({
  key: 'ea285f74ea294a235a95e0c8ca24a9f4',
  plugin: ['Autocomplete', 'PlaceSearch', 'Scale', 'OverView', 'ToolBar', 'MapType', 'PolyEditor', 'AMap.CircleEditor'],
  // 默认高德 sdk 版本为 1.4.4
  v: '1.4.4'
});
export default {
  name: 'mapModel',
  data() {
    return {
      show: false,
      mapCenter: [113.275342, 23.1227],
      searchOption: {
        city: '上海',
        citylimit: false
      },
      events: {
        click: e => {
          this.lnglathandler(e)
        }
      },
      plugin: [
        {
          pName: 'ToolBar', //放大缩小工具
          events: {
            init(instance) {}
          }
        },
        {
          pName: 'Scale', //比例尺
          events: {
            init(instance) {}
          }
        }
      ]
    }
  },

  methods: {
    lnglathandler(e) {
      let obj = {
          longitude: e.lnglat.getLng(),
          latitude: e.lnglat.getLat()
      }
      this.$emit('lnglatchange', obj)
    },
    onCloseMap() {
      // this.$emit("on-closeMap", false);
    },
    onSearchResult(pois) {
      console.log(pois)
      this.getlnglat(pois)
    },
    getlnglat(arr) {
      let latSum = 0
      let lngSum = 0
      //这就是我们封装的地图组件了，看到这基本上就完事了。
      let self = this
      if (arr.length > 0) {
        arr.forEach(function(item, index) {
          let { lng, lat } = item
          lngSum += lng
          latSum += lat
        })
        let center = {
          lng: lngSum / arr.length,
          lat: latSum / arr.length
        }
        self.mapCenter = [center.lng, center.lat]
        // console.log(this.mapCenter);
      }
    }
  }
}
</script>
<style lang="less" scoped>
.gaodemap .amap-page-container {
  height: 500px !important;
  position: relative;
  padding-top: 10px;
  margin: 0 auto;
}
.gaodemap .search-box {
  position: absolute;
  float: right;
  top: 20px;
  right: 10px;
}
.custom-modal {
  width: 750px;
}
</style>