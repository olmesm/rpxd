import {
	TodoForm
} from "../../components/todo-form"
import { getTodo } from "../../actions"
import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function TodoEditPage(
	props: PageProps<"/todos/[id]/edit">
) {
	const { id } = await props.params
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) return redirect("/sign-in")
		
	const todo = await getTodo(id)

	if (!todo) notFound()

	return (
		<>
			<h1>Editing Todo</h1>

			<TodoForm todo={todo} />

			<Link href={`/todos/${todo.id}`}>Show</Link>{" "}
			<Link href={`/todos`}>Back</Link>
		</>
	)
}