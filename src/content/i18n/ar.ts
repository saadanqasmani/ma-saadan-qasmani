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

export const arContent: ContentOverlay = {};
