import { toPrisma, caseHelpers, Template } from "rpxd/utils"

export default Template((feature, attributes) => {
	const modelProperties = attributes.map(toPrisma)

	return {
		onlyAppend: true,
		canAppend: (schema) =>
			!schema.includes(`model ${caseHelpers.pascalCase(feature)}`),
		path: `prisma/schema.prisma`,
		template: `
        model ${caseHelpers.pascalCase(feature)} {
  id String @id @default(cuid())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  ${modelProperties.join("\n  ")}
  userId String
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
`,
	}
})
