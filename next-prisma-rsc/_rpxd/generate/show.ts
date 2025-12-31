import { ts, caseHelpers, Template } from "rpxd/utils"

export default Template((feature, attributes) => {
	return {
		path: `./src/app/${caseHelpers.kebabCase(
			caseHelpers.plural(feature),
		)}/[id]/page.tsx`,
		template: ts`
import {
	${caseHelpers.pascalCase(feature)}
} from "../components/${caseHelpers.kebabCase(feature)}-details"
import { get${caseHelpers.pascalCase(feature)} } from "../actions"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function ${caseHelpers.pascalCase(
			feature,
		)}ShowPage(props: PageProps<"/${caseHelpers.kebabCase(
			caseHelpers.plural(feature),
		)}/[id]">) {
	const { id } = await props.params
	const ${caseHelpers.camelCase(feature)} = await get${caseHelpers.pascalCase(
			feature,
		)}(id)

	if (!${caseHelpers.camelCase(feature)}) notFound()

	return (
		<>
			<${caseHelpers.pascalCase(feature)} ${caseHelpers.camelCase(
			feature,
		)}={${caseHelpers.camelCase(feature)}} />

			<Link href={${[
				"`/",
				caseHelpers.kebabCase(caseHelpers.plural(feature)),
				"/${",
				caseHelpers.camelCase(feature),
				".id}/edit`",
			].join("")}}>Edit</Link>{" "}
			<Link href={${[
				"`/",
				caseHelpers.kebabCase(caseHelpers.plural(feature)),
				"`",
			].join("")}}>Back</Link>
		</>
	)
}
`,
	}
})
