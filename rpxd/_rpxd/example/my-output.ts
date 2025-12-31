// _rpxd/example/my-output.ts
import { ts, toZod, caseHelpers, Template } from "rpxd/utils"

export default Template((feature, attributes) => {
	return {
		path: `./src/${caseHelpers.kebabCase(
			caseHelpers.plural(feature),
		)}/output.ts`,
		template: ts`
import { z } from "zod"

export const ${caseHelpers.pascalCase(feature)}Schema = z.object({
	${attributes.map(toZod).join(",\n	")},
})
`,
	}
})
