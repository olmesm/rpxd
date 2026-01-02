import { z } from "zod"

export const TodoSchema = z.object({
	title: z.coerce.string().min(1, "Title can't be blank"),
	done: z.preprocess(
				(v) => ["on", "true", true].includes(v),
				z.boolean()
			),
})

export type TodoInputType = z.infer<typeof TodoSchema>

export type TodoType = TodoInputType & {
	id: string
	createdAt: Date
	updatedAt: Date
	userId: string
}

export type TodoActionState = {
	ok: boolean
	errors?: string[]
	values?: Partial<TodoInputType>
}