## Why

The rules for adding attribute types and string formats in app-concepts are written up in `ai-specs/ADDING_ATTRIBUTE_TYPES_AND_FORMATS_SPEC.md`, which sits outside OpenSpec and no longer matches the code. That document lists only `string` and `object` types and says every control reports string values. The code now also supports `number`, `date`, `select` and `multiple-select`, and controls report typed values. Moving the document into OpenSpec gives the attribute form one authoritative spec, written from what the code does today. Later attribute changes can then be proposed as deltas against it.

## What Changes

- Add a baseline capability spec for the app-concepts attribute form. It covers the supported attribute types and string formats, how values are reported, validation and error reporting, and the i18n key contract.
- Move the developer recipes for adding a new type or a new string format into `design.md`. Correct them to match the current code: typed `onChange` values, the number control's local text state, and that the picker-based controls do not run AJV.
- Delete `ai-specs/ADDING_ATTRIBUTE_TYPES_AND_FORMATS_SPEC.md` once its content is captured in OpenSpec.
- No runtime behavior changes. This change only documents the existing implementation.

## Capabilities

### New Capabilities
- `app-concepts/attributes`: Schema-driven attribute form in app-concepts. It covers the supported types (`string`, `number`, `date`, `select`, `multiple-select`, `object`), the string formats (`email`, `phone`), value reporting, debounced validation, aggregated errors and localized labels, placeholders, errors and options.
- `app-concepts/attributes/ios`: How the date picker is presented on iOS (bottom sheet with a spinner and a Done action).
- `app-concepts/attributes/android`: How the date picker is presented on Android (system dialog).

### Modified Capabilities
<!-- None: openspec/specs/ is empty. -->

## Impact

- Code: none. The spec describes `apps/app-concepts/src/entities/attribute/` as it is today.
- Docs: `ai-specs/ADDING_ATTRIBUTE_TYPES_AND_FORMATS_SPEC.md` is removed. `ai-specs/ATTRIBUTES_RENDERER_SPEC.md`, the earlier refactor spec, is out of scope and stays in place.
- Consumers: the group requested-attributes flow (`entities/group`) uses `AttributeRenderer` and is covered by the new spec, but is not changed.
