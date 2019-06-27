<template>
  <div class="container">
    <div class="content">
      <div class="main mainBorder">
        <p style="text-align: center;">
          <span class="systemName">注册</span>
        </p>
        <Form ref="loginform" :rules="rules" :model="loginModel">
          <FormItem prop="userName">
            <div class="ivu-input-wrapper ivu-input-wrapper-large ivu-input-type">
              <i
                class="ivu-icon ivu-icon-ios-person ivu-input-icon ivu-input-icon-normal"
                style="left:0"
              ></i>
              <input
                v-model="loginModel.userName"
                autocomplete="off"
                spellcheck="false"
                type="text"
                :placeholder="'用户名'"
                class="ivu-input ivu-input-large"
                style="padding-left:32px;padding-right:0"
              >
            </div>
          </FormItem>
          <FormItem prop="email">
            <div class="ivu-input-wrapper ivu-input-wrapper-large ivu-input-type">
              <i
                class="ivu-icon ivu-icon-md-mail ivu-input-icon ivu-input-icon-normal"
                style="left:0"
              ></i>
              <input
                v-model="loginModel.email"
                autocomplete="off"
                spellcheck="false"
                type="text"
                :placeholder="'邮箱'"
                class="ivu-input ivu-input-large"
                style="padding-left:32px;padding-right:0"
              >
            </div>
          </FormItem>
          <FormItem prop="phone">
            <div class="ivu-input-wrapper ivu-input-wrapper-large ivu-input-type">
              <i
                class="ivu-icon ivu-icon-ios-call ivu-input-icon ivu-input-icon-normal"
                style="left:0"
              ></i>
              <input
                v-model="loginModel.phone"
                autocomplete="off"
                spellcheck="false"
                type="text"
                :placeholder="'手机号'"
                class="ivu-input ivu-input-large"
                style="padding-left:32px;padding-right:0"
              >
            </div>
          </FormItem>
          <FormItem prop="password">
            <div class="ivu-input-wrapper ivu-input-wrapper-large ivu-input-type">
              <i
                class="ivu-icon ivu-icon-ios-lock ivu-input-icon ivu-input-icon-normal"
                style="left:0"
              ></i>
              <input
                v-model="loginModel.password"
                autocomplete="off"
                spellcheck="false"
                type="password"
                :placeholder="'用户密码'"
                class="ivu-input ivu-input-large"
                style="padding-left:32px;padding-right:0"
              >
            </div>
          </FormItem>
          <FormItem prop="confirmPassword">
            <div class="ivu-input-wrapper ivu-input-wrapper-large ivu-input-type">
              <i
                class="ivu-icon ivu-icon-ios-lock ivu-input-icon ivu-input-icon-normal"
                style="left:0"
              ></i>
              <input
                v-model="loginModel.confirmPassword"
                autocomplete="off"
                spellcheck="false"
                type="password"
                :placeholder="'确认密码'"
                class="ivu-input ivu-input-large"
                style="padding-left:32px;padding-right:0"
              >
            </div>
          </FormItem>
        </Form>
        <div>
          <a style="float:right;font-size: 14px;margin-top: 3px;color:#1890ff;">
            <span @click="login">去登录</span>
          </a>
        </div>
        <div style="margin-top:15px">
          <Button @click="submit" long size="large" style="color:#fff;background-color:#1890ff;">提交</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validEmail, validPhone } from "@/common/utils/validate";

export default {
  name: "register",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.loginModel.confirmPassword !== "") {
          this.$refs.loginform.validateField("confirmPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.loginModel.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    var checkEmail = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入邮箱"));
      } else if (!validEmail(this.loginModel.email)) {
        return callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    var checkPhone = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入手机号"));
      } else if (!validPhone(this.loginModel.phone)) {
        return callback(new Error("手机号不正确"));
      } else {
        callback();
      }
    };
    return {
      loginModel: {
        userName: "",
        password: "",
        email: "",
        phone: "",
        confirmPassword: ""
      },
      rules: {
        userName: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        email: [
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        phone: [
          {
            validator: checkPhone,
            trigger: "blur"
          }
        ],
        password: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ],
        confirmPassword: [
          {
            validator: validatePass2,
            trigger: "blur"
          }
        ]
      },
      redirect: null,
      otherQuery: {
        query: null,
        params: null
      }
    };
  },
  methods: {
    submit() {
      let vm = this;
      vm.$refs.loginform.validate(valid => {
        if (valid) {
          if (!validEmail(vm.loginModel.email)) {
            vm.$Message.error("邮箱格式不正确");
            return;
          }
          if (!validPhone(vm.loginModel.phone)) {
            vm.$Message.error("手机号不正确");
            return;
          }
          if (vm.loginModel.password != vm.loginModel.confirmPassword) {
            vm.$Message.error("两次输入密码不一致");
            return;
          }

          vm.$Message.loading({
            content: "提交中...",
            duration: 0
          });

          vm.$store
            .dispatch("register", vm.loginModel)
            .then(() => {
              setTimeout(function() {
                vm.$Message.destroy();
                vm.$router.replace({
                  path: "/"
                });
              }, 1000);
            })
            .catch(err => {
              vm.$Message.destroy();
              console.log("registerFail", err);
            });
        }
      });
    },
    login() {
      this.$router.push({ path: "/login" });
    }
  },
  watch: {
    /** 监听路由是否有重定向  */
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery.query = query.query;
          this.otherQuery.params = query.params;
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="less" scoped>
form {
  margin-top: 20px;
}
.mainBorder {
  width: 420px;
  border-radius: 10px;
  background-color: #fff;
  padding: 30px 40px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 10px;

  .systemName {
    font-weight: 700;
    color: #1890ff;
    line-height: 36px;
    font-size: 28px;
  }
  .EnglishSystemName {
    font-weight: 400;
    font-size: 20px;
    color: #1890ff;
    line-height: 36px;
  }
}
.container {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  min-height: 100%;
  background: #f0f2f5;
}
@media (min-width: 768px) {
  .container {
    background-image: url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
    font-size: 18px;
  }
}
.content {
  padding: 32px 0;
  -ms-flex: 1 1 0%;
  flex: 1 1 0%;
}
.main {
  width: 368px;
  margin: 0 auto;
}
@media (min-width: 768px) {
  .content {
    padding: 140px 0 24px;
  }
}
.top {
  text-align: center;
}
.header {
  height: 44px;
  line-height: 44px;
}
.logo {
  height: 44px;
  vertical-align: top;
  margin-right: 16px;
}
.title {
  font-size: 33px;
  color: rgba(0, 0, 0, 0.85);
  font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
  font-weight: 600;
  position: relative;
  top: 2px;
}
.desc {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
  margin-top: 12px;
  margin-bottom: 40px;
}
.tenant-title {
  margin-bottom: 24px;
  text-align: center;
}
</style>