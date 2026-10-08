import type { Flow } from '../model'

export const exampleFlow: Flow = {
  createInitialData: () => ({ favoriteColor: '', name: '' }),
  id: 'example',
  screens: [
    {
      blocks: [
        { component: 'text', id: 'intro', props: { textKey: 'flows.example.intro' } },
        { component: 'text-input', id: 'name', props: { field: 'name', labelKey: 'flows.example.nameLabel' } },
        {
          component: 'continue-button',
          id: 'continue',
          props: { labelKey: 'flows.example.continue', requiredFields: ['name'] },
        },
      ],
      id: 'name',
    },
    {
      blocks: [
        { component: 'text', id: 'greeting', props: { textKey: 'flows.example.greeting' } },
        {
          component: 'text-input',
          id: 'color',
          props: { field: 'favoriteColor', labelKey: 'flows.example.colorLabel' },
        },
        {
          component: 'continue-button',
          id: 'continue',
          props: { labelKey: 'flows.example.continue', requiredFields: ['favoriteColor'] },
        },
      ],
      id: 'color',
    },
    {
      blocks: [
        { component: 'text', id: 'summary', props: { textKey: 'flows.example.summary' } },
        { component: 'continue-button', id: 'finish', props: { labelKey: 'flows.example.finish' } },
      ],
      id: 'summary',
    },
  ],
  titleKey: 'flows.example.title',
}
