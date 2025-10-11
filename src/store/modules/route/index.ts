import type {
  RouteComponent,
  RouteLocationNormalizedLoaded,
  RouteRecordRaw,
} from 'vue-router'
import type { RouteModule, RouteState } from './types'
import { defineStore } from 'pinia'
import { fetchUserInfo } from '@/api/users/index'
import globalConfig from '@/config/app/index'
import router from '@/router'

export const useRouteStore = defineStore('route', {
  state: (): RouteState => ({
    hasAuthRoute: false,
    currentRoute: {} as RouteLocationNormalizedLoaded,
    routes: [],
    authRoutes: [],
    cacheRoutes: [],
    isRouteLoaded: true,
  }),
  actions: {
    /** 初始化路由 */
    async initAuthRoute() {
      await this.initDynamicRoute()
    },
    /** 导入路由组件 */
    importRouteComponent(componentPath?: RouteComponent | null) {
      const routeModules: RouteModule = import.meta.glob(
        ['/src/layouts/**/*.vue', '/src/views/**/*.vue'],
        { eager: true },
      )
      const routeModule = routeModules[`/src${componentPath}`]?.default
      return routeModule
    },
    /** 处理菜单 */
    processMenu(menu: RouteRecordRaw) {
      if (menu?.children?.length) {
        menu.children = menu.children.map(this.processMenu)
      }
      menu.component = this.importRouteComponent(menu.component)
      return menu
    },
    /** 初始化动态路由 */
    async initDynamicRoute() {
      const { defaultRoutePath } = globalConfig
      const { menus } = await fetchUserInfo()
      const routes = menus.map(this.processMenu)
      const defaultRoute: RouteRecordRaw[] = [
        { path: '/', redirect: defaultRoutePath },
      ]
      const dynamicRoutes = [...defaultRoute, ...routes]
      this.setRoutes(dynamicRoutes)
    },
    /** 将路由添加到路由实例中 */
    setRoutes(routes: RouteRecordRaw[]) {
      const staticRoutes = router.options.routes
      routes.forEach(route => router.addRoute(route))
      this.authRoutes = routes
      this.routes = staticRoutes.concat(routes)
      this.hasAuthRoute = true
    },
    /** 设置当前路由 */
    setCurrentRoute() {
      this.currentRoute = router.currentRoute.value
    },
    /** 添加缓存路由 */
    addCacheRoute(route: RouteLocationNormalizedLoaded) {
      const { name } = route
      const hasExist = this.cacheRoutes.find(
        (cacheRoute: RouteLocationNormalizedLoaded) => cacheRoute.name === name,
      )

      if (name && !hasExist)
        this.cacheRoutes.push(route)
    },
    /** 重新加载页面 */
    reloadPage(route: RouteLocationNormalizedLoaded) {
      if (route.fullPath === this.currentRoute.fullPath) {
        this.isRouteLoaded = false
        setTimeout(() => {
          // 等待页面动画播放完毕
          this.isRouteLoaded = true
        }, 400)
      }
    },
  },
})
