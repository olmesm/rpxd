import { ts, caseHelpers, Template } from "rpxd/utils"

export default Template((feature, attributes) => {
	return {
		path: `./src/app/${caseHelpers.kebabCase(
			caseHelpers.plural(feature),
		)}/components/${caseHelpers.kebabCase(feature)}-details.tsx`,
		template: ts`
import { type ${caseHelpers.pascalCase(feature)}Type } from "../schema"

export function ${caseHelpers.pascalCase(feature)}({ ${caseHelpers.camelCase(
			feature,
		)} }: { ${caseHelpers.camelCase(feature)}: ${caseHelpers.pascalCase(
			feature,
		)}Type }) {
	return (
		<>
			${attributes
				.map((attribute) =>
					`
			<p>
				<strong>${caseHelpers.startCase(
					attribute.name,
				)}:</strong> {${caseHelpers.camelCase(feature)}.${caseHelpers.camelCase(
						attribute.name,
					)}}
			</p>
					`.trim(),
				)
				.join("\n			")}
		</>
	)
}
`,
	}
})
