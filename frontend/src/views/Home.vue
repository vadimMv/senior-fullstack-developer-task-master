<template>
	<div class="home">
		<h1>Home Page</h1>
		<p>Welcome {{ username }}!</p>
		<div class="user-info">
			<p><strong>Roles:</strong> {{ userRoles.join(', ') }}</p>
			<div class="navigation">
				<router-link v-if="canAccessEditor" to="/editor" class="nav-link">
					Go to Editor Page
				</router-link>
				<router-link v-if="canAccessAdmin" to="/admin" class="nav-link">
					Go to Admin Page
				</router-link>
			</div>
		</div>
		<button @click="logout" class="logout-btn">Logout</button>
	</div>
</template>

<script setup>
import { computed } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"

const store = useStore()
const router = useRouter()

const username = computed(() => store.getters.username)
const userRoles = computed(() => store.getters.userRoles)
const canAccessEditor = computed(() => 
	store.getters.hasAnyRole(['editor', 'admin', 'Editor', 'Admin'])
)
const canAccessAdmin = computed(() => 
	store.getters.hasAnyRole(['admin', 'Admin'])
)

const logout = () => {
	store.dispatch('logout')
	router.push('/')
}
</script>

<style scoped>
.home {
	padding: 2rem;
	text-align: center;
}

.user-info {
	margin: 2rem 0;
	padding: 1rem;
	background-color: #f8f9fa;
	border-radius: 8px;
}

.navigation {
	margin-top: 1rem;
}

.nav-link {
	display: inline-block;
	margin: 0 1rem;
	padding: 0.5rem 1rem;
	background-color: #007bff;
	color: white;
	text-decoration: none;
	border-radius: 4px;
	transition: background-color 0.3s;
}

.nav-link:hover {
	background-color: #0056b3;
}

.logout-btn {
	margin-top: 2rem;
	padding: 0.5rem 1rem;
	background-color: #dc3545;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.logout-btn:hover {
	background-color: #c82333;
}
</style>