import { ts, caseHelpers, Template } from "rpxd/utils"

export default Template((feature, attributes) => {
	return {
		path: `./src/app/${caseHelpers.kebabCase(
			caseHelpers.plural(feature),
		)}/[id]/edit/page.tsx`,
		template: ts`
import {
	${caseHelpers.pascalCase(feature)}Form
} from "../../components/${caseHelpers.kebabCase(feature)}-form"
import { get${caseHelpers.pascalCase(feature)} } from "../../actions"
import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ${caseHelpers.pascalCase(feature)}EditPage(
	props: PageProps<"/${caseHelpers.kebabCase(
		caseHelpers.plural(feature),
	)}/[id]/edit">
) {
	const { id } = await props.params
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) return redirect("/sign-in")
		
	const ${caseHelpers.camelCase(feature)} = await get${caseHelpers.pascalCase(
			feature,
		)}(id)

	if (!${caseHelpers.camelCase(feature)}) notFound()

	return (
		<>
			<h1>Editing ${caseHelpers.startCase(feature)}</h1>

			<${caseHelpers.pascalCase(feature)}Form ${caseHelpers.camelCase(
			feature,
		)}={${caseHelpers.camelCase(feature)}} />

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
				"`",
			].join("")}}>Back</Link>
		</>
	)
}
`,
	}
})
