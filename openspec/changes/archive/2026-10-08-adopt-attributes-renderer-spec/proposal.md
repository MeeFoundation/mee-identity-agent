## Why

`ai-specs/ATTRIBUTES_RENDERER_SPEC.md` describes the refactor that turned `AttributeRenderer` from a JSON Schema renderer (`AnySchemaObject`, `$ref` definitions, an `ajv` prop and a `useAjv` hook) into a strictly typed form. The refactor is done, and the later `adopt-attribute-types-and-formats-spec` change already specs most of the result in `app-concepts/attributes`. Two guarantees from the refactor are still missing from that spec: what a host screen has to supply, and that a host's value is checked against its schema at compile time. Adding them lets the document be retired so that OpenSpec is the only source for the attribute form.

## What Changes

- Add a requirement to `app-concepts/attributes` for the host contract. The host passes a complete, self-contained schema, an initial value and optional change and error callbacks. It never supplies a validator, schema definitions or references to other schema documents.
- Change the "Inferred value shape" requirement to state that a value declared against a schema is checked at compile time, and add a scenario for that.
- Record in `design.md` where the old document no longer matches the code: errors are now shown in the form instead of going only to `console.error`, there are more types, and the "4 changes to add a type" recipe is replaced by the one in the archived attributes change.
- Delete `ai-specs/ATTRIBUTES_RENDERER_SPEC.md`.
- No runtime behavior changes. This change only documents the existing implementation.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `app-concepts/attributes`: adds the "Self-contained host contract" requirement and changes "Inferred value shape" so it also covers compile-time checking of host values.

## Impact

- Code: none. The spec describes `apps/app-concepts/src/entities/attribute/` and its two hosts as they are today: `widgets/group-my-info/ui/PersonalDetails.tsx` (group requested attributes) and `app/(tabs)/wallet/[section]/[document].tsx` (wallet document details).
- Docs: `ai-specs/ATTRIBUTES_RENDERER_SPEC.md` is removed.
- Out of scope: `entities/group/model/types.ts` still types `ShortGroup.schema` as AJV's `AnySchemaObject`, backed by `mock-group.schema.json`. That schema describes the group record, is never passed to the attribute form, and is not covered by the old document.
