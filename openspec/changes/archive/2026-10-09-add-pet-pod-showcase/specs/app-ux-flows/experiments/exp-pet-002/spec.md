## MODIFIED Requirements

### Requirement: Pod fixture and server-provided medication record
A run SHALL start from a pod fixture and a medication record. The pod fixture is the pet pod "Ginger": avatar photo, breadcrumb "Pets", and one member. The breadcrumb names only the `podcat:Pets` category, because Ginger is itself a Pets pod; Care & Feeding and Medical are sub-pods of Ginger, not its parents. The medication record stands for data that already exists on the server and is passed into the flow. Its shape SHALL follow the Tellipod Pets ontology's `pets:Medication`:
- one or more active ingredients, each an ontology term with IRI and label (ChEBI),
- an optional brand name,
- an optional manufacturer,
- a dosage amount: a decimal value plus an optional unit term with IRI, label and symbol (CCO),
- an optional dose form term with IRI and label (DrOn),
- a frequency per day, as free text,
- an optional start date.

The code that starts a run SHALL be able to supply a different record through the flow's initial state. When none is supplied, the record SHALL be:
- active ingredient Amoxicillin (`CHEBI:2676`),
- brand name Clavamox,
- manufacturer Zoetis,
- dose 62.5 mg,
- dose form Tablet (`DRON:00000022`),
- frequency `2`,
- start date 2026-10-06.

At run start the Medication form SHALL NOT yet be added to the pod. No screen SHALL fetch data.

#### Scenario: Default record
- **WHEN** a run starts without a supplied medication record and the participant adds the Medication form
- **THEN** the form shows Amoxicillin, Clavamox, Zoetis, 62.5 mg, Tablet, 2 times per day and Oct 6, 2026

#### Scenario: Supplied record
- **WHEN** a run starts with a supplied record whose brand name is "Baytril" and the participant adds the Medication form
- **THEN** the form shows "Baytril" as the brand name

#### Scenario: Ginger breadcrumb
- **WHEN** a participant opens `ginger-notes`
- **THEN** the pod top bar's breadcrumb reads "Pets" and nothing after it
