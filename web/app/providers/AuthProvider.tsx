"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
	useState,
} from "react"
import { AuthModal } from "@/components/auth/AuthModal"
import {
	type AuthUser,
	getCurrentUser,
	loginUser,
	logoutUser,
	registerUser,
} from "@/lib/api-client"

type AuthContextValue = {
	user: AuthUser | null
	isLoading: boolean
	signIn: (email: string, password: string) => Promise<void>
	signUp: (email: string, password: string) => Promise<void>
	signOut: () => Promise<void>
	requireAuth: (run: () => void | Promise<void>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const qc = useQueryClient()
	const [modalOpen, setModalOpen] = useState(false)
	const pendingActionRef = useRef<(() => void | Promise<void>) | null>(null)

	const userQuery = useQuery({
		queryKey: ["auth", "me"],
		queryFn: ({ signal }) => getCurrentUser(signal),
		staleTime: 60_000,
	})

	const setUser = useCallback(
		(user: AuthUser | null) => {
			qc.setQueryData(["auth", "me"], user)
		},
		[qc],
	)

	const signIn = useCallback(
		async (email: string, password: string) => {
			const user = await loginUser(email, password)
			setUser(user)
			qc.invalidateQueries({ queryKey: ["shortlists"] })
		},
		[qc, setUser],
	)

	const signUp = useCallback(
		async (email: string, password: string) => {
			const user = await registerUser(email, password)
			setUser(user)
			qc.invalidateQueries({ queryKey: ["shortlists"] })
		},
		[qc, setUser],
	)

	const signOut = useCallback(async () => {
		await logoutUser()
		setUser(null)
		qc.removeQueries({ queryKey: ["shortlists"] })
		qc.removeQueries({ queryKey: ["shortlist"] })
	}, [qc, setUser])

	const requireAuth = useCallback(
		(run: () => void | Promise<void>) => {
			if (userQuery.data) {
				void run()
				return
			}
			pendingActionRef.current = run
			setModalOpen(true)
		},
		[userQuery.data],
	)

	const handleAuthSuccess = useCallback(() => {
		setModalOpen(false)
		const run = pendingActionRef.current
		pendingActionRef.current = null
		if (run) void run()
	}, [])

	const value = useMemo<AuthContextValue>(
		() => ({
			user: userQuery.data ?? null,
			isLoading: userQuery.isLoading,
			signIn,
			signUp,
			signOut,
			requireAuth,
		}),
		[userQuery.data, userQuery.isLoading, signIn, signUp, signOut, requireAuth],
	)

	return (
		<AuthContext.Provider value={value}>
			{children}
			<AuthModal
				open={modalOpen}
				onClose={() => {
					setModalOpen(false)
					pendingActionRef.current = null
				}}
				onSuccess={handleAuthSuccess}
				signIn={signIn}
				signUp={signUp}
			/>
		</AuthContext.Provider>
	)
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error("useAuth must be used within AuthProvider")
	return ctx
}
