## 1. Verify spec against implementation

- [x] 1.1 Confirm the "Self-contained host contract" requirement: `AttributeRendererProps` in `apps/app-concepts/src/entities/attribute/model/types.ts` has only `schema`, `value`, `onChange?` and `onErrors?`, and neither `widgets/group-my-info/ui/PersonalDetails.tsx` nor `app/(tabs)/wallet/[section]/[document].tsx` creates or passes a validator. Verify by reading the files and running `grep -rn "useAjv\|resolveSchema\|\$ref\|definitions.schema" apps/app-concepts/src`, which must return nothing; fix any spec mismatch.
- [x] 1.2 Confirm the "Value that does not match its schema" scenario: temporarily add an unknown property (and, separately, a string for `age`) to `entities/group/api/mock/mock-my-group-personal-details.ts`, run `pnpm --filter app-concepts check-types`, check that it reports an error on that file, then revert the edit and verify with `git diff` that the file is unchanged.

## 2. Retire the ai-specs document

- [x] 2.1 Delete `ai-specs/ATTRIBUTES_RENDERER_SPEC.md`. Verify that `git status` shows it as deleted and that `grep -r ATTRIBUTES_RENDERER --exclude-dir=node_modules --exclude-dir=Pods .` returns no references outside `openspec/changes/`.

## 3. Validate

- [x] 3.1 Run `openspec validate adopt-attributes-renderer-spec --strict` and verify that it passes.
- [x] 3.2 Run `pnpm lint` and `pnpm check-types` and verify they report no errors caused by this change (it touches no code; note any pre-existing failures, such as the `sf-symbols-typescript` import, instead of fixing them). Lint passes. Check-types fails only on the existing `sf-symbols-typescript` import in `app-concepts/src/app/(tabs)/wallet/[section]/[document].tsx`.
