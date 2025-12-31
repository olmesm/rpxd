> Very much in development and currently for personal use.

---

# rpxd

Rapid Prototyping & Design scaffold tool.

## Usage

```bash
npm i -D rpxd

npx rpxd <command> <feature> [...attributes]
```

Attribute types are found in [rpxd/src/utils/index.ts](rpxd/src/utils/index.ts). Defaults to `string`

## Example

Running `npx rpxd <command> <feature> [...attributes]`, rpxd will look in the root of the project for an `_rpxd/<command>` and run the templates declared in the default export.

For `example` command...

```ts
// _rpxd/example/index.ts
const templateList = ["my-output.ts"]

export default templateList
```

With template...

```ts
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
```

Then running...

```bash
npx rpxd example todo name done:boolean
```

Will output...

```ts
// src/todos/output.ts
import { z } from "zod"

export const TodoSchema = z.object({
	name: z.coerce.string().min(1, "Name can't be blank"),
	done: z.preprocess((v) => ["on", "true", true].includes(v), z.boolean()),
})
```
