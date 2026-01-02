import Link from "next/link"
import {
	listTodos,
	deleteTodo,
} from "./actions"
import {
	Todo
} from "./components/todo-details"

export default async function TodoIndexPage() {
	const todos = await listTodos()

	return (
		<>
			<h1>Todos</h1>

			{todos.map((todo) => (
				<div key={todo.id}>
					<Todo todo={todo} />

					<form action={deleteTodo.bind(null, todo.id)}>
			<p>
				<Link href={`/todos/${todo.id}`}>Show</Link>{" "}
				<Link href={`/todos/${todo.id}/edit`}>Edit</Link>
				<button type="submit">Destroy</button>
			</p>
					</form>
				</div>
			))}

			<br />

			<Link href="/todos/new">New Todo</Link>
		</>
	)
}