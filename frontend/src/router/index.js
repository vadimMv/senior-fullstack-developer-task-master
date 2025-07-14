import { createRouter, createWebHistory } from "vue-router"
import Login from "../views/Login.vue"
import store from "../store"

const routes = [
	{
		path: "/",
		name: "Login",
		component: Login,
		meta: { requiresAuth: false }
	},
	{
		path: "/home",
		name: "Home",
		component: () => import("../views/Home.vue"),
		meta: { 
			requiresAuth: true,
			allowedRoles: ['regular', 'editor', 'admin', 'User', 'Editor', 'Admin']
		}
	},
	{
		path: "/admin",
		name: "Admin",
		component: () => import("../views/AdminView.vue"),
		meta: { 
			requiresAuth: true,
			allowedRoles: ['admin', 'Admin']
		}
	},
	{
		path: "/editor",
		name: "Editor",
		component: () => import("../views/EditorView.vue"),
		meta: { 
			requiresAuth: true,
			allowedRoles: ['editor', 'admin', 'Editor', 'Admin']
		}
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

// Route guard
router.beforeEach((to, from, next) => {
	const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
	const allowedRoles = to.meta.allowedRoles
	
	if (requiresAuth) {
		if (!store.getters.isAuthenticated) {
			next({ name: 'Login' })
			return
		}
		
		if (allowedRoles && allowedRoles.length > 0) {
			const hasRequiredRole = store.getters.hasAnyRole(allowedRoles)
			if (!hasRequiredRole) {
				if (store.getters.hasRole('admin') || store.getters.hasRole('Admin')) {
					next({ name: 'Admin' })
				} else if (store.getters.hasRole('editor') || store.getters.hasRole('Editor')) {
					next({ name: 'Editor' })
				} else {
					next({ name: 'Home' })
				}
				return
			}
		}
	}
	
	next()
})

export default router