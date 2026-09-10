import type { DictionaryOverlay } from "@/lib/i18n/dictionary";
import type { ContentOverlay } from "@/lib/i18n/content";

/**
 * Urdu.
 *
 * Set in Nastaliq, which is what an Urdu reader reads; a Naskh Urdu page
 * reads as a foreign one. Nastaliq slopes steeply and needs far more room
 * between lines than the Latin faces, so globals.css opens the leading up
 * and drops the uppercase and letter-spacing from the labels.
 *
 * The novel's title stays in English: there is no Urdu edition and no Urdu
 * title. IRIS, ICD, IMG and IPI are names rather than descriptions and stay
 * as they are.
 */

export const ur: DictionaryOverlay = {
  languageName: "اردو",

  nav: {
    author: "مصنف",
    work: "کام",
    research: "تحقیق",
    journal: "جریدہ",
    contact: "خط و کتابت",
    novel: "ناول",
    novelTitle: "The Highest Branch",
  },

  header: {
    home: "سعدان قاسمانی — صفحۂ اول",
    menu: "مینو",
    openMenu: "مینو کھولیں",
    closeMenu: "مینو بند کریں",
    skipToContent: "مواد پر جائیں",
    language: "زبان",
    chooseLanguage: "زبان منتخب کریں",
    browse: "فہرست",
  },

  announcement: {
    eyebrow: "۱۹ اکتوبر ۲۰۲۶ کو شائع ہو رہی ہے",
    heading: "The Highest Branch",
    body: "سترہ برس کی عمر میں ایک لڑکا درّہ عبور کرتا ہے، اُس جنگل کو چھوڑ کر جسے وہ اُس کے موسموں سے پہچانتا ہے، ایک ایسے ملک کی طرف جو وقت کو سمسٹروں میں ناپتا ہے۔",
    ask: "اپنا پتہ چھوڑ جائیے، اشاعت کے دن آپ کو خبر مل جائے گی۔ اِس کے سوا کچھ نہیں۔",
    placeholder: "you@example.com",
    submit: "اشاعت پر مجھے اطلاع دیں",
    sending: "بھیجا جا رہا ہے",
    done: "اُس دن آپ کو اطلاع مل جائے گی۔",
    readMore: "ناول کے بارے میں پڑھیں",
    dismiss: "بند کریں",
    later: "ابھی نہیں",
  },

  newsletter: {
    emailLabel: "ای میل پتہ",
    placeholder: "your@email.com",
    subscribe: "رکن بنیں",
    sending: "بھیجا جا رہا ہے",
    done: "آپ خط و کتابت میں شامل ہو گئے۔",
    failed: "کچھ گڑبڑ ہو گئی۔ دوبارہ کوشش کیجیے۔",
  },

  footer: {
    releaseLine: "۱۹ اکتوبر ۲۰۲۶",
    theNovel: "ناول",
    correspondence: "خط و کتابت",
    lettersHeading: "آرکائیو سے خطوط، کبھی کبھار۔",
    lettersBody: "نئی تحقیق، جریدے کی تحریریں، اور",
    lettersBodyAfter: "کی خبریں — صرف جب کہنے کو کچھ ہو۔",
    index: "اشاریہ",
    orderACopy: "ایک نسخہ منگوائیں",
    rights: "سعدان قاسمانی · استنبول",
    positioning: "مصنف، محقق اور حکمت کار",
  },

  home: {
    location: "استنبول",
    hoverHint: "کام کا سلسلہ دیکھنے کے لیے نشان زدہ مقامات پر مؤشر لے جائیں",
    scroll: "نیچے جائیں",
    author: "مصنف",
    portraitLabel: "مصنف کی تصویر",
    readBiography: "سوانح پڑھیں",
    practice: "عملی کام",
    practiceHeading: "تربیت وہاں، جہاں سوال سب سے مشکل ہیں۔",
    countries: "ممالک",
    nationalities: "قومیتیں",
    papersInProgress: "زیرِ تکمیل تحقیقی مقالے",
    archive: "آرکائیو",
    researchInProgress: "زیرِ تکمیل تحقیق",
    allResearch: "تمام تحقیق",
    novelEyebrow: "ناول",
    enterTheNovel: "ناول میں داخل ہوں",
    chapters: "ابواب",
    words: "الفاظ",
  },

  about: {
    eyebrow: "مصنف",
    titleLead: "شخص",
    titleAccent: "",
    biography: "سوانح",
    portraitLabel: "مصنف کی تصویر",
    theWork: "کام",
    currentRoles: "موجودہ ذمہ داریاں",
    practice: "عملی کام",
    founded: "بنیاد رکھی",
    recognition: "اعزازات",
    theResearch: "تحقیق",
    getInTouch: "رابطہ کریں",
    metaDescription: "{name} کی سوانح، {positioning}۔",
  },

  work: {
    eyebrow: "کام",
    titleLead: "ایک زندہ",
    titleAccent: "آرکائیو",
    lede: "علمی، پیشہ ورانہ اور تخلیقی کام — ایک بار چنا ہوا نہیں، بلکہ مسلسل بڑھتا ہوا۔",
    metaDescription: "منصوبوں، ذمہ داریوں اور اقدامات کا ایک زندہ آرکائیو۔",
    recruitmentTitleLead: "بین الاقوامی طلبہ کی",
    recruitmentTitleAccent: "بھرتی",
    viewGallery: "گیلری دیکھیں",
    openGallery: "{name} کی تصاویر کھولیں",
    lookInto: "{name} دیکھیں",
    detailLabels: {
      iris: "IRIS",
      icd: "ICD",
      recruitment: "بھرتی کا کام",
    },
    categories: {
      Academic: "علمی",
      Research: "تحقیق",
      Publications: "مطبوعات",
      "International Education": "بین الاقوامی تعلیم",
      "Global Engagement": "عالمی روابط",
      Strategy: "حکمتِ عملی",
      Writing: "تحریر",
      "Creative Work": "تخلیقی کام",
      Projects: "منصوبے",
    },
  },

  research: {
    eyebrow: "آرکائیو",
    titleLead: "تحقیقی",
    titleAccent: "آرکائیو",
    lede: "بین الاقوامیت کی سیاسی معیشت، قومی برانڈنگ، اور بین الاقوامی طلبہ کی سیکیورٹائزیشن پر تحقیقی مقالے۔ محدود رسائی والے مقالے صرف درخواست کے ذاتی جائزے کے بعد بھیجے جاتے ہیں۔",
    metaDescription:
      "بین الاقوامیت کی سیاسی معیشت، قومی برانڈنگ، اور بین الاقوامی طلبہ کی سیکیورٹائزیشن پر تحقیقی مقالے اور علمی کام۔",
    shapeEyebrow: "معاملے کی ساخت",
    shapeHeading: "نو مقالے، ایک سوال۔",
    shapeBody:
      "ادارے بین الاقوامی طلبہ کے بارے میں کہتے کچھ ہیں اور کرتے کچھ اور — پالیسی کے آلات، شراکتوں، استحقاق اور سلامتی کے راستے سے دیکھا گیا۔",
    trilogyNote: "اِن میں سے تین ایک ہی سلسلے کا حصہ ہیں",
    all: "سب",
    entryCount: "{count} اندراج",
    entryCountPlural: "{count} اندراجات",
    readAbstract: "خلاصہ پڑھیں",
    fullEntry: "مکمل اندراج",
    openFullEntry: "مکمل اندراج کھولیں",
    abstract: "خلاصہ",
    withAuthors: "{names} کے ساتھ",
    withAuthorsInline: "{names} کے ساتھ",
    and: "اور",
    viewPaper: "مقالہ دیکھیں",
    requestAccess: "رسائی کی درخواست",
    requestInstrument: "{name} کی درخواست",
    requestTheInstrument: "آلے کی درخواست",
    restricted: "محدود",
    close: "بند کریں",
    whatAreImgIpi: "IMG اور IPI کیا ہیں؟",
    abstractOf: "خلاصہ — {title}",
    requestAccessTo: "{title} تک رسائی کی درخواست",
    keywords: "کلیدی الفاظ",
    authors: "مصنفین",
    instrumentNote: "اِس مقالے کے ساتھ ایک آلہ ہے جس کے استعمال کی درخواست قاری کر سکتے ہیں۔",
    backToArchive: "آرکائیو پر واپس",
  },

  paper: {
    backToArchive: "آرکائیو",
    abstract: "خلاصہ",
    keywords: "کلیدی الفاظ",
    openAccess: "کھلی رسائی",
    restricted: "محدود",
    readThePaper: "مقالہ پڑھیں",
    requestAccess: "رسائی کی درخواست",
    viewPaper: "مقالہ دیکھیں",
    allNine: "تمام نو مقالے",
    and: "اور",
  },

  journal: {
    eyebrow: "جریدہ",
    titleLead: "مضامین",
    titleAccent: "و یادداشتیں",
    lede: "وہ تحریر جو تحقیق اور افسانے کے درمیان کھڑی ہے۔",
    metaDescription: "مضامین، غور و فکر اور تبصرے۔",
    comingSoon: "جلد",
    comingSoonHeading: "پہلے مضامین ابھی لکھے جا رہے ہیں۔",
    comingSoonBody:
      "آپ فہرست میں شامل ہیں، اِس لیے ہر تحریر اشاعت کے ساتھ ہی آپ تک پہنچے گی۔ یہیں وہ تحریر رہے گی جو تحقیق اور افسانے کے درمیان لکھی جاتی ہے۔",
    coverLabel: "سرورق",
    gate: {
      eyebrow: "اراکین کے لیے",
      heading: "مضامین اور یادداشتیں اراکین کے لیے ہیں۔",
      body: "آرکائیو سے یادداشتیں، وہ دلائل جو ابھی بن رہے ہیں، اور کبھی کبھار ایسی تحریر جو نہ تحقیق کی ہے نہ افسانے کی۔ رکن بنیے اور یہ صفحہ فوراً کھل جائے گا؛ اگلی بار کے لیے رسائی کا کوڈ ای میل پر آ جائے گا، اور جب بھی کچھ نیا شائع ہوگا اطلاع بھی۔",
      subscribe: "رکن بنیں",
      emailPlaceholder: "you@example.com",
      enter: "داخل ہوں",
      unlocksNote: "رکن بنتے ہی صفحہ کھل جاتا ہے۔",
      haveCode: "کوڈ پہلے سے موجود ہے",
      codePlaceholder: "رسائی کا کوڈ",
      unlock: "کھولیں",
      codeNote: "وہ اُسی ای میل میں تھا جو رکن بننے پر آپ کو بھیجی گئی۔",
      enterCode: "اپنا رسائی کوڈ درج کریں۔",
      wrongCode: "یہ کوڈ درست نہیں۔ اپنی ای میل دیکھیے۔",
      badEmail: "درست ای میل پتہ درج کریں۔",
      notConnected: "فہرست ابھی منسلک نہیں۔ فی الحال اپنا رسائی کوڈ استعمال کیجیے۔",
      failed: "کچھ گڑبڑ ہو گئی۔ دوبارہ کوشش کیجیے۔",
    },
  },

  contact: {
    eyebrow: "خط و کتابت",
    titleLead: "رابطہ",
    titleAccent: "کریں",
    lede: "پیشہ ورانہ استفسارات، تقریری دعوتوں، تحقیقی اشتراک، یا عام خط و کتابت کے لیے۔",
    metaDescription: "رابطہ کریں، پیشہ ورانہ رابطے کی درخواست دیں، یا ملاقات طے کریں۔",
    basedIn: "مقیم",
    appointments: "ملاقاتیں",
    bookingNote:
      "وقت {provider} کے ذریعے طے ہوتا ہے۔ اپنی سہولت کا وقت چنیے، وہ سیدھا کیلنڈر میں درج ہو جائے گا۔",
    bookATime: "وقت مقرر کریں",
    elsewhere: "دیگر مقامات",
  },

  forms: {
    required: "لازمی",
    invalidEmail: "درست ای میل پتہ درج کریں",
    somethingWrong: "کچھ گڑبڑ ہو گئی۔",
    tryAgain: "کچھ گڑبڑ ہو گئی۔ دوبارہ کوشش کیجیے۔",
    sending: "بھیجا جا رہا ہے…",
    close: "بند کریں",
    cancel: "منسوخ",

    name: "نام",
    fullName: "پورا نام",
    email: "ای میل",
    phone: "فون",
    phoneNumber: "فون نمبر",
    subject: "موضوع",
    message: "پیغام",
    optionalMessage: "اختیاری پیغام",
    country: "ملک",
    city: "شہر",
    institution: "ادارہ",
    position: "عہدہ",
    reason: "رسائی کی درخواست کی وجہ",
    shippingAddress: "ترسیل کا پتہ",
    quantity: "تعداد",

    sendMessage: "پیغام بھیجیں",
    contactDone: "آپ کا پیغام موصول ہو گیا۔ شکریہ۔",

    submitRequest: "درخواست بھیجیں",
    requestingAccess:
      "آپ {title} تک رسائی کی درخواست دے رہے ہیں۔ کچھ بھیجنے سے پہلے ہر درخواست کا جائزہ لیا جاتا ہے۔",
    requestDone:
      "{title} کے لیے آپ کی درخواست موصول ہو گئی۔ ہر درخواست کا الگ سے جائزہ لیا جاتا ہے — منظوری کی صورت میں آپ کو جواب ملے گا۔",

    submitOrder: "آرڈر بھیجیں",
    orderDone:
      "آپ کا آرڈر موصول ہو گیا۔ ہماری ٹیم ہر آرڈر کا ذاتی طور پر جائزہ لیتی ہے — تصدیق کے بعد ادائیگی اور ترسیل کی ہدایات آپ کو ای میل پر ملیں گی۔ ابھی ادائیگی کی ضرورت نہیں۔",
    orderNote:
      "یہ فارم ادائیگی یا بینک کی تفصیلات جمع نہیں کرتا۔ ہماری ٹیم ہر آرڈر کا ذاتی طور پر جائزہ لیتی ہے اور تصدیق ہوتے ہی ادائیگی کی ہدایات براہِ راست بھیجتی ہے۔",
  },

  novel: {
    aNovel: "ایک ناول",
    titleLead: "The Highest",
    titleAccent: "Branch",
    theBook: "کتاب",
    coverAlt: "{title} کا سرورق",
    coverLabel: "کتاب کا سرورق",
    chapters: "ابواب",
    words: "الفاظ",
    form: "صنف",
    status: "حالت",
    availability: "دستیابی",
    orderACopy: "ایک نسخہ منگوائیں",
    byline: "{title} — {name} کا ناول",
    purchase: {
      amazonTab: "یورپی یونین اور امریکہ",
      amazonNote: "ایمازون کے ذریعے",
      directTab: "ترکیہ اور پاکستان",
      directNote: "براہِ راست آرڈر",
      amazonBody: "{regions} کے قارئین کے لیے ایمازون پر دستیاب۔",
      buyOnAmazon: "ایمازون سے خریدیں",
      amazonPending: "کتاب درج ہوتے ہی ایمازون کا لنک یہاں آ جائے گا۔",
    },
  },

  detail: {
    workPractice: "کام · عملی",
    workProgramme: "کام · پروگرام",
    workProject: "کام · منصوبہ",
    backToTheWork: "کام پر واپس",

    iris: {
      requestDemo: "ڈیمو کی درخواست",
      enterAccessCode: "رسائی کا کوڈ درج کریں",
      sectionProblem: "مسئلہ",
      sectionBackbone: "تشخیصی ڈھانچہ",
      sectionFilm: "فلم",
      sectionWhatItDoes: "یہ کیا کرتا ہے",
      sectionArchitecture: "بناوٹ",
      withheldModules: "IRIS کے آٹھ ماڈیول فلم کے ساتھ روکے گئے ہیں۔",
      withheldArchitecture: "IRIS سرے سے آخر تک کیسے بنا ہے، یہ فلم کے ساتھ روکا گیا ہے۔",
      openFilmFullScreen: "فلم پوری اسکرین پر کھولیں",
      unlockTheFilm: "فلم کھولیں",
      filmTitle: "IRIS — تعارفی فلم",
      soundNote: "آواز بند ہے، جب تک آپ فلم کے اندر سے اُسے چالو نہ کریں۔",
      lock: {
        eyebrow: "رسائی کا کوڈ درکار ہے",
        heading: "فلم، ماڈیولوں کی فہرست اور بناوٹ روک لی گئی ہیں۔",
        body: "IRIS ابھی عام نہیں ہوا۔ رسائی کے کوڈ کے لیے سعدان سے رابطہ کیجیے، تینوں حصے ایک ساتھ، اِسی صفحے پر، ایک ماہ کے لیے کھل جائیں گے۔",
        requestTheCode: "کوڈ کی درخواست",
        enterCode: "کوڈ درج کریں",
        checking: "جانچا جا رہا ہے…",
        unlock: "کھولیں",
        wrongCode: "یہ کوڈ درست نہیں۔",
        enterSomething: "رسائی کا کوڈ درج کریں۔",
      },
    },

    icd: {
      sectionWhoFor: "یہ کن کے لیے ہے",
      sectionHowItRuns: "یہ کیسے چلتا ہے",
      sectionWorkingTogether: "مل کر کام",
      bringToInstitution: "اِسے اپنے ادارے میں لائیے۔",
      outcomes: "نتائج",
      deliveredIn: "منعقد ہوا",
      fromTheSessions: "نشستوں سے",
      galleryLabel: "ICD تربیت",
      photographs: "تصاویر",
      getInTouch: "رابطہ کریں",
      theResearchBehindIt: "اِس کے پیچھے کی تحقیق",
    },

    recruitment: {
      sectionWhatItAnswers: "یہ کس کا جواب دیتا ہے",
      sectionWorkingTogether: "مل کر کام",
      thePipeline: "مراحل",
      marketIntelligence: "منڈیوں کی معلومات",
      movesUpOn: "شراکت دار اوپر جاتا ہے",
      tier: {
        status: "درجہ",
        relationship: "تعلق",
        incentives: "مراعات",
        meetings: "ملاقاتیں",
      },
      fromTheField: "میدان سے",
      galleryLabel: "بھرتی کا کام",
      scheduleConsultation: "مشاورت کا وقت طے کریں",
      sendMessageInstead: "اِس کے بجائے پیغام بھیجیں",
    },
  },

  gallery: {
    eyebrow: "گیلری",
    photographs: "تصاویر",
    openPhotographs: "{name} کی تصاویر کھولیں",
    close: "بند کریں",
  },

  marginalia: {
    name: "حاشیے",
    foundCount: "{total} میں سے {found} ملے",
    body: "اِس سائٹ کے حاشیوں میں سات نشان چھوڑے گئے ہیں، جیسے کوئی قاری اُس کتاب پر نشان لگاتا ہے جسے وہ رکھنا چاہتا ہے۔ ہر نشان کوئی سچی بات کھولتا ہے۔",
    readersCard: "قاری کا کارڈ",
    readersCardHeading: "آپ حاشیے پڑھتے ہیں۔ اکثر لوگ نہیں پڑھتے۔",
    readersCardBody: "خط و کتابت میں شامل ہوں — نئی تحقیق، جریدے کی تحریریں، اور",
    readersCardBodyAfter: "کی خبریں، کبھی کبھار۔",
    clear: "مجموعہ صاف کریں",
    markFound: "حاشیہ ملا: {title}۔ {line}",
    markUnfound: "حاشیے پر ایک نشان: {hint}",
    indicator: "حاشیے: {total} میں سے {found} ملے۔ مجموعہ کھولیں۔",
    close: "بند کریں",
  },

  art: {
    tiers:
      "شراکت داروں کے تین درجے، جہاں اوپر جانا تبدیلی کی شرح، جواب دہی اور حوالوں کے معیار سے کمایا جاتا ہے",
    constellation: "تحقیقی میدانوں اور مقالوں کا ایک جھرمٹ",
    constellationHint: "کسی نقطے پر مؤشر لے جائیے تاکہ مقالے کو اُس کے میدان تک دیکھا جا سکے۔",
    globe:
      "مشرقی نصف کرے کا نقشہ، جس پر استنبول سے جرمنی، قطر، متحدہ عرب امارات، پاکستان، نیپال اور عراق کے راستے ہیں",
    branch:
      "ایک درخت جس کی شاخیں اور جڑیں سعدان قاسمانی کے کام کے مراحل بتاتی ہیں، جڑوں پر A اور O لیولز سے لے کر تاج پر ناول The Highest Branch تک",
    istanbul: "استنبول",
  },

  seasons: {
    eyebrow: "ناول · مقالہ",
    heading: "زندگی ناپنے کے دو طریقے۔",
    forestLead: "ایک جنگل جسے وہ اُس کے موسموں سے پہچانتا ہے",
    forestRest: "— وہ وقت جو لوٹتا ہے، دائرہ بناتا ہے، اور معاف کرتا ہے۔ نمو حلقوں سے ناپی گئی، نتائج سے نہیں۔",
    semestersLead: "ایک ملک جو وقت کو سمسٹروں میں ناپتا ہے",
    semestersRest: "— وہ وقت جو آگے بڑھتا ہے، حساب مانگتا ہے، اور ختم ہو جاتا ہے۔ نمو ایک مقررہ تاریخ کے مقابل ناپی گئی۔",
    note: "اِن دو گھڑیوں کے درمیان کا فاصلہ ہی تحقیق اور ناول دونوں کا موضوع ہے۔",
    forest: "جنگل",
    city: "شہر",
  },

  translation: {
    machineNotice:
      "یہ صفحہ ایک ترجمہ ہے۔ جہاں لفظ وزن رکھتا ہو، وہاں انگریزی اصل ہی وہ ہے جو لکھا گیا۔",
    abstractNotice: "غیر سرکاری ترجمہ۔ شائع شدہ خلاصہ انگریزی میں ہے۔",
    showOriginal: "انگریزی اصل دکھائیں",
    hideOriginal: "انگریزی اصل چھپائیں",
    originalHeading: "انگریزی اصل",
  },
};

export const urContent: ContentOverlay = {};
