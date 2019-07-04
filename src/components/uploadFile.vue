<template>
	<!--图片素材-->
	<div v-show="uploadFileSetting.uploadShow">
		<input
			name="file"
			id="file"
			type="file"
			:accept="uploadFileSetting.accept"
			:multiple="uploadFileSetting.multiple"
			style="display: none;"
			@change="getFile($event)"
		>
		<div class="uploadLayer">
			<div class="uploadContent">
				<Icon type="md-close" class="closeuploadBtn" @click="closeUploadLayer()"/>
				<div class="warnTip">温馨提醒：如果上传的数据量较大，请耐心等候！</div>
				<div id="uploader-demo">
					<!--用来存放item-->
					<div id="fileList" class="uploader-list"></div>
					<Row>
						<Col span="12" style="text-align: center;">
							<Button @click="chooseFn()">选择文件</Button>
						</Col>
						<Col span="12" style="text-align: center;">
							<Button type="success" @click="shangchuan()">开始上传</Button>
						</Col>
					</Row>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import $ from "jquery";

export default {
  name: "uploadFile",
  props: {
    uploadFileSetting: {
      type: Object,
      default: function() {
        return {
          uploadShow: true,
          accept: "", // 接受的上传类型
          multiple: "" // 选择单个/多个文件 默认单个
        };
      }
    },
    options: {
      // 上传路径和其他参数
      type: Object,
      default: function() {
        return {
          server: "/File/UploadMedia" // 上传路径
        };
      }
    }
  },
  data() {
    return {
      load: false,
      fileObj: []
    };
  },
  methods: {
    //选择函数
    chooseFn: function() {
      document.getElementById("file").click();
    },
    //有文件添加进来时
    getFile: function(event) {
      var vm = this;
      if (this.fileObj.length > 0) {
        vm.$Message.warning("只能选择一个文件！");
        return;
      }
      var file = event.target.files[0];
      this.fileObj.push(event.target.files[0]);

      var $list = $("#fileList");
      $list.append(
        '<div id="' +
          event.target.files.length +
          '" class="item">' +
          '<h4 class="info">' +
          file.name +
          "</h4>" +
          '<p class="state">等待上传...</p>' +
          "</div>"
      );
    },
    shangchuan: function() {
      var vm = this;
      if (vm.fileObj == "") {
        vm.$Message.warning("请选择文件！");
        return false;
      }
      vm.load = true;
      let formData = new FormData();
      for (var k in vm.options) {
        if (k != "server") {
          formData.append(k, vm.options[k]);
        }
      }
      formData.append("file", vm.fileObj[0]);
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      vm.$axios.post(vm.options.server, formData, config).then(function(res) {
        var retCode = res.data.header.retCode;
        var retMsg = res.data.header.retMsg;
        if (retCode == "000") {
          vm.$emit("on-close");
        } else {
          vm.$emit("on-error", retMsg);
        }
        document.getElementById("file").value = "";
        vm.fileObj = [];
        $("#fileList").html("");
        vm.load = false;
      });
    },
    closeUploadLayer: function() {
      this.$emit("on-close");
    }
  },
  mounted() {
    //初始化函数
  }
};
</script>

<style lang="less">
.uploadLayer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: rgba(0, 0, 0, 0.7);
  .uploadContent {
    position: absolute;
    width: 432px;
    top: 20%;
    left: 50%;
    margin-left: -216px;
    border-radius: 5px;
    background: #fff;
    .closeuploadBtn {
      float: right;
      font-size: 20px;
      color: #bdcbda;
      width: 20px;
      height: 20px;
      margin: 15px 15px 0 0;
    }
    .warnTip {
      margin-top: 40px;
      font-size: 14px;
      padding-left: 50px;
      font-weight: 900;
    }
  }
  .webuploader-container {
    position: relative;
  }
  .webuploader-element-invisible {
    position: absolute !important;
    clip: rect(1px 1px 1px 1px);
    /* IE6, IE7 */
    clip: rect(1px, 1px, 1px, 1px);
  }
  .webuploader-pick {
    position: relative;
    display: inline-block;
    cursor: pointer;
    background: #00b7ee;
    padding: 10px 15px;
    color: #fff;
    text-align: center;
    border-radius: 3px;
    overflow: hidden;
  }
  .webuploader-pick-hover {
    background: #00a2d4;
  }
  .webuploader-pick-disable {
    opacity: 0.6;
    pointer-events: none;
  }
  #uploader-demo {
    width: 100%;
    padding: 20px 0 30px 0;
  }
  #uploader-demo .file-item {
    width: 100px;
    height: 100px;
    display: inline-block;
    margin: 5px;
    position: relative;
    border: 1px solid #bdcbda;
    overflow: hidden;
  }
  #uploader-demo .item {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    padding: 0 0 10px 50px;
  }
  #uploader-demo #filePicker {
    margin: 0 auto;
  }
  #fileList {
    max-height: 250px;
    overflow-y: auto;
    font-size: 0;
  }
  .error {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    font-size: 12px;
  }
  #filePicker,
  .webuploader-pick {
    width: 82px;
    height: 33.5px;
    line-height: 33.5px;
    padding: 0;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>