import {
	TodoForm
} from "../components/todo-form"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function TodoNewPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) return redirect("/sign-in")

	return (
		<>
			<h1>New Todo</h1>
			<TodoForm />
		</>
	)
}