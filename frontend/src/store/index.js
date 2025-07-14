import { createStore } from "vuex"
import axios from "axios"

const API_BASE_URL = 'http://localhost:3000'

export default createStore({
	state: {
		user: null,
		isAuthenticated: false,
		loading: false,
		error: null
	},
	getters: {
		currentUser: (state) => state.user,
		isAuthenticated: (state) => state.isAuthenticated,
		userRoles: (state) => {
			if (!state.user) return []
			try {
				return typeof state.user.roles === 'string'
					? JSON.parse(state.user.roles)
					: state.user.roles || []
			} catch {
				return ['User']
			}
		},
		hasRole: (state, getters) => (role) => {
			return getters.userRoles.includes(role)
		},
		hasAnyRole: (state, getters) => (roles) => {
			return roles.some(role => getters.userRoles.includes(role))
		},
		username: (state) => state.user?.username || '',
		isLoading: (state) => state.loading,
		error: (state) => state.error
	},
	mutations: {
		SET_LOADING(state, loading) {
			state.loading = loading
		},
		SET_ERROR(state, error) {
			state.error = error
		},
		SET_USER(state, user) {
			state.user = user
			state.isAuthenticated = !!user
		},
		CLEAR_USER(state) {
			state.user = null
			state.isAuthenticated = false
		},
		CLEAR_ERROR(state) {
			state.error = null
		}
	},
	actions: {
		async login({ commit }, username) {
			commit('SET_LOADING', true)
			commit('CLEAR_ERROR')

			try {
				const response = await axios.post(`${API_BASE_URL}/users/login/${username}`, {}, {
					headers: {
						'token': username
					}
				})

				const user = response.data
				commit('SET_USER', user)
				return user
			} catch (error) {
				const errorMessage = error.response?.data?.message || 'Login failed'
				commit('SET_ERROR', errorMessage)
				throw error
			} finally {
				commit('SET_LOADING', false)
			}
		},

		logout({ commit }) {
			commit('CLEAR_USER')
			commit('CLEAR_ERROR')
		},

		clearError({ commit }) {
			commit('CLEAR_ERROR')
		}
	}
})
