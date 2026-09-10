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

export const deContent: ContentOverlay = {
  person: {
    positioning: "Autor, Forscher und Stratege",
    location: "Istanbul, Türkiye",
    bio: "Saadan Qasmani ist Internationalisierungsfachmann, Forscher und Romanautor mit Sitz in Istanbul. Er ist Global Engagement and Brand Strategist und Mitgründer von IRIS, einer SaaS-Plattform für das Management von Internationalisierung. Seine praktische Arbeit umfasst Studierendengewinnung, Partnerschaftsmanagement und Trainings zu interkultureller Kompetenz, durchgeführt in zwölf Ländern mit Teilnehmenden aus über siebzig Nationen, darunter die UNESCO Peace and Diplomacy Programmes, in Türkiye, Pakistan, Nepal und im Irak. Er absolviert einen Master in Politikwissenschaft und Internationalen Beziehungen an der Istanbul Aydın University, wo er außerdem das Model-United-Nations-Programm des Campus und STARLIGHT gegründet hat. Seine Forschung befasst sich mit der politischen Ökonomie der Internationalisierung, dem Nation Branding und der Versicherheitlichung internationaler Studierender.",
    practitionerNote:
      "Praktische Arbeit in Studierendengewinnung, Partnerschaftsmanagement und Trainings zur Entwicklung interkultureller Kompetenz (ICD), durchgeführt in 12 Ländern mit Teilnehmenden aus mehr als 70 Nationen, darunter die UNESCO Peace and Diplomacy Programmes, in Türkiye, Pakistan, Nepal und im Irak.",
    roles: [
      { title: "Direktor für Global Engagement & Brand Strategy" },
      { title: "Mitgründer", org: "IRIS — SaaS-Plattform für Internationalisierungsmanagement" },
      { title: "Masterstudent, Politikwissenschaft und Internationale Beziehungen" },
    ],
    founded: [
      { name: "Model-United-Nations-Programm" },
      { name: "STARLIGHT" },
    ],
    honors: [
      {
        title: "Presidential Award of Service and Excellence",
        org: "STAR Global Conference 2024, Kathmandu University, Nepal",
      },
    ],
  },

  book: {
    genre: "Allegorische literarische Fiktion, erzählt als Fabel",
    tagline: "Denn oben ist da, wo die Dinge herunterfallen.",
    status: "Erscheint am 19. Oktober 2026",
    synopsis:
      "Mit siebzehn überquert ein Junge den Pass und verlässt einen Wald, den er an seinen Jahreszeiten kennt, für ein Land, das die Zeit in Semestern misst. Was folgt, ist eine Fabel des Ankommens, der langsamen Architektur der Zugehörigkeit und ihres Preises, erzählt über die Jahre hinweg, die aus einem Studenten jemanden machen, den seine eigene Mutter womöglich nicht wiedererkennt.",
    subject:
      "Die Erfahrung internationaler Studierender, verfolgt am Leben eines Protagonisten von der Jugend bis durch einen beruflichen und akademischen Weg im Ausland.",
    amazonRegions: "Europäische Union & Amerika",
    directRegions: "Türkiye & Pakistan",
    directNote:
      "Direktbestellung — die Zahlungsdaten werden nach der Prüfung von Hand zugesandt, nie automatisch.",
  },

  instrumentLabel: "IMG- und IPI-Rechner",
  instrumentDefinition:
    "Zwei ökonometrische Instrumente (Gültekin & Qasmani). IMG misst, wie groß die Lücke im Internationalisierungsmanagement einer Institution ist, aus Informationsasymmetrie, Fragmentierung der Arbeitsabläufe und Defizit der digitalen Infrastruktur. IPI misst die Fähigkeit, diese Lücke zu schließen, aus dem Engagement der Leitung und der Bereitschaft der Lehrenden. Zusammen gelesen ordnen sie eine Institution einem von vier Profilen zu.",

  researchNote: {
    before: "Alle Forschung hier entsteht in Zusammenarbeit mit ",
    after: " oder als Erweiterung seiner Arbeit.",
  },

  work: {
    iris: {
      title: "IRIS — International Relations Intelligent System",
      summary:
        "Mitgegründet mit EduYork. Internationalisierung, verwandelt von einem Verwaltungsvorgang in eine strategische, messbare, datengetriebene Funktion, auf Grundlage der ökonometrischen Rahmenwerke IMG und IPI.",
    },
    icd: {
      title: "Entwicklung interkultureller Kompetenz",
      summary:
        "Trainings für Studierende, Lehrende und Verwaltung, entworfen um den Befund herum, dass interkulturelle Kompetenz eine Eigenschaft der Institution ist und nicht des Einzelnen. Durchgeführt in Türkiye, Pakistan, im Irak, in Nepal und in Deutschland.",
    },
    "star-scholars-global-engagement": {
      title: "Global Engagement & Brand Strategy",
      summary:
        "Leitung von globalem Engagement und Markenstrategie für ein Netzwerk aus 115 Ländern, 2.353 Universitäten und mehr als 20.000 Wissenschaftlerinnen und Wissenschaftlern.",
      linkLabel: "STAR Scholars besuchen",
    },
    "international-student-recruitment": {
      title: "Internationale Studierendengewinnung",
      summary:
        "Gewinnung in Türkiye, Pakistan, Nepal und im Irak, betrieben auf einem gestuften Partnerschaftsmodell: Agenturen steigen von der Erstansprache zur höchsten Stufe durch beständige Konversion, verlässliche Kommunikation und die Qualität ihrer Empfehlungen, wobei jede Stufe eigene Anreize und einen eigenen Prüfzyklus trägt.",
    },
    "unesco-peace-diplomacy": {
      title: "UNESCO Peace and Diplomacy Programmes",
      summary:
        "Kurzzeitige internationale Programme unter dem UNESCO-Lehrstuhl, mit der Entwicklung interkultureller Kompetenz im Zentrum.",
      linkLabel: "Zur Programmseite",
    },
  },

  research: {
    "structural-marginalization-turkish-universities": {
      title: "Strukturelle Marginalisierung internationaler Studierender an türkischen Universitäten",
      subtitle: "Tokenismus und Hope Trafficking als Mechanismen institutionellen Versagens",
      area: "Erfahrung internationaler Studierender",
      type: "Zeitschriftenartikel",
      date: "Demnächst — bei JUMP eingereicht",
      abstract:
        "Universitäten im Globalen Süden haben die Anwerbung internationaler Studierender erheblich schneller ausgeweitet als die institutionelle Infrastruktur, die sie tragen müsste; Marginalisierung bleibt in diesen Kontexten jedoch weitgehend undefiniert und ungemessen. Diese Studie untersucht die mehrdimensionalen Erfahrungen internationaler Studierender an türkischen Universitäten, mit Blick auf strukturelle Marginalisierung, diskriminierende Praktiken und die Lücke zwischen institutionellen Versprechen und gelebter Wirklichkeit. Auf Grundlage einer Querschnittsbefragung von 580 internationalen Studierenden aus 70 Nationen bewertet die Untersuchung sieben thematische Dimensionen: Marginalisierung, Diskriminierung, interkulturelle Kompetenz, Tokenismus, die Übereinstimmung von Erwartung und Wirklichkeit (hier operationalisiert als Hope Trafficking), psychische Auswirkungen und institutionelles Vertrauen. Die Ergebnisse zeigen schwache institutionelle Unterstützungssysteme, verbreitete Stereotypisierung, emotionale Erschöpfung und soziale Isolation. Marginalisierung und Hope Trafficking hängen jeweils signifikant mit psychischer Belastung zusammen, und interkulturelle Kompetenz weist den stärksten Zusammenhang mit Marginalisierung auf. Gestützt auf Deardorffs (2006) Pyramidenmodell interkultureller Kompetenz, Gültekins (2020a) Rahmenwerk zur bildungsbezogenen Soft Power und Pham und Trans (2015) Modell des interkulturellen Kapitals argumentiert der Beitrag, dass Marginalisierung am besten als systemisches und nicht als individuelles Versagen zu verstehen ist, und führt Tokenismus und Hope Trafficking als theoretische Werkzeuge mittlerer Reichweite ein, die institutionelle Praxis mit makropolitischen Folgen verbinden. Da das Design im Querschnitt angelegt ist und auf Selbstauskunft beruht, beschreiben die berichteten Zusammenhänge Muster des gemeinsamen Auftretens und keine kausalen Effekte; die beiden vorgeschlagenen Rahmenwerke bedürfen der Validierung in anderen Aufnahmeländern.",
      keywords: [
        "Marginalisierung",
        "Tokenismus",
        "Hope Trafficking",
        "interkulturelle Kompetenz",
        "internationale Hochschulbildung",
        "internationale Beziehungen",
      ],
    },

    "ai-international-academic-relations": {
      title:
        "Die Rolle künstlicher Intelligenz in internationalen akademischen Beziehungen und der Internationalisierung von Hochschulen",
      subtitle: "Eine empirische Analyse aus einer aufstrebenden Volluniversität",
      area: "Theorie der Internationalisierung",
      type: "Arbeitspapier",
      date: "In Arbeit",
      abstract:
        "Die Internationalisierung der Hochschulbildung ist zu einem bestimmenden Merkmal institutioneller Legitimität geworden, doch die administrative Infrastruktur, die sie trägt, bleibt bemerkenswert unterentwickelt. International Offices im Globalen Norden wie im Globalen Süden verwalten komplexe Beziehungen zwischen Institutionen weiterhin über E-Mail, Tabellen und manuelle Genehmigungsketten und erzeugen damit, was dieser Beitrag als Internationalization Management Gap (IMG) fasst: die strukturelle Kluft zwischen den erklärten Internationalisierungszielen einer Institution und ihrer Fähigkeit, sie einzulösen. Auf Grundlage qualitativer Daten aus zwei strukturierten Fokusgruppen und fünfzehn bis zwanzig teilstrukturierten Interviews mit Lehrenden und Fachkräften aus International Offices untersucht der Beitrag drei Fragen: welche Hürden Lehrende von internationaler akademischer Tätigkeit abhalten; welche Werkzeuge dieses Engagement wirksam stärken würden; und welche KI-gestützten institutionellen Lösungen diese Hürden systemisch angehen könnten. Der Beitrag führt ein Rahmenwerk aus zwei Gleichungen ein: den IMG, einen zusammengesetzten Index, der die Schwere der Lücke über drei Dimensionen misst (Informationsasymmetrie, Fragmentierung der Arbeitsabläufe und Defizit der digitalen Infrastruktur), mit empirisch begründeter Gleichgewichtung, sowie den Internationalization Potential Index (IPI), der die institutionelle Bereitschaft misst, diese Lücke über das Engagement der Leitung und die Bereitschaft der Lehrenden zu schließen. Der Bedarf an automatisierter Infrastruktur für das Internationalisierungsmanagement an Hochschulen ist offenkundig und nicht regional gebunden: er ist eine strukturelle Bedingung der Hochschulbildung des einundzwanzigsten Jahrhunderts weltweit. Der Beitrag zeigt, dass KI-gestützte Systeme des Internationalisierungsmanagements die tragfähigste strukturelle Antwort auf den IMG darstellen, und prüft, unter welchen Bedingungen solche Systeme am ehesten sinnvolle und gerechte Ergebnisse hervorbringen.",
      keywords: [
        "künstliche Intelligenz",
        "Internationalisierung",
        "internationale akademische Beziehungen",
        "Internationalization Management Gap",
        "Internationalization Potential Index",
        "Engagement der Lehrenden",
        "MOU-Automatisierung",
        "digitale Infrastruktur",
        "Fragmentierung der Arbeitsabläufe",
        "Globaler Süden",
        "Globaler Norden",
        "institutionelle Kapazität",
        "zusammengesetzter Index",
      ],
    },

    "six-eras-internationalization": {
      title: "Sechs Epochen der Internationalisierung in der Hochschulbildung",
      subtitle: "Infrastruktur, Anpassung und der Preis des Zögerns",
      area: "Theorie der Internationalisierung",
      type: "Arbeitspapier",
      date: "In Arbeit",
      abstract:
        "Die Geschichte der Internationalisierung der Hochschulbildung ist keine Geschichte linearen Fortschritts. Sie ist eine Geschichte diskontinuierlicher Sprünge: Momente, in denen die Regeln internationaler akademischer Zusammenarbeit grundlegend neu geschrieben wurden und in denen Institutionen, die den Wandel früh erkannten, strukturelle Vorteile aufbauten, die sich über Jahrzehnte verstärkten, während die Zögernden zunehmend obsolet wurden. Universitäten sind von Beruf wegen die Fachleute der Welt für Wissen und Wandel. Aus institutioneller Gewohnheit gehören sie zu den beständigsten Nachzüglern bei dessen Übernahme. Auf Grundlage einer strukturierten Übersicht und einer qualitativen Inhaltsanalyse der Internationalisierungsliteratur schlägt der Beitrag eine Periodisierung in sechs analytisch unterscheidbare Epochen vor: die diplomatische Epoche (1950er–1970er); die Epoche der Abkommen (1980er–2000); die Epoche der Kommerzialisierung (1995–2005); die Epoche der Rankings (2004–2015); die digitale Epoche (2012–2023); und die KI-Epoche (ab 2024). Aufbauend auf einer Lesart gestufter Anpassung von Gültekins phasenbasierter Klassifikation (Gültekin, 2021, 2025), auf Infrastrukturtheorie (Star & Ruhleder, 1996; Bowker & Star, 1999) und auf der Internationalisierungsliteratur (Knight, 2004; Kehm & Teichler, 2007) führt der Beitrag drei eigene theoretische Beiträge ein: i) die unsichtbare Schwelle — die Beobachtung, dass die prägende Fähigkeit jeder Epoche erst dann als entscheidend erkannt wurde, als das Fenster für den Vorteil des Erstanbieters bereits geschlossen war; ii) Papier-Internationalisierung — die strukturelle Neigung von Institutionen, die Fähigkeit jeder Epoche darzustellen, ohne sie aufzubauen; und iii) die Sprungillusion — der Trugschluss, Institutionen könnten grundlegende Infrastrukturschichten überspringen und bei den Fähigkeiten der Gegenwart ankommen. Der Beitrag benennt vier epochenübergreifende Muster: die These des sich verstärkenden Vorteils, das Muster der Nichterholung, die Beschleunigung jeder folgenden Epoche und das Problem des Epochenüberspringens. Er schließt mit einer vorausschauenden Analyse der KI-Epoche, einschließlich des Risikos, dass KI bestehende Hierarchien eher festigt als aufbricht, wenn sie auf die Erzeugung akademischer Texte statt auf Managementinfrastruktur beschränkt bleibt. Die sechste Epoche ist die erste, deren unsichtbare Schwelle in Echtzeit benannt wurde. Die Frage ist, ob Institutionen handeln, bevor sie sich schließt.",
      keywords: [
        "Internationalisierung der Hochschulbildung",
        "Periodisierung",
        "KI-Epoche",
        "internationale Politik",
        "Papier-Internationalisierung",
        "Sprungillusion",
        "unsichtbare Schwelle",
      ],
    },

    "selling-merit": {
      title: "Verdienst im Angebot",
      subtitle:
        "Stipendienabschöpfung, Hope Trafficking und die Architektur selbstzufriedener Banalität in der Internationalisierung der türkischen Hochschulbildung",
      area: "Politische Ökonomie der Internationalisierung",
      type: "Arbeitspapier",
      date: "In Arbeit",
      abstract:
        "Der Aufstieg von Türkiye zu einem führenden Ziel für internationale Studierende — ein rund neunfacher Anstieg binnen eines Jahrzehnts auf mehr als 356.000 Studierende, geschätzte drei Milliarden US-Dollar Jahresumsatz und ein staatliches Ziel von 500.000 bis 2028 — wird offiziell als Triumph der Internationalisierung und der Soft Power erzählt. Dieser Beitrag dokumentiert eine Korruptionsarchitektur unterhalb dieser Erzählung, die er als Stipendienabschöpfung bezeichnet: die Umleitung institutioneller Stipendienkontingente, die als Instrumente des Verdienstes vorgesehen sind, in einen kommerziellen Kanal, in dem sie als Sachprovision an Vermittlungsagenturen fungieren und anschließend selbstzahlenden Familien als ermäßigte Studiengebühr weiterverkauft werden, fälschlich beschrieben als Verdienst. Auf Grundlage einer Innenperspektive aus dem Vermittlungssektor, eines Korpus öffentlicher Agenturwerbung und amtlicher Einschreibestatistiken rekonstruiert der Beitrag den Mechanismus über drei zusammenlaufende Beweisebenen. Er entwickelt einen zentralen theoretischen Beitrag: selbstzufriedene Banalität, eine Erweiterung von Arendts Darstellung administrativer Gedankenlosigkeit, in der die handelnde Person nicht ängstlich und gehorsam ist, sondern stolz und unternehmerisch und die Beteiligung am Schaden als Kompetenz erlebt. Er argumentiert weiter, dass Hope Trafficking — die systematische Fehlvermarktung von Chancen, die jenes Studierendenvolumen erzeugt, das die Stipendienprämie einbringt — und das Alleinlassen der Studierenden nach der Ankunft in Verhältnissen rassifizierter Marginalisierung keine getrennten Phänomene sind, sondern Ein- und Austrittswunde ein und desselben Anreizes, innerhalb dessen die studierende Person weder Kundin noch Begünstigte ist, sondern ein Inhaberpapier, dessen Lieferung die Zahlung auslöst. Die Analyse steht im Feld des akademischen Kapitalismus, der Korruptionssoziologie und der politischen Ökonomie von Zertifikatssystemen und mobilisiert Marx, Weber, Durkheim, Bourdieu, Fanon und Akerlof neben gegenwärtiger Forschung. Sie kommt zu dem Schluss, dass diese Korruption keine planende Urheberschaft hat, sondern nur eine Drift, strukturell erzeugt und ideologisch vorab freigesprochen, und schlägt eine Architektur aus Register, Lizenzierung und Treuhand vor, die auf das Design des Marktes zielt und nicht auf sein Personal.",
      keywords: [
        "Internationalisierung der Hochschulbildung",
        "Korruption",
        "Bildungsagenturen",
        "Stipendien",
        "Türkiye",
        "akademischer Kapitalismus",
        "Banalität des Bösen",
        "Soft Power",
      ],
    },

    "security-sovereignty-international-student": {
      title: "Sicherheit, Souveränität und die internationale Studierende",
      subtitle: "Kommerzielle Abhängigkeit und die Steuerung grenzüberschreitender Mobilität",
      area: "Versicherheitlichung internationaler Studierender",
      type: "Arbeitspapier",
      date: "In Arbeit",
      abstract:
        "Staaten warben internationale Studierende einst als Instrumente des Einflusses an; zunehmend werben sie sie als Einnahmequelle an. Dieser Beitrag argumentiert, dass die Kommerzialisierung der internationalen Hochschulbildung ein strukturelles Sicherheitsproblem erzeugt hat, das der vorherrschende Soft-Power-Rahmen nicht wahrnehmen kann. Da Universitäten in vielen Staaten für einen erheblichen Teil ihrer Einnahmen von internationalen Studiengebühren abhängig geworden sind — häufig konzentriert auf Studierende aus einem einzigen, mitunter rivalisierenden Staat —, ist diese finanzielle Abhängigkeit zu einer Verwundbarkeit nationaler Souveränität geworden: eine Form von Hebelwirkung, eine Quelle systemischer Fragilität und eine Aushöhlung staatlicher Kontrolle über eine kritische Wissensinfrastruktur. Gestützt auf die internationale Dependenztradition und die Versicherheitlichungstheorie fasst der Beitrag die entstehende Dynamik als Versicherheitlichung kommerzieller Abhängigkeit und veranschaulicht sie an drei Fällen (Vereinigtes Königreich, China und Türkiye). Er argumentiert weiter, dass die Einflusslogik, die weiterhin zur Rechtfertigung offener Mobilität angeführt wird, auf einem kausalen Mechanismus beruht — Kontakt erzeugt Zuneigung —, dessen Wirksamkeitsbedingungen erheblich erodiert sind. Die internationale Studierende steht damit im Schnittpunkt dreier staatlicher Imperative — Einnahmen, Einfluss und Sicherheit —, die nicht mehr zusammenpassen. Der Beitrag schließt, dass die Steuerung grenzüberschreitender Mobilität zur Verwaltung eines Widerspruchs geworden ist, den Staaten selbst geschaffen haben und nicht auflösen können.",
      keywords: ["Versicherheitlichung", "Souveränität", "grenzüberschreitende Mobilität"],
    },

    "unesco-short-term-programmes-icd": {
      title:
        "Die Rolle kurzzeitiger UNESCO-Programme in der Entwicklung interkultureller Kompetenz von Studierenden",
      subtitle: "Befunde aus den Peace and Diplomacy Programmes des UNESCO-Lehrstuhls",
      area: "Entwicklung interkultureller Kompetenz",
      type: "Arbeitspapier",
      date: "In Arbeit",
      abstract:
        "Kurzzeitige Mobilitätsprogramme sind zu einem zentralen Mechanismus geworden, über den Universitäten internationale Erfahrung auch jenen Studierenden eröffnen, für die eine semesterlange Mobilität finanziell oder akademisch unerreichbar ist. Ihr Beitrag zur Entwicklung interkultureller Kompetenz ist jedoch ungleichmäßig belegt, und die Programme, die im Rahmen der UNESCO-Lehrstühle und des UNITWIN-Programms durchgeführt werden, fehlen in dieser Literatur nahezu vollständig, obwohl Ausbildung und Kapazitätsaufbau ausdrücklicher Bestandteil des Lehrstuhlmandats sind. Diese Studie bewertet Ergebnisse interkultureller Kompetenz bei [N] Teilnehmenden aus [N] Ländern, die zwischen [Jahr] und [Jahr] an den UNESCO Peace and Diplomacy Programmes des UNESCO-Lehrstuhls für Kulturdiplomatie, Governance und Bildung an der Istanbul Aydın University teilgenommen haben. Mit einem Design aus Vorher- und Nachher-Erhebung, ergänzt durch qualitative Berichte der Teilnehmenden, misst die Studie Veränderungen in den Dimensionen Wissen, Haltung und Anwendung interkultureller Kompetenz, wie sie Deardorffs Prozessmodell bestimmt, und prüft den Beitrag der Model-United-Nations-Komponente des Programms als angewandtes pädagogisches Element. Die Befunde zeigen [Ergebniszusammenfassung]. Die Studie belegt, dass kurzzeitige Programme unter einem institutionellen Mandat für Frieden und Diplomatie messbare Zuwächse interkultureller Kompetenz erzeugen, dass die Struktur des Lehrstuhls ein wiederholbares und übertragbares Durchführungsmodell mit nachgewiesener internationaler Reichweite bietet, und dass die Einbindung simulationsbasierter Praxis eine strukturelle Grenze darin behebt, wie verdichtete Programme Verhaltensergebnisse verfolgen. Wir plädieren für die Ausweitung dieses Modells im UNITWIN-Netzwerk und für die Einführung der Ergebnismessung auf Teilnehmendenebene als dortigen Standard.",
      keywords: [
        "Entwicklung interkultureller Kompetenz",
        "UNESCO-Lehrstühle",
        "UNITWIN",
        "kurzzeitige Mobilität",
        "Model United Nations",
        "Friedenspädagogik",
        "Internationalisierung der Hochschulbildung",
      ],
    },

    "from-survival-to-contribution": {
      title: "Vom Überleben zum Beitrag",
      subtitle:
        "Das WISDOM-Programm, vertriebene Frauen in MINT und die friedensbildende Funktion der Hochschulbildung",
      area: "Vertriebene Wissenschaftlerinnen, Zugang zu MINT",
      type: "Arbeitspapier",
      date: "In Arbeit",
      abstract:
        "Hochschulbildung wird regelmäßig als Weg aus der Vertreibung beschrieben, doch der Mechanismus, durch den ein Stipendium mehr wird als materielle Erleichterung, wird selten benannt. Dieser Artikel untersucht das Programm Women in Science Displacement Outreach Master's (WISDOM), eine Partnerschaft zwischen der Istanbul Aydın University (IAU) und der Organization for Women in Science for the Developing World (OWSD), die seit September 2024 eine Kohorte vertriebener Frauen in MINT-Masterprogrammen in Istanbul unterstützt. Auf Grundlage einer Vollerhebung der gesamten Kohorte (N = 13) und teilstrukturierter Interviews mit [n] Teilnehmerinnen untersucht die Studie mit einem retrospektiven Prä-Post-Design Veränderungen in vier Bereichen: wahrgenommene strukturelle Hürden, akademische Selbstwirksamkeit, soziale und berufliche Integration sowie Zukunftsorientierung. Die Befunde zeigen [Richtung und Ausmaß nach der Analyse einzufügen]. Wir argumentieren, dass der eigentliche Beitrag des Programms nicht der Zugang selbst ist, sondern die Umwandlung von Zugang in Handlungsfähigkeit: Die Teilnehmerinnen bewegten sich von einem Überlebenshorizont, in dem Bildung der unmittelbaren Sicherheit dient, hin zu einem Beitragshorizont, in dem Bildung dem Wiederaufbau ihrer Herkunftsländer dient. Wir verorten dies in der eigenen Geschichte von Türkiye als Aufnahmeland vertriebener Wissenschaftlerinnen und Wissenschaftler und argumentieren, dass die Universitätsreform von 1933 zugleich Vorbild und Warnung ist, da die Frauen unter jenen Emigrierten weitgehend aus der Überlieferung gestrichen wurden. Der Artikel bildet das Programm auf die Ziele für nachhaltige Entwicklung ab und schlägt einen wiederholbaren Rahmen für geschlechtergerechte Stipendiengestaltung vor. Grenzen, die sich aus der Kohortengröße, der Selbstauskunft und dem administrativen Verhältnis der Autoren zum Programm ergeben, werden ausdrücklich behandelt.",
      keywords: [
        "Hochschulbildung für Geflüchtete",
        "Frauen in MINT",
        "Vertreibung",
        "Friedensarbeit",
        "Ziele für nachhaltige Entwicklung",
        "Bildungsdiplomatie",
        "Türkiye",
      ],
    },

    "when-the-mou-is-the-outcome": {
      title: "Wenn das Abkommen selbst das Ergebnis ist",
      subtitle:
        "Die Messung der Partnerschaftsaktivierung in der kanadischen und türkischen Hochschulbildung",
      area: "Partnerschaftsmanagement",
      type: "Arbeitspapier",
      date: "In Arbeit",
      abstract:
        "Internationalisierungsstrategien berichten in reifen wie in aufstrebenden Hochschulsystemen zunehmend die Zahl ihrer Partnerschaften als Beleg globalen Engagements. Dieser Artikel fragt, was diese Zahlen messen. Gestützt auf neoinstitutionalistische Darstellungen zeremonieller Konformität und Entkopplung sowie auf Kritiken der Partnerschaftsasymmetrie aus der gemeinwesenorientierten Forschung behandeln wir das Memorandum of Understanding als zeremonielles Instrument, dessen Unterzeichnung häufig der abschließende und nicht der eröffnende Akt ist. Wir erstellen einen vergleichenden Datensatz angekündigter institutioneller Partnerschaften kanadischer und türkischer Universitäten und prüfen jede gegen beobachtbare Aktivierung innerhalb eines Fünfjahresfensters, gemessen an indexierter Ko-Autorschaft, dokumentierter Mobilität von Studierenden und Personal, gemeinsam durchgeführten Programmen, gemeinsamer Promotionsbetreuung und gemeinsam eingeworbenen Drittmitteln. Wir führen die Partnerschaftsaktivierungsrate als Diagnostik ein, zusammen mit einem Maß für die Halbwertszeit von Abkommen, und berichten erhebliche Nichtaktivierung in beiden Systemen, erreicht auf unterschiedlichen Wegen: Legitimitätspflege unter Einschreibungsdruck im kanadischen Fall, Kapazitätssubstitution unter einem nationalen Wachstumsziel im türkischen Fall. Das Muster erinnert an die Vermehrung bilateraler Instrumente in der Zwischenkriegszeit, deren Dichte mit dem Zustand verwechselt wurde, den sie herstellen sollten. Wir argumentieren, dass die Ankündigung von Partnerschaften als institutionelle Aufführung funktioniert, dass sie von Ranking-, Akkreditierungs- und Berichtsregimen getragen wird, die Abkommen zählen statt sie zu prüfen, und dass die Reformkonsequenz nicht weniger Partnerschaften lautet, sondern verpflichtende Offenlegung der Aktivierung. Wir schließen mit dem Vorschlag eines Berichtsstandards für institutionelle Partnerschaftsportfolios.",
      keywords: ["Absichtserklärungen", "Partnerschaftsaktivierung", "Kanada", "Türkiye"],
    },

    "borrowed-instruments-unbuilt-systems": {
      title: "Geliehene Instrumente, ungebaute Systeme",
      subtitle: "Bologna-Konformität und das Erbe des Formalismus in der Ukraine und in Türkiye",
      area: "Theorie der Internationalisierung",
      type: "Arbeitspapier",
      date: "In Arbeit",
      abstract:
        "Die Ukraine und Türkiye sind beide periphere Übernehmende des Bologna-Prozesses, und beide zeigen nahezu vollständige formale Konformität: dreistufige Studienstrukturen, Kreditübertragung, Diploma Supplements, Qualifikationsrahmen und nationale Qualitätssicherungsagenturen. Beide zeigen zugleich anhaltende Lücken zwischen Instrument und Funktion, darunter Kreditanerkennung, die nicht trägt, Lernergebnisse, die nachträglich erzeugt werden, und Qualitätssicherung, die Dokumentation prüft statt Lehre. Der Artikel fragt, warum zwei Systeme mit unähnlichen institutionellen Geschichten auf dasselbe Muster hohler Übernahme zulaufen. Gestützt auf die Forschung zum Politiktransfer und auf die Literatur zu Vertrauen und moralischer Handlungsfähigkeit in Bildungsinstitutionen argumentieren wir, dass jedes System ein eigenes Erbe administrativen Formalismus trägt: im türkischen Fall ein Muster aus der Tanzimat-Zeit, in dem die Einfuhr europäischer institutioneller Form als Erwerb der Institution selbst behandelt wird; im ukrainischen Fall eine postsowjetische Berichtskultur, in der der erzeugte Nachweis die berichtete Tätigkeit ersetzt. Anhand nationaler Umsetzungsberichte, der Dokumentation von Qualitätssicherungsagenturen, Gesetzestexten sowie Mobilitäts- und Anerkennungsdaten, ergänzt durch Experteninterviews in beiden Ländern, zeichnen wir nach, wie jedes Erbe bestimmt, welche Bologna-Instrumente aktiviert werden und welche zeremoniell bleiben. Wir führen Instrumentenaktivierung als Diagnostik und Formalismuserbe als erklärendes Konstrukt ein. Wir argumentieren, dass der wesentliche Preis hohler Konformität nicht administrative Ineffizienz ist, sondern die Erosion institutionellen Vertrauens, und dass diese Erosion sich selbst verstärkt: Sobald Lehrende und Studierende gelernt haben, institutionelle Dokumente als Aufführungen zu lesen, kommt jede spätere inhaltliche Reform bereits diskreditiert an.",
      keywords: ["Bologna-Prozess", "Ukraine", "Türkiye", "Politikformalismus"],
    },
  },

  marks: {
    istanbul: {
      hint: "Von wo aus die Arbeit geschrieben wird",
      title: "Istanbul",
      line: "Die Stadt, aus der das ganze Archiv geschrieben ist.",
    },
    seasons: {
      hint: "Zwei Uhren, ein Leben",
      title: "Jahreszeiten und Semester",
      line: "Der zentrale Gegensatz des Romans: Zeit, die wiederkehrt, gegen Zeit, die abläuft.",
    },
    nationalities: {
      hint: "Im Trainingsraum gezählt",
      title: "Siebzig Nationalitäten",
      line: "Trainings zu interkultureller Kompetenz, durchgeführt in zwölf Ländern mit Teilnehmenden aus mehr als siebzig Nationen.",
    },
    unesco: {
      hint: "Vier Länder, ein Programm",
      title: "Türkiye, Pakistan, Nepal, Irak",
      line: "UNESCO Peace and Diplomacy Programmes.",
    },
    trilogy: {
      hint: "Drei Papiere, die zusammengehören",
      title: "Die Korruptionstrilogie",
      line: "Marginalisierung (n = 580), Selling Merit und das dritte Papier der Reihe.",
    },
    founded: {
      hint: "Zwei Dinge, auf einem Campus begonnen",
      title: "Gegründet an der Istanbul Aydın",
      line: "Das Model-United-Nations-Programm des Campus und STARLIGHT.",
    },
    branch: {
      hint: "Der höchste",
      title: "The Highest Branch",
      line: "Neunundzwanzig Kapitel. Einhundertvierundvierzigtausend Wörter.",
    },
  },

  media: {
    "star-scholars-global-engagement": {
      title: "Global Engagement & Brand Strategy",
      captions: [
        "Am Stand des STAR Scholars Network",
        "STAR Global Conference 2024, Kathmandu University",
        "Vor der Konferenzwand",
        "Vor dem Konferenzprogramm",
        "Der Stand des STAR Scholars Network",
        "Delegierte auf der STAR Global Conference 2024",
        "Delegierte vor dem Veranstaltungsort",
        "Mit einem Kollegen auf der Konferenz",
        "Kathmandu University, STAR Global Conference 2024",
      ],
    },
    "unesco-peace-diplomacy": {
      title: "UNESCO Peace and Diplomacy Programmes",
      captions: [
        "Bei der Leitung einer Sitzung",
        "Mit dem Team des UNESCO-Programms",
        "Mit der gastgebenden Institution",
        "Vor dem Veranstaltungsort",
      ],
    },
    "international-student-recruitment": {
      title: "Internationale Studierendengewinnung",
      captions: [
        "Auf der Messe, Stand der İstanbul Nişantaşı University",
        "Im Gespräch mit einer Interessentin über das Angebot",
        "Am Stand",
      ],
    },
    icd: {
      title: "ICD-Training",
      captions: [
        "Bei der Leitung einer Sitzung",
        "Eine laufende Sitzung",
        "Vortrag über die Marginalisierung der internationalen Studierendenschaft",
        "Die gesamte Gruppe",
        "Workshop „ICD in Higher Education“, Kathmandu, Nepal",
        "Teilnehmende zwischen den Sitzungen",
      ],
    },
    award: {
      title: "Presidential Award of Service and Excellence",
      captions: [
        "Die Auszeichnung, STAR Global Conference 2024",
        "Mit Dr. Osman Gültekin, Kathmandu University, Nepal",
      ],
    },
    mun: {
      title: "Model United Nations",
      captions: [
        "Auf der Bühne bei IAUMUN",
        "Delegierte und Organisatoren, Istanbul Aydın University",
        "Die Eröffnungssitzung",
        "Ein Ausschuss in Sitzung",
        "Entgegennahme einer Urkunde auf der Konferenz",
        "Ein Ausschussraum",
        "Ausschussarbeit",
      ],
    },
    starlight: {
      title: "STARLIGHT",
      captions: ["Ein STARLIGHT-Titelbild", "Mit Exemplaren des Magazins"],
    },
  },
};
