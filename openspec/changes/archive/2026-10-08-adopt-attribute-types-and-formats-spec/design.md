## Context

See proposal.md, "Why". The attribute form lives in `apps/app-concepts/src/entities/attribute/`:

```
model/types.ts                       AttributeSchema union, InferAttributeValue, ControlProps, AttributeRendererProps
model/utils.ts                       setNestedValue (immutable write at a path)
ui/AttributesRenderer.tsx            renderNode switch; owns values + errors state
ui/StringAttributeControl.tsx        text input, format → keyboard, AJV + ajv-formats + phone validator
ui/NumberAttributeControl.tsx        numeric text input, local text state, AJV min/max
ui/DateAttributeControl.tsx          @react-native-community/datetimepicker, iOS modal / Android dialog
ui/SelectAttributeControl.tsx        bottom-sheet single choice
ui/MultipleSelectAttributeControl.tsx bottom-sheet checkbox list
ui/ObjectAttributeControl.tsx        flat root or bordered labelled group
@x/group.ts                          type-only exports for entities/group
```

The public barrel exports only `AttributeRenderer`, `AttributeSchema`, `InferAttributeValue` and `ObjectAttributeSchema`. The one consumer today is the group requested-attributes flow, and its mock schema uses every supported type.

The old document is out of date in these places:

| Old document says | Code does |
|---|---|
| Types are `string` and `object` only | Also `number`, `date`, `select` and `multiple-select` |
| `onChange` reports a string, and the consumer converts it | `HandleChange` takes `unknown`. Each control reports its typed value: number, `YYYY-MM-DD` string or `string[]` |
| Controls keep no local value state | `NumberAttributeControl` keeps the raw text locally so it can show partial or invalid input. The picker controls keep a local `showPicker` flag |
| Every control validates with AJV | Only the string and number controls run AJV. `date`, `select` and `multiple-select` are app-specific types that AJV does not know, so they are not validated |

## Goals / Non-Goals

**Goals:**
- Write the current behavior down as a spec (`specs/app-concepts/attributes/**`).
- Keep the "how to add a type or format" recipe, corrected, in this design.

**Non-Goals:**
- Fixing the gaps listed under Risks. They need their own changes with MODIFIED requirements.
- Adopting `ai-specs/ATTRIBUTES_RENDERER_SPEC.md` or `ai-specs/APPS_SPLIT_SPEC.md`.
- Moving the attribute form into a shared package.

## Decisions

**1. Capability path `app-concepts/attributes`, with `ios` and `android` sub-specs for the date picker.**
The project rules scope specs per app and split platform differences into `ios` and `android` specs. Only the date picker differs by platform, so the sub-specs are small. The alternative was a single spec with per-platform scenarios. It was rejected because it breaks the project's spec-organization rule.

**2. The spec states behavior; the recipe goes in this design.**
The old document was mostly a developer recipe: file names, AJV instances and switch cases. Under the spec rules, those details are not behavior. The spec keeps what can be observed and tested: the supported types, the value shapes, validation timing, the error map and the i18n keys. It also keeps the compile-time guarantees that developers rely on. The recipe below keeps the practical guidance.

**3. Document current behavior, quirks included.**
This is an adoption, not a redesign. Where the code has an odd but deliberate behavior, the spec states it. For example, a number field that is cleared or holds non-numeric text keeps the last valid number. Behavior that looks unintended is listed under Risks rather than written into the spec.

### Recipe: adding a new attribute TYPE

1. `model/types.ts`
   - Define `XAttributeSchema = { type: 'x', ... }`.
   - Add it to the `AttributeSchema` union.
   - Add a branch to `InferAttributeValue` before the `ObjectAttributeSchema` branch. The object branch must stay last because it matches the widest set of schemas.
