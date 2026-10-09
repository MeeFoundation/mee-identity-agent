export const en = {
  flow: {
    chrome: {
      allFlows: 'Back to all flows',
      variant: 'Variant (dev only): {{variant}}',
    },
    completion: {
      allFlows: 'Back to all flows',
      body: 'You have completed "{{title}}".',
      restart: 'Start again',
      title: 'Flow complete',
    },
  },
  flows: {
    chatAddMedication: {
      chat: {
        addMedication: 'Add medication?',
        placeholder: 'Message Telli...',
        send: 'Send',
        sending: 'Sending…',
        sent: 'Sent',
        telliReply: 'Got it — I can add this to Ginger’s medications.',
        threadLabel: 'Conversation with Telli',
        typing: 'Telli is typing',
        userMessage: 'Ginger needs Clavamox twice a day',
      },
      description: 'Tell Telli about a medication in the pod chat and add it as a form in one tap.',
      title: 'Add medication from chat',
    },
    expPet002: {
      addForm: {
        description: {
          medication: 'A medication record everyone with access to this pod can see — dose, frequency, and schedule.',
        },
        save: 'Save',
        templateLabel: 'Form template',
        templates: {
          contactInfo: 'Contact Info',
          medication: 'Medication',
          pet: 'Pet',
          petCareAndFeeding: 'Pet Care & Feeding',
        },
        title: 'Add form',
      },
      aiSuggestion: {
        addMedication: 'Add medication',
        caption: 'AI Suggestion',
      },
      description: 'Compares adding a pet medication through manual entry points with a one-tap AI suggestion.',
      forms: {
        addForm: 'Add form',
      },
      medical: {
        addMedication: 'Add medication',
        emptyMessage: 'Medications help you track what {{name}} takes.',
        emptyTitle: 'No medications yet',
        sectionTitle: 'Medications',
        title: 'Medical',
      },
      title: 'Medication entry point',
      variants: {
        a: {
          description: 'Manual entry points: Add form and the Medical category.',
          name: 'Manual entry',
        },
        b: {
          description: 'Manual entry points plus a one-tap AI suggestion.',
          name: 'AI suggestion',
        },
      },
    },
  },
  home: {
    assignedVariant: 'Assigned variant (dev only): {{variant}}',
    catalogue: {
      baseFlow: 'Base flow',
      noFrame: 'No Figma frame',
      title: 'Flow catalogue (dev only)',
    },
    chooseVariant: 'Choose version:',
    newSession: 'Start new test session',
    sections: {
      experiments: 'Experiments',
      showcases: 'Showcases',
    },
    start: 'Start',
    title: 'UX Flows',
  },
  notFound: {
    backHome: 'Back to all flows',
    title: 'Page not found',
  },
  pods: {
    ginger: {
      categories: {
        attachments: 'Attachments',
        medical: 'Medical',
        members: 'Members',
        subpods: 'Subpods',
      },
      forms: {
        addContactInfo: 'Add contact info',
        createForm: 'Create form',
        emptyMessage: 'Forms help you hold this pod’s info.',
        emptyTitle: 'You have no forms yet',
        title: 'Forms',
      },
      medication: {
        fields: {
          activeIngredient: 'Medication / Active ingredient',
          brandName: 'Brand name',
          dose: 'Dose',
          doseForm: 'Dose form',
          frequency: 'Frequency',
          manufacturer: 'Manufacturer',
          startDate: 'Start date',
        },
        formTitle: 'Medication',
        frequency_one: 'Once per day',
        frequency_other: '{{count}} times per day',
      },
      notes: {
        placeholder:
          'add your notes here and explore more capabilities of the pod by adding forms and chatting with the Telli agent',
        toolbar: {
          alignLeft: 'Align left',
          alignRight: 'Align right',
          blockquote: 'Quote',
          bold: 'Bold',
          codeBlock: 'Code block',
          image: 'Insert image',
          indent: 'Indent',
          inlineCode: 'Inline code',
          italic: 'Italic',
          label: 'Formatting',
          link: 'Insert link',
          orderedList: 'Numbered list',
          outdent: 'Outdent',
          paragraph: 'Paragraph',
          strikethrough: 'Strikethrough',
          underline: 'Underline',
          unorderedList: 'Bulleted list',
        },
      },
      tabs: {
        chat: 'Chat',
        info: 'Info',
        notes: 'Notes',
      },
    },
  },
  ui: {
    bottomSheet: {
      close: 'Close',
    },
    categoryRow: {
      label: '{{label}}, {{count}}',
    },
    formCard: {
      edit: 'Edit {{field}}',
    },
    header: {
      back: 'Back',
    },
    podTopBar: {
      back: 'Back',
      menu: 'More options',
    },
  },
}
