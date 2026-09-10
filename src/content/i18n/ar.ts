import type { DictionaryOverlay } from "@/lib/i18n/dictionary";
import type { ContentOverlay } from "@/lib/i18n/content";

/**
 * Arabic.
 *
 * The novel's title stays in English: there is no Arabic edition and no
 * Arabic title, and inventing one would promise a book that does not exist.
 * IRIS, ICD, IMG and IPI are names of instruments rather than descriptions,
 * so they stay as they are, and the Latin runs inside the Arabic the way it
 * does in any Arabic academic page.
 *
 * The page runs right to left, and the eyebrow labels lose their uppercase
 * and their letter-spacing in globals.css: Arabic has no upper case, and
 * tracked-out Naskh breaks the joins between letters.
 */

export const ar: DictionaryOverlay = {
  languageName: "العربية",

  nav: {
    author: "الكاتب",
    work: "الأعمال",
    research: "البحث",
    journal: "المجلة",
    contact: "المراسلة",
    novel: "الرواية",
    novelTitle: "The Highest Branch",
  },

  header: {
    home: "سعدان قاسماني — الصفحة الرئيسية",
    menu: "القائمة",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    skipToContent: "الانتقال إلى المحتوى",
    language: "اللغة",
    chooseLanguage: "اختر لغة",
    browse: "تصفح",
  },

  announcement: {
    eyebrow: "يصدر في ١٩ أكتوبر ٢٠٢٦",
    heading: "The Highest Branch",
    body: "في السابعة عشرة يعبر فتى الممرّ، تاركًا غابةً يعرفها بفصولها إلى بلدٍ يقيس الزمن بالفصول الدراسية.",
    ask: "اترك عنوانك وستعرف يوم صدورها. لا شيء غير ذلك.",
    placeholder: "you@example.com",
    submit: "أخبرني عند صدورها",
    sending: "جارٍ الإرسال",
    done: "ستصلك رسالة في ذلك اليوم.",
    readMore: "اقرأ عن الرواية",
    dismiss: "إغلاق",
    later: "ليس الآن",
  },

  newsletter: {
    emailLabel: "البريد الإلكتروني",
    placeholder: "your@email.com",
    subscribe: "اشترك",
    sending: "جارٍ الإرسال",
    done: "لقد دخلت إلى المراسلة.",
    failed: "حدث خطأ ما. حاول مرة أخرى.",
  },

  footer: {
    releaseLine: "١٩ أكتوبر ٢٠٢٦",
    theNovel: "الرواية",
    correspondence: "المراسلة",
    lettersHeading: "رسائل من الأرشيف، تُرسل نادرًا.",
    lettersBody: "أبحاث جديدة، ومقالات من المجلة، وأخبار عن",
    lettersBodyAfter: "— فقط حين يكون هناك ما يستحق القول.",
    index: "الفهرس",
    orderACopy: "اطلب نسخة",
    rights: "سعدان قاسماني · إسطنبول",
    positioning: "كاتب وباحث واستراتيجي",
  },

  home: {
    location: "إسطنبول",
    hoverHint: "مرّر المؤشر فوق النقاط المعلّمة لتتبع المسار",
    scroll: "مرّر",
    author: "الكاتب",
    portraitLabel: "صورة الكاتب",
    readBiography: "اقرأ السيرة",
    practice: "الممارسة",
    practiceHeading: "تدريبٌ حيث تكون الأسئلة أصعب ما تكون.",
    countries: "دولة",
    nationalities: "جنسية",
    papersInProgress: "ورقة بحثية قيد الإعداد",
    archive: "الأرشيف",
    researchInProgress: "أبحاث قيد الإعداد",
    allResearch: "كل الأبحاث",
    novelEyebrow: "الرواية",
    enterTheNovel: "ادخل الرواية",
    chapters: "فصلًا",
    words: "كلمة",
  },

  about: {
    eyebrow: "الكاتب",
    titleLead: "الشخص",
    titleAccent: "",
    biography: "السيرة",
    portraitLabel: "صورة الكاتب",
    theWork: "الأعمال",
    currentRoles: "المناصب الحالية",
    practice: "الممارسة",
    founded: "أسّس",
    recognition: "التكريم",
    theResearch: "الأبحاث",
    getInTouch: "تواصل",
    metaDescription: "سيرة {name}، {positioning}.",
  },

  work: {
    eyebrow: "الأعمال",
    titleLead: "أرشيف",
    titleAccent: "حيّ",
    lede: "أعمال أكاديمية ومهنية وإبداعية — تُضاف باستمرار لا تُنتقى مرة واحدة.",
    metaDescription: "أرشيف حيّ للمشاريع والمناصب والمبادرات.",
    recruitmentTitleLead: "استقطاب الطلاب",
    recruitmentTitleAccent: "الدوليين",
    viewGallery: "شاهد المعرض",
    openGallery: "افتح معرض صور {name}",
    lookInto: "اطّلع على {name}",
    detailLabels: {
      iris: "IRIS",
      icd: "ICD",
      recruitment: "الاستقطاب",
    },
    categories: {
      Academic: "أكاديمي",
      Research: "بحث",
      Publications: "منشورات",
      "International Education": "التعليم الدولي",
      "Global Engagement": "الانخراط العالمي",
      Strategy: "استراتيجية",
      Writing: "كتابة",
      "Creative Work": "عمل إبداعي",
      Projects: "مشاريع",
    },
  },

  research: {
    eyebrow: "الأرشيف",
    titleLead: "أرشيف",
    titleAccent: "البحث",
    lede: "أوراق عمل في الاقتصاد السياسي للتدويل، والعلامة الوطنية، وأمننة الطلاب الدوليين. الأوراق المقيّدة لا تُرسل إلا بعد مراجعة الطلب شخصيًا.",
    metaDescription:
      "أوراق عمل وأبحاث أكاديمية في الاقتصاد السياسي للتدويل، والعلامة الوطنية، وأمننة الطلاب الدوليين.",
    shapeEyebrow: "شكل المسألة",
    shapeHeading: "تسع أوراق، سؤال واحد.",
    shapeBody:
      "كيف تقول المؤسسات شيئًا عن الطلاب الدوليين وتفعل شيئًا آخر — متتبَّعًا عبر أدوات السياسات والشراكات والاستحقاق والأمن.",
    trilogyNote: "ثلاث منها تنتمي إلى مجموعة واحدة",
    all: "الكل",
    entryCount: "مدخل واحد",
    entryCountPlural: "{count} مدخلًا",
    readAbstract: "اقرأ الملخص",
    fullEntry: "المدخل الكامل",
    openFullEntry: "افتح المدخل الكامل",
    abstract: "الملخص",
    withAuthors: "بالاشتراك مع {names}",
    withAuthorsInline: "مع {names}",
    and: "و",
    viewPaper: "اطّلع على الورقة",
    requestAccess: "اطلب الوصول",
    requestInstrument: "اطلب {name}",
    requestTheInstrument: "اطلب الأداة",
    restricted: "مقيّد",
    close: "إغلاق",
    whatAreImgIpi: "ما هما IMG و IPI؟",
    abstractOf: "الملخص — {title}",
    requestAccessTo: "اطلب الوصول إلى {title}",
    keywords: "الكلمات المفتاحية",
    authors: "المؤلفون",
    instrumentNote: "تحمل هذه الورقة أداةً يمكن للقراء طلب استخدامها.",
    backToArchive: "العودة إلى الأرشيف",
  },

  paper: {
    backToArchive: "الأرشيف",
    abstract: "الملخص",
    keywords: "الكلمات المفتاحية",
    openAccess: "وصول مفتوح",
    restricted: "مقيّد",
    readThePaper: "اقرأ الورقة",
    requestAccess: "اطلب الوصول",
    viewPaper: "اطّلع على الورقة",
    allNine: "الأوراق التسع",
    and: "و",
  },

  journal: {
    eyebrow: "المجلة",
    titleLead: "مقالات",
    titleAccent: "وملاحظات",
    lede: "كتابة تقف بين البحث والرواية.",
    metaDescription: "مقالات وتأملات وتعليقات.",
    comingSoon: "قريبًا",
    comingSoonHeading: "المقالات الأولى ما زالت تُكتب.",
    comingSoonBody:
      "أنت على القائمة، فكل مقال سيصلك حال نشره. هنا ستعيش الكتابة التي تقف بين البحث والرواية.",
    coverLabel: "الغلاف",
    gate: {
      eyebrow: "للمشتركين",
      heading: "المقالات والملاحظات للمشتركين.",
      body: "ملاحظات من الأرشيف، وحجج ما زالت تتشكّل، وبين حين وآخر نصٌّ لا ينتمي إلى البحث ولا إلى الرواية. اشترك وتُفتح هذه الصفحة على الفور؛ ويصلك بالبريد رمز وصول للمرة القادمة، ورسالة كلما نُشر شيء جديد.",
      subscribe: "اشترك",
      emailPlaceholder: "you@example.com",
      enter: "ادخل",
      unlocksNote: "تُفتح الصفحة لحظة اشتراكك.",
      haveCode: "لديك رمز بالفعل",
      codePlaceholder: "رمز الوصول",
      unlock: "افتح",
      codeNote: "كان في الرسالة التي وصلتك عند الاشتراك.",
      enterCode: "أدخل رمز الوصول.",
      wrongCode: "هذا الرمز غير صحيح. راجع الرسالة التي وصلتك.",
      badEmail: "أدخل بريدًا إلكترونيًا صحيحًا.",
      notConnected: "القائمة غير موصولة بعد. استخدم رمز الوصول في الوقت الحالي.",
      failed: "حدث خطأ ما. حاول مرة أخرى.",
    },
  },

  contact: {
    eyebrow: "المراسلة",
    titleLead: "تواصل",
    titleAccent: "معنا",
    lede: "للاستفسارات المهنية، ودعوات المحاضرات، والتعاون البحثي، أو المراسلة العامة.",
    metaDescription: "تواصل، أو اطلب تواصلًا مهنيًا، أو حدّد موعدًا.",
    basedIn: "مقيم في",
    appointments: "المواعيد",
    bookingNote:
      "الحجز يتم عبر {provider}. اختر وقتًا يناسبك وسيُدرج مباشرة في التقويم.",
    bookATime: "احجز موعدًا",
    elsewhere: "في أماكن أخرى",
  },

  forms: {
    required: "مطلوب",
    invalidEmail: "أدخل بريدًا إلكترونيًا صحيحًا",
    somethingWrong: "حدث خطأ ما.",
    tryAgain: "حدث خطأ ما. حاول مرة أخرى.",
    sending: "جارٍ الإرسال…",
    close: "إغلاق",
    cancel: "إلغاء",

    name: "الاسم",
    fullName: "الاسم الكامل",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    phoneNumber: "رقم الهاتف",
    subject: "الموضوع",
    message: "الرسالة",
    optionalMessage: "رسالة اختيارية",
    country: "الدولة",
    city: "المدينة",
    institution: "المؤسسة",
    position: "المنصب",
    reason: "سبب طلب الوصول",
    shippingAddress: "عنوان الشحن",
    quantity: "الكمية",

    sendMessage: "أرسل الرسالة",
    contactDone: "وصلتنا رسالتك. شكرًا لك.",

    submitRequest: "أرسل الطلب",
    requestingAccess:
      "أنت تطلب الوصول إلى {title}. تُراجَع كل طلب قبل إرسال أي شيء.",
    requestDone:
      "وصلنا طلبك بشأن {title}. تُراجَع كل طلب على حدة — وسيصلك رد إن تمت الموافقة.",

    submitOrder: "أرسل الطلب",
    orderDone:
      "وصلنا طلبك. يراجع فريقنا كل طلب شخصيًا — وستصلك تعليمات الدفع والشحن بالبريد الإلكتروني بمجرد تأكيده. لا حاجة إلى الدفع الآن.",
    orderNote:
      "لا يجمع هذا النموذج أي بيانات دفع أو بيانات مصرفية. يراجع فريقنا كل طلب شخصيًا ويرسل تعليمات الدفع مباشرة بمجرد تأكيد طلبك.",
  },

  novel: {
    aNovel: "رواية",
    titleLead: "The Highest",
    titleAccent: "Branch",
    theBook: "الكتاب",
    coverAlt: "غلاف {title}",
    coverLabel: "غلاف الكتاب",
    chapters: "الفصول",
    words: "الكلمات",
    form: "الشكل",
    status: "الحالة",
    availability: "التوافر",
    orderACopy: "اطلب نسخة",
    byline: "{title} — رواية بقلم {name}",
    purchase: {
      amazonTab: "الاتحاد الأوروبي والأمريكتان",
      amazonNote: "عبر أمازون",
      directTab: "تركيا وباكستان",
      directNote: "طلب مباشر",
      amazonBody: "متاحة للقراء في {regions} عبر أمازون.",
      buyOnAmazon: "اشترِ من أمازون",
      amazonPending: "سيظهر رابط أمازون هنا بمجرد إدراج الكتاب.",
    },
  },

  detail: {
    workPractice: "الأعمال · الممارسة",
    workProgramme: "الأعمال · البرنامج",
    workProject: "الأعمال · المشروع",
    backToTheWork: "العودة إلى الأعمال",

    iris: {
      requestDemo: "اطلب عرضًا تجريبيًا",
      enterAccessCode: "أدخل رمز الوصول",
      sectionProblem: "المشكلة",
      sectionBackbone: "العمود التشخيصي",
      sectionFilm: "الفيلم",
      sectionWhatItDoes: "ماذا يفعل",
      sectionArchitecture: "البنية",
      withheldModules: "وحدات IRIS الثماني محجوبة مع الفيلم.",
      withheldArchitecture: "كيف بُني IRIS من طرفٍ إلى طرف محجوبٌ مع الفيلم.",
      openFilmFullScreen: "افتح الفيلم بملء الشاشة",
      unlockTheFilm: "افتح الفيلم",
      filmTitle: "IRIS — الفيلم التعريفي",
      soundNote: "الصوت مغلق حتى تشغّله من داخل الفيلم.",
      lock: {
        eyebrow: "رمز الوصول مطلوب",
        heading: "الفيلم وقائمة الوحدات والبنية محجوبة.",
        body: "لم يُطرح IRIS للعموم بعد. تواصل مع سعدان للحصول على رمز الوصول، وتُفتح الأقسام الثلاثة معًا، في هذه الصفحة، لمدة شهر.",
        requestTheCode: "اطلب الرمز",
        enterCode: "أدخل الرمز",
        checking: "جارٍ التحقق…",
        unlock: "افتح",
        wrongCode: "هذا الرمز غير صحيح.",
        enterSomething: "أدخل رمز الوصول.",
      },
    },

    icd: {
      sectionWhoFor: "لمن هو",
      sectionHowItRuns: "كيف يجري",
      sectionWorkingTogether: "العمل معًا",
      bringToInstitution: "أحضر هذا إلى مؤسستك.",
      outcomes: "المخرجات",
      deliveredIn: "قُدّم في",
      fromTheSessions: "من الجلسات",
      galleryLabel: "تدريب ICD",
      photographs: "صور",
      getInTouch: "تواصل",
      theResearchBehindIt: "البحث وراءه",
    },

    recruitment: {
      sectionWhatItAnswers: "ما الذي يجيب عنه",
      sectionWorkingTogether: "العمل معًا",
      thePipeline: "المسار",
      marketIntelligence: "معرفة الأسواق",
      movesUpOn: "يرتقي الشريك بناءً على",
      tier: {
        status: "الحالة",
        relationship: "العلاقة",
        incentives: "الحوافز",
        meetings: "الاجتماعات",
      },
      fromTheField: "من الميدان",
      galleryLabel: "عمل الاستقطاب",
      scheduleConsultation: "حدّد موعد استشارة",
      sendMessageInstead: "أرسل رسالة بدلًا من ذلك",
    },
  },

  gallery: {
    eyebrow: "المعرض",
    photographs: "صور",
    openPhotographs: "افتح صور {name}",
    close: "إغلاق",
  },

  marginalia: {
    name: "الهوامش",
    foundCount: "{found} من {total}",
    body: "تُركت سبع علامات على هوامش هذا الموقع، كما يعلّق قارئ على كتابٍ ينوي الاحتفاظ به. كل واحدة منها تبوح بشيء صحيح.",
    readersCard: "بطاقة القارئ",
    readersCardHeading: "أنت تقرأ الهوامش. معظم الناس لا يفعلون.",
    readersCardBody: "ادخل إلى المراسلة — أبحاث جديدة، ومقالات من المجلة، وأخبار عن",
    readersCardBodyAfter: "، تُرسل نادرًا.",
    clear: "امسح المجموعة",
    markFound: "عُثر على هامش: {title}. {line}",
    markUnfound: "علامة على الهامش: {hint}",
    indicator: "الهوامش: {found} من {total}. افتح المجموعة.",
    close: "إغلاق",
  },

  art: {
    tiers:
      "ثلاث درجات للشركاء، يُكتسب الصعود فيها بالتحويل وسرعة الاستجابة وجودة الإحالات",
    constellation: "كوكبة من مجالات البحث والأوراق",
    constellationHint: "مرّر المؤشر فوق نقطة لتتبع ورقة عبر مجالها.",
    globe:
      "خريطة لنصف الكرة الشرقي بمسارات من إسطنبول إلى ألمانيا وقطر والإمارات العربية المتحدة وباكستان ونيبال والعراق",
    branch:
      "شجرة تعلّم أغصانها وجذورها مراحل عمل سعدان قاسماني، من شهادتي A و O Levels عند الجذور إلى رواية The Highest Branch في التاج",
    istanbul: "إسطنبول",
  },

  seasons: {
    eyebrow: "الرواية · الأطروحة",
    heading: "طريقتان لقياس حياة.",
    forestLead: "غابة يعرفها بفصولها",
    forestRest:
      "— زمنٌ يعود، ويدور، ويغفر. نموٌّ يُقاس بالحلقات لا بالنتائج.",
    semestersLead: "بلدٌ يقيس الزمن بالفصول الدراسية",
    semestersRest: "— زمنٌ يتقدّم، ويحاسب، وينتهي. نموٌّ يُقاس بموعدٍ نهائي.",
    note: "المسافة بين هاتين الساعتين هي موضوع البحث والرواية معًا.",
    forest: "الغابة",
    city: "المدينة",
  },

  translation: {
    machineNotice:
      "هذه الصفحة ترجمة. وحيث تحمل الكلمة وزنًا، فالأصل الإنجليزي هو ما كُتب.",
    abstractNotice: "ترجمة غير رسمية. الملخص المنشور بالإنجليزية.",
    showOriginal: "أظهر الأصل الإنجليزي",
    hideOriginal: "أخفِ الأصل الإنجليزي",
    originalHeading: "الأصل الإنجليزي",
  },
};

