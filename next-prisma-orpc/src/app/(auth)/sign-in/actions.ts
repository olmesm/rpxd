"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"

const SignInSchema = z.object({
	email: z.email(),
	password: z.string(),
})

type SignInType = z.infer<typeof SignInSchema>

export type SignInActionState = {
	ok: boolean
	errors?: string[]
	values?: Partial<SignInType>
}

export async function signIn(
	_prev: SignInActionState,
	formData: FormData,
): Promise<SignInActionState> {
	const raw = Object.fromEntries(formData)

	const parsed = SignInSchema.safeParse(raw)

	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.issues.map((i) => i.message),
			values: raw,
		}
	}

	try {
		await auth.api.signInEmail({
			body: {
				email: parsed.data.email,
				password: parsed.data.password,
			},
		})
	} catch (error) {
		const { password: _, ...values } = parsed.data

		console.error(error)
		return {
			ok: false,
			errors: ["Account not found"],
			values,
		}
	}

	return { ok: true }
}
