import Vue from 'vue';
import Router from 'vue-router';
import ViewUI from 'view-design';
import store from '../store';
/* Layout */
import Layout from '@/views/layout/Layout'

Vue.use(Router)

/** 基础路由 */
export const constantRoutes = [
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
  {
    path: '/register',
    component: () => import('@/views/login/register'),
    hidden: true,
    name: 'register',
    meta: {
      title: '注册',
      icon: 'logo-wordpress',
    },
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    name: '404',
    meta: {
      title: '页面不存在',
    },
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true,
    name: '401',
    meta: {
      title: '权限不足',
    },
  },
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
        meta: { title: '首页', icon: 'ios-aperture',keepAlive: false }
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
        path: 'home12',
        component: () => import('@/components/HelloWorld'),
        name: 'home12',
        meta: { title: '首页12', icon: 'ios-navigate', roles: ['admin'],keepAlive: true }
      },
      {
        path: 'formDemo',
        component: () => import('@/components/custom-form/demo'),
        name: 'formDemo',
        meta: { title: '表单demo', icon: 'ios-navigate', roles: ['admin'],keepAlive: true }
      },
      {
        path: 'home13',
        component: () => import('@/views/dashboard/index'),
        name: 'home13',
        meta: { title: '首页13', icon: 'md-bookmarks', roles: ['editor'],keepAlive: true }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  {
    path: '*', name: '404',
    meta: {
      title: '页面不存在',
    },
    redirect: '/404',
    hidden: true
  }
]

const router = new Router({
  routes: constantRoutes
})


/**路由守卫**/
router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
  ViewUI.LoadingBar.start();
  let role = false;
  if (to.meta) {
    if (to.meta.title) { //判断是否有标题
      document.title = to.meta.title;
    }
    if (to.meta.roles) {
      if (to.meta.roles.length > 0) {
        role = to.meta.roles.some(function (value, index, _ary) {
          if (value == 'admin') {
            return true;
          }
        });
      }else {
        role = true;
      }
    } else {
      role = true;
    }
  } else {
    role = true;
  }

  var userName = localStorage.getItem("userName"); // 判断是否登录，本地存储有用户数据则视为已经登录
  if (userName) {
    //如果用户信息存在则往下执行。
    store.commit('SET_NAME', userName);
    /** 判断用户有没有访问权限 */
    if (role) {
      next()
    } else {
      next({
        replace: true,
        name: '401'
      })
    }
  } else {
    //如果用户token不存在则跳转到login页面
    if (to.path === '/login' || to.path === '/register') {
      next()
    } else {
      next(`/login?redirect=${to.path}&query=${JSON.stringify(to.query)}&params=${JSON.stringify(to.params)}`); //否则全部重定向到登录页
      document.title = "登录";
    }
  }
});

router.afterEach((to, from, next) => {
  ViewUI.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;