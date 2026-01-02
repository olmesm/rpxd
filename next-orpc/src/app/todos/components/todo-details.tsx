import { type TodoType } from "../schema"

export function Todo({ todo }: { todo: TodoType }) {
	return (
		<>
			<p>
				<strong>Title:</strong> {todo.title.toString()}
			</p>
			<p>
				<strong>Done:</strong> {todo.done.toString()}
			</p>
		</>
	)
}