import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

let routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@pages/index.vue')
  },
  {
    path: '/room/:id',
    component: () => import('@pages/room/index.vue'),
    meta: {
      private: true
    }
  },
  {
    path: '/test',
    component: () => import('@pages/test/index.vue')
  }
]

// Tạo router name, deep loop
const extendRoutes = (_routes: RouteRecordRaw[]) => {
  _routes.forEach((record) => {
    // tạo router name, xoá '/' ở đầu và thay thế còn lại = '-'
    record.name = record.path
      .replace(/\//, '')
      .replaceAll('/', '-')
      .replaceAll(new RegExp(/\([^)]*\)/, 'g'), '')
      .replaceAll(new RegExp(/:/, 'g'), '') || 'index'

    // deep loop
    if (record.children) {
      record.children = extendRoutes(record.children)
    }
  })
  return _routes
}

routes = extendRoutes(routes)

// 404 Handle
routes.push({
  path: '/:pathMatch(.*)*',
  component: () => import('./pages/error/index.vue'),
  meta: {
    title: 'Not Found'
  }
})

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
