const app = {
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

export default app