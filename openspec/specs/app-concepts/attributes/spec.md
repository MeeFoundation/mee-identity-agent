# app-concepts/attributes Specification

## Purpose

Renders a typed attribute schema in app-concepts as an editable form. The form collects values for each attribute, validates the ones that have rules, and reports both the values and any validation errors to the screen that hosts it.

## Requirements

### Requirement: Supported attribute types
The attribute form SHALL support exactly these attribute types: `string`, `number`, `date`, `select`, `multiple-select` and `object`. A schema that uses any other type SHALL be rejected at compile time. If an unknown type still reaches the form at runtime, the form SHALL render nothing for that node and SHALL keep rendering its sibling attributes.

#### Scenario: Schema with all supported types renders
- **WHEN** the form receives an object schema whose properties use `string`, `number`, `date`, `select`, `multiple-select` and nested `object` types
- **THEN** each property renders as the input for its type

#### Scenario: Unsupported type in a schema const
- **WHEN** a developer declares an attribute with a type outside the supported set, such as `boolean`
- **THEN** `pnpm check-types` fails for that schema

#### Scenario: Unknown type at runtime
- **WHEN** a schema node has a type the form does not recognize at runtime
- **THEN** that node renders nothing and the other attributes still render

### Requirement: Inferred value shape
The value type of a schema SHALL be inferred from the schema itself: `string`, `date` and `select` give a string, `number` gives a number, `multiple-select` gives an array of strings, and `object` gives an object of optional properties, each inferred recursively. A value declared with the type inferred from a schema SHALL be checked against that schema at compile time. The `value` passed to the form SHALL be checked against the value type inferred from the type of the `schema` passed with it.

#### Scenario: Inferred value type for a schema const
- **WHEN** a schema declares `age: { type: 'number' }`, `interests: { type: 'multiple-select', options: [...] }` and `address: { type: 'object', properties: { street: { type: 'string' } } }`
- **THEN** the inferred value type is `{ age?: number; interests?: string[]; address?: { street?: string } }`

#### Scenario: Value that does not match its schema
- **WHEN** a value typed against a schema uses a property name the schema does not declare, or gives a property a value of the wrong type, such as a string for a `number` attribute
- **THEN** `pnpm check-types` fails for that value

### Requirement: Object attributes group their properties
The form SHALL render the properties of an object attribute in schema declaration order. The root object SHALL render its properties as a flat list with no label or border. A nested object SHALL render its properties inside a bordered group with the object's localized label.

#### Scenario: Root object renders flat
- **WHEN** the form renders the root object schema
- **THEN** its properties appear as a flat list with no surrounding group label

#### Scenario: Nested object renders as labelled group
- **WHEN** the schema has a nested object property `address`
- **THEN** the properties of `address` appear inside a bordered group labelled with the `address` label

### Requirement: Values are reported on every change
The form SHALL report the complete updated value tree to the host every time any attribute changes. A nested value SHALL be written at its property path and SHALL leave the other values unchanged. The form SHALL take its initial values from the `value` provided when it is mounted.

#### Scenario: Editing a nested field
- **WHEN** the user types `Main St` into `address.address_street`
- **THEN** the host receives a value tree in which `address.address_street` is `Main St` and all other values are unchanged

#### Scenario: Initial values are shown
- **WHEN** the form mounts with `{ first_name: 'Ann' }`
- **THEN** the `first_name` input shows `Ann`

### Requirement: String attributes and formats
A `string` attribute SHALL render a text input. It SHALL report the entered text on every keystroke. The string attribute MAY declare a `format` of `email` or `phone`. A format SHALL pick the keyboard and the validation rule:

| Format | Keyboard | Valid when |
|---|---|---|
| none | default | always |
| `email` | email keyboard | the text is a well-formed email address |
| `phone` | phone pad | the text is a valid international phone number |

Every declared format SHALL have both a keyboard mapping and a validation rule. If a format is declared without a keyboard mapping, `pnpm check-types` SHALL fail.

#### Scenario: Format without keyboard mapping
- **WHEN** a developer adds `url` to the allowed formats but does not add a keyboard mapping for it
- **THEN** `pnpm check-types` fails

#### Scenario: Email format uses email keyboard
- **WHEN** a string attribute declares `format: 'email'` and the user focuses it
- **THEN** the email keyboard is shown

#### Scenario: Invalid phone number
- **WHEN** the user enters `123` into a string attribute with `format: 'phone'` and stops typing
- **THEN** the field shows its localized phone error message

### Requirement: Number attributes
A `number` attribute SHALL render a text input with a numeric keyboard. It MAY declare an inclusive `minimum` and `maximum`. When the entered text parses as a number, the form SHALL report that number. When the text is empty or is not a number, the form SHALL NOT report a new value, and the last reported number stays in the value tree. Text that is not a number, or a number outside the declared bounds, SHALL produce a validation error.

#### Scenario: Valid number is reported as a number
- **WHEN** the user types `42` into `age`, whose bounds are 0 to 150
- **THEN** the host receives `age` as the number `42` and no error is shown

