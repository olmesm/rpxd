import { ts, toZod, caseHelpers, Template } from "rpxd/utils"

export default Template((feature, attributes) => {
	return {
		path: `./src/app/${caseHelpers.kebabCase(
			caseHelpers.plural(feature),
		)}/schema.ts`,
		template: ts`
import { z } from "zod"

export const ${caseHelpers.pascalCase(feature)}Schema = z.object({
	${attributes.map(toZod).join(",\n	")},
})

export type ${caseHelpers.pascalCase(
			feature,
		)}InputType = z.infer<typeof ${caseHelpers.pascalCase(feature)}Schema>

export type ${caseHelpers.pascalCase(feature)}Type = ${caseHelpers.pascalCase(
			feature,
		)}InputType & {
	id: string
	createdAt: Date
	updatedAt: Date
	userId: string
}

export type ${caseHelpers.pascalCase(feature)}ActionState = {
	ok: boolean
	errors?: string[]
	values?: Partial<${caseHelpers.pascalCase(feature)}InputType>
}
`,
	}
})
