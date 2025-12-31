import { ts, caseHelpers, Template } from "rpxd/utils"

export default Template((feature, attributes) => {
	return {
		path: `./src/app/${caseHelpers.kebabCase(
			caseHelpers.plural(feature),
		)}/new/page.tsx`,
		template: ts`
import {
	${caseHelpers.pascalCase(feature)}Form
} from "../components/${caseHelpers.kebabCase(feature)}-form"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function ${caseHelpers.pascalCase(feature)}NewPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	if (!session?.user.id) return redirect("/sign-in")

	return (
		<>
			<h1>New ${caseHelpers.startCase(feature)}</h1>
			<${caseHelpers.pascalCase(feature)}Form />
		</>
	)
}
`,
	}
})
