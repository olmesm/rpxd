import { partition } from "es-toolkit"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { splitAttributes, type Template } from "./utils"

const runTemplate =
	(feature: string, templateArgs: string[]) => async (somePath: string) => {
		const [flags, attributes] = partition(templateArgs.filter(Boolean), (s) =>
			s.startsWith("-"),
		)

		const templateResult: ReturnType<ReturnType<typeof Template>> = (
			await import(somePath)
		).default(feature, splitAttributes(attributes))
		const outpath = resolve(process.cwd(), templateResult.path)

		mkdirSync(dirname(outpath), { recursive: true })

		if (templateResult.onlyAppend) {
			if (
				templateResult.canAppend
					? templateResult.canAppend(readFileSync(outpath, "utf-8"))
					: true
			) {
				writeFileSync(
					outpath,
					[
						readFileSync(outpath, "utf-8").trim(),
						templateResult.template.trim(),
					].join("\n\n"),
					"utf-8",
				)
			} else {
				console.error(
					`Failed onlyAppend checks. Please manually add the following to ${outpath}`,
				)
				console.error(templateResult.template.trim())
			}
		}

		if (!templateResult.onlyAppend) {
			if (existsSync(outpath) && !flags.includes("--overwrite"))
				throw Error(`File ${outpath} exists. Run with '--overwrite' if needed.`)

			writeFileSync(outpath, templateResult.template.trim(), "utf-8")
		}

		return templateResult.path
	}

const generateHelp = `
rapid <feature-name> <attributes:attribute-type>... [--overwrite]

Generates a resource 
`

const main = async (args: string[]) => {
	const [_nodePath, _scriptPath, command, ...rest] = args
	const commandRoot = resolve(process.cwd(), join("_rpxd", command))

	try {
		if (existsSync(commandRoot)) {
			const [feature, ...templateArgs] = rest
			if (!feature) throw Error("Ensure there is an feature name")

			const results = await Promise.all(
				(await import(commandRoot)).default
					.map((p: string) => join(commandRoot, p))
					.map(runTemplate(feature, templateArgs)),
			)

			return results
		}
	} catch (e) {
		console.warn("!!! Errors\n")
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		console.error((e as any).message)
		console.error(e)
		process.exit(1)
	}

	switch (command) {
		case "help":
		default:
			return [generateHelp].join("\n")
	}
}

main(process.argv).then(console.log)