2. `ui/XAttributeControl.tsx`
   - Props: `ControlProps<XAttributeSchema> & { onChange: (value: <inferred type>) => void }`. This makes `onChange` required and gives it the right type.
   - Report the typed value through `props.onChange`. Do not convert values in the renderer.
   - If the type needs validation, debounce it by 500 ms with `useRef<ReturnType<typeof setTimeout>>(undefined)`. Call `props.onError?.(msg)` when the value is invalid, and `props.onError?.(undefined)` when it is valid or empty. Use a module-level `const ajv = new Ajv()` in the control file. Do not share the AJV instance with other controls. AJV can only validate standard JSON Schema types. A custom type, such as `date` or `select`, needs its own check or no validation.
   - Use `attribute_${path.join('.')}` as the i18n key prefix: `.label` falls back to `path.at(-1)`, and `.placeholder`, `.error` and `.options.*` apply as relevant.
   - Render with `TextInput.Root size="sm" invalid={!!props.error}`. Show `props.error` below the input in `text-danger text-xs`. For picker types, use the read-only `TouchableOpacity` + `TextInput.Input editable={false}` + `Modal` pattern from `SelectAttributeControl`.
3. `ui/AttributesRenderer.tsx`: import the control and add a `case 'x'` to `renderNode` that passes `error={errors[key]}`, `onChange`, `onError`, `path`, `schema` and `value={value as <type>}`.
4. i18n: add `attribute_<field>` keys to both `features/localization/config/resources/common.en.json` and `common.es.json`.
5. Spec: propose an OpenSpec change that ADDs the type to `app-concepts/attributes`, or MODIFIES the "Supported attribute types" requirement.

### Recipe: adding a new string FORMAT

1. `model/types.ts`: add the format to `StringAttributeSchema['format']`.
2. `ui/StringAttributeControl.tsx`:
   - Add an entry to `FORMAT_KEYBOARD_TYPE`. The map is typed as `Record<NonNullable<format>, KeyboardTypeOptions>`, so a missing entry fails type checking.
   - If the format is not built into `ajv-formats` (see `node_modules/ajv-formats/src/formats.ts`), register it with `ajv.addFormat('<name>', { type: 'string', validate })` after `addFormats(ajv)`. Without this, AJV throws on an unknown format.
3. i18n: add `.label`, `.error` and optionally `.placeholder` for each field that uses the format.
4. Spec: propose a change that MODIFIES the "String attributes and formats" requirement.

### After either recipe
Run `pnpm check-types`, `pnpm lint` and `pnpm steiger:concepts`.

## Risks / Trade-offs

- **[The recipe lives in an archived design and is hard to find]** → The spec Purpose and future changes point back to this change. If the team wants a durable developer guide, a follow-up can add a README next to `entities/attribute`.
- **[Date conversion uses UTC]** `toISODate` uses `toISOString()`, which converts to UTC. In timezones ahead of UTC it can store the previous day. `formatDisplayDate` parses `YYYY-MM-DD` as UTC midnight, so in timezones behind UTC it can display the previous day. The spec describes the intended calendar-date behavior, so the code currently breaks that requirement in those timezones → Propose a follow-up fix change.
- **[`required` is ignored]** `ObjectAttributeSchema.required` is accepted but never enforced or shown. The spec makes no promise about it → A follow-up change can add a requirement for it.
- **[The form ignores later `value` updates]** `AttributeRenderer` reads `props.value` only to set its initial state. The spec scopes this to "initial values at mount" → Documented; change only if a consumer needs controlled updates.
- **[A cleared number field keeps its old value]** The spec documents this as current behavior → Revisit when `required` is enforced.
- **[An unknown type logs with `console.error`]** This conflicts with the project rule against leftover console statements, but the log is intentional diagnostics and is not changed here.

## Migration Plan

This is documentation only. Delete `ai-specs/ADDING_ATTRIBUTE_TYPES_AND_FORMATS_SPEC.md` when the change is applied, and create the main specs under `openspec/specs/app-concepts/attributes/` when it is archived. To roll back, restore the file from git.
