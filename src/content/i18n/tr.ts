import type { DictionaryOverlay } from "@/lib/i18n/dictionary";
import type { ContentOverlay } from "@/lib/i18n/content";

/**
 * Turkish.
 *
 * The language of the city the whole archive is written from, and of most of
 * the institutions in it, so the proper names here are the Turkish ones:
 * İstanbul Aydın Üniversitesi rather than a translation of it.
 *
 * Turkish is agglutinative, and a suffix has to agree with the vowels of the
 * word it attaches to. Any sentence that carries a value therefore places it
 * where no suffix is needed — "{name} hakkında" rather than "{name}'a" —
 * because the value is filled in at render time and its last vowel is not
 * known when the sentence is written.
 *
 * The novel's title stays in English: there is no Turkish edition and no
 * Turkish title. IRIS, ICD, IMG and IPI are names of instruments.
 */

export const tr: DictionaryOverlay = {
  languageName: "Türkçe",

  nav: {
    author: "Yazar",
    work: "Çalışmalar",
    research: "Araştırma",
    journal: "Günce",
    contact: "Yazışma",
    novel: "Roman",
    novelTitle: "The Highest Branch",
  },

  header: {
    home: "Saadan Qasmani — ana sayfa",
    menu: "Menü",
    openMenu: "Menüyü aç",
    closeMenu: "Menüyü kapat",
    skipToContent: "İçeriğe geç",
    language: "Dil",
    chooseLanguage: "Bir dil seçin",
    browse: "Bölümler",
  },

  announcement: {
    eyebrow: "19 Ekim 2026'da çıkıyor",
    heading: "The Highest Branch",
    body: "On yedi yaşında bir çocuk geçidi aşar; mevsimlerinden tanıdığı bir ormanı bırakıp zamanı dönemlerle ölçen bir ülkeye gider.",
    ask: "Bir adres bırakın, çıktığı gün haberiniz olsun.",
    placeholder: "siz@ornek.com",
    submit: "Çıkınca haber verin",
    sending: "Gönderiliyor",
    done: "O gün size yazacağım.",
    readMore: "Roman hakkında",
    dismiss: "Kapat",
    later: "Şimdi değil",
    onList: "Listedesiniz. O gün size yazacağım.",
  },

  newsletter: {
    emailLabel: "E-posta adresi",
    placeholder: "siz@ornek.com",
    subscribe: "Abone ol",
    sending: "Gönderiliyor",
    done: "Yazışmaya katıldınız.",
    failed: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
  },

  footer: {
    releaseLine: "19 Ekim 2026",
    theNovel: "Roman",
    correspondence: "Yazışma",
    lettersHeading: "Arşivden mektuplar, seyrek gönderilir.",
    lettersBody: "Yeni araştırmalar, günce yazıları ve",
    lettersBodyAfter: "haberleri — yalnızca söylenmeye değer bir şey olduğunda.",
    index: "Dizin",
    orderACopy: "Bir kopya sipariş edin",
    rights: "Saadan Qasmani · İstanbul",
    positioning: "Yazar, araştırmacı ve stratejist",
  },

  home: {
    location: "İstanbul",
    hoverHint: "Çalışmanın izini sürmek için işaretli kavşakların üzerine gelin",
    scroll: "Kaydırın",
    author: "Yazar",
    portraitLabel: "Yazar portresi",
    readBiography: "Özgeçmişi okuyun",
    practice: "Saha",
    practiceHeading: "Soruların en zor olduğu yerde verilen eğitim.",
    countries: "Ülke",
    nationalities: "Uyruk",
    papersInProgress: "Süren araştırma makalesi",
    archive: "Arşiv",
    researchInProgress: "Süren araştırmalar",
    allResearch: "Tüm araştırmalar",
    novelEyebrow: "Roman",
    enterTheNovel: "Romana girin",
    chapters: "bölüm",
    words: "kelime",
  },

  about: {
    eyebrow: "Yazar",
    titleLead: "İnsan",
    titleAccent: "",
    biography: "Özgeçmiş",
    portraitLabel: "Yazar portresi",
    theWork: "Çalışmalar",
    currentRoles: "Güncel görevler",
    practice: "Saha",
    founded: "Kurdukları",
    recognition: "Ödüller",
    theResearch: "Araştırmalar",
    getInTouch: "İletişime geçin",
    metaDescription: "Özgeçmiş: {name}, {positioning}.",
  },

  work: {
    eyebrow: "Çalışmalar",
    titleLead: "Yaşayan",
    titleAccent: "Arşiv",
    lede: "Akademik, mesleki ve yaratıcı çalışmalar — bir kez derlenmiş değil, sürekli eklenen.",
    metaDescription: "Projelerin, görevlerin ve girişimlerin yaşayan arşivi.",
    recruitmentTitleLead: "Uluslararası Öğrenci",
    recruitmentTitleAccent: "Kazanımı",
    viewGallery: "Galeriye bakın",
    openGallery: "{name} için fotoğrafları aç",
    lookInto: "{name} hakkında",
    detailLabels: {
      iris: "IRIS",
      icd: "ICD",
      recruitment: "öğrenci kazanımı",
    },
    categories: {
      Academic: "Akademik",
      Research: "Araştırma",
      Publications: "Yayınlar",
      "International Education": "Uluslararası eğitim",
      "Global Engagement": "Küresel ilişkiler",
      Strategy: "Strateji",
      Writing: "Yazı",
      "Creative Work": "Yaratıcı çalışma",
      Projects: "Projeler",
    },
  },

  research: {
    eyebrow: "Arşiv",
    titleLead: "Araştırma",
    titleAccent: "Arşivi",
    lede: "Uluslararasılaşmanın ekonomi politiği, ülke markalaşması ve uluslararası öğrencilerin güvenlikleştirilmesi üzerine çalışma makaleleri. Erişimi kısıtlı makaleler yalnızca talep tek tek incelendikten sonra gönderilir.",
    metaDescription:
      "Uluslararasılaşmanın ekonomi politiği, ülke markalaşması ve uluslararası öğrencilerin güvenlikleştirilmesi üzerine çalışma makaleleri ve akademik araştırmalar.",
    shapeEyebrow: "Meselenin biçimi",
    shapeHeading: "Dokuz makale, tek bir soru.",
    shapeBody:
      "Kurumlar uluslararası öğrenciler hakkında bir şey söylerken başka bir şey yapıyor — politika araçları, ortaklıklar, liyakat ve güvenlik üzerinden izi sürüldü.",
    trilogyNote: "Bunlardan üçü aynı dizinin parçası",
    all: "Tümü",
    entryCount: "{count} kayıt",
    entryCountPlural: "{count} kayıt",
    readAbstract: "Özeti okuyun",
    fullEntry: "Tam kayıt",
    openFullEntry: "Tam kaydı açın",
    abstract: "Özet",
    withAuthors: "Ortak yazarlar: {names}",
    withAuthorsInline: "ortak yazarlar: {names}",
    and: "ve",
    viewPaper: "Makaleye bakın",
    requestAccess: "Erişim talep edin",
    requestInstrument: "{name} talebi",
    requestTheInstrument: "Aracı talep edin",
    restricted: "Kısıtlı",
    close: "Kapat",
    whatAreImgIpi: "IMG ve IPI nedir?",
    abstractOf: "Özet — {title}",
    requestAccessTo: "{title} için erişim talebi",
    keywords: "Anahtar kelimeler",
    authors: "Yazarlar",
    instrumentNote:
      "Bu makale, okurların kullanmayı talep edebileceği bir ölçüm aracı taşır.",
    backToArchive: "Arşive dönün",
  },

  paper: {
    backToArchive: "Arşiv",
    abstract: "Özet",
    keywords: "Anahtar kelimeler",
    openAccess: "Açık erişim",
    restricted: "Kısıtlı",
    readThePaper: "Makaleyi okuyun",
    requestAccess: "Erişim talep edin",
    viewPaper: "Makaleye bakın",
    allNine: "Dokuz makalenin tamamı",
    and: "ve",
  },

  journal: {
    eyebrow: "Günce",
    titleLead: "Denemeler",
    titleAccent: "ve Notlar",
    lede: "Araştırmayla kurmaca arasında duran yazılar.",
    metaDescription: "Denemeler, düşünceler ve yorumlar.",
    comingSoon: "Yakında",
    comingSoonHeading: "İlk denemeler hâlâ yazılıyor.",
    comingSoonBody:
      "Listedesiniz; her biri yayımlandığı anda size ulaşacak. Araştırmayla kurmaca arasında yazılanlar burada yaşayacak.",
    coverLabel: "Kapak",
    readNote: "Notu okuyun",
    gate: {
      eyebrow: "Aboneler için",
      heading: "Denemeler ve notlar abonelere açık.",
      body: "Arşivden notlar, henüz kurulmakta olan savlar ve arada bir ne araştırmaya ne kurmacaya ait olan bir yazı. Abone olun, bu sayfa hemen açılsın; bir dahaki sefer için erişim kodunuz e-postayla gelsin, yeni bir şey çıktığında da haberiniz olsun.",
      subscribe: "Abone ol",
      emailPlaceholder: "siz@ornek.com",
      enter: "Girin",
      unlocksNote: "Abone olduğunuz anda sayfa açılır.",
      haveCode: "Kodunuz zaten var",
      codePlaceholder: "Erişim kodu",
      unlock: "Aç",
      codeNote: "Abone olduğunuzda gelen e-postanın içindeydi.",
      enterCode: "Erişim kodunuzu girin.",
      wrongCode: "Bu kod doğru değil. Size gönderilen e-postaya bakın.",
      badEmail: "Geçerli bir e-posta adresi girin.",
      notConnected: "Liste henüz bağlı değil. Şimdilik erişim kodunuzu kullanın.",
      failed: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
    },
  },

  contact: {
    eyebrow: "Yazışma",
    titleLead: "İletişime",
    titleAccent: "Geçin",
    lede: "Mesleki sorular, konuşma davetleri, araştırma iş birliği ya da genel yazışma için.",
    metaDescription:
      "İletişime geçin, mesleki iletişim talep edin ya da bir randevu ayarlayın.",
    basedIn: "Bulunduğu yer",
    appointments: "Randevular",
    bookingNote:
      "Randevular {provider} üzerinden alınıyor. Size uyan bir saat seçin, doğrudan takvime düşsün.",
    bookATime: "Randevu alın",
    elsewhere: "Başka yerlerde",
  },

  forms: {
    required: "Zorunlu",
    invalidEmail: "Geçerli bir e-posta adresi girin",
    somethingWrong: "Bir şeyler ters gitti.",
    tryAgain: "Bir şeyler ters gitti. Lütfen tekrar deneyin.",
    sending: "Gönderiliyor…",
    close: "Kapat",
    cancel: "Vazgeç",

    name: "Ad",
    fullName: "Ad soyad",
    email: "E-posta",
    phone: "Telefon",
    phoneNumber: "Telefon numarası",
    subject: "Konu",
    message: "Mesaj",
    optionalMessage: "İsteğe bağlı mesaj",
    country: "Ülke",
    city: "Şehir",
    institution: "Kurum",
    position: "Görev / unvan",
    reason: "Erişim talebinin gerekçesi",
    shippingAddress: "Teslimat adresi",
    quantity: "Adet",

    sendMessage: "Mesajı gönder",
    contactDone: "Mesajınız alındı. Teşekkür ederiz.",

    submitRequest: "Talebi gönder",
    requestingAccess:
      "{title} için erişim talep ediyorsunuz. Hiçbir şey gönderilmeden önce her talep incelenir.",
    requestDone:
      "{title} için talebiniz alındı. Her talep tek tek incelenir — onaylanırsa size dönülecek.",

    submitOrder: "Siparişi gönder",
    orderDone:
      "Siparişiniz alındı. Ekibimiz her siparişi tek tek inceler — onaylandığında ödeme ve kargo bilgileri e-postayla size ulaşacak. Şimdilik ödeme gerekmiyor.",
    orderNote:
      "Bu form ödeme ya da banka bilgisi toplamaz. Ekibimiz her siparişi tek tek inceler ve siparişiniz onaylandığında ödeme bilgilerini doğrudan gönderir.",
  },

  novel: {
    aNovel: "Bir roman",
    titleLead: "The Highest",
    titleAccent: "Branch",
    theBook: "Kitap",
    coverAlt: "{title} kapağı",
    coverLabel: "Kitap kapağı",
    chapters: "Bölüm",
    words: "Kelime",
    form: "Biçim",
    status: "Durum",
    availability: "Nereden alınır",
    orderACopy: "Bir kopya sipariş edin",
    byline: "{title} — {name} tarafından yazılmış bir roman",
    purchase: {
      amazonTab: "AB ve Amerika",
      amazonNote: "Amazon üzerinden",
      directTab: "Türkiye ve Pakistan",
      directNote: "doğrudan sipariş",
      amazonBody: "{regions} okurları için Amazon'da satışta.",
      buyOnAmazon: "Amazon'dan alın",
      amazonPending: "Kitap listelendiğinde Amazon bağlantısı burada görünecek.",
    },
  },

  detail: {
    workPractice: "Çalışmalar · Saha",
    workProgramme: "Çalışmalar · Program",
    workProject: "Çalışmalar · Proje",
    backToTheWork: "Çalışmalara dönün",

    iris: {
      requestDemo: "Tanıtım talep edin",
      enterAccessCode: "Erişim kodunu girin",
      sectionProblem: "Sorun",
      sectionBackbone: "Tanı omurgası",
      sectionFilm: "Film",
      sectionWhatItDoes: "Ne yapar",
      sectionArchitecture: "Mimari",
      withheldModules: "IRIS'in sekiz modülü filmle birlikte kapalı tutuluyor.",
      withheldArchitecture:
        "IRIS'in baştan sona nasıl kurulduğu filmle birlikte kapalı tutuluyor.",
      openFilmFullScreen: "Filmi tam ekran açın",
      unlockTheFilm: "Filmi açın",
      filmTitle: "IRIS — tanıtım filmi",
      soundNote: "Ses, filmin içinden açana kadar kapalı.",
      lock: {
        eyebrow: "Erişim kodu gerekiyor",
        heading: "Film, modül listesi ve mimari kapalı tutuluyor.",
        body: "IRIS henüz kamuya açık değil. Erişim kodu için Saadan ile iletişime geçin; üç bölüm birlikte, bu sayfada, bir ay boyunca açılsın.",
        requestTheCode: "Kodu talep edin",
        enterCode: "Kodu girin",
        checking: "Kontrol ediliyor…",
        unlock: "Aç",
        wrongCode: "Bu kod doğru değil.",
        enterSomething: "Erişim kodunu girin.",
      },
    },

    icd: {
      sectionWhoFor: "Kimin için",
      sectionHowItRuns: "Nasıl işler",
      sectionWorkingTogether: "Birlikte çalışmak",
      bringToInstitution: "Bunu kurumunuza getirin.",
      outcomes: "Kazanımlar",
      deliveredIn: "Verildiği yerler",
      fromTheSessions: "Oturumlardan",
      galleryLabel: "ICD eğitimi",
      photographs: "Fotoğraflar",
      getInTouch: "İletişime geçin",
      theResearchBehindIt: "Arkasındaki araştırma",
    },

    recruitment: {
      sectionWhatItAnswers: "Neyi yanıtlıyor",
      sectionWorkingTogether: "Birlikte çalışmak",
      thePipeline: "Süreç",
      marketIntelligence: "Pazar bilgisi",
      movesUpOn: "Bir ortak şununla yükselir",
      tier: {
        status: "Durum",
        relationship: "İlişki",
        incentives: "Teşvikler",
        meetings: "Görüşmeler",
      },
      fromTheField: "Sahadan",
      galleryLabel: "öğrenci kazanımı çalışması",
      scheduleConsultation: "Danışmanlık için randevu alın",
      sendMessageInstead: "Bunun yerine mesaj gönderin",
    },
  },

  gallery: {
    eyebrow: "Galeri",
    photographs: "Fotoğraflar",
    photographCount: "{count} fotoğraf",
    photographCountOne: "1 fotoğraf",
    openPhotographs: "{name} için fotoğrafları aç",
    close: "Kapat",
  },

  marginalia: {
    name: "Derkenar",
    foundCount: "{found} / {total} bulundu",
    body: "Bu sitenin kenarlarına yedi işaret bırakıldı; tıpkı saklamaya niyetli bir okurun kitabına düştüğü notlar gibi. Her biri gerçek bir şey söyler.",
    readersCard: "Okur Kartı",
    readersCardHeading: "Kenarları okuyorsunuz. Çoğu kişi okumaz.",
    readersCardBody: "Yazışmaya katılın — yeni araştırmalar, günce yazıları ve",
    readersCardBodyAfter: "haberleri, seyrek gönderilir.",
    clear: "Koleksiyonu sıfırla",
    markFound: "Derkenar bulundu: {title}. {line}",
    markUnfound: "Kenarda bir işaret: {hint}",
    indicator: "Derkenar: {found} / {total} bulundu. Koleksiyonu açın.",
    close: "Kapat",
  },

  art: {
    tiers:
      "Üç ortak kademesi; yukarı çıkış dönüşüm oranı, yanıt hızı ve yönlendirme kalitesiyle kazanılır",
    constellation: "Araştırma alanlarından ve makalelerden oluşan bir takımyıldız",
    constellationHint:
      "Bir makaleyi alanı üzerinden izlemek için bir düğümün üzerine gelin.",
    globe:
      "Doğu yarımküre haritası; İstanbul'dan Almanya'ya, Katar'a, Birleşik Arap Emirlikleri'ne, Pakistan'a, Nepal'e ve Irak'a giden güzergâhlarla",
    branch:
      "Dalları ve kökleri Saadan Qasmani'nin çalışmasının aşamalarını gösteren bir ağaç; köklerde A ve O Level sınavlarından tepede The Highest Branch romanına",
    istanbul: "İstanbul",
  },

  seasons: {
    eyebrow: "Roman · Tez",
    heading: "Bir hayatı ölçmenin iki yolu.",
    forestLead: "Mevsimlerinden tanıdığı bir orman",
    forestRest:
      "— dönen, daireler çizen, bağışlayan zaman. Sonuçlarla değil, halkalarla ölçülen büyüme.",
    semestersLead: "Zamanı dönemlerle ölçen bir ülke",
    semestersRest:
      "— ilerleyen, hesap soran, süresi dolan zaman. Bir son tarihe göre ölçülen büyüme.",
    note: "Bu iki saat arasındaki mesafe, hem araştırmanın hem romanın konusudur.",
    forest: "Orman",
    city: "Şehir",
  },

  translation: {
    machineNotice:
      "Bu sayfa bir çeviridir. Bir kelimenin ağırlık taşıdığı yerde, yazılmış olan İngilizce aslıdır.",
    abstractNotice: "Resmî olmayan çeviri. Yayımlanan özet İngilizcedir.",
    showOriginal: "İngilizce aslını gösterin",
    hideOriginal: "İngilizce aslını gizleyin",
    originalHeading: "İngilizce aslı",
  },
};

