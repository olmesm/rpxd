"use server"

import { z } from "zod"
import { auth } from "@/lib/auth"

const SignUpSchema = z.object({
	name: z.string().min(1, "Name can't be blank"),
	email: z.email(),
	password: z.string().min(8, "Password should be a minimum of 8 characters"),
})

type SignUpType = z.infer<typeof SignUpSchema>

export type SignUpActionState = {
	ok: boolean
	errors?: string[]
	values?: Partial<SignUpType>
}

export async function signUp(
	_prev: SignUpActionState,
	formData: FormData,
): Promise<SignUpActionState> {
	const raw = Object.fromEntries(formData.entries())

	const parsed = SignUpSchema.safeParse(raw)

	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.issues.map((i) => i.message),
			values: raw,
		}
	}

	try {
		await auth.api.signUpEmail({
			body: {
				name: parsed.data.name,
				email: parsed.data.email,
				password: parsed.data.password,
			},
		})
	} catch (error) {
		const { password: _, ...values } = parsed.data

		console.error(error)
		return {
			ok: false,
			errors: ["Failed to create account"],
			values,
		}
	}

	return { ok: true }
}
