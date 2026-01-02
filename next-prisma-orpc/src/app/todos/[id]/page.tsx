import {
	Todo
} from "../components/todo-details"
import { getTodo } from "../actions"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function TodoShowPage(props: PageProps<"/todos/[id]">) {
	const { id } = await props.params
	const todo = await getTodo(id)

	if (!todo) notFound()

	return (
		<>
			<Todo todo={todo} />

			<Link href={`/todos/${todo.id}/edit`}>Edit</Link>{" "}
			<Link href={`/todos`}>Back</Link>
		</>
	)
}