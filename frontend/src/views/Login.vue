<template>
	<div class="login">
		<h2>Welcome to HyperGuest Test</h2>
		<div class="login-form">
			<input 
				v-model="username" 
				type="text" 
				placeholder="Enter username"
				@keyup.enter="handleLogin"
			/>
			<button 
				@click="handleLogin" 
				:disabled="!username || isLoading"
			>
				{{ isLoading ? 'Logging in...' : 'Login' }}
			</button>
		</div>
		<p v-if="error" class="error">{{ error }}</p>
	</div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"

const router = useRouter()
const store = useStore()
const username = ref("")

const isLoading = computed(() => store.getters.isLoading)
const error = computed(() => store.getters.error)

const handleLogin = async () => {
	try {
		await store.dispatch('login', username.value)
		router.push('/home')
	} catch (err) {
		// Error is handled in the store
	}
}
</script>

<style scoped>
.login {
	padding: 2rem;
	text-align: center;
	max-width: 400px;
	margin: 0 auto;
}

.login-form {
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin-top: 2rem;
}

input {
	padding: 0.5rem;
	font-size: 1rem;
	border: 1px solid #ccc;
	border-radius: 4px;
}

button {
	padding: 0.5rem;
	font-size: 1rem;
	background-color: #42b983;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

button:disabled {
	background-color: #ccc;
	cursor: not-allowed;
}

button:hover:not(:disabled) {
	background-color: #3aa876;
}

.error {
	color: #dc3545;
	margin-top: 1rem;
}
</style>