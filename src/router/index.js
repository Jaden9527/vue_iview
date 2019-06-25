import Vue from 'vue';
import Router from 'vue-router';
import iView from 'iview';
/* Layout */
import Layout from '@/views/layout/Layout'

Vue.use(Router)

/** 基础路由 */
export const constantRoutes = [
  // {
  //   path: '/redirect',
  //   component: Layout,
  //   hidden: true,
  //   children: [
  //     {
  //       path: '/redirect/:path*',
  //       component: () => import('@/views/redirect/index')
  //     }
  //   ]
  // },
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    hidden: true,
    name: 'login',
    meta: {
      title: '登录',
      icon: 'logo-vimeo',
    },
  },
  // {
  //   path: '/404',
  //   component: () => import('@/views/errorPage/404'),
  //   hidden: true
  // },
  // {
  //   path: '/401',
  //   component: () => import('@/views/errorPage/401'),
  //   hidden: true
  // },
  {
    path: '',
    component: Layout,
    redirect: '/home',
    name: '',
    meta: {
      title: 'dashboard',
      icon: 'ios-navigate',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/dashboard/index'),
        name: 'home',
        meta: { title: '首页', icon: 'ios-aperture'}
      }
    ]
  },
  {
    path: '/main',
    component: Layout,
    hidden: false,
    name: 'main',
    meta: {
      title: 'dashboard',
      icon: 'md-analytics',
    },
    children: [
      {
        path: 'home1',
        component: () => import('@/views/dashboard/index'),
        name: 'home1',
        meta: { title: '首页12', icon: 'ios-navigate', roles: ['admin']}
      },
      {
        path: 'home12',
        component: () => import('@/components/HelloWorld'),
        name: 'home12',
        meta: { title: '首页123', icon: 'md-bookmarks', roles: ['admin']}
      }
    ]
  },
]

const router = new Router({
  routes: constantRoutes
})


/**路由守卫**/
router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  iView.LoadingBar.start();
  if (to.meta.title) { //判断是否有标题
    document.title = to.meta.title;
  }
  // var isLogin = sessionStorage.getItem("sessionId"); // 判断是否登录，本地存储有用户数据则视为已经登录
  var isLogin = true; // 判断是否登录，本地存储有用户数据则视为已经登录
  if (isLogin) {
    //如果用户信息存在则往下执行。
    next()
  } else {
    //如果用户token不存在则跳转到login页面
    if (to.path === '/login' || to.path === '/register') {
      next()
    } else {
      next(`/login?redirect=${to.path}`); //否则全部重定向到登录页
      document.title = "登陆";
    }
  }
});

router.afterEach((to, from, next) => {
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;