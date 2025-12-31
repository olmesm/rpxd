import { ts, toZod, caseHelpers, Template } from "rpxd/utils"

export default Template((feature, attributes) => {
	return {
		path: `./src/app/${caseHelpers.kebabCase(
			caseHelpers.plural(feature),
		)}/actions.ts`,
		template: ts`
"use server"

import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import {
	${caseHelpers.pascalCase(feature)}Schema,
	${caseHelpers.pascalCase(feature)}InputType,
	${caseHelpers.pascalCase(feature)}Type,
} from "./schema"

export type ${caseHelpers.pascalCase(feature)}ActionState = {
	ok: boolean
	errors?: string[]
	values?: Partial<${caseHelpers.pascalCase(feature)}InputType>
}

export async function list${caseHelpers.pascalCase(
			caseHelpers.plural(feature),
		)}(): Promise<${caseHelpers.pascalCase(feature)}Type[]> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) return []

	return db.${caseHelpers.camelCase(feature)}.findMany({
		orderBy: { createdAt: "desc" },
		where: { userId: session.user.id },
	})
}

export async function get${caseHelpers.pascalCase(
			feature,
		)}(id: string): Promise<${caseHelpers.pascalCase(feature)}Type | null> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) return null

	return db.${caseHelpers.camelCase(feature)}.findUnique({
		where: { id, userId: session.user.id },
	})
}

export async function delete${caseHelpers.pascalCase(
			feature,
		)}(id: string): Promise<void> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) redirect("/sign-in")

	try {
		await db.${caseHelpers.camelCase(feature)}.delete({ where: {
			id, 
			userId: session.user.id,
		} })
	} catch (error) {
		console.error(error)
		redirect("/${caseHelpers.kebabCase(caseHelpers.plural(feature))}")
	}

	redirect("/${caseHelpers.kebabCase(caseHelpers.plural(feature))}")
}

export async function create${caseHelpers.pascalCase(feature)}(
	_prev: ${caseHelpers.pascalCase(feature)}ActionState,
	formData: FormData,
): Promise<${caseHelpers.pascalCase(feature)}ActionState> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) redirect("/sign-in")

	const raw = Object.fromEntries(formData)

	const parsed = ${caseHelpers.pascalCase(feature)}Schema.safeParse(raw)

	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.issues.map((i) => i.message),
			values: raw,
		}
	}

	let id: string | null = null

	try {
		const ${caseHelpers.camelCase(feature)} = await db.${caseHelpers.camelCase(
			feature,
		)}.create({
			data: {
				...parsed.data,
				userId: session.user.id,
			},
			select: { id: true },
		})

		id = post.id
	} catch (error) {
		const baseState: ${caseHelpers.pascalCase(
			feature,
		)}ActionState = { ok: false, values: parsed.data }
		
		console.error(error)
		return {
			...baseState, 
			errors: ["Something went wrong."],
		}
	}

	redirect(${[
		"`/",
		caseHelpers.kebabCase(caseHelpers.plural(feature)),
		"/${id}`",
	].join("")})
}

export async function update${caseHelpers.pascalCase(feature)}(
	id: string,
	_prev: ${caseHelpers.pascalCase(feature)}ActionState,
	formData: FormData,
): Promise<${caseHelpers.pascalCase(feature)}ActionState> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) redirect("/sign-in")

	const raw = Object.fromEntries(formData)

	const parsed = ${caseHelpers.pascalCase(feature)}Schema.safeParse(raw)

	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.issues.map((i) => i.message),
			values: raw,
		}
	}

	try {
		await db.${caseHelpers.camelCase(feature)}.update({
			where: {
				id,
				userId: session.user.id,
			},
			data: parsed.data,
		})

	} catch (error) {
		const baseState: ${caseHelpers.pascalCase(
			feature,
		)}ActionState = { ok: false, values: parsed.data }
		
		console.error(error)
		return {
			...baseState, 
			errors: ["Something went wrong."],
		}
	}

	redirect(${[
		"`/",
		caseHelpers.kebabCase(caseHelpers.plural(feature)),
		"/${id}`",
	].join("")})
}
`,
	}
})
