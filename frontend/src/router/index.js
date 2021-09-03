import Vue from 'vue'
import VueRouter from 'vue-router'
import { isUserLoggedIn } from '@/auth/utils'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'artistas',
      component: () => import('@/views/artistas/ListaArtistas.vue'),
      meta: {
        pageTitle: 'Artistas',
        breadcrumb: [
          {
            text: 'Artistas',
            active: true,
          },
        ],
      },
    },
    {
      path: '/artista/:id',
      name: 'artista',
      component: () => import('@/views/artistas/Artista.vue'),
      meta: {
        pageTitle: 'Artistas',
        breadcrumb: [
          {
            text: 'Artistas',
          },
          {
            text: 'Ver artista',
            active: true,
          },
        ],
      },
    },
    {
      path: '/contratos',
      name: 'contratos',
      component: () => import('@/views/contratos/ListaContratos.vue'),
      meta: {
        pageTitle: 'Contratos',
        breadcrumb: [
          {
            text: 'Contratos',
            active: true,
          },
        ],
      },
    },
    {
      path: '/contrato/:id',
      name: 'contrato',
      component: () => import('@/views/contratos/Contrato.vue'),
      meta: {
        pageTitle: 'Contrato',
        breadcrumb: [
          {
            text: 'Contratos',
          },
          {
            text: 'Ver contrato',
            active: true,
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, _, next) => {
  const isLoggedIn = isUserLoggedIn()

  if (to.name !== 'login' && !isLoggedIn) {
    return next({ name: 'login' })
  }

  return next()
})



// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