#### Scenario: Out-of-range number
- **WHEN** the user types `200` into `age`, whose bounds are 0 to 150, and stops typing
- **THEN** the field shows its localized error message

#### Scenario: Non-numeric text
- **WHEN** the user types `abc` into a number attribute and stops typing
- **THEN** no new value is reported and the field shows its error message

### Requirement: Date attributes
A `date` attribute SHALL render a read-only field that opens a native date picker when tapped. Picking a date SHALL report it as a `YYYY-MM-DD` string. The field SHALL display the stored date in the device locale's date format. Date attributes SHALL NOT be validated.

#### Scenario: Picking a date
- **WHEN** the user taps `date_of_birth` and picks 1 March 1990
- **THEN** the host receives `date_of_birth` as `1990-03-01` and the field shows that date in the device's locale format

### Requirement: Select attributes
A `select` attribute SHALL declare a list of option values. It SHALL render a read-only field that opens a bottom sheet listing the options. Selecting an option SHALL report that option value, mark it as selected and close the sheet. The sheet SHALL also close when the user taps Done or taps outside the sheet.

#### Scenario: Choosing an option
- **WHEN** the user opens `preferred_language` and taps `spanish`
- **THEN** the host receives `preferred_language` as `spanish`, the sheet closes and the field shows the localized label for `spanish`

### Requirement: Multiple-select attributes
A `multiple-select` attribute SHALL declare a list of option values. It SHALL render a read-only field that opens a bottom sheet with a checkbox for each option. Tapping an option SHALL toggle it and SHALL report the updated array, with new selections appended in the order they were tapped. The sheet SHALL stay open until the user taps Done or taps outside it. The field SHALL show the localized labels of the selected options joined by `, `.

#### Scenario: Toggling options
- **WHEN** the user opens `interests`, taps `music`, then `travel`, then `music` again
- **THEN** the host receives `['music']`, then `['music', 'travel']`, then `['travel']`, and the sheet stays open

### Requirement: Debounced validation and error reporting
Validation for `string` and `number` attributes SHALL run 500 ms after the user's last keystroke. An empty field SHALL clear its error. A valid value SHALL clear its error. An invalid value SHALL set a localized error message, which is shown below the field, and the field SHALL be styled as invalid. The form SHALL collect all current errors into a map keyed by dot-separated property path, such as `address.address_street`. It SHALL report this map to the host every time the map changes.

#### Scenario: Error reported after typing stops
- **WHEN** the user types `foo` into `email` and makes no further input for 500 ms
- **THEN** the field shows its email error and the host receives `{ email: '<localized email error>' }`

#### Scenario: Error clears when the field is emptied
- **WHEN** the `email` field shows an error and the user clears the field
- **THEN** after the debounce the error disappears and `email` is removed from the reported error map

#### Scenario: No validation while typing
- **WHEN** the user is typing continuously, with less than 500 ms between keystrokes
- **THEN** no validation error is shown or reported for that field until typing stops

### Requirement: Localized attribute text
All attribute text SHALL be looked up from i18n keys under `attribute_<dot.path>`. When a key is missing, the fallback SHALL be used. Every `attribute_*` key in the English resource SHALL also exist in the Spanish resource.

| Key | Used for | Fallback |
|---|---|---|
| `.label` | label for any attribute, including object groups | last segment of the property path |
| `.placeholder` | placeholder for string and number inputs | empty |
| `.error` | validation message for string and number attributes | `Invalid value` (string) or `Invalid number` (number) |
| `.options.<value>` | display label of a select or multiple-select option | the raw option value |

The bottom sheet's close action SHALL use the `common.done` key, with `Done` as the fallback. Neither locale file defines `common.done` yet, so both languages show the fallback.

#### Scenario: Label falls back to field name
- **WHEN** an attribute `nickname` has no `attribute_nickname.label` translation
- **THEN** its label reads `nickname`

#### Scenario: Nested key path
- **WHEN** the attribute `address.address_street` is rendered
- **THEN** its label is read from `attribute_address.address_street.label`

#### Scenario: Option label translated
- **WHEN** `preferred_language` has option `french` and `attribute_preferred_language.options.french` is `French`
- **THEN** the option is listed as `French`, and `french` is the reported value

### Requirement: Self-contained host contract
A host screen SHALL render the attribute form by supplying only a schema, an initial value and, optionally, a change callback and an error callback. The schema SHALL be complete in itself: every nested attribute is declared inline, with no references to other schema documents or shared definitions. The host SHALL NOT supply a validator, validator instance, schema definitions or a resolver. All validation the form performs SHALL run inside the form.

#### Scenario: Host renders the form with schema and value only
- **WHEN** a host renders the form with a schema and an initial value and no callbacks
- **THEN** the form renders every attribute in the schema and validates the attributes that have rules

#### Scenario: Host has no validator dependency
- **WHEN** a developer inspects a host that renders the attribute form
- **THEN** it does not create, import or pass a validator or schema definitions in order to render the form

#### Scenario: Nested attributes declared inline
- **WHEN** a schema needs a nested group of attributes, such as an address
- **THEN** the group is declared inline as a nested `object` attribute rather than referenced from another document
