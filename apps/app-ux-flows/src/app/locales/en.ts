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
      cases: {
        a: {
          description: 'Tell Telli that Ginger needs Clavamox and add it from the reply.',
          name: 'Add from chat',
        },
      },
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
    scAtt001: {
      add: 'Add attachment',
      cases: {
        a: {
          description: 'The owner shares a new photo with the pod.',
          goal: "Add a photo to Sofia's pod.",
          name: 'Add a file',
        },
        b: {
          description: "The owner fixes a file's name.",
          goal: 'Rename "About Sophia.databook.mc" so it ends in ".pdf".',
          name: 'Rename a file',
        },
        c: {
          description: 'The owner removes a file nobody needs.',
          goal: 'Delete "Activities-tracker.xls" from the pod.',
          name: 'Delete a file',
        },
      },
      description:
        "Add, rename, save and delete the files in Sofia's pod. Files sit in one flat list, with no folders.",
      empty: {
        message: 'Files you add are shared with everyone in this pod.',
        title: 'No files yet',
      },
      hints: {
        actions: 'What you can do with one file.',
        add: 'Picking is mocked: each choice adds a sample file.',
        files: 'Every file in the pod, newest first.',
        rename: 'Give the file a new name.',
      },
      pod: {
        avatar: 'S',
        subtitle: 'Attachments',
        title: 'About Sofia',
      },
      questions: {
        deleteWithoutAsking: 'Should a file be deleted without asking first?',
        everyoneChanges: 'Everyone in the pod can change every file. Is that clear from the screen?',
      },
      rename: {
        field: 'File name',
        taken: 'A file with that name already exists.',
        title: 'Rename file',
      },
      screens: {
        actions: {
          about: 'What you can do with one file. Delete takes effect straight away.',
          questions: {
            confirmDelete: 'Should Delete ask for confirmation?',
          },
        },
        add: {
          about: 'Two kinds of file. Picking is mocked: each choice adds a sample file.',
          questions: {
            kinds: 'Is it clear what "Media file" and "Document" each include?',
          },
        },
        files: {
          about: 'Every file in one flat list, newest first. The "Add attachment" button is always in reach.',
          questions: {
            sortOrSearch: 'Should the list be sortable, or searchable?',
          },
        },
        rename: {
          about: 'Not in the design. A sheet with the current name, kept unique in the pod.',
          questions: {
            lockExtension: 'Should the extension be locked?',
          },
        },
      },
      title: "Sofia's files",
      toast: {
        saved: 'Saved to your device',
      },
    },
    scOnb001: {
      description:
        'The first-run intro that shows pods as rooms in a home on your phone, Telli tidying a pod, and Paula joining it from her phone.',
      goal: 'Go through the intro and get started with Tellipod.',
      hints: {
        existingDevice: 'A stand-in. Replay the intro to try it again.',
        gingerPod: 'Inviting Telli is optional. Try it, or just go on.',
        paula: 'The same pod on two phones.',
        restore: 'A stand-in. Replay the intro to try it again.',
        rooms: 'Read the intro and move on with Next, or tap Ginger.',
        telliHandoff: 'The intro ends here.',
        welcome: 'Get Started finishes the intro.',
      },
      questions: {
        demoRequired: 'Should the Telli demo be required, or stay optional as it is now?',
        fourBeats: 'Four beats: is anything missing, or could one go?',
        roomsMetaphor: 'Does the "rooms in a home" picture make pods clear before people have any of their own?',
      },
      screens: {
        existingDevice: {
          about: 'A stand-in for the existing "How would you like to proceed?" sheet.',
        },
        gingerPod: {
          about: 'Telli only enters a pod you invite it into, and only suggests. Nothing is saved until you add it.',
          questions: {
            optionalDemo: 'Is "Invite Telli" clear as an optional demo?',
            suggestedLabel: 'Is "(suggested)" enough to tell Telli\'s info from yours?',
          },
        },
        paula: {
          about: "The same pod on Paula's phone, shared directly between devices with pod members only.",
          questions: {
            deviceToDevice: 'Does "device-to-device" mean anything to people at this point?',
            samePod: 'Is it clear that Paula sees the same pod, not a copy?',
          },
        },
        restore: {
          about: 'A stand-in for the restore flow.',
        },
        rooms: {
          about: 'Pods as rooms in a home on your phone: a trip, a cat and a kid each get one.',
          questions: {
            examples: 'Are "Kyoto trip", "Ginger" and "Sofia" good examples?',
            gingerTappable: 'Is it obvious that the Ginger tag can be tapped?',
          },
        },
        telliHandoff: {
          about: "A stand-in for Telli's naming chat, which is not part of this prototype.",
        },
        welcome: {
          about: 'Pods live on your devices. From here the existing onboarding takes over.',
          questions: {
            links: 'Should the two links be this prominent on a first run?',
          },
        },
      },
      title: 'Tellipod intro: Rooms',
    },
    scOnb002: {
      description: 'The Rooms intro without a Next button: you move through it by tapping what lights up in the scene.',
      goal: 'Go through the intro and get started with Tellipod.',
      hints: {
        existingDevice: 'A stand-in. Replay the intro to try it again.',
        gingerPod: 'Tap what lights up: invite Telli, add what it suggests, then invite Paula.',
        paula: "Wait for Paula's message, then tap Home.",
        restore: 'A stand-in. Replay the intro to try it again.',
        rooms: 'Tap the Ginger tag to go on.',
        telliHandoff: 'The intro ends here.',
        welcome: 'Get Started finishes the intro.',
      },
      questions: {
        engaging: 'Does tapping the scene make the story more engaging than a Next button, or slower?',
        nextCue: 'With no Next button, is it always clear what to tap next?',
        requiredDemo:
          'Tapping forward now requires the Telli demo. Is that the right trade-off against Rooms, where it is optional?',
      },
      screens: {
        existingDevice: {
          about: 'A stand-in for the existing "How would you like to proceed?" sheet.',
        },
        gingerPod: {
          about:
            'Telli only enters a pod you invite it into, and only suggests. Each step leads to the next: invite Telli, add its suggestions, then invite Paula.',
          questions: {
            inviteHint:
              '"Invite Telli" still says "Demo, optional" although it\'s the way forward. Should the hint change?',
            invitePaula: 'Does "Invite Paula" on the pod card read as sharing this pod?',
          },
        },
        paula: {
          about: 'The same pod on Paula\'s phone, shared directly between devices. "Home" returns to all your pods.',
          questions: {
            home: 'Is "Home" clear as the way to move on?',
          },
        },
        restore: {
          about: 'A stand-in for the restore flow.',
        },
        rooms: {
          about:
            'Pods as rooms in a home on your phone. The Ginger tag is the only way forward, so it is drawn large and ringed.',
          questions: {
            ringCue: 'Without a Next button, is the ringed Ginger tag enough of a cue?',
          },
        },
        telliHandoff: {
          about: "A stand-in for Telli's naming chat, which is not part of this prototype.",
        },
        welcome: {
          about: 'Pods live on your devices. From here the existing onboarding takes over.',
          questions: {
            ring: 'Does the ring on Get Started still help after every beat had one?',
          },
        },
      },
      title: 'Tellipod intro: Tap through',
    },
    scOnb003: {
      description:
        'The intro without the isometric home: a flat pod card grows from a deck of pods, opens, is shared and joins your list.',
      goal: 'Go through the intro and get started with Tellipod.',
      hints: {
        existingDevice: 'A stand-in. Replay the intro to try it again.',
        gingerPod: 'Invite Telli and add what it suggests, or just tap Next.',
        paula: 'The same pod on two phones. Tap Next.',
        restore: 'A stand-in. Replay the intro to try it again.',
        rooms: 'Watch the pods stack up, then tap Next.',
        telliHandoff: 'The intro ends here.',
        welcome: 'Get Started finishes the intro.',
      },
      questions: {
        deckReads: 'Does the deck on the first beat read as "your pods", or as a stack of cards?',
        flatClearer: 'Is a flat pod card clearer than the isometric home for explaining what a pod is?',
        samePod: "Is it clear that the pod on Paula's phone is the same pod?",
      },
      screens: {
        existingDevice: {
          about: 'A stand-in for the existing "How would you like to proceed?" sheet.',
        },
        gingerPod: {
          about: 'Telli only enters a pod you invite it into, and only suggests. The demo is optional.',
          questions: {
            enoughShown: 'Does the open card show enough of what a pod holds?',
          },
        },
        paula: {
          about: "The same pod on Paula's phone, shared directly between devices.",
          questions: {
            deviceToDevice: 'Does the flat version still say "device to device"?',
          },
        },
        restore: {
          about: 'A stand-in for the restore flow.',
        },
        rooms: {
          about:
            'Pods as cards in a deck: Home, Kyoto trip, Sofia and Ginger, each with a note, a file and a message. Ginger lands on top because it is the one the story follows.',
          questions: {
            separatePods: 'Do the cards read as separate private pods?',
          },
        },
        telliHandoff: {
          about: "A stand-in for Telli's naming chat, which is not part of this prototype.",
        },
        welcome: {
          about:
            'The pod joins your list, now with Telli and Paula in it. From here the existing onboarding takes over.',
          questions: {
            oneOfMany: 'Does the list make clear Ginger is one pod of many?',
          },
        },
      },
      title: 'Tellipod intro: Living pod',
    },
    scOnb004: {
      actions: {
        back: 'Back',
        close: 'Close',
        contactCard: 'Fill in from my contact card',
        continue: 'Continue',
        gotIt: "Got it, let's set up",
        later: "I'll do this later",
        manual: 'Enter details manually',
        next: 'Next',
        pairAnother: 'Pair another device',
        pairOtherDevice: 'Pair with my other device',
        replay: 'Replay intro',
        setupThisPhone: 'Set up on this phone',
        showMeAround: 'Show me around',
        skip: 'Skip',
        skipToSetup: 'I know Tellipod, skip to setup',
      },
      contacts: {
        askingMessage: 'Tellipod uses your contact card to fill in your name and how people can reach you.',
        askingTitle: 'Tellipod Would Like to Access Your Contacts',
        cancel: 'Cancel',
        choosingMessage: 'Choose which contacts to share with Tellipod.',
        choosingTitle: 'Select Contacts to Share',
        continue: 'Continue',
        dontAllow: "Don't Allow",
        pickerTitle: 'Contacts',
        select: 'Select Contacts',
        shareAll: 'Share All',
      },
      description: 'The next first-run: a one-minute tour of pods, then set up a local profile. No account.',
      devices: {
        headline: 'Do you use more than one device?',
        laterNote: 'You can pair another device later in Settings.',
        otherDevices: 'Other devices',
        subline: 'Your spaces live only on this phone until you pair another device.',
        thisPhone: "{{name}}'s Tellipod",
      },
      goal: 'Go through the intro and get started with Tellipod.',
      hints: {
        devices: 'Pair another device, or finish for now.',
        landing: 'Start the tour, or skip if you already know Tellipod.',
        next: 'The intro ends here.',
        pairing: 'A stand-in. Replay the intro to try it again.',
        podAnything: 'Wait for the examples, or pick a tab.',
        profileChoose: 'Fill from a contact card, or type it yourself.',
        profileForm: 'First name is enough to continue.',
        setup: 'Set up on this phone, or pair another device.',
        shareOnce: 'Watch the vet number update.',
        yoursToKeep: 'Wait for the closing line, then set up.',
      },
      landing: {
        headline: 'Get to know Tellipod in a minute',
      },
      pager: 'Step {{current}} of {{total}}',
      profile: {
        country: 'Country',
        deviceOnly: 'Saved on your device only. No cloud, no servers.',
        email: 'Email',
        firstName: 'First name',
        firstNameError: 'Enter your first name',
        headline: 'Set up your profile',
        lastName: 'Last name',
        phone: 'Phone',
        privacy: "We'll only use this to show who you are in pods you share.",
        realName: 'Use your real name so people recognize you.',
        subline: "This is how you'll appear to others on Tellipod.",
      },
      questions: {
        simulatedContacts: 'Should simulated contacts stay in a demo, or only a manual form?',
        skipMissesPod: 'Does skipping to setup make it too easy to miss what a pod is?',
        tourClearer: 'Is a one-minute tour clearer than the four-beat rooms story?',
      },
      screens: {
        devices: {
          about: 'Spaces live on this phone until you pair another.',
          questions: {
            later: 'Is "I\'ll do this later" the right way out?',
          },
        },
        landing: {
          about: 'Offer a short tour or skip straight to local setup.',
          questions: {
            minute: 'Is "in a minute" a promise we can keep?',
          },
        },
        next: {
          about: 'Stand-in: what comes after setup is not built here.',
        },
        pairing: {
          about: 'Stand-in: pairing is not built in this prototype.',
        },
        podAnything: {
          about: 'Pods are for anything you share: a trip, care, pets, a reno, a book club.',
          questions: {
            examples: 'Do the five examples help, or is one enough?',
          },
        },
        profileChoose: {
          about: 'Appear as yourself. Data stays on the device.',
          questions: {
            contactCard: 'Is "contact card" meaningful before a real OS prompt?',
          },
        },
        profileForm: {
          about: 'First name is enough to continue.',
          questions: {
            extraFields: 'Are email and phone too much for a first run?',
          },
        },
        setup: {
          about: 'Two steps: name, then other devices. No password.',
          questions: {
            pairingEarly: 'Is pairing this early a distraction?',
          },
        },
        shareOnce: {
          about: 'Share once; everyone sees the same vet number.',
          questions: {
            readsAs: 'Does the share play read as device-to-device, or as chat?',
          },
        },
        yoursToKeep: {
          about: 'No accounts, data centers, ads or tracking.',
          questions: {
            closing: 'Does the closing line land after the "No …" list?',
          },
        },
      },
      setup: {
        headline: "Let's set up your Tellipod",
        subline: 'Just two quick steps: your name, then your other devices. No account or password.',
      },
      standIn: {
        body: 'This part of setup is still being designed. Only the intro is built in this prototype.',
        nextTitle: 'What comes next',
        pairingTitle: 'Pairing another device',
      },
      title: 'Tellipod intro: Onboarding v2',
      tour: {
        podAnything: {
          filesLabel: 'Files',
          formLabel: 'Form',
          headline: 'A pod for anything',
          message: 'Message…',
          noteLabel: 'Note',
          tabsLabel: 'Pod examples',
        },
        shareOnce: {
          headline: 'Share it once. Everyone stays up to date.',
          newPod: 'New pod',
          partner: 'Partner',
          pod: 'Pet care',
          share: 'Share',
          vet: 'Vet',
          vetPhone: 'Vet phone',
          walker: 'Dog walker',
        },
        yoursToKeep: {
          closing: 'Just you and the people you choose.',
          headline: 'Yours to keep',
          noAccounts: 'No accounts.',
          noAds: 'No ads.',
          noDataCenters: 'No data centers.',
          noTracking: 'No tracking.',
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
        categories: {
          all: 'All categories',
          browse: 'Browse categories',
          empty: 'No pods yet',
          events: 'Events',
          health: 'Health & Wellness',
          people: 'People',
          title: 'Categories',
        },
        maybeLater: 'Maybe later',
        message:
          'A Pod is a private little room for any info — your kid, a trip, a project. Fill it with info, files, and notes and start collaborating. Every Pod you create or receive from others is automatically organized into Tellipod categories.',
        title: 'Create your first Pod',
        userInitial: 'A',
        welcome: 'Welcome, Alice',
      },
      newPod: {
        category: 'Category',
        changeImage: 'change image',
        chooseCategory: 'Choose category',
        create: 'Create Pod',
        created: 'Pod created',
        description:
          'A digital room for one part of your life. You’ll invite people and add things once this Pod is created.',
        image: 'Profile image',
        imageChosen: 'Image selected',
        imagePlaceholder: 'Add a profile image',
        name: 'Pod name',
        optional: '(Optional)',
        selectImage: 'select image',
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
      podCreated: {
        goTo: 'Go to {{name}}',
        message:
          'You can invite people to this pod by using the link. Copy and share your link with those you want to join.',
        title: '<bold>{{name}}</bold> Pod was created successfully',
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
    scPet003: {
      cases: {
        a: {
          description: 'Ginger’s Care & Feeding is empty. You are her owner.',
          goal: 'Write down how Ginger should be fed, so whoever looks after her knows.',
          name: 'Write',
          questions: {
            emptyState: 'What should the empty state suggest writing?',
          },
        },
        b: {
          description:
            'Alice shared Ginger’s pod with you while she is away. Her instructions are read-only; dinner is due.',
          goal: 'You’re looking after Ginger while Alice is away. Check how much she eats, then feed her dinner and record it.',
          name: 'Feed as sitter',
          questions: {
            historyBefore: 'Should the feeding history show meals from before the sitter joined?',
          },
        },
        c: {
          description: 'The same shared pod; you ask Telli instead of reading the instructions.',
          goal: 'You’re looking after Ginger. Ask Telli how much she eats.',
          hints: {
            info: 'Telli answers in the pod’s Chat.',
          },
          name: 'Ask Telli',
          questions: {
            quote: 'Should Telli quote the instructions or link to them?',
          },
        },
        d: {
          description: 'Ginger’s instructions mention two meal times, and there is no feeding schedule yet.',
          goal: 'Turn Ginger’s feeding instructions into a feeding schedule.',
          name: 'Tidy into schedule',
          questions: {
            afterSchedule: 'What should happen to the instructions text once the schedule exists?',
          },
        },
      },
      chat: {
        aliceThanks: 'Thanks for looking after Ginger this week!',
        placeholder: 'Message Ginger’s pod. Tag @Telli for help…',
        telliTyping: 'Telli is typing',
        threadLabel: 'Ginger’s pod chat',
      },
      description:
        'Shows Ginger’s free-text care and feeding instructions: written by her owner, read by someone looking after her, answered by Telli, and turned into a feeding schedule.',
      edit: {
        cancel: 'Cancel',
        placeholder: 'How to feed and look after {{name}}',
        save: 'Save',
        title: 'Instructions',
      },
      hints: {
        careFeeding: 'The instructions are free text, as the owner wrote them.',
        chat: 'Ask Telli anything about Ginger’s pod.',
        editInstructions: 'Write the instructions, then save them.',
        feedingHistory: 'Check who fed Ginger and when.',
        feedMeal: 'Confirm the meal, or cancel.',
        info: 'Care & Feeding sits next to Medical.',
        scheduleSheet: 'Check the meals Telli found, then set up the schedule.',
        undoMeal: 'Confirm that the meal was not fed, or keep it.',
      },
      questions: {
        freeText: 'Should the instructions stay free text, or become a form with fields?',
      },
      scheduleSheet: {
        cancel: 'Not now',
        confirm: 'Set up schedule',
        title: 'Set up {{name}}’s feeding schedule?',
      },
      screens: {
        careFeeding: {
          about:
            'Ginger’s Care & Feeding: today’s meals or the feeding schedule, and the instructions. Only the owner can change the instructions; every member can record meals.',
          questions: {
            sections: 'Should the schedule and the instructions be one section or two?',
          },
        },
        chat: {
          about: 'One chat for everyone in Ginger’s pod. Telli answers from what the pod holds.',
        },
        editInstructions: {
          about: 'Plain text, with no fields to fill in.',
        },
        feedingHistory: {
          about: 'The last 7 days of meals: who fed Ginger, when, how much she ate, and missed meals.',
        },
        feedMeal: {
          about: 'The same meal sheet as SC-PET-004: confirm the meal and how much Ginger ate.',
        },
        info: {
          about: 'Ginger’s Info tab, with the Care & Feeding row after Medical.',
        },
        scheduleSheet: {
          about: 'Telli names each time it found in the instructions as a meal.',
          questions: {
            editable: 'Should meal names and times be editable before setting up?',
          },
        },
        undoMeal: {
          about: 'Reverting a meal you recorded asks for confirmation.',
        },
      },
      title: 'Care instructions',
    },
    scPet004: {
      cases: {
        a: {
          description: 'Ginger’s breakfast was due ten minutes ago and nobody has logged it.',
          goal: 'Ginger’s breakfast is due. Feed her and record it.',
          name: 'Log a meal',
          questions: {
            oneTap: 'Should “Mark as fed” be one tap, without the sheet, when all was eaten?',
          },
        },
        b: {
          description: 'Sam fed Ginger her breakfast twenty minutes ago.',
          goal: 'Ginger is meowing for food. Feed her if she hasn’t eaten yet.',
          name: 'Double feed',
          questions: {
            noticeable: 'Is “Fed · {time} · Sam” noticeable enough before someone feeds her again?',
          },
        },
        c: {
          description: 'You marked Ginger’s dinner as fed ten minutes ago, but you haven’t fed her yet.',
          goal: 'You marked Ginger’s dinner as fed by mistake. Undo it.',
          hints: {
            careFeeding: 'A meal you fed can be reverted from its card.',
          },
          name: 'Undo fed',
          questions: {
            tellSam: 'Should Sam be told when a meal is undone?',
          },
        },
        d: {
          description: 'Ginger’s breakfast is due, and she leaves half of it.',
          goal: 'Ginger only ate half her breakfast. Record it.',
          hints: {
            feedMeal: 'Choose how much she ate before confirming.',
          },
          name: 'Partly eaten',
          questions: {
            none: 'Should “None” record a meal as fed at all?',
          },
        },
      },
      description:
        'Shows how two people looking after Ginger log her meals: feeding her, noticing someone already did, undoing a mistake, and recording how much she ate.',
      hints: {
        careFeeding: 'Today’s meals are at the top of Care & Feeding.',
        feedAgain: 'Decide whether to feed her again.',
        feedingHistory: 'Check who fed Ginger and when.',
        feedMeal: 'Confirm the meal, or cancel.',
        info: 'Care & Feeding sits next to Medical.',
        undoMeal: 'Confirm that the meal was not fed, or keep it.',
      },
      questions: {
        sharedToday: 'Should meals and medication doses share one Today list on Ginger’s pod?',
      },
      screens: {
        careFeeding: {
          about: 'Today’s breakfast and dinner, with the same due, overdue and given treatments as a dose.',
          questions: {
            missed: 'What should happen to a meal that is never logged?',
          },
        },
        feedAgain: {
          about: 'Feeding a meal someone else gave asks first, with not feeding as the main choice.',
          questions: {
            allow: 'Should a second feeding be allowed at all?',
          },
        },
        feedingHistory: {
          about: 'The last 7 days of meals: who fed Ginger, when, how much she ate, and missed meals.',
        },
        feedMeal: {
          about: 'Like giving a dose, plus how much of the meal Ginger ate.',
        },
        info: {
          about: 'Ginger’s Info tab, with the Care & Feeding row after Medical.',
        },
        undoMeal: {
          about: 'Reverting asks for confirmation, as for a dose.',
        },
      },
      title: 'Meals',
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
      adoptConflict: {
        addedBy: 'Added by {{name}}',
        cancel: 'Cancel',
        keepBoth: 'Keep both',
        replace: 'Replace {{value}}',
        title: {
          address: 'You already share an address',
          email: 'You already share an email',
          firstName: 'You already share a first name',
          phone: 'You already share a phone number',
          role: 'You already share a role',
        },
        yours: 'Yours',
      },
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
        d: {
          description: "Geo added Bogdan's personal email and phone number. Bogdan already shares his work email.",
          goal: "Geo added some of your details to Sofia's pod. Keep what's right and remove what isn't.",
          name: 'Info others added about me',
        },
        e: {
          description: 'Geo shares an old email. Andrew already added a phone number for Geo.',
          goal: "Geo's email in the pod is out of date. Add the one you know: geo@swiftinvention.com.",
          name: 'Add info about someone else',
          questions: {
            whoAdded: 'Should Geo see who added each detail before deciding?',
          },
        },
      },
      description:
        "Invite someone to Sofia's pod with a one-time link, take back an invite that is still pending, remove someone who already joined, sort out what others added about you, or add what you know about someone else.",
      editor: {
        field: 'Field',
      },
      hints: {
        adoptConflict: 'Keep both, or replace yours.',
        info: 'Sharing starts from Members.',
        inviteDetail: 'This invite has not been used yet.',
        inviteName: 'Type a name and create the link.',
        inviteShare: 'Pick any app to send the link.',
        memberDetail: 'What the member shares, and what others added about them.',
        members: 'Everyone in the pod, and everyone invited.',
        myInfo: 'What you share, and what others added about you.',
        removeConfirm: 'Removing someone cannot be undone.',
        suggestionActions: 'Copy it, add it to your info, or remove it.',
      },
      info: {
        suggestions_one: '{{count}} suggestion',
        suggestions_other: '{{count}} suggestions',
      },
      infoToast: {
        added: '{{field}} added to the info you share',
        addedAbout: '{{field}} added about {{name}}',
        alreadyShared: '{{name}} already shares this {{field}}',
        copied: '{{field}} copied',
        removed: "{{name}}'s {{field}} removed",
        removedMine: 'Your {{field}} about {{name}} removed',
        replaced: '{{field}} replaced',
        updated: '{{field}} updated',
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
        addedByOthers: 'Info about {{name}} — Added by others',
        addedByOthersHelp:
          'Everyone in <bold>{{pod}}</bold> can see these. Only the person who added a detail can change it.',
        addInfo: 'Add info about {{name}}',
        nothingShared: "{{name}} hasn't shared any info yet.",
        remove: 'Remove from pod',
        removeMine: 'Remove your {{field}} {{value}}',
        shared_one: '{{count}} info shared by {{name}}',
        shared_other: '{{count}} info shared by {{name}}',
        sharedHelp: 'Only {{name}} can change these. What you edit is added below as your info about {{name}}.',
      },
      members: {
        invite: 'Invite member',
        pendingInvites: 'Pending invites',
      },
      myInfo: {
        addedByOthers: 'Info about you — Added by others',
        addedByOthersHelp:
          'Only the person who added a detail can change it but you are allowed to remove the info that isn’t right or merge it with your own info if it is right.',
        addPersonalInfo: 'Add personal info',
        moreActions: 'More actions for {{field}} {{value}}',
        shared_one: '{{count}} info shared in this pod',
        shared_other: '{{count}} info shared in this pod',
        sharedVisibleTo: 'Everyone in <bold>{{pod}}</bold> can see these.',
      },
      pod: {
        avatar: 'S',
        members: 'Members',
        suggestCategory: 'Suggest category',
        title: 'About Sofia',
      },
      questions: {
        detailComesBack:
          'A detail someone added is hidden once its person shares the same value. If that person later changes their value, should the detail come back? Right now it does.',
        tellBogdan: 'Should Bogdan be told when someone adds a detail about him?',
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
        adoptConflict: {
          about:
            'No design. Bogdan already shares this kind of detail, so he picks whether to replace his or keep both.',
          questions: {
            mainOne: 'When both are kept, should one be the main one?',
          },
        },
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
          about:
            "No design; follows Bogdan's own info screen. What the member shares and what others added about them. Bogdan can't change their info: his edits are added as his own info about them. The owner can remove them here.",
          questions: {
            joinedAndAccess: 'Should the owner still see when the member joined and what they can do?',
            tellMember: 'Should the member be told when someone adds info about them?',
          },
        },
        members: {
          about: "Who is in the pod, and who was invited but hasn't joined yet. Each person shows the Role they share.",
          questions: {
            dots: 'What do the coloured dots on the avatars mean?',
            pendingLabel: 'Is "Pending for N days" useful, or should it show when the invite expires?',
            telliListed: 'The design leaves Telli out of this list. Should it be listed?',
          },
        },
        myInfo: {
          about:
            "What Bogdan shares in the pod, and what others added about him. He can edit what he shares. He can't change what others added, only take it over or remove it.",
          questions: {
            stopSharing: 'Should Bogdan be able to stop sharing a detail?',
            tellAdder: 'Should the person who added a detail be told when it is removed?',
          },
        },
        removeConfirm: {
          about: "No design. Removing someone can't be undone, so it asks first.",
          questions: {
            messages: 'Is it right that their chat messages stay?',
            tellMember: 'Should the removed person be told?',
          },
        },
        suggestionActions: {
          about: 'What Bogdan can do with a detail someone else added.',
          questions: {
            movesOut: 'Is it clear that "Add to info I share" moves the detail out of Geo\'s list?',
          },
        },
      },
      share: {
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
      suggestionActions: {
        add: 'Add to info I share',
        copy: 'Copy value',
        remove: 'This isn’t right, remove it',
        sharedDaysAgo_one: 'Shared by {{name}} {{count}} day ago',
        sharedDaysAgo_other: 'Shared by {{name}} {{count}} days ago',
        sharedToday: 'Shared by {{name}} today',
        sharedYesterday: 'Shared by {{name}} yesterday',
        title: '{{field}}: <bold>{{value}}</bold>',
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
    devMode: {
      label: 'Dev mode',
      turnOff: 'Turn off',
    },
    families: {
      attachments: 'Attachments',
      onboarding: 'Onboarding',
      people: 'People',
      pets: 'Pet care',
    },
    group: {
      title: '{{title}} ({{count}})',
    },
    hiddenInProduction: 'Hidden in production',
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
    attachments: {
      actionsSheet: {
        delete: 'Delete file',
        description: '{{detail}} · added by you',
        descriptionByMember: '{{detail}} · added by {{name}}',
        rename: 'Rename',
        save: 'Save to device',
      },
      addSheet: {
        description: 'Everyone in this pod can see it, add to it, and change it.',
        document: 'Document',
        mediaFile: 'Media file',
        title: 'Add to Files',
      },
      detail: '{{size}} · {{date}}',
      size: {
        b: '{{value}} B',
        gb: '{{value}} GB',
        kb: '{{value}} KB',
        mb: '{{value}} MB',
      },
    },
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
      careFeeding: {
        amounts: {
          all: 'All',
          half: 'About half',
          little: 'A little',
          none: 'None',
        },
        edit: 'Edit',
        emptyMessage: 'Write down how Ginger is fed and looked after.',
        emptyTitle: 'No care instructions yet',
        history: {
          empty: 'No meals in the last 7 days',
          fed: 'Fed {{time}} · {{member}}',
          fedAgain: 'Fed again {{time}} · {{member}}',
          missed: 'Missed · scheduled {{time}}',
          preview: 'Last fed {{day}} {{time}} · {{member}}',
          title: 'Feeding history',
        },
        instructions: 'Instructions',
        meal: {
          ate: {
            half: 'ate about half',
            little: 'ate a little',
            none: 'ate none',
          },
          due: 'Due now',
          fed: 'Fed · {{time}} · {{member}}',
          fedAgain: 'Fed again · {{time}} · {{member}}',
          feedAgain: 'Feed again',
          markAsFed: 'Mark as fed',
          overdue: 'Overdue · due at {{time}}',
          undo: 'Undo',
          upcoming: 'Due at {{time}}',
        },
        meals: {
          breakfast: 'Breakfast',
          dinner: 'Dinner',
          lunch: 'Lunch',
        },
        mealsInline: {
          breakfast: 'breakfast',
          dinner: 'dinner',
          lunch: 'lunch',
        },
        schedule: 'Schedule',
        scheduledMeal: '{{meal}} · {{time}}',
        sheet: {
          feed: {
            amount: 'How much did she eat?',
            cancel: 'Cancel',
            confirm: 'Mark as fed',
            scheduledAt: 'Scheduled: {{time}}',
            scheduledNow: 'Scheduled: now',
            title: 'Record {{name}}’s {{meal}}?',
          },
          feedAgain: {
            at: '{{member}} fed her at {{time}}.',
            cancel: 'Don’t feed',
            confirm: 'Feed again',
            minutesAgo: '{{member}} fed her {{count}} minutes ago.',
            title: '{{name}} already had {{meal}}',
          },
          meal: '{{meal}} · {{portion}}',
          undo: {
            cancel: 'Keep as fed',
            confirm: 'Mark as not fed',
            fed: 'Fed {{day}} {{time}} · {{member}}',
            title: 'Undo {{name}}’s {{meal}}?',
          },
        },
        suggestion: {
          caption: 'Found {{count}} meal times. Set up a feeding schedule?',
          label: 'Set up schedule',
        },
        title: 'Care & Feeding',
        toast: {
          extra: 'Extra {{meal}} logged',
          fed: '{{meal}} marked as fed',
          saved: 'Care instructions saved',
          scheduled: 'Feeding schedule set up',
          undone: '{{meal}} marked as not fed',
        },
        today: 'Today',
        write: 'Write instructions',
      },
      categories: {
        attachments: 'Attachments',
        careFeeding: 'Care & Feeding',
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
      telli: {
        answers: {
          feeding:
            'Ginger eats twice a day, at 7am and 6pm: half a cup of dry food (Purina Pro Plan) plus a spoonful of wet food. It’s in <careFeeding>Care & Feeding</careFeeding>.',
          notFound: 'I couldn’t find that in Ginger’s pod.',
        },
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
      memberInfo: {
        fieldNames: {
          address: 'address',
          email: 'email',
          firstName: 'first name',
          phone: 'phone',
          role: 'role',
        },
        fields: {
          address: 'Address',
          email: 'Email',
          firstName: 'First name',
          phone: 'Phone',
          role: 'Role',
        },
      },
      sharing: {
        assistant: 'Assistant',
        canView: 'Can view',
        copied: 'Copied',
        copyInviteLink: 'copy invite link',
        copyLink: 'Copy link',
        linkCopied: 'Link copied',
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
    tellipodIntro: {
      art: {
        demo: {
          added: "You added the suggested info. Ginger's pod now has you and Telli.",
          before: "Inside Ginger's pod. A note says: feeds 7am and 6pm, half cup dry. Telli waits outside the door.",
          suggested:
            'Telli came in and suggested info from the note: meals 7:00 AM and 6:00 PM; portion half a cup of dry food. It waits for you to add it.',
        },
        paula:
          "Your phone and Paula's phone. A one-time link opened the same Ginger pod on her phone, joined directly by one line. Paula says: Ginger's fed!",
        rooms:
          "Illustration: a small home standing on a phone. Its rooms are pods named Kyoto trip, Ginger and Sofia. A cat sits in Ginger's room.",
        welcome: "Your home again. Ginger's pod now has you, Telli and Paula, and a new message.",
      },
      beats: {
        gingerPod: {
          headline: { accent: 'You decide.', lead: 'Telli tidies.\n', tail: '' },
          subline: 'Telli, your AI assistant, sees only\npods you invite it into.',
        },
        paula: {
          headline: { accent: 'Same pod', lead: 'Invite Paula.\n', tail: ', her phone.' },
          subline: 'Direct device-to-device sharing,\npod members only.',
        },
        rooms: {
          headline: { accent: 'Pods', lead: '', tail: ' are small\nprivate rooms.' },
          subline: 'One for your kid, a trip, your cat.',
        },
        welcome: {
          headline: { accent: 'Tellipod', lead: 'Welcome to ', tail: '.\nHost your world.' },
          subline: 'Pods live on your devices,\nnot in a corporate data center.',
        },
      },
      demo: {
        addAll: 'Add all suggested info',
        addAllHint: 'Demo, optional. Nothing is saved.',
        addRow: 'Add {{label}}',
        editRow: 'Edit {{label}}',
        inviteTelli: 'Invite Telli',
        inviteTelliHint: 'Demo, optional. Opens the door for Telli. Nothing is shared.',
        suggested: '(suggested)',
        telliWaiting: 'Telli, waiting outside the door',
      },
      intro: {
        back: 'Back',
        existingDevice: 'Already have Tellipod on another device?',
        getStarted: 'Get Started',
        getStartedHint: 'Opens Telli, your assistant',
        logo: 'Tellipod',
        next: 'Next',
        restore: 'Restoring from backup?',
        skip: 'Skip',
        skipHint: 'Goes to the last step',
        skipLabel: 'Skip intro',
        step: 'Step {{step}} of 4',
      },
      living: {
        art: {
          rooms:
            'Four pods stacked like cards: Home, Kyoto trip, Sofia and, on top, Ginger. Each card shows a note, a file and a message.',
        },
        beats: {
          rooms: {
            headline: { accent: 'Pods', lead: '', tail: ' for every\npart of life.' },
            subline: 'One for a trip, your kid, your cat.',
          },
        },
        labels: {
          files: 'Files',
          note: 'Note',
          paulaJoined: 'Paula joined',
          paulaSays: 'Paula:',
          petSitter: 'Pet sitter',
        },
        pods: {
          ginger: {
            category: 'Pets',
            chat: { text: 'Vet on Friday, 10am', time: '10:02' },
            file: 'Vaccines.pdf',
            name: 'Ginger',
            note: 'Loves the sunny window seat.',
          },
          home: {
            category: 'Home',
            chat: { text: 'Plumber comes at 3', time: '11:20' },
            file: 'Lease.pdf',
            memberInitial: 'A',
            name: 'Home',
            note: 'Bins go out Sunday night.',
          },
          kyoto: {
            category: 'Travel',
            chat: { text: 'Booked the ryokan!', time: '9:12' },
            file: 'Itinerary.pdf',
            memberInitial: 'M',
            name: 'Kyoto trip',
            note: 'Flight JL 5 lands 7:40 AM.',
          },
          sofia: {
            category: 'People',
            chat: { text: 'I’ll do Tuesday', time: '8:30' },
            file: 'Insurance card.jpg',
            memberInitial: 'G',
            name: 'Sofia',
            note: 'Soccer Tue & Thu, 5 pm.',
          },
        },
      },
      pod: {
        chat: 'Chat',
        gingerTag: "Enter Ginger's pod",
        gingerTagHint: 'Same as Next',
        gingerTagTapHint: 'Opens Ginger’s pod',
        home: 'Home',
        homeHint: 'Back to all your pods',
        info: 'Info',
        invitePaula: 'Invite Paula',
        invitePaulaHint: 'Shares Ginger’s pod with Paula',
        meals: 'Meals',
        mealsValue: '7:00 AM · 6:00 PM',
        memberNames: {
          paula: 'Paula',
          telli: 'Telli',
          you: 'you',
        },
        members: 'Members: {{names}}',
        message: 'Ginger’s fed!',
        messagePlaceholder: 'Message…',
        messageTime: '7:05',
        newMessage: 'New message',
        note: 'feeds 7am & 6pm, ½ cup dry',
        notes: 'Notes',
        noteTag: '#ginger',
        oneTimeLink: 'One-time link',
        paulaInitial: 'P',
        paulaPhone: 'Paula’s phone',
        portion: 'Portion',
        portionValue: '½ cup, dry food',
        sofiaInitial: 'S',
        synced: 'Synced',
        tags: {
          ginger: 'Ginger',
          kyoto: 'Kyoto trip',
          sofia: 'Sofia',
        },
        yourPhone: 'Your phone',
      },
      standIns: {
        badge: 'Prototype stand-in',
        existingDevice: {
          body: 'This link opens the existing “How would you like to proceed?” sheet. Only the intro is built in this prototype.',
          title: 'Already have Tellipod on another device?',
        },
        replay: 'Replay intro',
        restore: {
          body: 'This link opens the restore flow. Only the intro is built in this prototype.',
          title: 'Restoring from backup?',
        },
        telliHandoff: {
          body: 'Get Started continues into Telli’s naming chat in the existing onboarding. Only the intro is built in this prototype.',
          title: 'Hey, I’m Telli!',
        },
      },
    },
  },
  ui: {
    appTabBar: {
      home: 'Home',
      label: 'Main',
      navigation: 'Navigation',
      notifications: 'Notifications',
      notificationsNew: 'Notifications, new',
      telli: 'Ask Telli',
    },
    attachmentRow: {
      menu: 'More actions for {{name}}',
      open: '{{name}}, {{detail}}',
    },
    bottomSheet: {
      close: 'Close',
    },
    categoryRow: {
      label: '{{label}}, {{count}}',
      labelWithPreview: '{{label}}, {{count}}, {{preview}}',
    },
    chat: {
      telliName: '@Telli',
    },
    chatActionCard: {
      edit: 'Edit {{label}}',
    },
    formCard: {
      edit: 'Edit {{field}}',
    },
    groupChat: {
      attach: 'Add attachment',
      empty: {
        hint: 'Tag @Telli if you need help.',
        message: 'Everyone in this pod will see your messages.',
        title: 'Be the first to write a message.',
      },
      send: 'Send',
    },
    header: {
      back: 'Back',
    },
    homeTopBar: {
      search: 'Search, or ask Telli…',
      sharing: 'Device-to-device sharing, pod members only.',
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
