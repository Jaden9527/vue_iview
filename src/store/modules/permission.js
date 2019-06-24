/** 判断路由是否在菜单显示 */
function showRoute(list = [], parent) {
    let parentShow = false;
    list.forEach((item,index) => {
        /** 如果设置权限进行权限验证，没有设置默认为有权限 */
        item.meta.roles = item.meta.roles || [];
        if (item.meta.roles.length > 0) {
            item["show"] = item.meta.roles.includes("admin");
            parentShow = item.meta.roles.includes("admin") ? true : parentShow;
        } else {
            item["show"] = true;
            parentShow = true;
        }

        if(index == list.length - 1 && parent && !parentShow) {
            parent.show = false;
        }

        if (item.children) {
            showRoute(item.children, item);
        }
    });
}

const permission = {
    state: {
        routeList: [],
        roles: ['admin'] // 用户权限
    },
    mutations: {
        // 上面定义的state
        SET_ROUTES: (state, routes) => {
            state.routeList = routes
        }
    },
    actions: { //注册actions， 类似vue 的 methods
        GenerateRoutes(context, routes = []) {
            showRoute(routes); 

            context.commit('SET_ROUTES', routes)
        }
    }
};

export default permission