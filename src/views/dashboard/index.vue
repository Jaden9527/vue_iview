<template>
    <div class="hello">
        <h1>{{ msg }}</h1>
        <h2>Essential Links</h2>
        <h3>{{this.$store.state.count}}</h3>
        <Button @click="addFn" type="primary">add</Button>
        <Button @click="uploadFn" type="dashed">上传</Button>

        <uploadFile :uploadFileSetting="uploadFileSetting" @on-close="uploadClose()" @uploadChange="uploadChange"></uploadFile>
    </div>
</template>

<script>
import uploadFile from "../../components/uploadFile.vue";
export default {
  name: "Dashboard",
  components: {
    uploadFile
  },
  data() {
    return {
      msg: "Welcome to Your Vue.js App",
      uploadFileSetting: {
          uploadShow: false,
          multiple: "multiple"
      }
    };
  },
  methods: {
    addFn: function() {
      this.$store.dispatch("add", 2);
    },
    reductFn: function() {
      this.$store.dispatch("reduct", 4);
    },
    uploadFn: function() {
        this.uploadFileSetting.uploadShow = true;
    },
    uploadClose: function() {
        this.uploadFileSetting.uploadShow = false;
    },
    uploadChange:function(list) {
      console.log("上传返回路径", list)
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>