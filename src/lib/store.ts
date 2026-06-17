import { create } from 'zustand'

export type Route =
  | { name: 'home' }
  | { name: 'taskers' }
  | { name: 'tasker-detail'; id: string }
  | { name: 'employer-posts' }
  | { name: 'pricing' }
  | { name: 'dashboard' }
  | { name: 'admin' }
  | { name: 'auth' }
  | { name: 'terms' }
  | { name: 'privacy' }
  | { name: 'community' }
  | { name: 'how-it-works' }

interface NavState {
  route: Route
  history: Route[]
  forwardStack: Route[]
  navigate: (route: Route) => void
  back: () => void
  forward: () => void
  canGoBack: () => boolean
  canGoForward: () => boolean
}

export const useNav = create<NavState>((set, get) => ({
  route: { name: 'home' },
  history: [{ name: 'home' }],
  forwardStack: [],
  navigate: (route) => {
    const state = get()
    set({
      route,
      history: [...state.history, route],
      forwardStack: [],
    })
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  },
  back: () => {
    const state = get()
    if (state.history.length > 1) {
      const newHistory = state.history.slice(0, -1)
      const prev = newHistory[newHistory.length - 1]
      set({
        route: prev,
        history: newHistory,
        forwardStack: [state.route, ...state.forwardStack],
      })
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  },
  forward: () => {
    const state = get()
    if (state.forwardStack.length > 0) {
      const [next, ...rest] = state.forwardStack
      set({
        route: next,
        history: [...state.history, next],
        forwardStack: rest,
      })
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  },
  canGoBack: () => get().history.length > 1,
  canGoForward: () => get().forwardStack.length > 0,
}))

// Auth state
interface AuthState {
  userId: string | null
  role: 'tasker' | 'employer' | 'admin' | null
  email: string | null
  name: string | null
  isAuthenticated: boolean
  login: (user: { userId: string; role: 'tasker' | 'employer' | 'admin'; email: string; name: string }) => void
  logout: () => void
}

export const useAuth = create<AuthState>((set) => ({
  userId: null,
  role: null,
  email: null,
  name: null,
  isAuthenticated: false,
  login: (user) =>
    set({
      userId: user.userId,
      role: user.role,
      email: user.email,
      name: user.name,
      isAuthenticated: true,
    }),
  logout: () =>
    set({
      userId: null,
      role: null,
      email: null,
      name: null,
      isAuthenticated: false,
    }),
}))

// Notification bell state
interface NotificationState {
  unreadCount: number
  isBellOpen: boolean
  setUnreadCount: (n: number) => void
  increment: () => void
  toggleBell: () => void
  setBell: (open: boolean) => void
}

export const useNotifications = create<NotificationState>((set) => ({
  unreadCount: 0,
  isBellOpen: false,
  setUnreadCount: (n) => set({ unreadCount: n }),
  increment: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
  toggleBell: () => set((s) => ({ isBellOpen: !s.isBellOpen })),
  setBell: (open) => set({ isBellOpen: open }),
}))
