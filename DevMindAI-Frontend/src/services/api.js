import axios from 'axios'

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim()
const baseURL = configuredBaseUrl || '/api'

export const api = axios.create({
  baseURL,
})

const isProtectedRoute = (url = '') => url.startsWith('/ai/')

// Request interceptor to automatically inject Clerk Bearer token and User ID
api.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== 'undefined' && window.Clerk) {
        // Add Bearer token
        if (window.Clerk?.session) {
          const token = await window.Clerk.session.getToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        
        // Add User ID header
        if (window.Clerk?.user?.id) {
          config.headers['X-User-ID'] = window.Clerk.user.id
        }
      }
    } catch (error) {
      console.error('Error fetching Clerk token/user in interceptor:', error)
    }

    if (isProtectedRoute(config.url) && !config.headers.Authorization) {
      const authError = new Error('Authentication required. Please sign in to access this service.')
      authError.response = { status: 401, data: { message: authError.message } }
      return Promise.reject(authError)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


