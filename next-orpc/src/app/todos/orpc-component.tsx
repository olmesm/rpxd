"use client"
import { getIssueMessage, parseFormData } from "@orpc/react"
import { useServerAction } from "@orpc/react/hooks"
import { redirectSomeWhereForm } from "./orpc"
import { flow } from "es-toolkit"

export function MyComponent() {
	const { execute, data, error, status } = useServerAction(
		redirectSomeWhereForm,
	)

	console.log({ error, data })

	return (
		<form action={flow(parseFormData, execute)}>
			<label>
				Name:
				<input name="user[name]" type="text" />
				<span>{getIssueMessage(error, "user[name]")}</span>
			</label>

			<label>
				Age:
				<input name="user[age]" type="number" />
				<span>{getIssueMessage(error, "user[age]")}</span>
			</label>

			<label>
				Images:
				<input name="images[]" type="file" multiple />
				<span>{getIssueMessage(error, "images[]")}</span>
			</label>

			<button disabled={status === "pending"}>Submit</button>
		</form>
	)
}
