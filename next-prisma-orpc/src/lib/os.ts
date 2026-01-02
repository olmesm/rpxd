import { os } from "@orpc/server"

import { auth } from "@/lib/auth"
import { ORPCError } from "@orpc/server"

const headersMiddleware = os.middleware(async ({ next }) => {
	const { headers } = await import("next/headers")
	const nextHeaders = await headers()

	return next({
		context: {
			headers: new Headers(nextHeaders),
		},
	})
})

const authMiddleware = os
	.$context<{ headers: Headers }>() // <-- define dependent-context
	.middleware(async ({ context, next }) => {
		const sessionData = await auth.api.getSession({
			headers: context.headers,
		})

		if (!sessionData?.session || !sessionData?.user) {
			throw new ORPCError("UNAUTHORIZED")
		}

		return next({
			context: {
				session: sessionData.session,
				user: sessionData.user,
			},
		})
	})

export const publik = os.use(headersMiddleware)
export const authorized = publik.use(authMiddleware)
