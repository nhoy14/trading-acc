import axios from 'axios'

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
const API_BASE = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:8000' : 'https://trading-acc.onrender.com')

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const loginAgent = async (username, password) => {
  const res = await api.post('/login', { username, password })
  return res.data
}

export const getAccounts = async () => {
  const res = await api.get('/accounts')
  return res.data
}

export const createAccount = async (data) => {
  const res = await api.post('/accounts', data)
  return res.data
}

export const updateAccount = async (id, data) => {
  const res = await api.put(`/accounts/${id}`, data)
  return res.data
}

export const deleteAccount = async (id) => {
  const res = await api.delete(`/accounts/${id}`)
  return res.data
}

export default api
