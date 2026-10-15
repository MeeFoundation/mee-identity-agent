## MODIFIED Requirements

### Requirement: Pod chat with Telli
`chat` SHALL show Ginger's pod chat. In cases B and C it SHALL start with Alice's message "Thanks for looking after Ginger this week!". In cases A and D it SHALL start empty and show the chat empty state until the first message is sent. A message the participant sends SHALL be shown as theirs with the current time, and the composer SHALL be cleared.

After a short typing indicator, Telli SHALL answer:
- a message about feeding (mentioning feed, food, eat, meal, breakfast, dinner or "how much" as whole words, so "great" or "weather" don't count) with "Ginger eats twice a day, at 7am and 6pm: half a cup of dry food (Purina Pro Plan) plus a spoonful of wet food. It's in Care & Feeding.", where "Care & Feeding" is a link that opens `care-feeding`;
- any other message ending with "?" with "I couldn't find that in Ginger's pod.";
- nothing otherwise.

#### Scenario: Ask Telli
- **WHEN** a reviewer in case C sends "How much does Ginger eat at dinner?"
- **THEN** Telli answers with the feeding answer, and the run completes without a completion view

#### Scenario: Open Care & Feeding from Telli's answer
- **WHEN** a reviewer taps "Care & Feeding" in Telli's feeding answer
- **THEN** `care-feeding` is shown, and back returns to `chat`

#### Scenario: Unrelated question
- **WHEN** a reviewer in case C sends "Does Ginger like toys?"
- **THEN** Telli answers "I couldn't find that in Ginger's pod." and the run is not completed

#### Scenario: Owner's empty chat
- **WHEN** a reviewer in case A opens `chat`
- **THEN** the chat empty state "Be the first to write a message." is shown above the composer, with no messages

#### Scenario: First message in the owner's chat
- **WHEN** a reviewer in case A sends "Hello" from the empty chat
- **THEN** the empty state is replaced by the reviewer's message with the current time
