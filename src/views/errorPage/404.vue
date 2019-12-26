<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <Row>
        <Col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
        >
        <div class="pic-404">
          <img
            class="pic-404__parent"
            src="@/common/images/404.png"
            alt="404"
          >
        </div>
        </Col>
        <Col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="8"
        >
        <div class="bullshit">
          <div class="bullshit__oops">OOPS!</div>
          <div class="bullshit__info">
            保留所有权利
            <a
              style="color:#20a0ff"
              target="_blank"
            >wallstreetcn</a>
          </div>
          <div class="bullshit__headline">{{ message }}</div>
          <div class="bullshit__info">请检查您输入的URL是否正确，或单击下面的按钮返回主页。</div>
          <a
            href=""
            class="bullshit__return-home"
          >返回主页</a>
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page404",
  computed: {
    message () {
      return "无法进入此页面...";
    }
  }
};
</script>

<style lang="less" scoped>
.wscn-http404-container {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
  width: 100%;
}

.wscn-http404 {
  position: relative;
  padding: 0 50px;
  overflow: hidden;
  width: 100%;
}

.wscn-http404 .pic-404 {
  position: relative;
  float: left;
  overflow: hidden;
}

.wscn-http404 .pic-404__parent {
  width: 100%;
}

.wscn-http404 .bullshit {
  position: relative;
  float: left;
  padding: 30px 0;
  overflow: hidden;
}

.wscn-http404 .bullshit__headline,
.wscn-http404 .bullshit__oops {
  font-weight: 700;
  -webkit-animation-name: slideUp-data-v-c095f994;
  animation-name: slideUp-data-v-c095f994;
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
}
.wscn-http404 .bullshit__oops {
  font-size: 32px;
  line-height: 40px;
  color: #1482f0;
  margin-bottom: 20px;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.wscn-http404 .bullshit__info,
.wscn-http404 .bullshit__return-home {
  -webkit-animation-name: slideUp-data-v-c095f994;
  animation-name: slideUp-data-v-c095f994;
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
}
.wscn-http404 .bullshit__info {
  font-size: 13px;
  line-height: 21px;
  color: grey;
  margin-bottom: 30px;
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.wscn-http404 .bullshit__headline {
  font-size: 20px;
  line-height: 24px;
  color: #222;
  margin-bottom: 10px;
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
.wscn-http404 .bullshit__headline,
.wscn-http404 .bullshit__oops {
  font-weight: 700;
  -webkit-animation-name: slideUp-data-v-c095f994;
  animation-name: slideUp-data-v-c095f994;
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
}
.wscn-http404 .bullshit__return-home {
  display: block;
  float: left;
  width: 110px;
  height: 36px;
  background: #1482f0;
  border-radius: 100px;
  text-align: center;
  color: #fff;
  font-size: 14px;
  line-height: 36px;
  cursor: pointer;
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}
</style>