export const arContent: ContentOverlay = {
  person: {
    positioning: "كاتب وباحث واستراتيجي",
    location: "إسطنبول، تركيا",
    bio: "سعدان قاسماني مختص في التدويل وباحث وروائي مقيم في إسطنبول. يعمل استراتيجيًا للانخراط العالمي والعلامة المؤسسية، وشارك في تأسيس IRIS، وهي منصة برمجية لإدارة التدويل. يمتد عمله المهني إلى استقطاب الطلاب وإدارة الشراكات والتدريب على الكفاءة الثقافية، مقدَّمًا في اثني عشر بلدًا لمشاركين من أكثر من سبعين جنسية، بما في ذلك برامج اليونسكو للسلام والدبلوماسية، في تركيا وباكستان ونيبال والعراق. يُعِدّ درجة الماجستير في العلوم السياسية والعلاقات الدولية في جامعة إسطنبول آيدن، حيث أسّس أيضًا برنامج نموذج الأمم المتحدة في الحرم الجامعي وSTARLIGHT. تتركّز أبحاثه على الاقتصاد السياسي للتدويل، والعلامة الوطنية، وأمننة الطلاب الدوليين.",
    practitionerNote:
      "عمل مهني في استقطاب الطلاب وإدارة الشراكات والتدريب على تنمية الكفاءة الثقافية (ICD)، مقدَّم في ١٢ بلدًا لمشاركين من أكثر من ٧٠ جنسية، بما في ذلك برامج اليونسكو للسلام والدبلوماسية، في تركيا وباكستان ونيبال والعراق.",
    roles: [
      { title: "مدير الانخراط العالمي واستراتيجية العلامة" },
      { title: "شريك مؤسس", org: "IRIS — منصة برمجية لإدارة التدويل" },
      { title: "طالب ماجستير، العلوم السياسية والعلاقات الدولية" },
    ],
    founded: [{ name: "برنامج نموذج الأمم المتحدة" }, { name: "STARLIGHT" }],
    honors: [
      {
        title: "جائزة الرئاسة للخدمة والتميّز",
        org: "مؤتمر STAR العالمي ٢٠٢٤، جامعة كاتماندو، نيبال",
      },
    ],
  },

  book: {
    genre: "أدب رمزي، يُروى على هيئة حكاية",
    tagline: "لأن الأعلى هو حيث تسقط الأشياء منه.",
    status: "تصدر في ١٩ أكتوبر ٢٠٢٦",
    synopsis:
      "في السابعة عشرة يعبر فتى الممرّ، تاركًا غابةً يعرفها بفصولها إلى بلدٍ يقيس الزمن بالفصول الدراسية. وما يلي حكايةٌ عن الوصول، وعن العمارة البطيئة للانتماء وأثمانها، تُروى عبر السنوات التي تُحوِّل طالبًا إلى شخصٍ قد لا تعرفه أمه.",
    subject:
      "تجربة الطالب الدولي، متتبَّعةً عبر حياة بطلٍ من المراهقة إلى مسارٍ مهني وأكاديمي في الخارج.",
    amazonRegions: "الاتحاد الأوروبي والأمريكتان",
    directRegions: "تركيا وباكستان",
    directNote:
      "طلب مباشر — تُرسل تفاصيل الدفع يدويًا بعد المراجعة، ولا تُرسل تلقائيًا أبدًا.",
  },

  instrumentLabel: "حاسبة IMG و IPI",
  instrumentDefinition:
    "أداتان اقتصاديتان قياسيتان (Gültekin & Qasmani). تقيس IMG حجم الفجوة في إدارة التدويل لدى مؤسسة ما، انطلاقًا من عدم تناظر المعلومات، وتشتّت سير العمل، ونقص البنية الرقمية. وتقيس IPI القدرة على سدّ تلك الفجوة، انطلاقًا من التزام القيادة وجاهزية أعضاء هيئة التدريس. وقراءتهما معًا تضع المؤسسة في واحد من أربعة تصنيفات.",

  researchNote: {
    before: "كل بحثٍ هنا هو بالتعاون مع ",
    after: "، أو توسيعٌ لعمله.",
  },

  work: {
    iris: {
      title: "IRIS — International Relations Intelligent System",
      summary:
        "أُسّس بالاشتراك مع EduYork. التدويل، محوَّلًا من إجراء إداري إلى وظيفة استراتيجية قابلة للقياس تقوم على البيانات، على أساس الإطارين الاقتصاديين القياسيين IMG و IPI.",
    },
    icd: {
      title: "تنمية الكفاءة الثقافية",
      summary:
        "تدريب للطلاب وأعضاء هيئة التدريس والإدارة، مصمَّم حول نتيجة مفادها أن الكفاءة الثقافية صفةٌ للمؤسسة لا للفرد. قُدّم في تركيا وباكستان والعراق ونيبال وألمانيا.",
    },
    "star-scholars-global-engagement": {
      title: "الانخراط العالمي واستراتيجية العلامة",
      summary:
        "قيادة الانخراط العالمي واستراتيجية العلامة لشبكة تمتد عبر ١١٥ بلدًا و٢٣٥٣ جامعة وأكثر من ٢٠٠٠٠ باحث.",
      linkLabel: "زيارة موقع STAR Scholars",
    },
    "international-student-recruitment": {
      title: "استقطاب الطلاب الدوليين",
      summary:
        "استقطاب في تركيا وباكستان ونيبال والعراق، يقوم على إطار شراكة متدرّج: ينتقل الوكلاء من الاستكشاف إلى الدرجة الأعلى بثبات معدّل التحويل، وسرعة الاستجابة، وجودة الإحالات، وتحمل كل درجة حوافزها ودورة مراجعتها الخاصة.",
    },
    "unesco-peace-diplomacy": {
      title: "برامج اليونسكو للسلام والدبلوماسية",
      summary:
        "برامج دولية قصيرة الأمد تُدار تحت كرسي اليونسكو، وفي قلبها تنمية الكفاءة الثقافية.",
      linkLabel: "زيارة موقع البرنامج",
    },
  },

  marks: {
    istanbul: {
      hint: "من حيث يُكتب هذا العمل",
      title: "إسطنبول",
      line: "المدينة التي كُتب منها الأرشيف كله.",
    },
    seasons: {
      hint: "ساعتان، حياة واحدة",
      title: "الفصول والفصول الدراسية",
      line: "التقابل المركزي في الرواية: زمنٌ يعود في مقابل زمنٍ ينتهي.",
    },
    nationalities: {
      hint: "أُحصيت في قاعة التدريب",
      title: "سبعون جنسية",
      line: "تدريب على الكفاءة الثقافية قُدّم في اثني عشر بلدًا لمشاركين من أكثر من سبعين جنسية.",
    },
    unesco: {
      hint: "أربعة بلدان، برنامج واحد",
      title: "تركيا، باكستان، نيبال، العراق",
      line: "برامج اليونسكو للسلام والدبلوماسية.",
    },
    trilogy: {
      hint: "ثلاث أوراق ينتمي بعضها إلى بعض",
      title: "ثلاثية الفساد",
      line: "التهميش (ن = ٥٨٠)، وSelling Merit، والورقة الثالثة من المجموعة.",
    },
    founded: {
      hint: "شيئان بدآ في حرم جامعي",
      title: "تأسّسا في جامعة إسطنبول آيدن",
      line: "برنامج نموذج الأمم المتحدة في الحرم الجامعي وSTARLIGHT.",
    },
    branch: {
      hint: "الأعلى",
      title: "The Highest Branch",
      line: "تسعة وعشرون فصلًا. مئة وأربعة وأربعون ألف كلمة.",
    },
  },

  media: {
    "star-scholars-global-engagement": {
      title: "الانخراط العالمي واستراتيجية العلامة",
      captions: [
        "عند جناح شبكة STAR Scholars",
        "مؤتمر STAR العالمي ٢٠٢٤، جامعة كاتماندو",
        "أمام خلفية المؤتمر",
        "أمام برنامج المؤتمر",
        "جناح شبكة STAR Scholars",
        "المشاركون في مؤتمر STAR العالمي ٢٠٢٤",
        "المشاركون خارج مقر المؤتمر",
        "مع زميل في المؤتمر",
        "جامعة كاتماندو، مؤتمر STAR العالمي ٢٠٢٤",
      ],
    },
    "unesco-peace-diplomacy": {
      title: "برامج اليونسكو للسلام والدبلوماسية",
      captions: [
        "أثناء إدارة جلسة",
        "مع فريق برنامج اليونسكو",
        "مع المؤسسة المضيفة",
        "خارج مقر البرنامج",
      ],
    },
    "international-student-recruitment": {
      title: "استقطاب الطلاب الدوليين",
      captions: [
        "في المعرض، جناح جامعة إسطنبول نيشانتاشي",
        "شرح العرض لطالبة مرتقبة",
        "عند الجناح",
      ],
    },
    icd: {
      title: "تدريب ICD",
      captions: [
        "أثناء إدارة جلسة",
        "جلسة جارية",
        "تقديم عن تهميش مجتمع الطلاب الدوليين",
        "المجموعة كاملة",
        "ورشة «ICD in Higher Education»، كاتماندو، نيبال",
        "المشاركون بين الجلسات",
      ],
    },
    award: {
      title: "جائزة الرئاسة للخدمة والتميّز",
      captions: [
        "الجائزة، مؤتمر STAR العالمي ٢٠٢٤",
        "مع د. عثمان غولتكين، جامعة كاتماندو، نيبال",
      ],
    },
    mun: {
      title: "نموذج الأمم المتحدة",
      captions: [
        "على منصة IAUMUN",
        "المشاركون والمنظمون، جامعة إسطنبول آيدن",
        "الجلسة الافتتاحية",
        "لجنة منعقدة",
        "تسلّم شهادة في المؤتمر",
        "قاعة لجنة",
        "عمل اللجان",
      ],
    },
    starlight: {
      title: "STARLIGHT",
      captions: ["غلاف من STARLIGHT", "مع نسخ من المجلة"],
    },
  },
};
