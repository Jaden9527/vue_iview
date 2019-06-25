const app = {
    state: {
        /** 打开的标签页 */
        pageOpenedList: [{
            meta: { title: '首页' },
            path: '',
            name: 'home'
        }]
    },
    mutations: {
        // 上面定义的state
        setPageOpenedList: (state, page) => {
            let obj = page || {};
            let noHave = state.pageOpenedList.some(function (value, index, _ary) {
                if (value.name == obj.name) {
                    return true;
                }
            });

            if (!noHave) {
                state.pageOpenedList.push(obj)
            }

        },
        /** 清除所有页签 */
        clearAllTags(state) {
            state.pageOpenedList.splice(1);
        },
        /** 清除其他页签 */
        clearOtherTags(state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
        },
        /** 关闭所选页签 */
        removeTag(state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        }
    },
    actions: { //注册actions， 类似vue 的 methods
        GeneratePageOpenedList(context, page) {
            context.commit('setPageOpenedList', page)
        }
    }
};

export default app