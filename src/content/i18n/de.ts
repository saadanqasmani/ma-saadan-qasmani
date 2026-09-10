import type { DictionaryOverlay } from "@/lib/i18n/dictionary";
import type { ContentOverlay } from "@/lib/i18n/content";

/**
 * German.
 *
 * The novel's title stays in English throughout. There is no German edition
 * and no German title; inventing one would promise a book that does not
 * exist. The same rule holds for IRIS, ICD, IMG and IPI, which are names of
 * instruments rather than descriptions of them.
 */

export const de: DictionaryOverlay = {
  languageName: "Deutsch",

  nav: {
    author: "Der Autor",
    work: "Die Arbeit",
    research: "Forschung",
    journal: "Das Journal",
    contact: "Korrespondenz",
    novel: "Der Roman",
    novelTitle: "The Highest Branch",
  },

  header: {
    home: "Saadan Qasmani — Startseite",
    menu: "Menü",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    skipToContent: "Zum Inhalt springen",
    language: "Sprache",
    chooseLanguage: "Sprache wählen",
    browse: "Übersicht",
  },

  announcement: {
    eyebrow: "Erscheint am 19. Oktober 2026",
    heading: "The Highest Branch",
    body: "Mit siebzehn überquert ein Junge den Pass und verlässt einen Wald, den er an seinen Jahreszeiten kennt, für ein Land, das die Zeit in Semestern misst.",
    ask: "Hinterlassen Sie eine Adresse, und Sie erfahren es an dem Tag, an dem es erscheint. Sonst nichts.",
    placeholder: "sie@beispiel.de",
    submit: "Benachrichtigen Sie mich",
    sending: "Wird gesendet",
    done: "Sie hören an diesem Tag von mir.",
    readMore: "Mehr über den Roman",
    dismiss: "Schließen",
    later: "Jetzt nicht",
  },

  newsletter: {
    emailLabel: "E-Mail-Adresse",
    placeholder: "ihre@email.de",
    subscribe: "Abonnieren",
    sending: "Wird gesendet",
    done: "Sie sind in die Korrespondenz aufgenommen.",
    failed: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
  },

  footer: {
    releaseLine: "19. Oktober 2026",
    theNovel: "Der Roman",
    correspondence: "Korrespondenz",
    lettersHeading: "Briefe aus dem Archiv, selten verschickt.",
    lettersBody: "Neue Forschung, Journaleinträge und Nachrichten zu",
    lettersBodyAfter: "— nur wenn es etwas zu sagen gibt.",
    index: "Verzeichnis",
    orderACopy: "Ein Exemplar bestellen",
    rights: "Saadan Qasmani · Istanbul",
    positioning: "Autor, Forscher und Stratege",
  },

  home: {
    location: "Istanbul",
    hoverHint: "Fahren Sie über die markierten Knotenpunkte, um der Arbeit zu folgen",
    scroll: "Scrollen",
    author: "Der Autor",
    portraitLabel: "Autorenporträt",
    readBiography: "Die Biografie lesen",
    practice: "Die Praxis",
    practiceHeading: "Trainings dort, wo die Fragen am schwersten sind.",
    countries: "Länder",
    nationalities: "Nationalitäten",
    papersInProgress: "Forschungsarbeiten in Arbeit",
    archive: "Das Archiv",
    researchInProgress: "Laufende Forschung",
    allResearch: "Alle Forschung",
    novelEyebrow: "Der Roman",
    enterTheNovel: "Den Roman betreten",
    chapters: "Kapitel",
    words: "Wörter",
  },

  about: {
    eyebrow: "Der Autor",
    titleLead: "Die",
    titleAccent: "Person",
    biography: "Biografie",
    portraitLabel: "Autorenporträt",
    theWork: "Die Arbeit",
    currentRoles: "Aktuelle Positionen",
    practice: "Praxis",
    founded: "Gegründet",
    recognition: "Auszeichnungen",
    theResearch: "Die Forschung",
    getInTouch: "Kontakt aufnehmen",
    metaDescription: "Biografie von {name}, {positioning}.",
  },

  work: {
    eyebrow: "Die Arbeit",
    titleLead: "Ein lebendiges",
    titleAccent: "Archiv",
    lede: "Akademische, berufliche und kreative Arbeit — fortlaufend ergänzt statt einmal kuratiert.",
    metaDescription: "Ein lebendiges Archiv von Projekten, Positionen und Initiativen.",
    recruitmentTitleLead: "Internationale",
    recruitmentTitleAccent: "Studierendengewinnung",
    viewGallery: "Galerie ansehen",
    openGallery: "Galerie zu {name} öffnen",
    lookInto: "{name} ansehen",
    detailLabels: {
      iris: "IRIS",
      icd: "ICD",
      recruitment: "Studierendengewinnung",
    },
    categories: {
      Academic: "Akademisch",
      Research: "Forschung",
      Publications: "Publikationen",
      "International Education": "Internationale Bildung",
      "Global Engagement": "Globales Engagement",
      Strategy: "Strategie",
      Writing: "Schreiben",
      "Creative Work": "Kreative Arbeit",
      Projects: "Projekte",
    },
  },

  research: {
    eyebrow: "Das Archiv",
    titleLead: "Forschungs",
    titleAccent: "archiv",
    lede: "Arbeitspapiere zur politischen Ökonomie der Internationalisierung, zum Nation Branding und zur Versicherheitlichung internationaler Studierender. Papiere mit eingeschränktem Zugang werden erst nach persönlicher Prüfung der Anfrage versandt.",
    metaDescription:
      "Arbeitspapiere und akademische Forschung zur politischen Ökonomie der Internationalisierung, zum Nation Branding und zur Versicherheitlichung internationaler Studierender.",
    shapeEyebrow: "Die Gestalt der Sache",
    shapeHeading: "Neun Papiere, eine Frage.",
    shapeBody:
      "Wie Institutionen das eine über internationale Studierende sagen und das andere tun — nachgezeichnet an politischen Instrumenten, Partnerschaften, Verdienst und Sicherheit.",
    trilogyNote: "Drei davon gehören zu einer Reihe",
    all: "Alle",
    entryCount: "{count} Eintrag",
    entryCountPlural: "{count} Einträge",
    readAbstract: "Abstract lesen",
    fullEntry: "Voller Eintrag",
    openFullEntry: "Den vollen Eintrag öffnen",
    abstract: "Abstract",
    withAuthors: "Mit {names}",
    withAuthorsInline: "mit {names}",
    and: "und",
    viewPaper: "Papier ansehen",
    requestAccess: "Zugang anfragen",
    requestInstrument: "{name} anfragen",
    requestTheInstrument: "Das Instrument anfragen",
    restricted: "Eingeschränkt",
    close: "Schließen",
    whatAreImgIpi: "Was sind IMG und IPI?",
    abstractOf: "Abstract — {title}",
    requestAccessTo: "Zugang zu {title} anfragen",
    keywords: "Schlagwörter",
    authors: "Autoren",
    instrumentNote:
      "Zu diesem Papier gehört ein Instrument, dessen Nutzung Leser anfragen können.",
    backToArchive: "Zurück zum Archiv",
  },

  paper: {
    backToArchive: "Das Archiv",
    abstract: "Abstract",
    keywords: "Schlagwörter",
    openAccess: "Open Access",
    restricted: "Eingeschränkt",
    readThePaper: "Das Papier lesen",
    requestAccess: "Zugang anfragen",
    viewPaper: "Papier ansehen",
    allNine: "Alle neun Papiere",
    and: "und",
  },

  journal: {
    eyebrow: "Das Journal",
    titleLead: "Essays",
    titleAccent: "& Notizen",
    lede: "Texte, die zwischen der Forschung und der Fiktion liegen.",
    metaDescription: "Essays, Reflexionen und Kommentare.",
    comingSoon: "Bald",
    comingSoonHeading: "Die ersten Essays werden noch geschrieben.",
    comingSoonBody:
      "Sie stehen auf der Liste, jeder Text erreicht Sie also, sobald er erscheint. Hier wird das leben, was zwischen der Forschung und der Fiktion geschrieben wird.",
    coverLabel: "Titelbild",
    gate: {
      eyebrow: "Für Abonnenten",
      heading: "Die Essays und Notizen sind für Abonnenten.",
      body: "Notizen aus dem Archiv, Argumente, die noch entstehen, und gelegentlich ein Stück, das weder zur Forschung noch zur Fiktion gehört. Abonnieren Sie, und diese Seite öffnet sich sofort; per E-Mail erhalten Sie einen Zugangscode für das nächste Mal und eine Nachricht, sobald etwas Neues erscheint.",
      subscribe: "Abonnieren",
      emailPlaceholder: "sie@beispiel.de",
      enter: "Eintreten",
      unlocksNote: "Die Seite öffnet sich in dem Moment, in dem Sie abonnieren.",
      haveCode: "Sie haben bereits einen Code",
      codePlaceholder: "Zugangscode",
      unlock: "Freischalten",
      codeNote: "Er stand in der E-Mail, die Sie beim Abonnieren erhalten haben.",
      enterCode: "Geben Sie Ihren Zugangscode ein.",
      wrongCode: "Dieser Code stimmt nicht. Sehen Sie in der zugesandten E-Mail nach.",
      badEmail: "Geben Sie eine gültige E-Mail-Adresse ein.",
      notConnected:
        "Die Liste ist noch nicht angebunden. Nutzen Sie vorerst Ihren Zugangscode.",
      failed: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    },
  },

  contact: {
    eyebrow: "Korrespondenz",
    titleLead: "Kontakt",
    titleAccent: "aufnehmen",
    lede: "Für berufliche Anfragen, Vortragsanfragen, Forschungskooperationen oder allgemeine Korrespondenz.",
    metaDescription:
      "Kontakt aufnehmen, beruflichen Kontakt anfragen oder einen Termin vereinbaren.",
    basedIn: "Ansässig in",
    appointments: "Termine",
    bookingNote:
      "Die Terminbuchung läuft über {provider}. Wählen Sie eine Zeit, die Ihnen passt, und sie landet direkt im Kalender.",
    bookATime: "Termin buchen",
    elsewhere: "Anderswo",
  },

  forms: {
    required: "Pflichtfeld",
    invalidEmail: "Geben Sie eine gültige E-Mail-Adresse ein",
    somethingWrong: "Etwas ist schiefgelaufen.",
    tryAgain: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    sending: "Wird gesendet…",
    close: "Schließen",
    cancel: "Abbrechen",

    name: "Name",
    fullName: "Vollständiger Name",
    email: "E-Mail",
    phone: "Telefon",
    phoneNumber: "Telefonnummer",
    subject: "Betreff",
    message: "Nachricht",
    optionalMessage: "Nachricht (optional)",
    country: "Land",
    city: "Stadt",
    institution: "Institution",
    position: "Position / Titel",
    reason: "Grund für die Zugangsanfrage",
    shippingAddress: "Lieferadresse",
    quantity: "Anzahl",

    sendMessage: "Nachricht senden",
    contactDone: "Ihre Nachricht ist eingegangen. Vielen Dank.",

    submitRequest: "Anfrage senden",
    requestingAccess:
      "Sie fragen Zugang zu {title} an. Jede Anfrage wird geprüft, bevor etwas versandt wird.",
    requestDone:
      "Ihre Anfrage zu {title} ist eingegangen. Jede Anfrage wird einzeln geprüft — Sie hören von uns, wenn sie bewilligt wird.",

    submitOrder: "Bestellung absenden",
    orderDone:
      "Ihre Bestellung ist eingegangen. Unser Team prüft jede Bestellung persönlich — Sie erhalten Zahlungs- und Versandhinweise per E-Mail, sobald sie bestätigt ist. Eine Zahlung ist noch nicht erforderlich.",
    orderNote:
      "Dieses Formular erhebt keine Zahlungs- oder Bankdaten. Unser Team prüft jede Bestellung persönlich und sendet die Zahlungshinweise direkt zu, sobald Ihre Bestellung bestätigt ist.",
  },

  novel: {
    aNovel: "Ein Roman",
    titleLead: "The Highest",
    titleAccent: "Branch",
    theBook: "Das Buch",
    coverAlt: "Cover von {title}",
    coverLabel: "Buchcover",
    chapters: "Kapitel",
    words: "Wörter",
    form: "Form",
    status: "Status",
    availability: "Verfügbarkeit",
    orderACopy: "Ein Exemplar bestellen",
    byline: "{title} — ein Roman von {name}",
    purchase: {
      amazonTab: "EU & Amerika",
      amazonNote: "über Amazon",
      directTab: "Türkiye & Pakistan",
      directNote: "Direktbestellung",
      amazonBody: "Für Leser in {regions} über Amazon erhältlich.",
      buyOnAmazon: "Bei Amazon kaufen",
      amazonPending:
        "Der Amazon-Link erscheint hier, sobald das Buch gelistet ist.",
    },
  },

  detail: {
    workPractice: "Die Arbeit · Praxis",
    workProgramme: "Die Arbeit · Programm",
    workProject: "Die Arbeit · Projekt",
    backToTheWork: "Zurück zur Arbeit",

    iris: {
      requestDemo: "Demo anfragen",
      enterAccessCode: "Zugangscode eingeben",
      sectionProblem: "Das Problem",
      sectionBackbone: "Das diagnostische Rückgrat",
      sectionFilm: "Der Film",
      sectionWhatItDoes: "Was es leistet",
      sectionArchitecture: "Die Architektur",
      withheldModules: "Die acht Module von IRIS liegen beim Film.",
      withheldArchitecture: "Wie IRIS von Grund auf gebaut ist, liegt beim Film.",
      openFilmFullScreen: "Film im Vollbild öffnen",
      unlockTheFilm: "Film freischalten",
      filmTitle: "IRIS — der Erklärfilm",
      soundNote: "Der Ton ist aus, bis Sie ihn im Film einschalten.",
      lock: {
        eyebrow: "Zugangscode erforderlich",
        heading: "Der Film, die Modulliste und die Architektur sind zurückgehalten.",
        body: "IRIS ist noch nicht öffentlich. Wenden Sie sich für den Zugangscode an Saadan, dann öffnen sich die drei Abschnitte gemeinsam, auf dieser Seite, für einen Monat.",
        requestTheCode: "Code anfragen",
        enterCode: "Code eingeben",
        checking: "Wird geprüft…",
        unlock: "Freischalten",
        wrongCode: "Dieser Code stimmt nicht.",
        enterSomething: "Geben Sie den Zugangscode ein.",
      },
    },

    icd: {
      sectionWhoFor: "Für wen es ist",
      sectionHowItRuns: "Wie es abläuft",
      sectionWorkingTogether: "Zusammenarbeit",
      bringToInstitution: "Holen Sie das an Ihre Institution.",
      outcomes: "Ergebnisse",
      deliveredIn: "Durchgeführt in",
      fromTheSessions: "Aus den Sitzungen",
      galleryLabel: "ICD-Training",
      photographs: "Fotografien",
      getInTouch: "Kontakt aufnehmen",
      theResearchBehindIt: "Die Forschung dahinter",
    },

    recruitment: {
      sectionWhatItAnswers: "Worauf es antwortet",
      sectionWorkingTogether: "Zusammenarbeit",
      thePipeline: "Die Pipeline",
      marketIntelligence: "Marktkenntnis",
      movesUpOn: "Ein Partner steigt auf durch",
      tier: {
        status: "Status",
        relationship: "Beziehung",
        incentives: "Anreize",
        meetings: "Treffen",
      },
      fromTheField: "Aus der Praxis",
      galleryLabel: "Arbeit in der Studierendengewinnung",
      scheduleConsultation: "Beratung vereinbaren",
      sendMessageInstead: "Stattdessen eine Nachricht senden",
    },
  },

  gallery: {
    eyebrow: "Galerie",
    photographs: "Fotografien",
    openPhotographs: "Fotografien zu {name} öffnen",
    close: "Schließen",
  },

  marginalia: {
    name: "Die Marginalien",
    foundCount: "{found} von {total} gefunden",
    body: "Sieben Zeichen sind an den Rändern dieser Seite hinterlassen, so wie ein Leser ein Buch annotiert, das er behalten will. Jedes gibt etwas Wahres preis.",
    readersCard: "Die Leserkarte",
    readersCardHeading: "Sie lesen die Ränder. Die meisten tun das nicht.",
    readersCardBody:
      "Treten Sie in die Korrespondenz ein — neue Forschung, Journaleinträge und Nachrichten zu",
    readersCardBodyAfter: ", selten verschickt.",
    clear: "Die Sammlung zurücksetzen",
    markFound: "Marginalie gefunden: {title}. {line}",
    markUnfound: "Ein Zeichen am Rand: {hint}",
    indicator: "Marginalien: {found} von {total} gefunden. Die Sammlung öffnen.",
    close: "Schließen",
  },

  art: {
    tiers:
      "Drei Partnerstufen, wobei der Aufstieg durch Konversion, Reaktionsfähigkeit und Empfehlungsqualität verdient wird",
    constellation: "Eine Konstellation aus Forschungsfeldern und Papieren",
    constellationHint:
      "Fahren Sie über einen Knoten, um ein Papier durch sein Feld zurückzuverfolgen.",
    globe:
      "Eine Karte der östlichen Hemisphäre mit Routen von Istanbul nach Deutschland, Katar, in die Vereinigten Arabischen Emirate, nach Pakistan, Nepal und in den Irak",
    branch:
      "Ein Baum, dessen Äste und Wurzeln die Stationen von Saadan Qasmanis Arbeit markieren, von den A- und O-Levels an den Wurzeln bis zum Roman The Highest Branch in der Krone",
    istanbul: "Istanbul",
  },

  seasons: {
    eyebrow: "Der Roman · Die These",
    heading: "Zwei Arten, ein Leben zu messen.",
    forestLead: "Ein Wald, den er an seinen Jahreszeiten kennt",
    forestRest:
      "— Zeit, die wiederkehrt, kreist und verzeiht. Wachstum, gemessen in Ringen, nicht in Ergebnissen.",
    semestersLead: "Ein Land, das die Zeit in Semestern misst",
    semestersRest:
      "— Zeit, die voranschreitet, abrechnet und verfällt. Wachstum, gemessen an einer Frist.",
    note: "Der Abstand zwischen diesen beiden Uhren ist der Gegenstand sowohl der Forschung als auch des Romans.",
    forest: "Wald",
    city: "Stadt",
  },

  translation: {
    machineNotice:
      "Diese Seite ist eine Übersetzung. Wo ein Wort Gewicht trägt, ist das englische Original das geschriebene.",
    abstractNotice:
      "Inoffizielle Übersetzung. Das veröffentlichte Abstract ist auf Englisch.",
    showOriginal: "Das englische Original zeigen",
    hideOriginal: "Das englische Original ausblenden",
    originalHeading: "Das englische Original",
  },
};

export const deContent: ContentOverlay = {};
