import type { DictionaryOverlay } from "@/lib/i18n/dictionary";
import type { ContentOverlay } from "@/lib/i18n/content";

/**
 * Russian.
 *
 * The novel's title stays in English: there is no Russian edition and no
 * Russian title, and inventing one would promise a book that does not
 * exist. IRIS, ICD, IMG and IPI are names of instruments rather than
 * descriptions, so they stay as they are too.
 */

export const ru: DictionaryOverlay = {
  languageName: "Русский",

  nav: {
    author: "Автор",
    work: "Работа",
    research: "Исследования",
    journal: "Журнал",
    contact: "Переписка",
    novel: "Роман",
    novelTitle: "The Highest Branch",
  },

  header: {
    home: "Саадан Касмани — главная",
    menu: "Меню",
    openMenu: "Открыть меню",
    closeMenu: "Закрыть меню",
    skipToContent: "Перейти к содержанию",
    language: "Язык",
    chooseLanguage: "Выберите язык",
    browse: "Разделы",
  },

  announcement: {
    eyebrow: "Выходит 19 октября 2026",
    heading: "The Highest Branch",
    body: "В семнадцать лет мальчик переходит перевал, оставляя лес, который он знает по временам года, ради страны, где время измеряют семестрами.",
    ask: "Оставьте адрес — и вы узнаете в день выхода. Больше ничего.",
    placeholder: "you@example.com",
    submit: "Сообщите мне о выходе",
    sending: "Отправляется",
    done: "В этот день вы получите письмо.",
    readMore: "Подробнее о романе",
    dismiss: "Закрыть",
    later: "Не сейчас",
  },

  newsletter: {
    emailLabel: "Адрес электронной почты",
    placeholder: "your@email.com",
    subscribe: "Подписаться",
    sending: "Отправляется",
    done: "Вы вошли в переписку.",
    failed: "Что-то пошло не так. Попробуйте ещё раз.",
  },

  footer: {
    releaseLine: "19 октября 2026",
    theNovel: "Роман",
    correspondence: "Переписка",
    lettersHeading: "Письма из архива, отправляются редко.",
    lettersBody: "Новые исследования, записи в журнале и новости о",
    lettersBodyAfter: "— только когда есть что сказать.",
    index: "Указатель",
    orderACopy: "Заказать экземпляр",
    rights: "Саадан Касмани · Стамбул",
    positioning: "Писатель, исследователь и стратег",
  },

  home: {
    location: "Стамбул",
    hoverHint: "Наведите курсор на отмеченные узлы, чтобы проследить работу",
    scroll: "Прокрутите",
    author: "Автор",
    portraitLabel: "Портрет автора",
    readBiography: "Читать биографию",
    practice: "Практика",
    practiceHeading: "Обучение там, где вопросы труднее всего.",
    countries: "Стран",
    nationalities: "Национальностей",
    papersInProgress: "Исследовательских работ в процессе",
    archive: "Архив",
    researchInProgress: "Исследования в работе",
    allResearch: "Все исследования",
    novelEyebrow: "Роман",
    enterTheNovel: "Войти в роман",
    chapters: "глав",
    words: "слов",
  },

  about: {
    eyebrow: "Автор",
    titleLead: "Человек",
    titleAccent: "",
    biography: "Биография",
    portraitLabel: "Портрет автора",
    theWork: "Работа",
    currentRoles: "Текущие должности",
    practice: "Практика",
    founded: "Основал",
    recognition: "Признание",
    theResearch: "Исследования",
    getInTouch: "Связаться",
    metaDescription: "Биография {name}, {positioning}.",
  },

  work: {
    eyebrow: "Работа",
    titleLead: "Живой",
    titleAccent: "архив",
    lede: "Академическая, профессиональная и творческая работа — пополняется постоянно, а не собрана единожды.",
    metaDescription: "Живой архив проектов, должностей и инициатив.",
    recruitmentTitleLead: "Набор иностранных",
    recruitmentTitleAccent: "студентов",
    viewGallery: "Смотреть галерею",
    openGallery: "Открыть галерею: {name}",
    lookInto: "Подробнее: {name}",
    detailLabels: {
      iris: "IRIS",
      icd: "ICD",
      recruitment: "набор студентов",
    },
    categories: {
      Academic: "Академическое",
      Research: "Исследования",
      Publications: "Публикации",
      "International Education": "Международное образование",
      "Global Engagement": "Глобальное взаимодействие",
      Strategy: "Стратегия",
      Writing: "Письмо",
      "Creative Work": "Творческая работа",
      Projects: "Проекты",
    },
  },

  research: {
    eyebrow: "Архив",
    titleLead: "Архив",
    titleAccent: "исследований",
    lede: "Рабочие статьи о политической экономии интернационализации, национальном брендинге и секьюритизации иностранных студентов. Работы с ограниченным доступом высылаются только после личного рассмотрения запроса.",
    metaDescription:
      "Рабочие статьи и академические исследования о политической экономии интернационализации, национальном брендинге и секьюритизации иностранных студентов.",
    shapeEyebrow: "Как это устроено",
    shapeHeading: "Девять статей, один вопрос.",
    shapeBody:
      "Как институции говорят одно об иностранных студентах и делают другое — прослежено через инструменты политики, партнёрства, заслуги и безопасность.",
    trilogyNote: "Три из них принадлежат одному циклу",
    all: "Все",
    entryCount: "{count} запись",
    entryCountPlural: "{count} записей",
    readAbstract: "Читать аннотацию",
    fullEntry: "Полная запись",
    openFullEntry: "Открыть полную запись",
    abstract: "Аннотация",
    withAuthors: "В соавторстве с {names}",
    withAuthorsInline: "с {names}",
    and: "и",
    viewPaper: "Смотреть статью",
    requestAccess: "Запросить доступ",
    requestInstrument: "Запросить {name}",
    requestTheInstrument: "Запросить инструмент",
    restricted: "Ограниченный доступ",
    close: "Закрыть",
    whatAreImgIpi: "Что такое IMG и IPI?",
    abstractOf: "Аннотация — {title}",
    requestAccessTo: "Запросить доступ к {title}",
    keywords: "Ключевые слова",
    authors: "Авторы",
    instrumentNote:
      "К этой статье прилагается инструмент, использование которого читатели могут запросить.",
    backToArchive: "Назад в архив",
  },

  paper: {
    backToArchive: "Архив",
    abstract: "Аннотация",
    keywords: "Ключевые слова",
    openAccess: "Открытый доступ",
    restricted: "Ограниченный доступ",
    readThePaper: "Читать статью",
    requestAccess: "Запросить доступ",
    viewPaper: "Смотреть статью",
    allNine: "Все девять статей",
    and: "и",
  },

  journal: {
    eyebrow: "Журнал",
    titleLead: "Эссе",
    titleAccent: "и заметки",
    lede: "Тексты, которые стоят между исследованием и вымыслом.",
    metaDescription: "Эссе, размышления и комментарии.",
    comingSoon: "Скоро",
    comingSoonHeading: "Первые эссе ещё пишутся.",
    comingSoonBody:
      "Вы в списке, поэтому каждое дойдёт до вас, как только выйдет. Здесь будет жить то, что пишется между исследованием и вымыслом.",
    coverLabel: "Обложка",
    gate: {
      eyebrow: "Для подписчиков",
      heading: "Эссе и заметки — для подписчиков.",
      body: "Заметки из архива, доводы, которые ещё складываются, и иногда текст, не принадлежащий ни исследованию, ни вымыслу. Подпишитесь — и страница откроется сразу; на почту придёт код доступа на следующий раз и письмо, когда появится что-то новое.",
      subscribe: "Подписаться",
      emailPlaceholder: "you@example.com",
      enter: "Войти",
      unlocksNote: "Страница откроется в тот же момент, когда вы подпишетесь.",
      haveCode: "Код уже есть",
      codePlaceholder: "Код доступа",
      unlock: "Открыть",
      codeNote: "Он был в письме, которое вы получили при подписке.",
      enterCode: "Введите код доступа.",
      wrongCode: "Этот код неверен. Проверьте письмо, которое вам отправили.",
      badEmail: "Введите действительный адрес электронной почты.",
      notConnected: "Список ещё не подключён. Пока воспользуйтесь кодом доступа.",
      failed: "Что-то пошло не так. Попробуйте ещё раз.",
    },
  },

  contact: {
    eyebrow: "Переписка",
    titleLead: "Связаться",
    titleAccent: "",
    lede: "По профессиональным вопросам, приглашениям выступить, научному сотрудничеству или обычной переписке.",
    metaDescription:
      "Связаться, запросить профессиональный контакт или назначить встречу.",
    basedIn: "Базируется в",
    appointments: "Встречи",
    bookingNote:
      "Запись идёт через {provider}. Выберите удобное время — и оно сразу попадёт в календарь.",
    bookATime: "Выбрать время",
    elsewhere: "В других местах",
  },

  forms: {
    required: "Обязательно",
    invalidEmail: "Введите действительный адрес электронной почты",
    somethingWrong: "Что-то пошло не так.",
    tryAgain: "Что-то пошло не так. Попробуйте ещё раз.",
    sending: "Отправляется…",
    close: "Закрыть",
    cancel: "Отмена",

    name: "Имя",
    fullName: "Полное имя",
    email: "Электронная почта",
    phone: "Телефон",
    phoneNumber: "Номер телефона",
    subject: "Тема",
    message: "Сообщение",
    optionalMessage: "Сообщение (необязательно)",
    country: "Страна",
    city: "Город",
    institution: "Учреждение",
    position: "Должность",
    reason: "Причина запроса доступа",
    shippingAddress: "Адрес доставки",
    quantity: "Количество",

    sendMessage: "Отправить сообщение",
    contactDone: "Ваше сообщение получено. Спасибо.",

    submitRequest: "Отправить запрос",
    requestingAccess:
      "Вы запрашиваете доступ к {title}. Каждый запрос рассматривается прежде, чем что-либо будет отправлено.",
    requestDone:
      "Ваш запрос на {title} получен. Каждый запрос рассматривается отдельно — вы получите ответ, если он будет одобрен.",

    submitOrder: "Отправить заказ",
    orderDone:
      "Ваш заказ получен. Наша команда рассматривает каждый заказ лично — после подтверждения вы получите инструкции по оплате и доставке по электронной почте. Оплата пока не требуется.",
    orderNote:
      "Эта форма не собирает платёжные или банковские данные. Наша команда рассматривает каждый заказ лично и высылает инструкции по оплате напрямую, как только заказ подтверждён.",
  },

  novel: {
    aNovel: "Роман",
    titleLead: "The Highest",
    titleAccent: "Branch",
    theBook: "Книга",
    coverAlt: "Обложка {title}",
    coverLabel: "Обложка книги",
    chapters: "Глав",
    words: "Слов",
    form: "Форма",
    status: "Статус",
    availability: "Где купить",
    orderACopy: "Заказать экземпляр",
    byline: "{title} — роман {name}",
    purchase: {
      amazonTab: "ЕС и Америка",
      amazonNote: "через Amazon",
      directTab: "Türkiye и Пакистан",
      directNote: "прямой заказ",
      amazonBody: "Доступно читателям в регионах {regions} через Amazon.",
      buyOnAmazon: "Купить на Amazon",
      amazonPending: "Ссылка на Amazon появится здесь, как только книга будет размещена.",
    },
  },

  detail: {
    workPractice: "Работа · Практика",
    workProgramme: "Работа · Программа",
    workProject: "Работа · Проект",
    backToTheWork: "Назад к работе",

    iris: {
      requestDemo: "Запросить демонстрацию",
      enterAccessCode: "Ввести код доступа",
      sectionProblem: "Проблема",
      sectionBackbone: "Диагностическая основа",
      sectionFilm: "Фильм",
      sectionWhatItDoes: "Что он делает",
      sectionArchitecture: "Архитектура",
      withheldModules: "Восемь модулей IRIS закрыты вместе с фильмом.",
      withheldArchitecture: "То, как устроен IRIS целиком, закрыто вместе с фильмом.",
      openFilmFullScreen: "Открыть фильм во весь экран",
      unlockTheFilm: "Открыть фильм",
      filmTitle: "IRIS — поясняющий фильм",
      soundNote: "Звук выключен, пока вы не включите его в самом фильме.",
      lock: {
        eyebrow: "Требуется код доступа",
        heading: "Фильм, список модулей и архитектура закрыты.",
        body: "IRIS ещё не публичен. Напишите Саадану за кодом доступа — и три раздела откроются вместе, на этой странице, на месяц.",
        requestTheCode: "Запросить код",
        enterCode: "Введите код",
        checking: "Проверяется…",
        unlock: "Открыть",
        wrongCode: "Этот код неверен.",
        enterSomething: "Введите код доступа.",
      },
    },

    icd: {
      sectionWhoFor: "Для кого это",
      sectionHowItRuns: "Как это проходит",
      sectionWorkingTogether: "Работа вместе",
      bringToInstitution: "Проведите это в вашем учреждении.",
      outcomes: "Результаты",
      deliveredIn: "Проведено в",
      fromTheSessions: "С занятий",
      galleryLabel: "тренинг ICD",
      photographs: "Фотографии",
      getInTouch: "Связаться",
      theResearchBehindIt: "Исследование, стоящее за этим",
    },

    recruitment: {
      sectionWhatItAnswers: "На что это отвечает",
      sectionWorkingTogether: "Работа вместе",
      thePipeline: "Воронка",
      marketIntelligence: "Знание рынков",
      movesUpOn: "Партнёр поднимается за счёт",
      tier: {
        status: "Статус",
        relationship: "Отношения",
        incentives: "Стимулы",
        meetings: "Встречи",
      },
      fromTheField: "С места",
      galleryLabel: "работа по набору студентов",
      scheduleConsultation: "Назначить консультацию",
      sendMessageInstead: "Вместо этого написать сообщение",
    },
  },

  gallery: {
    eyebrow: "Галерея",
    photographs: "Фотографии",
    openPhotographs: "Открыть фотографии: {name}",
    close: "Закрыть",
  },

  marginalia: {
    name: "Маргиналии",
    foundCount: "найдено {found} из {total}",
    body: "На полях этого сайта оставлено семь знаков — так читатель делает пометки в книге, которую собирается сохранить. Каждый из них выдаёт что-то настоящее.",
    readersCard: "Читательская карточка",
    readersCardHeading: "Вы читаете поля. Большинство — нет.",
    readersCardBody:
      "Войдите в переписку — новые исследования, записи в журнале и новости о",
    readersCardBodyAfter: ", отправляется редко.",
    clear: "Очистить коллекцию",
    markFound: "Найдена маргиналия: {title}. {line}",
    markUnfound: "Знак на полях: {hint}",
    indicator: "Маргиналии: найдено {found} из {total}. Открыть коллекцию.",
    close: "Закрыть",
  },

  art: {
    tiers:
      "Три уровня партнёрства, где движение вверх зарабатывается конверсией, отзывчивостью и качеством рекомендаций",
    constellation: "Созвездие исследовательских областей и статей",
    constellationHint:
      "Наведите курсор на узел, чтобы проследить статью через её область.",
    globe:
      "Карта восточного полушария с маршрутами из Стамбула в Германию, Катар, Объединённые Арабские Эмираты, Пакистан, Непал и Ирак",
    branch:
      "Дерево, чьи ветви и корни отмечают этапы работы Саадана Касмани, от экзаменов A и O Levels у корней до романа The Highest Branch в кроне",
    istanbul: "Стамбул",
  },

  seasons: {
    eyebrow: "Роман · Диссертация",
    heading: "Два способа измерить жизнь.",
    forestLead: "Лес, который он знает по временам года",
    forestRest:
      "— время, которое возвращается, идёт по кругу и прощает. Рост, измеренный кольцами, а не результатами.",
    semestersLead: "Страна, где время измеряют семестрами",
    semestersRest:
      "— время, которое идёт вперёд, выставляет счёт и истекает. Рост, измеренный по сроку.",
    note: "Расстояние между этими двумя часами и есть предмет и исследования, и романа.",
    forest: "Лес",
    city: "Город",
  },

  translation: {
    machineNotice:
      "Эта страница — перевод. Там, где слово имеет вес, написанным был английский оригинал.",
    abstractNotice:
      "Неофициальный перевод. Опубликованная аннотация — на английском языке.",
    showOriginal: "Показать английский оригинал",
    hideOriginal: "Скрыть английский оригинал",
    originalHeading: "Английский оригинал",
  },
};

export const ruContent: ContentOverlay = {};
