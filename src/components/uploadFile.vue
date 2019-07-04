<template>
  <!--图片素材-->
  <div v-show="uploadFileSetting.uploadShow">
    <input
      name="file"
      id="file"
      type="file"
      ref="clearFile"
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
          <div id="fileList" class="uploader-list">
            <template v-if="fileObj.length > 0">
              <div :id="i" class="item" v-for="file, i in fileObj">
                <h4 class="info">
                  {{file.name}}
                  <span style="padding-left:10px">
                    <Icon type="md-close" @click="deleteFile(i)"/>
                  </span>
                </h4>
              </div>
              <div class="item">
                <p class="state">等待上传...</p>
              </div>
            </template>
          </div>
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
          server: "/File/UploadMedia", // 上传路径
          sessionId: "sessionId"
        };
      }
    }
  },
  data() {
    return {
      fileObj: [],
      selectFile: null
    };
  },
  methods: {
    //选择函数
    chooseFn: function() {
      document.getElementById("file").click();
    },
    /** 删除文件 */
    deleteFile(index) {
      this.fileObj.splice(index, 1);
    },
    //有文件添加进来时
    getFile: function(event) {
      var vm = this;
      //   if (this.fileObj.length > 0) {
      //     vm.$Message.warning("只能选择一个文件！");
      //     return;
      //   }

      for (let i = 0; i < event.target.files.length; i++) {
        let file = event.target.files[i];
        let isHave = this.fileObj.some(item => {
          if ( item.name == file.name &&item.type == file.type &&item.size == file.size ) {
            return true;
          }
        });

        if (!isHave) {
          /** 不存在重复文件插入上传队列 */
          this.fileObj.push(file);
        }
      }
      this.$refs.clearFile.value = ""; // 清空file文件

      /** jquery插入上传预览 */
      //   var file = event.target.files[0];
      //   var $list = $("#fileList");
      //   $list.append(
      //     '<div id="' +
      //       event.target.files.length +
      //       '" class="item">' +
      //       '<h4 class="info">' +
      //       file.name +
      //       "</h4>" +
      //       '<p class="state">等待上传...</p>' +
      //       "</div>"
      //   );
    },
    /** 上传前判断 */
    shangchuan: function() {
      var vm = this;
      if (vm.fileObj == "") {
        vm.$Message.warning("请选择文件！");
        return false;
      }

      /** 判断上传的文件是否为多个 */
      if (vm.fileObj.length == 1) {
        const file = vm.fileObj[0];
        /** 判断是否为图片，是否需要压缩 */
        if (file.type.indexOf("image") > -1) {
          vm.compress(file, { quality: 0.2 }).then(from => {
            vm.uploadFn(from)
              .then(res => {
                let list = [];
                list.push(res);

                vm.$emit("uploadChange" , list);
              })
              .catch(err => {
                console.log("上传失败");
              });
          });
        } else {
          const form = new FormData();
          for (var k in vm.options) {
            if (k != "server") {
              form.append(k, vm.options[k]);
            }
          }
          form.append("file", file);

          vm.uploadFn(form)
            .then(res => {
              let list = [];
              list.push(res);

              vm.$emit("uploadChange" , list);
            })
            .catch(err => {
              console.log("上传失败");
            });
        }
      } else if (vm.fileObj.length > 1) {
        let list = [];
        for (let i = 0; i < vm.fileObj.length; i++) {
          const file = vm.fileObj[i];

          if (file.type.indexOf("image") > -1) {
            vm.compress(file, { quality: 0.2 }).then(from => {
              vm.uploadFn(from)
                .then(res => {
                  list.push(res);
                  if (i == vm.fileObj.length - 1) {
                    vm.$emit("uploadChange" , list);
                  }
                })
                .catch(err => {
                  console.log("上传失败");
                });
            });
          } else {
            const form = new FormData();
            for (var k in vm.options) {
              if (k != "server") {
                form.append(k, vm.options[k]);
              }
            }
            form.append("file", file);

            vm.uploadFn(form)
              .then(res => {
                list.push(res);
                if (i == vm.fileObj.length - 1) {
                  vm.$emit("uploadChange" , list);
                }
              })
              .catch(err => {
                console.log("上传失败");
              });
          }
        }
      }
    },
    /** 上传文件 */
    uploadFn(formData) {
      let vm = this;
      let config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      return new Promise(function(resolve, reject) {
        vm.$axios
          .post(vm.options.server, formData, config)
          .then(function(res) {
            var retCode = res.data.header.retCode;
            var retMsg = res.data.header.retMsg;
            if (retCode == "000") {
              vm.$emit("on-close");
            } else {
              vm.$emit("on-error", retMsg);
              reject(res);
            }
            document.getElementById("file").value = "";
            vm.fileObj = [];

            resolve(res);
          })
          .catch(function(err) {
            document.getElementById("file").value = "";
            vm.fileObj = [];
            reject(err);
          });
      });
    },

    //图片压缩
    compress(file, obj) {
      //file是指上传的图片，obj是压缩的品质，越低越模糊
      let vm = this;
      return new Promise(function(resolve, reject) {
        let reader = new FileReader();
        let image = new Image();
        reader.readAsDataURL(file);
        reader.onload = function() {
          file.src = this.result;
          image.onload = function() {
            let width = image.width;
            let height = image.height;
            file.width = width;
            file.height = height;
          };
          console.log(file);
          image.src = file.src; //页面上显示所选择的图片
          if (file.size / 1024 > 1025) {
            //判断图片的大小，超过1M 进行压缩
            let vm = this; //这里的this 是把vue的实例对象指向改变为vm
            var img = new Image();
            img.src = path.src;
            img.onload = function() {
              var that = this; //这里的this 是把img的对象指向改变为that
              // 默认按比例压缩
              var w = that.width,
                h = that.height,
                scale = w / h;
              w = obj.width || w;
              h = obj.height || w / scale;
              var quality = 0.7; // 默认图片质量为0.7
              //生成canvas
              var canvas = document.createElement("canvas");
              var ctx = canvas.getContext("2d");
              // 创建属性节点
              var anw = document.createAttribute("width");
              anw.nodeValue = w;
              var anh = document.createAttribute("height");
              anh.nodeValue = h;
              canvas.setAttributeNode(anw);
              canvas.setAttributeNode(anh);
              ctx.drawImage(that, 0, 0, w, h);
              // 图像质量
              if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                quality = obj.quality;
              }
              // quality值越小，所绘制出的图像越模糊
              var base64 = canvas.toDataURL("image/jpeg", quality);
              // 回调函数返回base64的值
              var urlFile = vm.convertBase64UrlToBlob(base64); //这个地方的处理是为了把压缩的base64转化为对象，获得压缩后图片的大小size，方便对压缩后的图片再次进行判断；
              console.log(urlFile);

              const form = new FormData();
              for (var k in vm.options) {
                if (k != "server") {
                  form.append(k, vm.options[k]);
                }
              }
              form.append("file", urlFile);

              resolve(form);
            };
          } else {
            // vm.partitionBase = file.src.split(",")[1]; //这里是因为后台需要 base64和图片type类型两个数据，所以进行了处理
            // vm.imgType = "." + file.type.split("/")[1];

            const form = new FormData();
            for (var k in vm.options) {
              if (k != "server") {
                form.append(k, vm.options[k]);
              }
            }
            form.append("file", file);

            resolve(form);
          }
        };
      });
    },

    //将base64码转化为file（Blob）
    //此处函数对压缩后的base64经过处理返回{size: "", type: ""}
    convertBase64UrlToBlob(urlData) {
      var arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
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