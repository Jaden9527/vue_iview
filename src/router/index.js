import Vue from 'vue';
import Router from 'vue-router';
import iView from 'iview';
/* Layout */
import Layout from '@/views/layout/Layout'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '',
      component: Layout,
      redirect: 'dashboard',
      show: true,
      children: [
        {
          path: 'dashboard',
          component: () => import('@/views/dashboard/index'),
          name: 'Dashboard',
          meta: { title: '首页', icon: 'ios-navigate' }
        }
      ]
    },
  ]
})

/**路由守卫**/
router.beforeEach((to, from, next) => {
  // // to: Route: 即将要进入的目标 路由对象
  // // from: Route: 当前导航正要离开的路由
  // // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  // iView.LoadingBar.start();
  // if (to.meta.title) { //判断是否有标题
  //   document.title = to.meta.title;
  // }
  // var isLogin = sessionStorage.getItem("sessionId"); // 判断是否登录，本地存储有用户数据则视为已经登录
  // if (isLogin) {
  //   //如果用户信息存在则往下执行。
  //   next()
  // } else {
  //   //如果用户token不存在则跳转到login页面
  //   if (to.path === '/login' || to.path === '/register') {
  //     next()
  //   } else {
  //     next('/login');
  //     document.title = "登陆";
  //   }
  // }
  next()
});

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;