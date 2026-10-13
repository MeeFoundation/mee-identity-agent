## ADDED Requirements

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

## MODIFIED Requirements

### Requirement: Inferred value shape
The value type of a schema SHALL be inferred from the schema itself: `string`, `date` and `select` give a string, `number` gives a number, `multiple-select` gives an array of strings, and `object` gives an object of optional properties, each inferred recursively. A value declared with the type inferred from a schema SHALL be checked against that schema at compile time. The `value` passed to the form SHALL be checked against the value type inferred from the type of the `schema` passed with it.

#### Scenario: Inferred value type for a schema const
- **WHEN** a schema declares `age: { type: 'number' }`, `interests: { type: 'multiple-select', options: [...] }` and `address: { type: 'object', properties: { street: { type: 'string' } } }`
- **THEN** the inferred value type is `{ age?: number; interests?: string[]; address?: { street?: string } }`

#### Scenario: Value that does not match its schema
- **WHEN** a value typed against a schema uses a property name the schema does not declare, or gives a property a value of the wrong type, such as a string for a `number` attribute
- **THEN** `pnpm check-types` fails for that value
