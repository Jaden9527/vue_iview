const getters = {
    roles: state => state.permission.roles,
    routeList: state => state.permission.routeList,
    pageOpenedList: state => state.app.pageOpenedList,
    userName: state => state.app.userName,
  }
  export default getters