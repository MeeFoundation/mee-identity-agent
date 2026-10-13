export const en = {
  flow: {
    briefing: {
      close: 'Close',
      goal: 'Goal',
      goalReached: 'Goal reached',
      onThisScreen: 'On this screen',
      openQuestions: 'Open questions',
      reachedCase: 'You reached the goal of this case.',
      reachedFlow: 'You reached the goal of this flow.',
      start: 'Start',
      startOver: 'Start over',
      thisCase: 'This case',
      thisFlow: 'This flow',
      thisScreen: 'This screen',
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
    expPet005: {
      description: 'Compares where participants find and record a scheduled medication dose.',
      details: {
        recent: 'Recent doses',
        seeAll: 'See all',
      },
      info: {
        forms: 'Forms',
      },
      title: 'Give medication',
      today: 'Today',
      variants: {
        a: {
          description: 'The due dose is shown on Medical and the medication’s details only.',
          name: 'From Medical',
        },
        b: {
          description: 'Ginger’s pod also shows the due dose under its top bar, on Notes and Info.',
          name: 'On Ginger’s pod',
        },
        c: {
          description: 'Home also shows the due dose in a Today section above the pods.',
          name: 'On Home',
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
        podNotes: 'Look around the pod — a dot shows where something is waiting.',
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
    scPet002: {
      cases: {
        a: {
          description: 'Ginger’s morning Apoquel was due three hours ago and nobody has given it.',
          goal: 'Ginger’s morning Apoquel is overdue. Give it to her now and record it.',
          name: 'Overdue dose',
          questions: {
            skip: 'After how long should an overdue dose be skipped rather than given late?',
          },
        },
        b: {
          description: 'You marked Ginger’s Apoquel as given a few minutes ago, but she didn’t take it.',
          goal: 'You marked Ginger’s Apoquel as given by mistake. Undo it.',
          hints: {
            medical: 'A given dose can be reverted from its card.',
          },
          name: 'Undo a dose',
          questions: {
            limit: 'Should undo be limited in time, or to the member who gave the dose?',
          },
        },
      },
      description:
        'Shows the less common states of Ginger’s scheduled dose: giving one that is overdue, and undoing one marked as given by mistake.',
      hints: {
        doseHistory: 'Check which doses are recorded.',
        giveDose: 'Confirm the dose, or cancel.',
        medical: 'Ginger’s scheduled dose is at the top of Medical.',
        undoDose: 'Confirm that the dose was not given, or keep it.',
      },
      questions: {
        whoCanUndo: 'Should Sam be told when a dose is undone?',
      },
      screens: {
        doseHistory: {
          about: 'An undone dose leaves no entry in the history.',
        },
        giveDose: {
          about: 'The same confirmation as EXP-PET-005; an overdue dose names its scheduled time instead of “now”.',
        },
        medical: {
          about: 'Ginger’s Medical screen, with the scheduled dose overdue or given.',
          questions: {
            overdueTone: 'Is the overdue treatment urgent enough without being alarming?',
          },
        },
        undoDose: {
          about: 'Reverting asks for confirmation, so a tap on Undo is never itself the mistake.',
          questions: {
            confirm: 'Would an immediate Undo in the toast be better than a confirmation?',
          },
        },
      },
      title: 'Medication doses',
    },
    scPpl001: {
      cases: {
        a: {
          description: "Sofia's Contact info is empty, so every recognised line is new.",
          goal: "Add Sofia's email to her notes, then tidy the notes into her Contact info.",
          name: 'New contact',
        },
        b: {
          description:
            "The note already links to Sofia's Contact info. A new line is added to that contact and disappears from the note.",
          goal: 'Add a line "Sofia email: …" to her notes, then tidy it into her Contact info.',
          name: 'Update through the link',
          questions: {
            nameNeeded:
              'Does a line need Sofia\'s name ("Sofia email: …") to be added to her contact? What about "email: …" alone?',
          },
          screens: {
            notesTidied: {
              about: 'The new line was added to the existing link, which lights up briefly.',
              questions: {
                lightUp: 'Do we need the link to light up?',
                wentIntoLink: 'When the line disappears, is it clear that it went into "Sofia Walker"?',
              },
            },
            tidyConfirm: {
              questions: {
                newOrSaved: 'Is it clear which details are new and which Sofia already had?',
              },
            },
          },
        },
        c: {
          description: 'Nothing in the note is recognised, so nothing is highlighted and Tidy is never offered.',
          goal: "Add something about Sofia's hobbies to her notes.",
          name: 'Nothing to tidy',
          questions: {
            nothingHappens: 'Is it fine that nothing at all happens here?',
          },
        },
      },
      description:
        "Write about Sofia in her pod's notes, and let Tidy turn the details it recognises into her Contact info.",
      hints: {
        contactInfo: "This is Sofia's Contact info. Use the Notes tab to go back to her notes.",
        notes: 'Type in the note, then pause for a moment and watch the lines you wrote.',
        notesTidied: 'The tidied lines now live in Contact info. Try the link.',
        tidyConfirm: 'Check what Contact info will hold, then confirm.',
      },
      pod: {
        avatar: 'S',
        breadcrumb: {
          immediateFamily: 'Immediate Family',
          people: 'People',
        },
        title: 'About Sofia',
      },
      questions: {
        existingContact:
          'How do we add new information to a contact that already exists, through notes? Case B shows one answer.',
        reversible: "Should Tidy be reversible? Right now it can't be undone.",
        whenAnalysed: 'Should notes be analysed while typing, or only once a line is finished?',
      },
      screens: {
        contactInfo: {
          about: "Sofia's Contact info, the single place these details live. The note only links to it.",
          questions: {
            source: 'Should Contact info show where each value came from?',
          },
        },
        notes: {
          about:
            "Sofia's notes. After a short pause in typing, lines that look like contact details are highlighted and Tidy is offered.",
          questions: {
            colours: 'Is it clear what the yellow and blue highlights mean?',
            dismiss: "Can a suggestion be dismissed? Right now it can't.",
            pause: 'Is a 1.5-second pause right before suggestions appear?',
          },
        },
        notesTidied: {
          about: 'The recognised lines have moved into Contact info, and the link leads there.',
          questions: {
            linkTarget: 'Is it obvious that the link opens Contact info?',
            moved: 'Is it clear that the lines were moved, not deleted?',
          },
        },
        tidyConfirm: {
          about:
            'Shows the Contact info that tidying will produce. "NEW" marks values that come from the note, and any value can be changed before tidying.',
          questions: {
            confirmLabel: 'Is "Tidy notes" clear as the confirm action?',
            conflict:
              'What should happen when a recognised value conflicts with a saved one, such as another date of birth? Right now the note wins.',
            editable: 'Is it clear that the details can be changed here before tidying?',
          },
        },
      },
      tidy: {
        confirm: 'Tidy notes',
        descriptionUpdate:
          "The new details are added to what {{name}}'s Contact info already holds. You can change any of them first.",
        new: 'NEW',
        titleCreate: 'Convert the selected notes to Contact info?',
        titleUpdate: "Add to {{name}}'s Contact info?",
      },
      title: "Tidy Sofia's notes",
    },
    scPpl002: {
      cases: {
        a: {
          description: 'Nobody else is in the pod yet.',
          goal: "Invite Geo to Sofia's pod and send them the link.",
          name: 'Invite',
        },
        b: {
          description: "Geo was invited two days ago and hasn't joined.",
          goal: "Geo hasn't joined yet. Take back their invite.",
          name: 'Revoke an invite',
          questions: {
            expire: 'Should an unused invite expire on its own, and should the owner see that?',
          },
        },
        c: {
          description: 'Geo joined three weeks ago and can view the pod.',
          goal: "Geo shouldn't see Sofia's pod anymore. Remove them.",
          name: 'Remove a member',
        },
      },
      description:
        "Invite someone to Sofia's pod with a one-time link, take back an invite that is still pending, or remove someone who already joined.",
      hints: {
        info: 'Sharing starts from Members.',
        inviteDetail: 'This invite has not been used yet.',
        inviteName: 'Type a name and create the link.',
        inviteShare: 'Pick any app to send the link.',
        memberDetail: 'This is what the member can do in the pod.',
        members: 'Everyone in the pod, and everyone invited.',
        removeConfirm: 'Removing someone cannot be undone.',
      },
      info: {
        suggestions_one: '{{count}} suggestion',
        suggestions_other: '{{count}} suggestions',
      },
      inviteDetail: {
        dates: 'Sent {{sent}} · Expires {{expires}}',
        explanation: "Revoking stops the link from working right away. {{name}} isn't told.",
        revoke: 'Revoke invite',
        sendAgain: 'Send link again',
        title: "{{name}}'s invite",
      },
      inviteName: {
        create: 'Create invite link',
        description: 'Once they join, they can see everything in it and use its chat.',
        help: "Just a name so you can keep track — you'll send them a link next.",
        label: 'Who are you inviting?',
        title: 'Add a member to <bold>{{pod}}</bold>',
      },
      memberDetail: {
        canDo: {
          chat: 'Read and write in the chat',
          title: 'What they can do',
          view: 'See notes and info',
        },
        joined: 'Joined',
        remove: 'Remove from pod',
      },
      members: {
        invite: 'Invite member',
        pendingInvites: 'Pending invites',
      },
      pod: {
        avatar: 'S',
        members: 'Members',
        suggestCategory: 'Suggest category',
        title: 'About Sofia',
      },
      questions: {
        telliCount: "Should Telli count as a member? Right now it doesn't, but pending invites do.",
        viewOnly:
          'People who join can only view the pod and use its chat. Is that clear to the person sending the invite?',
      },
      removeConfirm: {
        cancel: 'Cancel',
        confirm: 'Remove {{name}}',
        messagesStay: 'Their messages stay in the chat.',
        noAccess: "{{name}} can't open the pod anymore.",
        title: 'Remove {{name}} from <bold>{{pod}}</bold>?',
      },
      screens: {
        info: {
          about: "Sofia's pod as its owner sees it. Members is where sharing starts.",
        },
        inviteDetail: {
          about:
            'No design. A pending invite can be sent again or revoked. Revoking is instant and can be undone from the toast.',
          questions: {
            newLink: 'Should "Send link again" make a new link and stop the old one? Right now it reuses it.',
            tellInvitee: 'Should the invitee be told the invite was revoked?',
          },
        },
        inviteName: {
          about: "The name is only for the owner's own list. Nothing is sent yet.",
        },
        inviteShare: {
          about: 'The link is created now and can be used once. Picking any app counts as sending it.',
          questions: {
            closedWithoutSending:
              'If the sheet is closed without sending, should the invite stay pending? Right now it does.',
            tone: 'Is "the key to your pod" the right tone?',
          },
        },
        memberDetail: {
          about: 'No design. What the member can do in the pod, and how to remove them.',
          questions: {
            changeAccess: 'Should the owner be able to change what a member can do?',
          },
        },
        members: {
          about: "Who is in the pod, and who was invited but hasn't joined yet.",
          questions: {
            pendingLabel: 'Is "Pending for N days" useful, or should it show when the invite expires?',
          },
        },
        removeConfirm: {
          about: "No design. Removing someone can't be undone, so it asks first.",
          questions: {
            messages: 'Is it right that their chat messages stay?',
            tellMember: 'Should the removed person be told?',
          },
        },
      },
      share: {
        copied: 'Link copied',
        copyLink: 'Copy link',
        description:
          'This link is the key to your pod. Send it only to {{name}}, in a way you trust. The link works once and expires {{date}}.',
        target: {
          copy: 'Copy',
          mail: 'Mail',
          messages: 'Messages',
        },
        targets: 'Send the link with',
        title: 'Invite {{name}} to <bold>{{pod}}</bold>',
      },
      title: "Invite someone to Sofia's pod",
      toast: {
        removed: '{{name}} was removed from About Sofia',
        revoked: "{{name}}'s invite revoked",
        sent: 'Invite link sent to {{name}}',
        undo: 'Undo',
      },
    },
    scPpl003: {
      cases: {
        a: {
          description: 'Geo opens the pod for the first time.',
          goal: "Bogdan shared Sofia's pod with you. Find out who else is in it.",
          name: 'Look around',
        },
        b: {
          description: 'Geo asks Telli instead of reading the notes.',
          goal: 'Ask Telli when Sofia has piano.',
          name: 'Ask Telli',
        },
      },
      chat: {
        bogdanSetUp: 'I set up this pod for Sofia. Everything we know is in the notes.',
        bogdanWelcome: "Welcome, Geo! Ask Telli if you can't find something.",
        joined: '<bold>{{name}}</bold> joined',
        placeholder: 'Ask Telli…',
        telliTyping: 'Telli is typing',
        threadLabel: 'Pod chat',
        yesterday: 'Yesterday',
      },
      description:
        "Look around a pod someone shared with you: you can read everything and use the chat, but you can't change anything.",
      hints: {
        chat: 'Everyone in the pod shares this chat. Try asking Telli something.',
        contactInfo: "Sofia's Contact info, read-only.",
        info: 'Forms and categories, without ways to add any.',
        members: 'Everyone who can see this pod.',
        notes: 'Try to change the note.',
      },
      pod: {
        avatar: 'S',
        members: 'Members',
        sharedBy: 'Shared by {{name}}',
        title: 'About Sofia',
      },
      questions: {
        noticeReadOnly: "Is it clear that you can't change anything here? Nothing says so.",
        tryToEdit: 'What should happen when someone tries to edit the notes?',
      },
      screens: {
        chat: {
          about: 'One chat for everyone in the pod. Anyone can ask Telli about what the pod holds.',
          questions: {
            source: 'Should Telli say where an answer came from?',
          },
        },
        contactInfo: {
          about: "Sofia's details, read-only.",
        },
        info: {
          about: 'Forms and categories without "Create form" or suggestions.',
          questions: {
            categories: 'Should members see Subpods and Attachments at all?',
          },
        },
        members: {
          about: 'Who else is in the pod. Only the owner can invite.',
          questions: {
            pending: "Should members see pending invites? Right now they don't.",
          },
        },
        notes: {
          about: "The owner's notes, read-only. No toolbar, no caret, no Tidy.",
          questions: {
            sayReadOnly: 'Should the notes say they are read-only, or who can edit them?',
          },
        },
      },
      title: "Sofia's pod, shared with me",
    },
  },
  home: {
    assignedVariant: 'Assigned variant (dev only): {{variant}}',
    catalogue: {
      baseFlow: 'Base flow',
      noFrame: 'No Figma frame',
      title: 'Screens (dev only)',
    },
    newSession: 'Start new test session',
    sections: {
      experiments: 'Experiments ({{count}})',
      showcases: 'Showcases ({{count}})',
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
      dose: {
        due: 'Due now',
        given: 'Given · {{time}} · {{member}}',
        history: 'History',
        lastGiven: 'Last given {{day}} {{time}} · {{member}}',
        markAsGiven: 'Mark as given',
        overdue: 'Overdue · due at {{time}}',
        toast: {
          given: '{{name}} marked as given',
          undone: '{{name}} marked as not given',
        },
        undo: 'Undo',
        upcoming: 'Due at {{time}}',
      },
      doseHistory: {
        allMedications: 'All medications',
        course: '{{name}} · {{year}}',
        empty: 'No doses in this period',
        given: 'Given {{time}} · {{member}}',
        medication: 'Medication',
        missed: 'Missed',
        periods: {
          '1y': 'Year',
          '7d': 'Week',
          '30d': 'Month',
          all: 'All',
        },
        scheduled: 'Scheduled {{time}}',
        showAllTime: 'Show all time',
        showMore_one: 'Show {{count}} more',
        showMore_other: 'Show {{count}} more',
        someone: 'Someone',
        title: 'Dose history',
        today: 'Today',
        todayInline: 'today',
        yesterday: 'Yesterday',
        yesterdayInline: 'yesterday',
        you: 'You',
      },
      doseSheet: {
        give: {
          cancel: 'Cancel',
          confirm: 'Mark as given',
          scheduledAt: 'Scheduled: {{time}}',
          scheduledNow: 'Scheduled: now',
          title: 'Record {{name}}’s dose?',
        },
        medication: '{{name}} · {{dose}} {{form}}',
        undo: {
          cancel: 'Keep as given',
          confirm: 'Mark as not given',
          given: 'Given {{day}} {{time}} · {{member}}',
          title: 'Undo {{name}}’s dose?',
        },
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
      medical: {
        add: 'Add medication',
        history: 'Dose history',
        historyPreview: 'Last given {{day}} {{time}} · {{member}}',
        medications: 'Medications',
        title: 'Medical',
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
    notes: {
      label: 'Notes',
      tidy: 'Tidy',
    },
    people: {
      categories: {
        attachments: 'Attachments',
        members: 'Members',
        subpods: 'Subpods',
      },
      contactInfo: {
        empty: 'No contact info yet.',
        fields: {
          dateOfBirth: 'Date of birth',
          email: 'Email',
          firstName: 'First name',
          lastName: 'Last name',
        },
        title: 'Contact info',
      },
      forms: {
        createForm: 'Create form',
        medical: 'Medical',
        title: 'Forms',
      },
      sharing: {
        assistant: 'Assistant',
        canView: 'Can view',
        infoShared_one: '{{count}} info shared',
        infoShared_other: '{{count}} info shared',
        owner: 'Owner',
        pendingFor_one: 'Pending for {{count}} day',
        pendingFor_other: 'Pending for {{count}} days',
        sentToday: 'Sent today',
        telli: 'Telli',
        you: '{{name}} (You)',
      },
      telli: {
        answers: {
          born: "Sofia was born on April 8, 2018. That's from her Contact info.",
          fullName: "Her full name is Sofia Walker. That's from her Contact info.",
          notFound: "I couldn't find that in Sofia's pod. Bogdan might know.",
          piano: "Sofia has piano on Tuesdays. That's from her notes.",
        },
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
    groupChat: {
      attach: 'Add attachment',
      send: 'Send',
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
    segmentedTabs: {
      dot: 'new',
    },
    toast: {
      close: 'Close',
    },
  },
}
