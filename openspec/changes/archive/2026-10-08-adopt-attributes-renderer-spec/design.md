## Context

See proposal.md, "Why". The refactor in `ai-specs/ATTRIBUTES_RENDERER_SPEC.md` is complete:

- `model/types.ts` defines a closed `AttributeSchema` union, `InferAttributeValue`, `ControlProps` and `AttributeRendererProps`. `ui/AttributeRenderer.types.ts` is gone.
- `useAjv`, `attributeDefinitionsAtom`, `getAttributeDefinitions`, `definitions.schema.json` and `resolveSchema` are gone. A search of `apps/app-concepts/src` finds no `$ref`, `useAjv` or `resolveSchema`.
- `AttributeRenderer` recurses through `renderNode`, and `ObjectAttributeControl` receives a `renderProperty` callback. Controls derive their name from `path.at(-1)` and root status from `path.length === 0`.
- The group mock data is typed TS: `mock-requested-attributes-schema.ts` (`satisfies ObjectAttributeSchema`) and `mock-my-group-personal-details.ts` (typed with `InferAttributeValue<typeof mockRequestedAttributesSchema>`). `getGroupRequestedAttributesSchema` returns `Promise<ObjectAttributeSchema>`.
- Hosts pass no validator: `PersonalDetails.tsx` passes `schema`, `value` and `onErrors`, and the wallet `[document].tsx` screen passes `schema`, `value`, `onChange` and `onErrors`.

Where the code has moved on from the old document:

| Old document says | Code does (already specced in `app-concepts/attributes`) |
|---|---|
| Types are `string` and `object` | Also `number`, `date`, `select` and `multiple-select` |
| `renderNode` validates every node with one module-level AJV and logs failures with `console.error`; no error UI | `renderNode` does not validate. The string and number controls validate after a 500 ms debounce with their own AJV instance, show the error under the field, and the form reports an aggregated error map through `onErrors` |
| `AttributeRendererProps` is `{ schema, value }` | Also optional `onChange` and `onErrors`; the form keeps its own value and error state |
| `ControlProps` is `{ schema, value, path, renderProperty? }` | Also `error`, `onChange` and `onError` |
| Mock schema has `display_name`, `email`, names, `status` and a six-field address | Uses every supported type, adds `phone`, drops `status`, and has a three-field address |
| "4 changes to add a type" | Superseded by the recipe in `archive/2026-10-08-adopt-attribute-types-and-formats-spec/design.md` (types, control, renderer case, i18n, spec) |
| One host (`PersonalDetails`) | Two hosts: also the wallet document details screen |

## Goals / Non-Goals

**Goals:**
- Capture the two refactor guarantees that are missing from `app-concepts/attributes`: the self-contained host contract, and compile-time checking of values against schemas.
- Retire the old document.

**Non-Goals:**
- Restating the requirements that already exist (closed type union, inference, unknown types at runtime, object grouping, validation and errors).
- Retyping `ShortGroup.schema` (`AnySchemaObject`) in `entities/group`. It is a separate group-record schema and never reaches the form.
- Any code change.

## Decisions

**1. Modify the existing capability; don't create a new one.**
The old document and the existing spec describe the same component. A separate `app-concepts/attribute-renderer` capability would split one form's contract across two specs. The alternative of adding nothing was rejected: the host contract (no validator, no `$ref`) was the refactor's main goal, and nothing else records it.

**2. Add a new requirement for the host contract; extend "Inferred value shape" for compile-time checking.**
The host contract is a new concern, so it is ADDED. Compile-time checking of values belongs to the existing inference requirement, so that requirement is MODIFIED. The delta carries the full text and keeps the original scenario.

**3. Leave out the implementation shape.**
`renderNode`, `renderProperty`, module-level AJV and deriving names from `path` are internal. If they change, a host sees no difference, so they stay in this design and out of the spec.

## Risks / Trade-offs

- **[Compile-time checking is only as narrow as the schema type]** `getGroupRequestedAttributesSchema` returns the wide `ObjectAttributeSchema`, so in `PersonalDetails` the form's `value` prop is checked only against a generic object shape. The precise check happens where the mock value is declared. The wallet screen casts its value with `as InferAttributeValue<TSchema>`, which skips the check → The spec states the check against the *type* of the schema passed. A follow-up can make the API and atom generic over the schema type if hosts need the stronger check.
- **[`console.error` for unknown types]** The `default` branch of `renderNode` still logs, as the old document specified. This conflicts with the project rule against leftover console statements → Already noted in the archived attributes change, and not changed here.

## Migration Plan

Documentation only. Delete `ai-specs/ATTRIBUTES_RENDERER_SPEC.md` when the change is applied. On archive, the delta merges into `openspec/specs/app-concepts/attributes/spec.md`. To roll back, restore the file from git.
