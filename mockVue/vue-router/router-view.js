export default {
  name: 'router-view',
  render(h) {

    const {routeMap, current} = this.$router;
    const component = routeMap[current] ? routeMap[current].component : null;
    return h(component);
  }
}