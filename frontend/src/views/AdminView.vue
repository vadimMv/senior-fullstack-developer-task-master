<template>
	<div class="admin">
		<h1>Admin Page</h1>
		<p>Welcome {{ username }}!</p>
		<div class="admin-content">
			<p>You have admin privileges. Here you can:</p>
			<ul>
				<li>Manage users</li>
				<li>Configure system settings</li>
				<li>View analytics</li>
				<li>Access all features</li>
			</ul>
			<div class="user-roles">
				<strong>Your roles:</strong> {{ userRoles.join(', ') }}
			</div>
			<div class="navigation">
				<router-link to="/home" class="nav-link">Back to Home</router-link>
				<router-link to="/editor" class="nav-link">Go to Editor Page</router-link>
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

const logout = () => {
	store.dispatch('logout')
	router.push('/')
}
</script>

<style scoped>
.admin {
	padding: 2rem;
	text-align: center;
}

.admin-content {
	margin: 2rem 0;
	padding: 1rem;
	background-color: #fff3cd;
	border-radius: 8px;
}

.admin-content ul {
	text-align: left;
	max-width: 300px;
	margin: 1rem auto;
}

.user-roles {
	margin: 1rem 0;
	padding: 0.5rem;
	background-color: #d4edda;
	border-radius: 4px;
}

.navigation {
	margin-top: 1rem;
}

.nav-link {
	display: inline-block;
	margin: 0 1rem;
	padding: 0.5rem 1rem;
	background-color: #ffc107;
	color: #212529;
	text-decoration: none;
	border-radius: 4px;
	transition: background-color 0.3s;
}

.nav-link:hover {
	background-color: #e0a800;
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