export const trContent: ContentOverlay = {
  person: {
    positioning: "Yazar, araştırmacı ve stratejist",
    location: "İstanbul, Türkiye",
    bio: "Saadan Qasmani, İstanbul'da yaşayan bir uluslararasılaşma uzmanı, araştırmacı ve romancıdır. Küresel ilişkiler ve marka stratejisi alanında çalışmakta, uluslararasılaşma yönetimi için bir SaaS platformu olan IRIS'in kurucu ortaklığını yürütmektedir. Saha çalışması öğrenci kazanımı, ortaklık yönetimi ve kültürlerarası yetkinlik eğitimini kapsar; bu eğitimler on iki ülkede, yetmişten fazla uyruktan katılımcıya verilmiştir ve aralarında Türkiye, Pakistan, Nepal ve Irak'ta yürütülen UNESCO Barış ve Diplomasi Programları da vardır. İstanbul Aydın Üniversitesi'nde Siyaset Bilimi ve Uluslararası İlişkiler yüksek lisansını sürdürmekte, aynı üniversitede kampüsün Model Birleşmiş Milletler programını ve STARLIGHT'ı kurmuştur. Araştırmaları uluslararasılaşmanın ekonomi politiği, ülke markalaşması ve uluslararası öğrencilerin güvenlikleştirilmesi üzerinde yoğunlaşır.",
    practitionerNote:
      "Öğrenci kazanımı, ortaklık yönetimi ve kültürlerarası yetkinlik geliştirme (ICD) eğitiminde saha çalışması; 12 ülkede, 70'ten fazla uyruktan katılımcıya verilmiştir; aralarında Türkiye, Pakistan, Nepal ve Irak'ta yürütülen UNESCO Barış ve Diplomasi Programları da vardır.",
    roles: [
      { title: "Küresel İlişkiler ve Marka Stratejisi Direktörü" },
      { title: "Kurucu ortak", org: "IRIS — uluslararasılaşma yönetimi SaaS platformu" },
      { title: "Yüksek lisans adayı, Siyaset Bilimi ve Uluslararası İlişkiler", org: "İstanbul Aydın Üniversitesi" },
    ],
    founded: [
      { name: "Model Birleşmiş Milletler Programı", org: "İstanbul Aydın Üniversitesi" },
      { name: "STARLIGHT", org: "İstanbul Aydın Üniversitesi" },
    ],
    honors: [
      {
        title: "Presidential Award of Service and Excellence",
        org: "2024 STAR Küresel Konferansı, Kathmandu Üniversitesi, Nepal",
      },
    ],
  },

  book: {
    genre: "Alegorik edebî kurmaca, bir fabl olarak anlatılmış",
    tagline: "Çünkü yukarısı, şeylerin düştüğü yerdir.",
    status: "19 Ekim 2026'da çıkıyor",
    synopsis:
      "On yedi yaşında bir çocuk geçidi aşar; mevsimlerinden tanıdığı bir ormanı bırakıp zamanı dönemlerle ölçen bir ülkeye gider. Ardından gelen, varışın bir fablıdır: aidiyetin yavaş mimarisi ve bedeli, bir öğrenciyi kendi annesinin bile tanıyamayacağı birine dönüştüren yılların içinden anlatılır.",
    subject:
      "Uluslararası öğrenci deneyimi; bir kahramanın hayatı üzerinden, ergenlikten yurt dışındaki mesleki ve akademik yolculuğuna kadar izlenerek.",
    amazonRegions: "Avrupa Birliği ve Amerika kıtası",
    directRegions: "Türkiye ve Pakistan",
    directNote:
      "Doğrudan sipariş — ödeme bilgileri inceleme sonrası elden gönderilir, hiçbir zaman otomatik olarak değil.",
  },

  instrumentLabel: "IMG ve IPI hesaplayıcısı",
  instrumentDefinition:
    "İki ekonometrik ölçüm aracı (Gültekin & Qasmani). IMG, bir kurumun uluslararasılaşma yönetimindeki açığın büyüklüğünü ölçer: bilgi asimetrisi, iş akışı dağınıklığı ve dijital altyapı eksikliği üzerinden. IPI ise o açığı kapatma kapasitesini ölçer: yönetimin bağlılığı ve akademik kadronun hazırlığı üzerinden. Birlikte okunduklarında kurumu dört profilden birine yerleştirirler.",

  researchNote: {
    before: "Buradaki tüm araştırmalar ",
    after: " ile ortak yürütülmüştür ya da onun çalışmasının bir uzantısıdır.",
  },

  work: {
    iris: {
      title: "IRIS — International Relations Intelligent System",
      summary:
        "EduYork ile birlikte kuruldu. Uluslararasılaşma, IMG ve IPI ekonometrik çerçeveleri üzerinde, idari bir süreç olmaktan çıkarılıp stratejik, ölçülebilir ve veriye dayalı bir işleve dönüştürüldü.",
    },
    icd: {
      title: "Kültürlerarası Yetkinlik Geliştirme",
      summary:
        "Öğrenciler, akademik kadro ve idari personel için, kültürlerarası yetkinliğin bireysel değil kurumsal bir nitelik olduğu bulgusu etrafında tasarlanmış eğitim. Türkiye, Pakistan, Irak, Nepal ve Almanya'da verildi.",
    },
    "star-scholars-global-engagement": {
      title: "Küresel İlişkiler ve Marka Stratejisi",
      summary:
        "115 ülkeye, 2.353 üniversiteye ve 20.000'den fazla araştırmacıya uzanan bir ağın küresel ilişkilerini ve marka stratejisini yönetmek.",
      linkLabel: "STAR Scholars sitesine gidin",
    },
    "international-student-recruitment": {
      title: "Uluslararası Öğrenci Kazanımı",
      summary:
        "Türkiye, Pakistan, Nepal ve Irak'ta, kademeli bir ortaklık çerçevesi üzerinde yürütülen öğrenci kazanımı: acenteler istikrarlı dönüşüm, hızlı iletişim ve yönlendirme kalitesiyle ilk temastan en üst kademeye yükselir; her kademenin kendi teşvikleri ve kendi değerlendirme döngüsü vardır.",
    },
    "unesco-peace-diplomacy": {
      title: "UNESCO Barış ve Diplomasi Programları",
      summary:
        "UNESCO Kürsüsü altında yürütülen kısa süreli uluslararası programlar; merkezinde kültürlerarası yetkinlik geliştirme vardır.",
      linkLabel: "Program sitesine gidin",
    },
  },

  recruitment: {
    name: "Öğrenci kazanımı",
    expansion: "Uluslararası öğrenci kazanımı",
    lede: "Komisyon listesi olarak değil, kademeli bir ilişki olarak yürütülen bir ortak ağı; çünkü alternatifi ölçülebilir ve ölçüldü.",

    problem: {
      quote:
        "Umut tacirliği, uluslararası eğitimin aday öğrencilere — özellikle sosyoekonomik olanakları kısıtlı ortamlardan gelenlere — kurumun karşılanmayacağını bildiği ya da bilmesi gerektiği fırsat anlatılarıyla sistematik biçimde pazarlanmasıdır.",
      source:
        "Gültekin & Qasmani, Türk Üniversitelerinde Uluslararası Öğrencilerin Yapısal Ötekileştirilmesi",
      figures: [
        { value: "%18,4", note: "acentelerin kendilerine gerçekçi beklentiler verdiğini söyledi" },
        { value: "%51,1", note: "kayıt olmadan önce yanıltıldığını söyledi" },
        {
          value: "0,66",
          label: "r",
          note: "kazanım sürecinde bozulan vaatler ile psikolojik zarar — veri kümesindeki en güçlü ilişki",
        },
      ],
      body:
        "Her beş öğrenciden biri bile acentesinin anlattığı teklifi gerçekçi bulmadı. Komisyon listesi gibi yönetilen bir ağın ürettiği şey budur; bu ağdaki ortakların, karşılanması gereken bir ölçütü olan ilişkiler olarak yürütülmesinin nedeni de budur.",
      caveat:
        "Kesitsel ve kendi beyanına dayalı; dolayısıyla bunlar kanıtlanmış nedenler değil, birlikte görülme örüntüleridir.",
    },

    pipeline: ["Başvuru öncesi", "Başvuru", "Teklif", "Kayıt", "Varış"],

    framework: {
      heading: "Üç kademe, tek bir merdiven",
      body:
        "Her ortak bir kademede durur ve kademe komisyonu, iletişimi ve değerlendirme döngüsünü belirler. Kademeler arası hareket yalnızca hacimle değil, kanıtla kazanılır.",
    },

    tiers: [
      {
        n: "1. Kademe",
        name: "Yüksek değerli ortaklar",
        status: "Kanıtlanmış, istikrarlı akış",
        relationship: "Doğrudan, kişisel iletişim",
        incentives: "En yüksek komisyon, özel teklifler",
        meetings: "Üç aylık strateji görüşmeleri",
      },
      {
        n: "2. Kademe",
        name: "Gelişen ortaklar",
        status: "Büyüyen, orta düzey çıktı",
        relationship: "Düzenli görüşme, eğitim",
        incentives: "Standart komisyon, prim hedefleri",
        meetings: "Altı aylık değerlendirme",
      },
      {
        n: "3. Kademe",
        name: "Yeni ve ilk temasta",
        status: "Yeni katılmış ya da düşük etkinlikte",
        relationship: "İlk temas, tanışma",
        incentives: "Giriş komisyonu, deneme süresi",
        meetings: "İlk tanışma oturumu",
      },
    ],

    progression: ["istikrarlı dönüşüm", "hızlı iletişim", "nitelikli yönlendirme"],

    intelligence: {
      heading: "Pazar bir karardır, bir varış noktası değil.",
      body:
        "Öğrenci kazanımındaki başarısızlıkların çoğu, kimse bir başvuruyu işleme almadan aylar önce yapılmış bir hedefleme hatasıdır. Bir pazara girmeden önce üç soru üzerinden okunur; bu sorulara yanıt vermeyi bıraktığında, hacim ne gösterirse göstersin bırakılır.",
      groups: [
        {
          n: "01",
          name: "Öğrenci gönderiyor mu",
          line: "Talebin temelleri; her şeyden önce okunur.",
          signals: [
            "Genç nüfus ve orta sınıfın büyümesi",
            "Ülke içi eğitim arzının kendi talebini karşılayıp karşılayamadığı",
            "Hane gelirine göre karşılanabilirlik ve döviz kuru",
            "Ayrılmaya iten ekonomik ve jeopolitik baskı",
          ],
        },
        {
          n: "02",
          name: "Buraya gönderiyor mu",
          line: "Uyum; ilginin başvuruya dönüşüp dönüşmeyeceğini belirler.",
          signals: [
            "Programların, pazarın gerçekten okumak istediğiyle örtüşmesi",
            "Öğrenim ücreti ve yaşam maliyetinin ailenin taşıyabileceğiyle oranı",
            "Mezuniyet sonrası çıktılar ve çalışma hakları",
            "Diaspora, güvenlik, öğretim dili",
            "Rakiplerin payı ve acente ağının halihazırdaki doygunluğu",
          ],
        },
        {
          n: "03",
          name: "Kayda dönüşüyor mu",
          line: "Uygulanabilirlik; portföylerin çoğunun hiç ölçmediği kısım.",
          signals: [
            "Ulusal ortalama değil, o uyruğa özgü vize onay oranı",
            "Belgelerin güvenilirliği ve yarattığı doğrulama yükü",
            "Tekliften kayda dönüşüm oranı, pazara ve programa göre",
            "Kayıt başına maliyetin getirdiği öğrenim ücretine oranı",
            "Birinci yıldan sonra devam",
          ],
        },
      ],
      risk:
        "Toplam kaydın kabaca üçte birini aşan tek bir pazar bir güç değil, bir yoğunlaşma riskidir: tek bir başkentteki bir vize kuralı, bir kur hareketi ya da bir politika değişikliği bir yılın planını beraberinde götürebilir. Portföy, hacim için olduğu kadar bilinçli biçimde dağılım için de yönetilir.",
    },

    cta: {
      heading: "Bunu kurumunuza getirin.",
      body:
        "Öğrenci kazanımı stratejisi, ortak ağı tasarımı, acente kademelendirmesi ve katılımı üzerine danışmanlık; ya da mevcut ağınızın gerçekte ne getirdiğinin denetimi.",
    },
  },

  icd: {
    name: "ICD",
    expansion: "Kültürlerarası Yetkinlik Geliştirme",
    lede: "Kültürlerarası yetkinliği, bireylerden hissetmeleri istenen bir şey değil, bir kurumun sahip olduğu bir nitelik olarak ele alan eğitim.",

    premise: {
      heading: "Bir eksiklik, bir ruh hâli değil",
      quote:
        "Kurumsal kültürlerarası yetkinliği, tamamlayıcı bir kültürel yatırım olarak değil, kapsayıcılığın ön koşulu olarak anlamak daha doğrudur.",
      source:
        "Gültekin & Qasmani, Türk Üniversitelerinde Uluslararası Öğrencilerin Yapısal Ötekileştirilmesi",
      body:
        "Çalışma, yetmiş uyruktan 580 uluslararası öğrencide yedi boyutu ölçüyor. Veri kümesinin tamamındaki en güçlü ilişki, bir kurumun kültürlerarası yetkinlik eksikliği ile öğrencilerinin bildirdiği ötekileştirme arasında. Bu eğitimin var olma nedeni bu bulgudur; yalnızca öğrencilere verilmemesinin nedeni de.",
      figures: [
        {
          value: "0,80",
          label: "r",
          note: "kültürlerarası yetkinlik eksikliği ile ötekileştirme — veri kümesindeki en güçlü ilişki",
        },
        {
          value: "2,62",
          label: "ortalama",
          note: "beşli ölçekte kurumsal kültürlerarası yetkinlik",
        },
        {
          value: "%28,4",
          label: "",
          note: "üniversite yönetiminin anlamlı kapsayıcılığı desteklediğini doğruluyor",
        },
      ],
      caveat:
        "Çalışma kesitsel ve kendi beyanına dayalı; dolayısıyla bunlar kanıtlanmış nedenler değil, birlikte görülme örüntüleridir. Makalenin kendisi de bunu söylüyor.",
    },

    organisational: {
      quote:
        "Bu çalışma kültürlerarası yetkinliği örgütsel bir nitelik olarak ele alır: bir kurumun yönetiminin, akademik kadrosunun ve idari personelinin, hizmetlerin tasarımında ve sunumunda kültürel farkları görme ve bunlara karşılık verme yönündeki toplam kapasitesi.",
      body:
        "Yönetim, akademik kadro ve personelin her biri bu kapasitenin farklı bir parçasını taşır; birine yönelik bir atölye diğerlerinin yerini tutamaz. Program üç hat üzerinde yürür; her biri ayrı tasarlanır ve her gruba kendi diliyle anlatılır.",
    },

    audiences: [
      {
        key: "Öğrenciler",
        tone: "green",
        body: "İletişim, uyum ve topluluk kurma üzerine etkileşimli oturumlar.",
        outcomes: ["kültürel yön bulma", "kimlik müzakeresi", "topluluk kurma"],
      },
      {
        key: "Akademik kadro",
        tone: "blue",
        body: "Sınıf içi kapsayıcılık ve kültürlerarası anlayış için çerçeveler ve atölyeler.",
        outcomes: ["kapsayıcı pedagoji", "kültürlerarası etkileşim", "öğrenciyi tutma"],
      },
      {
        key: "İdare",
        tone: "amber",
        body: "Hizmet sunumu, kültürel duyarlılık ve sorun çözme eğitimleri.",
        outcomes: ["hizmet sunumu", "kültürel duyarlılık", "sorun çözme"],
      },
    ],

    cycle: [
      {
        n: "01",
        name: "Tanı",
        body: "Kurumun elinde hâlihazırda ne olduğu ve açığın nerede durduğu. Yönetimin bağlılığı, personelin iletişimi ve program tasarımı ayrı ayrı ölçülür; çünkü araştırma bunların farklı oranlarda aksadığını buluyor.",
      },
      {
        n: "02",
        name: "Tasarım",
        body: "Üç hat için ve kurumun kendi bağlamı için kurulmuş bir müfredat; başka yerden taşınmış bir izlence değil.",
      },
      {
        n: "03",
        name: "Uygulama",
        body: "Yerinde ya da karma yürütülen oturumlar, öğretim dilinde, kurumda kalan materyallerle.",
      },
      {
        n: "04",
        name: "Raporlama",
        body: "Neyin değiştiği, neyin değişmediği ve kurumun dış destek olmadan neyi sürdürmesi gerektiği.",
      },
    ],

    delivered: ["Türkiye", "Pakistan", "Irak", "Nepal", "Almanya"],

    priority: {
      quote:
        "Kültürlerarası yetkinlik kurumun her katmanına yerleşmelidir — rektörlüğün karar alma ve kaynak dağıtımından uluslararası ofisin kadrosuna, akademik kadronun eğitimine ve öğrenci işleri programlarına kadar.",
      body:
        "Madde düzeyindeki sonuçlardan en doğrudan iki müdahale çıkıyor: kariyer danışmanlığının uluslararası mezunların işgücü piyasasındaki farklı konumu etrafında yeniden tasarlanması ve öğretim dilinde destek sağlanması. Bunlar ölçme aracının tamamındaki en düşük puanlı iki maddeye karşılık geliyor.",
    },

    structures: {
      heading: "Yapılar, vitrinler değil",
      quote:
        "Üniversiteler uluslararası öğrencileri kültür şenlikleri, tanıtım fotoğrafları ve pazarlama malzemeleri yoluyla simgesel bir kaynak olarak seferber eder; böylece güç ilişkilerini ya da fırsat yapılarını değiştirmeden çeşitlilik belgesi edinirler.",
      body:
        "Ankette öğrencilerin kabaca %67'si bu şekilde kullanıldığını söylerken, %35,5'i bundan yararlandığını söyledi — aradaki fark yaklaşık 31 yüzde puanı ve göstermelik temsil kavramının yakalamak için kurulduğu büyüklük tam olarak budur. Bunu tek başına eğitim kapatmaz. Kapatan şey, öğrencilerin görev aldığı, yazdığı ve hesabını verdiği kalıcı yapılardır. Bunlardan ikisi İstanbul Aydın Üniversitesi'nde kuruldu ve programın bir kuruma kurmakta yardım ettiği şeyin parçasıdır.",
      items: [
        {
          name: "Model Birleşmiş Milletler",
          line: "Kampüs programı kuruldu ve dört konferans düzenlendi.",
          why: "Bir delege bir pozisyon alır, onu müzakere eder ve ondan sorumlu tutulur. Yetkinlik anlatılmaz, kullanılır.",
        },
        {
          name: "STARLIGHT",
          line: "Türkiye'nin ilk uluslararası öğrenci dergisi.",
          why: "Öğrencilerin kendi yürüttüğü bir yayın platformu, tanıtım fotoğrafının elinden aldığı yazarlığı onlara geri verir.",
        },
      ],
    },

    invitations: [
      {
        title: "Araştırma iş birliği",
        body: "Kültürlerarası yetkinlik, ötekileştirme ya da yükseköğretimin uluslararasılaşması üzerine.",
      },
      {
        title: "Danışmanlık",
        body: "Uluslararası öğrenciler ve onlara destek veren personel için.",
      },
      {
        title: "İstişare",
        body: "Uluslararasılaşma stratejisi, ortaklıkların etkinleştirilmesi ve öğrenci deneyimi üzerine.",
      },
      {
        title: "Kısa süreli programlar",
        body: "Yaz ve kış okulları, barış ve diplomasi yoğun programları, akademik kadro ve personel değişimleri — tasarımdan raporlamaya.",
      },
      {
        title: "ICD ders tasarımı",
        body: "Kurumunuzun sahiplendiği ve kendi yürüttüğü bir kültürlerarası yetkinlik dersi kurmak.",
      },
    ],

    closing:
      "Kurumsal kültürlerarası yetkinlik, kapsayıcılığın bağlı olduğu koşuldur. Ölçülebilir ve kurulabilir.",
  },

  iris: {
    lede: "Uluslararasılaşma, idari bir süreç olmaktan çıkarılıp stratejik, ölçülebilir ve veriye dayalı bir işleve dönüştürüldü.",

    problem: {
      heading: "Üniversiteler küreselleşti.",
      counter: "Yönetim sistemleri küreselleşmedi.",
      figures: [
        { value: "3–6", unit: "ay", note: "tek bir mutabakat zaptı imzalamak için" },
        { value: "5–10", unit: "kişi", note: "her anlaşmaya dokunuyor" },
        { value: "4'te 1", unit: "", note: "ortaklık görüşmesi yarıda bırakılıyor" },
      ],
      frictions: [
        "dağınık strateji",
        "tepkisel kararlar",
        "yapılandırılmamış hareketlilik",
        "idari yük",
        "ölçülebilir bilgi yok",
      ],
      close: "Sezgiyle yönetiliyor. Bilgiyle değil.",
      turn: "Ya ölçülebilseydi?",
    },

    instruments: {
      heading: "Her şey iki ekonometrik ölçüm aracıyla başlıyor.",
      img: {
        role: "Açığın büyüklüğü.",
        parts: [
          {
            name: "Bilgi asimetrisi",
            items: [
              "aday ortakların sunulmasına kadar geçen gün",
              "etkin kullanılan arama platformları",
              "belgelenmiş bir keşif süreci",
            ],
          },
          {
            name: "İş akışı dağınıklığı",
            items: [
              "mutabakat zaptı başına onay veren birim",
              "talepten imzaya kadar geçen gün",
              "yarıda bırakma oranı",
            ],
          },
          {
            name: "Dijital altyapı eksikliği",
            items: [
              "amaca özel yazılım",
              "merkezî kayıtlar",
              "izleme, entegrasyon, gösterge panoları",
            ],
          },
        ],
      },
      ipi: {
        role: "Onu kapatma kapasitesi.",
        parts: [
          {
            name: "Yönetimin bağlılığı",
            items: [
              "imzalanmış uluslararasılaşma stratejisi",
              "kendine ait uluslararası ilişkiler ofisi (en az 1 tam zamanlı)",
              "kendine ait bütçe kalemi",
            ],
          },
          {
            name: "Akademik kadronun hazırlığı",
            items: [
              "dijital rahatlık",
              "yapay zekâya aşinalık",
              "yapay zekâ önerilerine güven",
              "düzenli kullanma olasılığı",
            ],
          },
        ],
      },
      close: "Ölçüldü — tahmin edilmedi.",
    },

    profiles: {
      heading: "Dört kurumsal profil",
      note: "IMG ve IPI birlikte okunur.",
      items: [
        { condition: "Büyük açık · Yüksek kapasite", action: "Şimdi uygulayın" },
        { condition: "Küçük açık · Yüksek kapasite", action: "İlerletin ve karşılaştırın" },
        { condition: "Büyük açık · Düşük kapasite", action: "Önce yönetişim" },
        { condition: "Küçük açık · Düşük kapasite", action: "Hazırlık kurun" },
      ],
    },

    chain: ["Araştırma", "Ölçüm", "Bilgi", "Eylem"],

    modules: [
      { n: "01", name: "Gösterge panosu", line: "Uluslararasılaşmanın her sinyali." },
      { n: "02", name: "Sağlık göstergesi", line: "Kurumun uluslararasılaşma sağlığı, IMG ve IPI'den hesaplanır." },
      { n: "03", name: "Ortak keşfi", line: "Adaylar avlanmaz; bulunur ve sıralanır." },
      { n: "04", name: "Ortaklıklar", line: "Portföy ve ne kadarının gerçekten işlediği." },
      { n: "05", name: "Analitik", line: "Geçmiş eğilimlerden stratejik öngörülere." },
      { n: "06", name: "Hareketlilik", line: "Her öğrencinin yolculuğu, veriyle planlanmış." },
      { n: "07", name: "Mutabakat yönetimi", line: "Hiçbir anlaşma fark edilmeden sona ermez." },
      { n: "08", name: "Öğrenci kazanımı", line: "İlk sorudan kayda kadar, uçtan uca ölçülmüş." },
      { n: "09", name: "Belgeler", line: "Arşive sorun." },
    ],

    engine: {
      heading: "Bir veri tabanı değil. Bir bilgi sistemi.",
      inputs: ["Kurum", "Hareketlilik", "Ortaklık", "Öğrenci kazanımı"],
      core: ["IMG çerçevesi", "IPI çerçevesi", "Araştırma kitaplığı", "Yapay zekâ akıl yürütmesi"],
      outputs: ["Analitik", "Öneriler", "Karar desteği", "Yönetim raporları"],
      close: "Her çıktı ölçülmüş bir girdiye — ve ardındaki bilime — kadar izlenebilir.",
      library:
        "IRIS araştırma kitaplığına dayanır: IRIS'in kendi veri kitaplığında saklanan hakemli makaleler ve resmî kılavuzlar; böylece her yanıtın bilimsel bir dayanağı olur.",
    },

    closing:
      "IRIS, uluslararasılaşmayı dağınık bir idari işten ölçülebilir kurumsal bilgiye dönüştürür.",
    credit: "IMG · IPI ekonometrik çerçeveleri üzerine kuruldu — Gültekin & Qasmani",
  },

  research: {
    "structural-marginalization-turkish-universities": {
      title: "Türk Üniversitelerinde Uluslararası Öğrencilerin Yapısal Ötekileştirilmesi",
      subtitle: "Kurumsal Başarısızlığın İki Mekanizması: Göstermelik Temsil ve Umut Tacirliği",
      area: "Uluslararası öğrenci deneyimi",
      type: "Dergi makalesi",
      date: "Yakında — JUMP'a sunuldu",
      abstract:
        "Küresel Güney'deki üniversiteler uluslararası öğrenci kazanımını, onu taşıyacak kurumsal altyapıdan çok daha hızlı büyüttü; buna karşın bu ortamlarda ötekileştirme büyük ölçüde tanımsız ve ölçülmemiş durumda. Bu çalışma, Türk üniversitelerindeki uluslararası öğrencilerin çok boyutlu deneyimlerini inceliyor; odağında yapısal ötekileştirme, ayrımcı uygulamalar ve kurumsal vaatlerle yaşanan gerçeklik arasındaki açık var. Yetmiş uyruktan 580 uluslararası öğrenciyle yapılan kesitsel anket verilerine dayanan araştırma yedi tematik boyutu değerlendiriyor: ötekileştirme, ayrımcılık, kültürlerarası yetkinlik, göstermelik temsil, beklenti ile gerçekliğin örtüşmesi (burada umut tacirliği olarak işletimselleştirildi), psikolojik etki ve kuruma duyulan güven. Bulgular zayıf kurumsal destek sistemlerine, yaygın kalıp yargılara, duygusal tükenmeye ve toplumsal yalıtılmışlığa işaret ediyor. Ötekileştirme ve umut tacirliğinin her biri psikolojik baskıyla anlamlı biçimde ilişkili; kültürlerarası yetkinlik ise ötekileştirmeyle en güçlü ilişkiyi gösteriyor. Deardorff'un (2006) Kültürlerarası Yetkinlik Piramidi, Gültekin'in (2020a) eğitimsel yumuşak güç çerçevesi ve Pham ile Tran'ın (2015) kültürlerarası sermaye modeline dayanan makale, ötekileştirmenin bireysel değil sistemik bir başarısızlık olarak anlaşılmasının daha doğru olduğunu savunuyor; göstermelik temsil ile umut tacirliğini de kurumsal uygulamayı makro-siyasal sonuca bağlayan orta düzeyli kuramsal araçlar olarak öneriyor. Tasarım kesitsel olduğu ve kendi beyanına dayandığı için burada bildirilen ilişkiler nedensel etkileri değil birlikte görülme örüntülerini tarif ediyor; önerilen iki çerçevenin başka ev sahibi ülke bağlamlarında da sınanması gerekiyor.",
      keywords: [
        "ötekileştirme",
        "göstermelik temsil",
        "umut tacirliği",
        "kültürlerarası yetkinlik",
        "uluslararası yükseköğretim",
        "uluslararası ilişkiler",
      ],
    },

    "ai-international-academic-relations": {
      title:
        "Uluslararası Akademik İlişkilerde ve Yükseköğretim Kurumlarının Uluslararasılaşmasında Yapay Zekânın Rolü",
      subtitle: "Yükselen Bir Kapsamlı Üniversiteden Ampirik Bir Analiz",
      area: "Uluslararasılaşma kuramı",
      type: "Çalışma makalesi",
      date: "Sürüyor",
      abstract:
        "Yükseköğretimin uluslararasılaşması kurumsal meşruiyetin belirleyici bir işareti hâline geldi; oysa onu taşıyan idari altyapı şaşırtıcı ölçüde gelişmemiş durumda. Küresel Kuzey'de de Küresel Güney'de de uluslararası ofisler kurumlar arası karmaşık ilişkileri hâlâ e-posta, tablolar ve elden yürüyen onay zincirleriyle yönetiyor; bu makalenin uluslararasılaşma yönetimi açığı (IMG) olarak kavramsallaştırdığı durum böyle doğuyor: bir kurumun ilan ettiği uluslararasılaşma hedefleriyle bunları gerçekleştirme kapasitesi arasındaki yapısal kopukluk. İki yapılandırılmış odak grubundan ve akademisyenler ile uluslararası ofis çalışanlarıyla yapılan on beş ilâ yirmi yarı yapılandırılmış görüşmeden elde edilen nitel verilere dayanan makale üç soruyu ele alıyor: akademisyenleri uluslararası akademik faaliyete katılmaktan alıkoyan engeller nelerdir; bu katılımı anlamlı biçimde artıracak araçlar hangileridir; ve yapay zekâ temelli hangi kurumsal çözümler bu engelleri sistemik olarak giderebilir. Makale iki denklemli bir çerçeve öneriyor: açığın şiddetini üç boyutta (bilgi asimetrisi, iş akışı dağınıklığı ve dijital altyapı eksikliği) ampirik olarak gerekçelendirilmiş eşit ağırlıklarla ölçen bileşik bir gösterge olan IMG; ve o açığı kapatmaya dönük kurumsal hazırlığı yönetimin bağlılığı ile akademik kadronun hazırlığı üzerinden ölçen uluslararasılaşma potansiyeli göstergesi (IPI). Yükseköğretim kurumlarında otomatikleştirilmiş bir uluslararasılaşma yönetimi altyapısına duyulan ihtiyaç açıktır ve bölgeye özgü değildir: yirmi birinci yüzyıl yükseköğretiminin küresel ölçekte yapısal bir koşuludur. Makale, yapay zekâ destekli uluslararasılaşma yönetimi sistemlerinin IMG karşısındaki en uygulanabilir yapısal yanıt olduğunu ortaya koyuyor ve bu sistemlerin anlamlı ve adil sonuçlar üretmesinin hangi koşullarda daha olası olduğunu değerlendiriyor.",
      keywords: [
        "yapay zekâ",
        "uluslararasılaşma",
        "uluslararası akademik ilişkiler",
        "uluslararasılaşma yönetimi açığı",
        "uluslararasılaşma potansiyeli göstergesi",
        "akademisyen katılımı",
        "mutabakat zaptı otomasyonu",
        "dijital altyapı",
        "iş akışı dağınıklığı",
        "Küresel Güney",
        "Küresel Kuzey",
        "kurumsal kapasite",
        "bileşik gösterge",
      ],
    },

    "six-eras-internationalization": {
      title: "Yükseköğretimde Uluslararasılaşmanın Altı Dönemi",
      subtitle: "Altyapı, Uyum ve Gecikmenin Bedeli",
      area: "Uluslararasılaşma kuramı",
      type: "Çalışma makalesi",
      date: "Sürüyor",
      abstract:
        "Yükseköğretimin uluslararasılaşma tarihi doğrusal bir ilerleme öyküsü değildir. Kesintili sıçramaların öyküsüdür: uluslararası akademik ilişkinin kurallarının baştan yazıldığı anların; değişimi erken fark eden kurumların onlarca yıl boyunca büyüyen yapısal üstünlükler kurduğu, geciken kurumlarınsa giderek eskidiği anların. Üniversiteler, mesleği gereği, bilginin ve değişimin dünyadaki uzmanlarıdır. Kurumsal alışkanlıkları gereğiyse onu benimsemekte dünyanın en istikrarlı geç kalanları arasındadır. Uluslararasılaşma yazınının yapılandırılmış bir taramasına ve nitel içerik çözümlemesine dayanan makale, yükseköğretimin uluslararasılaşmasını analitik olarak birbirinden ayrılabilir altı döneme ayırmayı öneriyor: diplomatik dönem (1950'ler–1970'ler); anlaşmalar dönemi (1980'ler–2000); ticarileşme dönemi (1995–2005); sıralamalar dönemi (2004–2015); dijital dönem (2012–2023); ve yapay zekâ dönemi (2024'ten itibaren). Gültekin'in evre temelli sınıflandırmasının kademeli uyum okuması (Gültekin, 2021, 2025), altyapı kuramı (Star & Ruhleder, 1996; Bowker & Star, 1999) ve uluslararasılaşma yazını (Knight, 2004; Kehm & Teichler, 2007) üzerine kurulan makale üç özgün kuramsal katkı sunuyor: i) görünmez eşik — her dönemin belirleyici yetisinin ancak ilk hamle üstünlüğünün penceresi kapandıktan sonra belirleyici sayıldığı gözlemi; ii) kâğıt üzerinde uluslararasılaşma — kurumların her dönemin yetisini inşa etmeden sergileme yönündeki yapısal eğilimi; ve iii) sıçrama yanılsaması — kurumların temel altyapı katmanlarını atlayıp bugünün yetilerine varabileceği yanılgısı. Makale dönemler arası dört örüntü saptıyor: birikimli üstünlük savı, telafisizlik örüntüsü, her yeni dönemin hızlanması ve dönem atlama sorunu. Yapay zekâ döneminin ileriye dönük bir çözümlemesiyle kapanıyor; buna, yapay zekânın yönetim altyapısı yerine akademik metin üretimiyle sınırlanması hâlinde mevcut hiyerarşileri sarsmak yerine pekiştirme riski de dâhil. Altıncı dönem, görünmez eşiği gerçek zamanlı olarak adlandırılan ilk dönemdir. Soru, kurumların o eşik kapanmadan harekete geçip geçmeyeceğidir.",
      keywords: [
        "yükseköğretimin uluslararasılaşması",
        "dönemlendirme",
        "yapay zekâ dönemi",
        "uluslararası siyaset",
        "kâğıt üzerinde uluslararasılaşma",
        "sıçrama yanılsaması",
        "görünmez eşik",
      ],
    },

    "selling-merit": {
      title: "Liyakati Satmak",
      subtitle:
        "Burs Kaçırma, Umut Tacirliği ve Türk Yükseköğretiminin Uluslararasılaşmasında Kendinden Hoşnut Sıradanlığın Mimarisi",
      area: "Uluslararasılaşmanın ekonomi politiği",
      type: "Çalışma makalesi",
      date: "Sürüyor",
      abstract:
        "Türkiye'nin uluslararası öğrenciler için önde gelen bir varış ülkesine dönüşmesi — on yılda yaklaşık dokuz katlık bir artışla 356.000'i aşan öğrenci sayısı, yılda tahminen 3 milyar ABD doları gelir ve 2028 için 500.000'lik bir devlet hedefi — resmî olarak uluslararasılaşmanın ve yumuşak gücün bir zaferi diye anlatılıyor. Bu makale, o anlatının altında işleyen bir yolsuzluk mimarisini belgeliyor ve ona burs kaçırma adını veriyor: liyakat aracı olarak tanımlanan kurumsal burs kontenjanlarının, aracı kurumlara ayni ödenen bir komisyon işlevi gördükleri ticari bir kanala yönlendirilmesi ve ardından kendi masrafını karşılayan ailelere, liyakat diye yanlış tanımlanan indirimli öğrenim ücreti olarak perakende satılması. Aracılık sektörünün içinden bir etnografiye, kamuya açık acente reklamlarından oluşan bir derleme ile resmî kayıt istatistiklerine dayanan makale, mekanizmayı birbirine yakınsayan üç kanıt düzeyinde yeniden kuruyor. Başlıca kuramsal katkısı şudur: kendinden hoşnut sıradanlık — Arendt'in idari düşüncesizlik çözümlemesinin bir uzantısı; ama buradaki görevli korkak ve itaatkâr değil, gururlu ve girişimcidir ve zarara ortak olmayı bir yetkinlik olarak yaşar. Makale ayrıca, umut tacirliğinin — burs ödülünü kazandıran öğrenci hacmini üreten sistematik yanlış fırsat pazarlamasının — ve öğrencilerin varıştan sonra ırksallaştırılmış bir ötekileştirmenin içine terk edilmesinin ayrı olgular olmadığını; tek bir teşvikin giriş ve çıkış yarası olduğunu savunuyor. O teşvikin içinde öğrenci ne müşteridir ne yararlanıcı; teslimi ödemeyi tetikleyen bir hamiline yazılı senettir. Çözümleme akademik kapitalizm, yolsuzluk sosyolojisi ve diploma sistemlerinin ekonomi politiği içine yerleşiyor; çağdaş araştırmanın yanı sıra Marx, Weber, Durkheim, Bourdieu, Fanon ve Akerlof'u işe koşuyor. Sonuçta bu yolsuzluğun kurgulayan bir faili olmadığını; yalnızca yapısal olarak üretilen ve ideolojik olarak önceden aklanan bir sürüklenme bulunduğunu söylüyor ve piyasanın personeline değil tasarımına yönelen bir sicil–lisans–emanet hesabı mimarisi öneriyor.",
      keywords: [
        "yükseköğretimin uluslararasılaşması",
        "yolsuzluk",
        "eğitim acenteleri",
        "burslar",
        "Türkiye",
        "akademik kapitalizm",
        "kötülüğün sıradanlığı",
        "yumuşak güç",
      ],
    },

    "security-sovereignty-international-student": {
      title: "Güvenlik, Egemenlik ve Uluslararası Öğrenci",
      subtitle: "Ticari Bağımlılık ve Sınır Ötesi Hareketliliğin Yönetişimi",
      area: "Uluslararası öğrencilerin güvenlikleştirilmesi",
      type: "Çalışma makalesi",
      date: "Sürüyor",
      abstract:
        "Devletler bir zamanlar uluslararası öğrencileri nüfuz aracı olarak çağırıyordu; giderek artan biçimde gelir kaynağı olarak çağırıyorlar. Bu makale, uluslararası yükseköğretimin ticarileşmesinin, egemen yumuşak güç çerçevesinin göremeyeceği yapısal bir güvenlik sorunu ürettiğini savunuyor. Pek çok devlette üniversiteler gelirlerinin önemli bir bölümü için uluslararası öğrenim ücretlerine bağımlı hâle geldikçe — ve bu bağımlılık çoğu kez tek bir, kimi zaman rakip bir devletin öğrencilerinde yoğunlaştıkça — söz konusu mali bağımlılık ulusal egemenliğin bir kırılganlığına dönüştü: bir kaldıraç biçimi, sistemik bir kırılganlık kaynağı ve kritik bir bilgi altyapısı üzerindeki devlet denetiminin aşınması. Uluslararası bağımlılık geleneğine ve güvenlikleştirme kuramına dayanan makale, ortaya çıkan bu dinamiği ticari bağımlılığın güvenlikleştirilmesi olarak kavramsallaştırıyor ve üç örnek üzerinden gösteriyor (Birleşik Krallık, Çin ve Türkiye). Ayrıca, açık hareketliliği meşrulaştırmak için hâlâ öne sürülen nüfuz gerekçesinin bir nedensellik mekanizmasına — temasın yakınlık doğurmasına — dayandığını, oysa bu mekanizmanın işlerlik koşullarının büyük ölçüde aşındığını savunuyor. Böylece uluslararası öğrenci, artık birbiriyle bağdaşmayan üç devlet buyruğunun — gelir, nüfuz ve güvenlik — kesişiminde duruyor. Makale, sınır ötesi hareketliliğin yönetişiminin, devletlerin kendi yarattığı ve çözemediği bir çelişkinin idaresine dönüştüğü sonucuna varıyor.",
      keywords: ["güvenlikleştirme", "egemenlik", "sınır ötesi hareketlilik"],
    },

    "unesco-short-term-programmes-icd": {
      title:
        "UNESCO Kısa Süreli Programlarının Öğrencilerin Kültürlerarası Yetkinlik Gelişimindeki Rolü",
      subtitle: "UNESCO Kürsüsü Barış ve Diplomasi Programlarından Bulgular",
      area: "Kültürlerarası yetkinlik geliştirme",
      type: "Çalışma makalesi",
      date: "Sürüyor",
      abstract:
        "Kısa süreli hareketlilik programları, üniversitelerin bir dönem boyu hareketliliği malî ya da akademik olarak erişilmez olan öğrencilere uluslararası deneyim ulaştırmasının başlıca yolu hâline geldi. Ne var ki bu programların kültürlerarası yetkinlik gelişimine katkısı eşitsiz biçimde belgelenmiş durumda; UNESCO Kürsüleri ve UNITWIN Programı kapsamında yürütülen programlarsa, eğitim ve kapasite geliştirme kürsü görev tanımının açık bir parçası olmasına rağmen bu yazından neredeyse tümüyle yoktur. Bu çalışma, İstanbul Aydın Üniversitesi'ndeki Kültürel Diplomasi, Yönetişim ve Eğitim UNESCO Kürsüsü tarafından [yıl] ile [yıl] arasında yürütülen UNESCO Barış ve Diplomasi Programlarına katılan [N] ülkeden [N] katılımcıda kültürlerarası yetkinlik sonuçlarını değerlendiriyor. Program öncesi ve sonrası tasarımı, katılımcıların nitel anlatılarıyla destekleyen çalışma, Deardorff'un süreç modelinde tanımlanan bilgi, tutum ve uygulama boyutlarındaki değişimi ölçüyor ve programın Model Birleşmiş Milletler bileşeninin uygulamalı bir pedagojik öge olarak katkısını inceliyor. Bulgular [sonuç özeti] göstermektedir. Çalışma, kurumsal bir barış ve diplomasi görev tanımı altında yürütülen kısa süreli programların kültürlerarası yetkinlikte ölçülebilir kazanımlar ürettiğini; kürsü yapısının uluslararası erişimi kanıtlanmış, yinelenebilir ve taşınabilir bir uygulama modeli sunduğunu; ve benzetim temelli uygulamanın katılmasının, sıkıştırılmış programların davranışsal sonuçlara ulaşmasındaki yapısal bir sınırı giderdiğini ortaya koyuyor. Bu modelin UNITWIN ağı boyunca yaygınlaştırılmasını ve ağ içinde katılımcı düzeyinde sonuç ölçümünün standart uygulama hâline getirilmesini savunuyoruz.",
      keywords: [
        "kültürlerarası yetkinlik geliştirme",
        "UNESCO Kürsüleri",
        "UNITWIN",
        "kısa süreli hareketlilik",
        "Model Birleşmiş Milletler",
        "barış eğitimi",
        "yükseköğretimin uluslararasılaşması",
      ],
    },

    "from-survival-to-contribution": {
      title: "Hayatta Kalmaktan Katkıya",
      subtitle:
        "WISDOM Programı, STEM Alanındaki Yerinden Edilmiş Kadınlar ve Yükseköğretimin Barış İnşası İşlevi",
      area: "Yerinden edilmiş araştırmacılar, STEM erişimi",
      type: "Çalışma makalesi",
      date: "Sürüyor",
      abstract:
        "Yükseköğretim çoğu zaman yerinden edilmişlikten çıkış yolu olarak anlatılır; ama bir bursun maddi bir rahatlamadan fazlasına dönüşme mekanizması nadiren açıkça belirtilir. Bu makale, İstanbul Aydın Üniversitesi (İAÜ) ile Gelişmekte Olan Dünya İçin Bilimde Kadınlar Örgütü (OWSD) arasındaki bir ortaklık olan ve Eylül 2024'ten bu yana İstanbul'daki STEM yüksek lisans programlarında yerinden edilmiş bir kadın grubunu destekleyen Women in Science Displacement Outreach Master's (WISDOM) Programı'nı inceliyor. Grubun tamamıyla yapılan bir sayım anketine (N = 13) ve [n] katılımcıyla yapılan yarı yapılandırılmış görüşmelere dayanan çalışma, geriye dönük bir öncesi–sonrası tasarımıyla dört alandaki değişimi ele alıyor: algılanan yapısal engeller, akademik öz-yeterlik, toplumsal ve mesleki bütünleşme ve geleceğe yönelim. Bulgular [çözümlemeden sonra yön ve büyüklük eklenecek] göstermektedir. Programın ayırt edici katkısının erişimin kendisi değil, erişimin faillik hâline dönüşmesi olduğunu savunuyoruz: katılımcılar, eğitimin ivedi güvenliğe aracılık ettiği bir hayatta kalma ufkundan, eğitimin köken ülkelerinin yeniden inşasına aracılık ettiği bir katkı ufkuna geçtiler. Bunu Türkiye'nin yerinden edilmiş bilim insanlarını kabul etme tarihine yerleştiriyor ve 1933 Üniversite Reformu'nun hem bir emsal hem bir uyarı sunduğunu savunuyoruz; çünkü o göçmenler arasındaki kadınlar kayıttan büyük ölçüde silinmiştir. Makale programı Sürdürülebilir Kalkınma Amaçlarıyla eşleştiriyor ve toplumsal cinsiyete duyarlı burs tasarımı için yinelenebilir bir çerçeve öneriyor. Grup büyüklüğünden, kendi beyanına dayanmaktan ve yazarların programla idari ilişkisinden doğan sınırlar doğrudan ele alınıyor.",
      keywords: [
        "mültecilerin yükseköğretimi",
        "STEM'de kadınlar",
        "yerinden edilme",
        "barış inşası",
        "Sürdürülebilir Kalkınma Amaçları",
        "eğitim diplomasisi",
        "Türkiye",
      ],
    },

    "when-the-mou-is-the-outcome": {
      title: "Mutabakat Zaptının Kendisi Sonuç Olduğunda",
      subtitle: "Kanada ve Türkiye Yükseköğretiminde Ortaklık Etkinleşmesinin Ölçülmesi",
      area: "Ortaklık yönetimi",
      type: "Çalışma makalesi",
      date: "Sürüyor",
      abstract:
        "Uluslararasılaşma stratejileri, olgun ve yükselen yükseköğretim sistemlerinin ikisinde de ortaklık sayılarını küresel katılımın kanıtı olarak giderek daha çok bildiriyor. Bu makale o sayıların neyi ölçtüğünü soruyor. Törensel uyum ve ayrışma üzerine yeni kurumsalcı çözümlemelere ve toplulukla iç içe araştırma içinde geliştirilen ortaklık asimetrisi eleştirilerine dayanarak, mutabakat zaptını imzalanması çoğu kez başlatıcı değil bitirici bir edim olan törensel bir belge olarak ele alıyoruz. Kanada ve Türkiye üniversitelerinde ilan edilmiş kurumsal ortaklıklardan karşılaştırmalı bir veri kümesi kuruyor ve her birini beş yıllık bir pencerede gözlemlenebilir etkinleşmeye karşı sınıyoruz; ölçütler dizinlenmiş ortak yazarlık, kayıtlı öğrenci ve personel hareketliliği, birlikte yürütülen programlar, ortak doktora danışmanlığı ve birlikte alınan dış fon. Tanı aracı olarak ortaklık etkinleşme oranını ve bir anlaşma yarılanma ömrü ölçüsünü öneriyor, her iki sistemde de farklı yollardan varılan yüksek düzeyde etkinleşmeme bildiriyoruz: Kanada örneğinde kayıt kısıtı altında meşruiyetin korunması, Türkiye örneğinde ulusal bir büyüme hedefi altında kapasitenin ikame edilmesi. Bu örüntü, iki savaş arası dönemde ikili belgelerin çoğalmasını ve yoğunluklarının, üretmeleri beklenen durumla karıştırılmasını hatırlatıyor. Ortaklık ilanının kurumsal bir gösteri olarak işlediğini; anlaşmaları denetlemek yerine sayan sıralama, akreditasyon ve raporlama rejimlerince ayakta tutulduğunu; ve reformun gereğinin daha az ortaklık değil, etkinleşmenin zorunlu olarak açıklanması olduğunu savunuyoruz. Kurumsal ortaklık portföyleri için bir raporlama standardı önerisiyle kapatıyoruz.",
      keywords: ["mutabakat zaptları", "ortaklık etkinleşmesi", "Kanada", "Türkiye"],
    },

    "borrowed-instruments-unbuilt-systems": {
      title: "Ödünç Alınmış Araçlar, Kurulmamış Sistemler",
      subtitle: "Bologna Uyumu ve Ukrayna ile Türkiye'de Biçimcilik Mirası",
      area: "Uluslararasılaşma kuramı",
      type: "Çalışma makalesi",
      date: "Sürüyor",
      abstract:
        "Ukrayna ve Türkiye, Bologna Süreci'ni çeperden benimseyen ülkelerdir ve ikisi de neredeyse tam bir biçimsel uyum sergiler: üç kademeli yapı, kredi transferi, diploma ekleri, yeterlilik çerçeveleri ve ulusal kalite güvence kurumları. İkisi de araçla işlev arasında süregiden açıklar sergiler: taşınmayan kredi tanınması, sonradan üretilen öğrenme çıktıları ve öğretimi değil belgeyi denetleyen kalite güvencesi. Bu makale, kurumsal tarihleri birbirine benzemeyen iki sistemin neden aynı içi boş benimseme örüntüsünde buluştuğunu soruyor. Politika ödünç alma yazınına ve eğitim kurumlarında güven ile ahlaki faillik üzerine yazına dayanarak, her sistemin ayrı bir idari biçimcilik mirası taşıdığını savunuyoruz: Türkiye örneğinde, Avrupa kurumsal biçiminin ithalinin kurumun kendisinin edinilmesi sayıldığı bir Tanzimat örüntüsü; Ukrayna örneğinde, üretilen kaydın raporlanan faaliyetin yerine geçtiği Sovyet sonrası bir raporlama kültürü. Ulusal uygulama raporlarını, kalite güvence kurumu belgelerini, mevzuat metinlerini ve hareketlilik ile tanınma verilerini, her iki ülkede yapılan uzman görüşmeleriyle birlikte kullanarak, her mirasın hangi Bologna araçlarının etkinleştiğini ve hangilerinin törensel kaldığını nasıl belirlediğini izliyoruz. Tanı aracı olarak araç etkinleşmesini, açıklayıcı kavram olarak biçimcilik mirasını öneriyoruz. İçi boş uyumun asıl bedelinin idari verimsizlik değil kurumsal güvenin aşınması olduğunu ve bu aşınmanın kendini beslediğini savunuyoruz: akademisyenler ve öğrenciler kurumsal belgeleri birer gösteri olarak okumayı bir kez öğrendiklerinde, sonraki her esaslı reform daha baştan itibarsız gelir.",
      keywords: ["Bologna Süreci", "Ukrayna", "Türkiye", "politika biçimciliği"],
    },
  },

  marks: {
    istanbul: {
      hint: "Bu çalışmanın yazıldığı yer",
      title: "İstanbul",
      line: "Bütün arşivin içinden yazıldığı şehir.",
    },
    seasons: {
      hint: "İki saat, tek bir hayat",
      title: "Mevsimler ve dönemler",
      line: "Romanın merkezî karşıtlığı: dönen zamana karşı süresi dolan zaman.",
    },
    nationalities: {
      hint: "Eğitim salonunda sayıldı",
      title: "Yetmiş uyruk",
      line: "On iki ülkede, yetmişten fazla uyruktan katılımcıya verilen kültürlerarası yetkinlik eğitimi.",
    },
    unesco: {
      hint: "Dört ülke, tek bir program",
      title: "Türkiye, Pakistan, Nepal, Irak",
      line: "UNESCO Barış ve Diplomasi Programları.",
    },
    trilogy: {
      hint: "Birbirine ait üç makale",
      title: "Yolsuzluk üçlemesi",
      line: "Ötekileştirme (n = 580), Selling Merit ve dizinin üçüncü makalesi.",
    },
    founded: {
      hint: "Bir kampüste başlatılan iki şey",
      title: "İstanbul Aydın'da kuruldu",
      line: "Kampüsün Model Birleşmiş Milletler programı ve STARLIGHT.",
    },
    branch: {
      hint: "En yükseği",
      title: "The Highest Branch",
      line: "Yirmi dokuz bölüm. Yüz kırk dört bin kelime.",
    },
  },

  media: {
    "star-scholars-global-engagement": {
      title: "Küresel İlişkiler ve Marka Stratejisi",
      captions: [
        "STAR Scholars Network standında",
        "2024 STAR Küresel Konferansı, Kathmandu Üniversitesi",
        "Konferans panosunun önünde",
        "Konferans programının önünde",
        "STAR Scholars Network standı",
        "2024 STAR Küresel Konferansı katılımcıları",
        "Mekânın önünde katılımcılar",
        "Konferansta bir meslektaşla",
        "Kathmandu Üniversitesi, 2024 STAR Küresel Konferansı",
      ],
    },
    "unesco-peace-diplomacy": {
      title: "UNESCO Barış ve Diplomasi Programları",
      captions: [
        "Bir oturumu yönetirken",
        "UNESCO program ekibiyle",
        "Ev sahibi kurumla",
        "Mekânın önünde",
      ],
    },
    "international-student-recruitment": {
      title: "Uluslararası Öğrenci Kazanımı",
      captions: [
        "Fuarda, İstanbul Nişantaşı Üniversitesi standı",
        "Aday bir öğrenciye teklifi anlatırken",
        "Standın başında",
      ],
    },
    icd: {
      title: "ICD eğitimi",
      captions: [
        "Bir oturumu yönetirken",
        "Süren bir oturum",
        "Uluslararası öğrenci topluluğunun ötekileştirilmesi üzerine sunum",
        "Grubun tamamı",
        "«ICD in Higher Education» atölyesi, Katmandu, Nepal",
        "Oturumlar arasında katılımcılar",
      ],
    },
    award: {
      title: "Presidential Award of Service and Excellence",
      captions: [
        "Ödül, 2024 STAR Küresel Konferansı",
        "Dr. Osman Gültekin ile, Kathmandu Üniversitesi, Nepal",
      ],
    },
    mun: {
      title: "Model Birleşmiş Milletler",
      captions: [
        "IAUMUN sahnesinde",
        "Delegeler ve düzenleyiciler, İstanbul Aydın Üniversitesi",
        "Açılış oturumu",
        "Toplantı hâlinde bir komite",
        "Konferansta sertifika alırken",
        "Bir komite salonu",
        "Komite çalışması",
      ],
    },
    starlight: {
      title: "STARLIGHT",
      captions: ["Bir STARLIGHT kapağı", "Derginin nüshalarıyla"],
    },
  },
};
