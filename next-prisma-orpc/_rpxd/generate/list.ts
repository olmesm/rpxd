import { ts, caseHelpers, Template } from "rpxd/utils"

export default Template((feature, attributes) => {
	return {
		path: `./src/app/${caseHelpers.kebabCase(
			caseHelpers.plural(feature),
		)}/page.tsx`,
		template: ts`
import Link from "next/link"
import {
	list${caseHelpers.pascalCase(caseHelpers.plural(feature))},
	delete${caseHelpers.pascalCase(feature)},
} from "./actions"
import {
	${caseHelpers.pascalCase(feature)}
} from "./components/${caseHelpers.kebabCase(feature)}-details"

export default async function ${caseHelpers.pascalCase(feature)}IndexPage() {
	const ${caseHelpers.camelCase(
		caseHelpers.plural(feature),
	)} = await list${caseHelpers.pascalCase(caseHelpers.plural(feature))}()

	return (
		<>
			<h1>${caseHelpers.startCase(caseHelpers.plural(feature))}</h1>

			{${caseHelpers.camelCase(
				caseHelpers.plural(feature),
			)}.map((${caseHelpers.camelCase(feature)}) => (
				<div key={${caseHelpers.camelCase(feature)}.id}>
					<${caseHelpers.pascalCase(feature)} ${caseHelpers.camelCase(
			feature,
		)}={${caseHelpers.camelCase(feature)}} />

					<form action={delete${caseHelpers.pascalCase(
						feature,
					)}.bind(null, ${caseHelpers.camelCase(feature)}.id)}>
			<p>
				<Link href={${[
					"`/",
					caseHelpers.kebabCase(caseHelpers.plural(feature)),
					"/${",
					caseHelpers.camelCase(feature),
					".id}`",
				].join("")}}>Show</Link>{" "}
				<Link href={${[
					"`/",
					caseHelpers.kebabCase(caseHelpers.plural(feature)),
					"/${",
					caseHelpers.camelCase(feature),
					".id}/edit`",
				].join("")}}>Edit</Link>
				<button type="submit">Destroy</button>
			</p>
					</form>
				</div>
			))}

			<br />

			<Link href="/${caseHelpers.kebabCase(
				caseHelpers.plural(feature),
			)}/new">New ${caseHelpers.startCase(feature)}</Link>
		</>
	)
}

`,
	}
})
