"use client"

import { useState } from "react"

type Mode = "signin" | "signup"

type AuthModalProps = {
	open: boolean
	onClose: () => void
	onSuccess: () => void
	signIn: (email: string, password: string) => Promise<void>
	signUp: (email: string, password: string) => Promise<void>
}

export function AuthModal({
	open,
	onClose,
	onSuccess,
	signIn,
	signUp,
}: AuthModalProps) {
	const [mode, setMode] = useState<Mode>("signin")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	if (!open) return null

	const submit = async (event: React.FormEvent) => {
		event.preventDefault()
		setError(null)
		const trimmedEmail = email.trim()
		if (!trimmedEmail || !password) return

		setSubmitting(true)
		try {
			if (mode === "signin") {
				await signIn(trimmedEmail, password)
			} else {
				await signUp(trimmedEmail, password)
			}
			setEmail("")
			setPassword("")
			onSuccess()
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong.")
		} finally {
			setSubmitting(false)
		}
	}

	const switchMode = (next: Mode) => {
		setMode(next)
		setError(null)
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<button
				type="button"
				aria-label="Close dialog"
				className="absolute inset-0 bg-black/40"
				onClick={() => !submitting && onClose()}
			/>
			<div className="relative z-10 w-full max-w-md rounded-lg bg-card p-5 shadow-lg space-y-4">
				<div className="space-y-1">
					<div className="text-lg font-semibold">
						{mode === "signin" ? "Sign in" : "Create an account"}
					</div>
					<div className="text-sm opacity-70">
						{mode === "signin"
							? "Sign in to manage your shortlists."
							: "Create an account to save shortlists."}
					</div>
				</div>

				<form className="space-y-3" onSubmit={submit}>
					<label className="block space-y-1">
						<span className="text-xs text-muted-foreground">Email</span>
						<input
							type="email"
							autoComplete="email"
							className="w-full rounded-md border px-3 py-2 text-sm"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={submitting}
							required
						/>
					</label>

					<label className="block space-y-1">
						<span className="text-xs text-muted-foreground">Password</span>
						<input
							type="password"
							autoComplete={
								mode === "signin" ? "current-password" : "new-password"
							}
							className="w-full rounded-md border px-3 py-2 text-sm"
							placeholder={mode === "signup" ? "At least 8 characters" : ""}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={submitting}
							minLength={mode === "signup" ? 8 : 1}
							required
						/>
					</label>

					{error && (
						<p className="text-sm text-red-500" role="alert">
							{error}
						</p>
					)}

					<div className="flex justify-end gap-2 pt-1">
						<button
							type="button"
							className="rounded-md border px-4 py-2 text-sm"
							onClick={onClose}
							disabled={submitting}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-50"
							disabled={submitting || !email.trim() || !password}
						>
							{submitting
								? "…"
								: mode === "signin"
									? "Sign in"
									: "Create account"}
						</button>
					</div>
				</form>

				<div className="border-t pt-3 text-center text-xs text-muted-foreground">
					{mode === "signin" ? (
						<>
							Don't have an account?{" "}
							<button
								type="button"
								className="text-foreground underline underline-offset-2"
								onClick={() => switchMode("signup")}
							>
								Sign up
							</button>
						</>
					) : (
						<>
							Already have an account?{" "}
							<button
								type="button"
								className="text-foreground underline underline-offset-2"
								onClick={() => switchMode("signin")}
							>
								Sign in
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	)
}
