import { Template, ts, toFormField, caseHelpers } from "rpxd/utils"

export default Template((feature, attributes) => {
	return {
		path: `./src/app/${caseHelpers.kebabCase(
			caseHelpers.plural(feature),
		)}/components/${caseHelpers.kebabCase(feature)}-form.tsx`,
		template: ts`
"use client"

import { useActionState } from "react"
import {
	create${caseHelpers.pascalCase(feature)},
	update${caseHelpers.pascalCase(feature)},
	type ${caseHelpers.pascalCase(feature)}ActionState,
} from "../actions"
import { type ${caseHelpers.pascalCase(feature)}Type } from "../schema"


export function ${caseHelpers.pascalCase(
			feature,
		)}Form({ ${caseHelpers.camelCase(feature)} }: { ${caseHelpers.camelCase(
			feature,
		)}?: ${caseHelpers.pascalCase(feature)}Type }) {
	const action = ${caseHelpers.camelCase(
		feature,
	)} ? update${caseHelpers.pascalCase(
			feature,
		)}.bind(null, ${caseHelpers.camelCase(
			feature,
		)}.id) : create${caseHelpers.pascalCase(feature)}
	const initialState: ${caseHelpers.pascalCase(
		feature,
	)}ActionState = ${caseHelpers.camelCase(feature)} ? 
		{ ok: true, values: ${caseHelpers.camelCase(feature)} } :
		{ ok: true }
	
	const [state, formAction, isPending] = useActionState(action, initialState)

	return (
		<form action={formAction}>
			{state.ok || !state.errors?.length ? null : (
				<div style={{ color: "red" }}>
					<p>
						{state.errors.length} error{state.errors.length === 1 ? "" : "s"}{" "}
						prohibited this ${caseHelpers
							.startCase(feature)
							.toLowerCase()} from being saved:
					</p>

					<ul>
						{(state.errors ?? []).map((m, i) => (
							<li key={${"`${m}-${i}`"}}>{m}</li>
						))}
					</ul>
				</div>
			)}

${attributes.map(toFormField).join("\n")}

			<button type="submit" disabled={isPending}>
				{
					${caseHelpers.camelCase(feature)} ?
					"Update ${caseHelpers.startCase(feature)}" :
					"Create ${caseHelpers.startCase(feature)}"
				}
			</button>
		</form>
	)
}
`,
	}
})
