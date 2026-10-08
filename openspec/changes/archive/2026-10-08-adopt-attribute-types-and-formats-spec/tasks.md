## 1. Verify spec against implementation

- [x] 1.1 Confirm that the supported types and value shapes in `specs/app-concepts/attributes/spec.md` match `apps/app-concepts/src/entities/attribute/model/types.ts`: the union members, the `InferAttributeValue` branches and the format union `email | phone`. Verify by reading the file and fixing any spec mismatch.
- [x] 1.2 Confirm the validation timing (500 ms debounce), the empty-clears-error behavior, the fallback messages (`Invalid value` and `Invalid number`) and the dot-path error map against `StringAttributeControl.tsx`, `NumberAttributeControl.tsx` and `AttributesRenderer.tsx`. Verify by reading the files and fixing any spec mismatch.
- [x] 1.3 Confirm that the i18n key contract (`attribute_<dot.path>.label|placeholder|error|options.<value>` and `common.done`) matches all controls and the key shapes in `common.en.json` and `common.es.json`. Verify with `grep -n "attribute_" apps/app-concepts/src/features/localization/config/resources/common.*.json`.
- [x] 1.4 Confirm that the iOS and Android date picker behavior in `specs/app-concepts/attributes/{ios,android}/spec.md` matches `DateAttributeControl.tsx`. Verify by reading the file.

## 2. Retire the ai-specs document

- [x] 2.1 Delete `ai-specs/ADDING_ATTRIBUTE_TYPES_AND_FORMATS_SPEC.md`. Verify that `git status` shows it as deleted and that `grep -r ADDING_ATTRIBUTE_TYPES --exclude-dir=node_modules --exclude-dir=Pods .` returns no references outside `openspec/changes/`.

## 3. Validate

- [x] 3.1 Run `openspec validate adopt-attribute-types-and-formats-spec --strict` and verify that it passes.
- [x] 3.2 Run `pnpm lint` and verify that it passes. Run `pnpm check-types` and verify that it reports no errors related to this change. Lint passes. Check-types fails only on an existing, unrelated error: `app-concepts/src/app/(tabs)/wallet/[section]/[document].tsx` imports `sf-symbols-typescript`, which is not installed. This change does not touch code.
