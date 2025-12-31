"use client"

import { authClient } from "@/lib/auth-client"
import { useTransition } from "react"

export function SignOutButton() {
	const [isPending, startTransition] = useTransition()

	const action = () =>
		startTransition(async () => {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: () => {
						window.location.href = "/"
					},
					onError: (error) => {
						console.error("Sign out failed:", error)
						window.location.reload()
					},
				},
			})
		})

	return (
		<button disabled={isPending} onClick={action} type="submit">
			Sign out
		</button>
	)
}
