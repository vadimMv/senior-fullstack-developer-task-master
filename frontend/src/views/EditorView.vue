<template>
	<div class="editor">
		<h1>Editor Page</h1>
		<p>Welcome {{ username }}!</p>
		<div class="editor-content">
			<p>You have editor privileges. Here you can:</p>
			<ul>
				<li>Edit content</li>
				<li>Manage articles</li>
				<li>Review submissions</li>
			</ul>
			<div class="navigation">
				<router-link to="/home" class="nav-link">Back to Home</router-link>
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
const canAccessAdmin = computed(() => 
	store.getters.hasAnyRole(['admin', 'Admin'])
)

const logout = () => {
	store.dispatch('logout')
	router.push('/')
}
</script>

<style scoped>
.editor {
	padding: 2rem;
	text-align: center;
}

.editor-content {
	margin: 2rem 0;
	padding: 1rem;
	background-color: #e8f5e8;
	border-radius: 8px;
}

.editor-content ul {
	text-align: left;
	max-width: 300px;
	margin: 1rem auto;
}

.navigation {
	margin-top: 1rem;
}

.nav-link {
	display: inline-block;
	margin: 0 1rem;
	padding: 0.5rem 1rem;
	background-color: #28a745;
	color: white;
	text-decoration: none;
	border-radius: 4px;
	transition: background-color 0.3s;
}

.nav-link:hover {
	background-color: #1e7e34;
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