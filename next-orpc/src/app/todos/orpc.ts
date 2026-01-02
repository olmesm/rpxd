"use server"

import { authorized } from "@/lib/os"
import { onError, onSuccess } from "@orpc/client"
import { redirect } from "next/navigation"
import z from "zod"

const ping = authorized
	.input(
		z.object({
			user: z.object({
				name: z.string(),
				age: z.coerce.number(),
			}),
		}),
	)
	.handler(({ input, context }) => {
		console.log("Form action called!")
		console.log({ input, context })

		return { success: true }
	})

export const redirectSomeWhereForm = ping.actionable({
	interceptors: [
		// onSuccess(async () => ({ success: true })),
		onError(async (error) => console.error(error) ?? redirect("/sign-in")),
	],
})
