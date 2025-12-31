"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { signIn, type SignInActionState } from "../actions"

const initialState: SignInActionState = { ok: false }

export function SignInForm() {
	const [state, formAction, isPending] = useActionState(signIn, initialState)
	const router = useRouter()

	useEffect(() => {
		if (!state.ok) return

		// Tell the Better Auth client to re-fetch session after server action sets cookies.
		authClient.$store.notify("$sessionSignal")
		router.push("/")
		router.refresh()
	}, [router, state.ok])

	return (
		<form action={formAction}>
			{state.ok || !state.errors?.length ? null : (
				<div style={{ color: "red" }}>
					<ul>
						{(state.errors ?? []).map((m, i) => (
							<li key={`${m}-${i}`}>{m}</li>
						))}
					</ul>
				</div>
			)}

			<div>
				<label htmlFor="email">Email</label>
				<input
					id="email"
					name="email"
					type="email"
					defaultValue={state.values?.email ?? ""}
				/>
			</div>

			<div>
				<label htmlFor="password">Password</label>
				<input id="password" name="password" type="password" />
			</div>

			<button type="submit" disabled={isPending}>
				Submit
			</button>
		</form>
	)
}
