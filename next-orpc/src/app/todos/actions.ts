"use server"

import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import {
	TodoSchema,
	TodoInputType,
	TodoType,
} from "./schema"

export type TodoActionState = {
	ok: boolean
	errors?: string[]
	values?: Partial<TodoInputType>
}

export async function listTodos(): Promise<TodoType[]> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) return []

	return db.todo.findMany({
		orderBy: { createdAt: "desc" },
		where: { userId: session.user.id },
	})
}

export async function getTodo(id: string): Promise<TodoType | null> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) return null

	return db.todo.findUnique({
		where: { id, userId: session.user.id },
	})
}

export async function deleteTodo(id: string): Promise<void> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) redirect("/sign-in")

	try {
		await db.todo.delete({ where: {
			id, 
			userId: session.user.id,
		} })
	} catch (error) {
		console.error(error)
		redirect("/todos")
	}

	redirect("/todos")
}

export async function createTodo(
	_prev: TodoActionState,
	formData: FormData,
): Promise<TodoActionState> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) redirect("/sign-in")

	const raw = Object.fromEntries(formData.entries())

	const parsed = TodoSchema.safeParse(raw)

	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.issues.map((i) => i.message),
			values: raw,
		}
	}

	let id: string | null = null

	try {
		const todo = await db.todo.create({
			data: {
				...parsed.data,
				userId: session.user.id,
			},
			select: { id: true },
		})

		id = todo.id
	} catch (error) {
		const baseState: TodoActionState = { ok: false, values: parsed.data }
		
		console.error(error)
		return {
			...baseState, 
			errors: ["Something went wrong."],
		}
	}

	redirect(`/todos/${id}`)
}

export async function updateTodo(
	id: string,
	_prev: TodoActionState,
	formData: FormData,
): Promise<TodoActionState> {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) redirect("/sign-in")

	const raw = Object.fromEntries(formData.entries())

	const parsed = TodoSchema.safeParse(raw)

	if (!parsed.success) {
		return {
			ok: false,
			errors: parsed.error.issues.map((i) => i.message),
			values: raw,
		}
	}

	try {
		await db.todo.update({
			where: {
				id,
				userId: session.user.id,
			},
			data: parsed.data,
		})

	} catch (error) {
		const baseState: TodoActionState = { ok: false, values: parsed.data }
		
		console.error(error)
		return {
			...baseState, 
			errors: ["Something went wrong."],
		}
	}

	redirect(`/todos/${id}`)
}