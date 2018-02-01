const getters = {
  sidebar: state => state.app.sidebar,
  tabs: state => state.app.tabs,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles
}
export default getters
