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
    ask: "Bir adres bırakın, çıktığı gün haberiniz olsun. Başka hiçbir şey için değil.",
    placeholder: "siz@ornek.com",
    submit: "Çıkınca haber verin",
    sending: "Gönderiliyor",
    done: "O gün size yazacağım.",
    readMore: "Roman hakkında",
    dismiss: "Kapat",
    later: "Şimdi değil",
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
