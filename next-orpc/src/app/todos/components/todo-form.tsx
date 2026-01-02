"use client"

import { useActionState } from "react"
import {
	createTodo,
	updateTodo,
	type TodoActionState,
} from "../actions"
import { type TodoType } from "../schema"


export function TodoForm({ todo }: { todo?: TodoType }) {
	const action = todo ? updateTodo.bind(null, todo.id) : createTodo
	const initialState: TodoActionState = todo ? 
		{ ok: true, values: todo } :
		{ ok: true }
	
	const [state, formAction, isPending] = useActionState(action, initialState)

	return (
		<form action={formAction}>
			{state.ok || !state.errors?.length ? null : (
				<div style={{ color: "red" }}>
					<p>
						{state.errors.length} error{state.errors.length === 1 ? "" : "s"}{" "}
						prohibited this todo from being saved:
					</p>

					<ul>
						{(state.errors ?? []).map((m, i) => (
							<li key={`${m}-${i}`}>{m}</li>
						))}
					</ul>
				</div>
			)}


			<div>
				<label htmlFor="title">Title</label>
				<input
					id="title"
					name="title"
					defaultValue={state.values?.title ?? ""}
				/>
			</div>


			<div>
				<label htmlFor="done">
					<input
						id="done"
						name="done"
						type="checkbox"
						defaultChecked={state.values?.done ?? false}
					/>
					Done
				</label>
			</div>


			<button type="submit" disabled={isPending}>
				{
					todo ?
					"Update Todo" :
					"Create Todo"
				}
			</button>
		</form>
	)
}