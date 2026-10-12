export const en = {
  flow: {
    briefing: {
      close: 'Close',
      goal: 'Goal',
      goalReached: 'Goal reached',
      onThisScreen: 'On this screen',
      reachedCase: 'You reached the goal of this case.',
      reachedFlow: 'You reached the goal of this flow.',
      start: 'Start',
      startOver: 'Start over',
      tryCase: 'Try case {{code}}',
      yourGoal: 'Your goal',
    },
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
    expDemo001: {
      description:
        'Demo only: shows how an A/B test works when the variants differ by one component, the empty state card.',
      forms: {
        addMedication: 'Add medication',
      },
      title: 'A/B demo: empty state call to action',
      variants: {
        a: {
          description: 'The standard empty state card with a link-style action.',
          name: 'A · Control',
        },
        b: {
          description: 'A highlighted empty state card with an icon and a filled primary button.',
          name: 'B · Prominent call to action',
        },
      },
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
    expPet003: {
      description: 'Compares how Medical shows Ginger’s medication on the Info tab when you only need to check it.',
      info: {
        forms: 'Forms',
        medical: 'Medical',
      },
      medical: {
        medications: 'Medications',
        title: 'Medical',
      },
      medication: {
        add: 'Add medication',
        preview: '{{name}} · {{frequency}}',
      },
      title: 'Check current medication',
      variants: {
        a: {
          description: 'Info shows a Medical row; the medication is listed on the Medical screen.',
          name: 'Medical row',
        },
        b: {
          description: 'The Medical row also previews the medication’s name and frequency.',
          name: 'Medical row with preview',
        },
        c: {
          description: 'Info lists the medication in a Medical section, with no Medical screen.',
          name: 'Medical inline',
        },
      },
    },
    expPet004: {
      description: 'Compares how participants find and start changing an existing medication’s schedule.',
      editor: {
        context: '{{name}} · {{dose}}',
        doseLabel: '{{label}} ({{unit}})',
      },
      form: {
        close: 'Close',
      },
      info: {
        forms: 'Forms',
      },
      medical: {
        medications: 'Medications',
        title: 'Medical',
      },
      medication: {
        add: 'Add medication',
        changeSchedule: 'Change schedule',
        edit: 'Edit medication',
      },
      title: 'Update medication',
      updated: 'Medication updated',
      variants: {
        a: {
          description: 'Medical lists the medication; editing starts from its details.',
          name: 'Details, then edit',
        },
        b: {
          description: 'The medication on Medical also offers Edit medication, which opens the edit sheet.',
          name: 'Edit from the list',
        },
        c: {
          description: 'The medication on Medical also offers Change schedule, which edits the schedule in place.',
          name: 'Change schedule inline',
        },
      },
    },
    scPet001: {
      cases: {
        a: {
          goal: 'Create a pod for your cat Ginger using the Add Pod button.',
          hints: {
            home: 'Start a new pod from the Home screen.',
            newPod: 'Name the pod and create it.',
          },
          name: 'With the Add Pod button',
        },
        b: {
          goal: 'Ask Telli to create a pod for your new cat, Ginger.',
          hints: {
            home: 'Open Ask Telli from the bottom bar.',
            newPod: 'Check what Telli filled in, then create the pod.',
          },
          messages: {
            reply: 'Here’s a pod for Ginger. Check the details and create it.',
            user: '@Telli create new pet Ginger',
          },
          name: 'With Telli, one message',
        },
        c: {
          goal: 'Tell Telli about your new pet and let it help you create Ginger’s pod.',
          hints: {
            home: 'Open Ask Telli from the bottom bar.',
            newPod: 'Check what Telli filled in, then create the pod.',
          },
          messages: {
            firstReply: 'Congrats! What’s its name?',
            firstUser: '@Telli I have a new pet!',
            secondReply: 'What a beautiful name! Shall I create a pod for Ginger?',
            secondUser: 'It’s Ginger',
          },
          name: 'With Telli, a conversation',
        },
      },
      description: 'Create a pod for your cat by name, then add pet structure from a suggested template.',
      goal: 'Create a pod for your cat Ginger.',
      hints: {
        podEmpty: 'Take a look — the app may suggest something.',
        podTemplateSuggested: 'Decide whether to use the Pet template.',
        telli: 'Send the message, then use Telli’s card when you’re ready.',
      },
      home: {
        addPod: 'Add Pod',
        maybeLater: 'Maybe later',
        message:
          'A Pod is a private little room for any info — your kid, a trip, a project. Fill it with info, files, and notes and start collaborating. Every Pod you create or receive from others is automatically organized into Tellipod categories.',
        title: 'Create your first Pod',
        userInitial: 'A',
        welcome: 'Welcome, Alice',
      },
      newPod: {
        category: 'Category',
        chooseCategory: 'Choose category',
        create: 'Create Pod',
        created: 'Pod created',
        description:
          'A digital room for one part of your life. You’ll invite people and add things once this Pod is created.',
        name: 'Pod name',
        role: 'Your role in this Pod',
        suggestedByTelli: 'Suggested by Telli from your chat',
        title: 'New Pod',
      },
      pod: {
        addForm: 'Add form',
        attachments: 'Attachments',
        emptyMessage: 'Forms help you hold this pod’s information.',
        emptyTitle: 'You have no forms yet.',
        forms: 'Forms',
        members: 'Members',
        subpods: 'Subpods',
        tabs: {
          chat: 'Chat',
          info: 'Info',
          notes: 'Notes',
        },
      },
      suggestion: {
        notNow: 'Not now',
        useTemplate: 'Use template',
      },
      telli: {
        category: 'Category',
        createPod: 'Create pod',
        greeting: 'Hey! I am @Telli, tag me whenever you need help.',
        newPod: 'New pod',
        openPod: 'Open pod',
        placeholder: 'Write your message. Tag @Telli for help...',
        podCreated: 'Pod created',
        send: 'Send',
        sending: 'Sending…',
        sent: 'Sent',
        thinking: '@Telli is thinking',
        threadLabel: 'Conversation with Telli',
        title: 'Telli',
      },
      title: 'Create Ginger',
    },
  },
  home: {
    assignedVariant: 'Assigned variant (dev only): {{variant}}',
    catalogue: {
      baseFlow: 'Base flow',
      noFrame: 'No Figma frame',
      title: 'Flow catalogue (dev only)',
    },
    chooseCase: 'Choose a case:',
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
    catalog: {
      forms: {
        pet: 'Pet information',
      },
      suggestions: {
        pets: {
          message: 'Add a Pet template to keep medical, care and feeding information organized.',
          title: 'Is {{name}} a pet?',
        },
      },
      templates: {
        pets: {
          structure: 'Pet information',
        },
      },
    },
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
      home: {
        pods: 'Pods',
        userInitial: 'A',
        welcome: 'Welcome, Alice',
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
        started: 'Started {{date}}',
        summary: '{{dose}} · {{frequency}}',
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
    appTabBar: {
      home: 'Home',
      label: 'Main',
      navigation: 'Navigation',
      telli: 'Ask Telli',
    },
    bottomSheet: {
      close: 'Close',
    },
    categoryRow: {
      label: '{{label}}, {{count}}',
      labelWithPreview: '{{label}}, {{count}}, {{preview}}',
    },
    formCard: {
      edit: 'Edit {{field}}',
    },
    header: {
      back: 'Back',
    },
    inlineFieldEditor: {
      cancel: 'Cancel',
      save: 'Save',
    },
    podTopBar: {
      back: 'Back',
      menu: 'More options',
    },
  },
}
