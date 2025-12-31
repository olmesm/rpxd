import { startCase, camelCase, kebabCase, pascalCase } from "es-toolkit"
import z from "zod"
import pluralize from "pluralize"

type TemplateType = {
	path: string
	template: string
	onlyAppend?: boolean
	canWrite?: (existingFileContents: string) => Promise<boolean> | boolean
	canAppend?: (existingFileContents: string) => Promise<boolean> | boolean
}

export function Template(
	templateFn: (feature: string, attributes: AttributeType[]) => TemplateType,
) {
	return (feature: string, attributes: AttributeType[]) =>
		templateFn(feature, attributes)
}

const { plural } = pluralize

export const caseHelpers = {
	plural,
	camelCase,
	startCase,
	kebabCase,
	pascalCase,
}

export const ts = String.raw
export const js = String.raw

const attributeLiteral = z.literal([
	"string",
	"boolean",
	"int",
	"bigint",
	"float",
	"decimal",
	"datetime",
	"json",
	"enum",
])

export type AttributeType = {
	name: string
	kind: z.infer<typeof attributeLiteral>
	values: string[]
}

export const splitAttributes = (attributeList: string[]): AttributeType[] =>
	attributeList.reduce((a: AttributeType[], c) => {
		const [name, rawKind = "string", ...rawValues] = c.split(":")
		const values = rawValues.filter(Boolean)
		const kind = attributeLiteral.parse(rawKind)

		if (["enum"].includes(kind) && values.length < 1)
			throw Error(
				`Additional values are required for kind '${kind}' eg 'status:enum:active:inactive'\ngot '${c}'`,
			)

		return [...a, { name, kind, values }]
	}, [])

export function toZod(attribute: AttributeType) {
	switch (attribute.kind) {
		case "string":
			return `${camelCase(
				attribute.name,
			)}: z.coerce.string().min(1, "${startCase(
				attribute.name,
			)} can't be blank")`

		case "boolean":
			// HTML forms submit "on", "true", "false", or nothing
			return `${camelCase(attribute.name)}: z.preprocess(
				(v) => ["on", "true", true].includes(v),
				z.boolean()
			)`

		case "int":
			return `${camelCase(attribute.name)}: z.coerce.number().int()`

		case "bigint":
			return `${camelCase(attribute.name)}: z.coerce.bigint()`

		case "float":
		case "decimal":
			return `${camelCase(attribute.name)}: z.coerce.number()`

		case "datetime":
			return `${camelCase(attribute.name)}: z.coerce.date()`

		case "json":
			// comes in as string, let caller decide structure
			return `${camelCase(attribute.name)}: z.preprocess(
				(v) => (typeof v === "string" ? JSON.parse(v) : v),
				z.unknown()
			)`

		case "enum":
			return `${camelCase(attribute.name)}: z.enum(${JSON.stringify(
				attribute.values,
			)})`

		default:
			throw Error(`TODO toZod({ kind: "${attribute.kind}" })`)
	}
}

export function toPrisma(attribute: AttributeType) {
	switch (attribute.kind) {
		case "string":
		case "boolean":
		case "int":
		case "float":
		case "decimal":
		case "json":
			return `${attribute.name} ${pascalCase(attribute.kind)}`
		case "bigint":
			return `${attribute.name} BigInt`
		case "datetime":
			return `${attribute.name} DateTime`

		case "enum":
		default:
			throw Error(`TODO toPrisma({ kind: "${attribute.kind}" })`)
	}
}

export function toFormField(attribute: AttributeType) {
	const name = camelCase(attribute.name)
	const label = startCase(attribute.name)

	switch (attribute.kind) {
		case "string":
			return `
			<div>
				<label htmlFor="${name}">${label}</label>
				<input
					id="${name}"
					name="${name}"
					defaultValue={state.values?.${name} ?? ""}
				/>
			</div>
`

		case "boolean":
			return `
			<div>
				<label htmlFor="${name}">
					<input
						id="${name}"
						name="${name}"
						type="checkbox"
						defaultChecked={state.values?.${name} ?? false}
					/>
					${label}
				</label>
			</div>
`

		case "int":
		case "float":
		case "decimal":
			return `
			<div>
				<label htmlFor="${name}">${label}</label>
				<input
					id="${name}"
					name="${name}"
					type="number"
					defaultValue={state.values?.${name} ?? ""}
				/>
			</div>
`

		case "bigint":
			return `
			<div>
				<label htmlFor="${name}">${label}</label>
				<input
					id="${name}"
					name="${name}"
					type="number"
					step="1"
					defaultValue={state.values?.${name} ?? ""}
				/>
			</div>
`

		case "datetime":
			return `
			<div>
				<label htmlFor="${name}">${label}</label>
				<input
					id="${name}"
					name="${name}"
					type="datetime-local"
					defaultValue={state.values?.${name} ?? ""}
				/>
			</div>
`

		case "json":
			return `
			<div>
				<label htmlFor="${name}">${label}</label>
				<textarea
					id="${name}"
					name="${name}"
					defaultValue={state.values?.${name} ?? ""}
				/>
			</div>
`

		case "enum":
			return `
			<div>
				<label htmlFor="${name}">${label}</label>
				<select
					id="${name}"
					name="${name}"
					defaultValue={state.values?.${name} ?? ""}
				>
					${attribute.values
						.map((v) => `<option value="${v}">${startCase(v)}</option>`)
						.join("\n")}
				</select>
			</div>
`

		default:
			throw Error(`TODO toFormField({ kind: "${attribute.kind}" })`)
	}
}
