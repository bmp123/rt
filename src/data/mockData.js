// ============================================================
// RadioTube MVP — Mock Data & Recommendation Engine
// ============================================================

export const CATEGORIES = [
  { id: 'business', label: 'Бизнес', icon: '💼', color: '#7c3aed' },
  { id: 'tech', label: 'IT и технологии', icon: '💻', color: '#06b6d4' },
  { id: 'psychology', label: 'Психология', icon: '🧠', color: '#f43f5e' },
  { id: 'health', label: 'Здоровье', icon: '❤️', color: '#10b981' },
  { id: 'finance', label: 'Финансы', icon: '📊', color: '#f59e0b' },
  { id: 'marketing', label: 'Маркетинг', icon: '📢', color: '#ec4899' },
  { id: 'education', label: 'Образование', icon: '📚', color: '#8b5cf6' },
  { id: 'creativity', label: 'Творчество', icon: '🎨', color: '#14b8a6' },
  { id: 'lifestyle', label: 'Лайфстайл', icon: '✨', color: '#f97316' },
  { id: 'sports', label: 'Спорт', icon: '⚡', color: '#ef4444' },
  { id: 'science', label: 'Наука', icon: '🔬', color: '#6366f1' },
  { id: 'career', label: 'Карьера', icon: '🚀', color: '#0ea5e9' },
];

export const FORMATS = [
  { id: 'podcast', label: 'Подкасты', icon: '🎙️' },
  { id: 'interview', label: 'Интервью', icon: '🎤' },
  { id: 'discussion', label: 'Дискуссии', icon: '💬' },
  { id: 'education', label: 'Обучение', icon: '🎓' },
  { id: 'qa', label: 'Q&A сессии', icon: '❓' },
  { id: 'workshop', label: 'Воркшопы', icon: '🛠️' },
];

export const AUTHORS = [
  {
    id: 1,
    name: 'Алексей Громов',
    avatar: null,
    initials: 'АГ',
    color: '#7c3aed',
    bio: 'Предприниматель, основатель 3 стартапов. Делюсь опытом масштабирования бизнеса.',
    categories: ['business', 'finance', 'marketing'],
    formats: ['podcast', 'interview', 'qa'],
    followers: 12400,
    totalStreams: 87,
    rating: 4.9,
    isLive: true,
    collabOpen: true,
    desiredCollabs: ['Маркетинг + финансы', 'Стартапы и инвестиции'],
    products: ['Консультация 1:1', 'Курс "Бизнес с нуля"'],
  },
  {
    id: 2,
    name: 'Мария Светлова',
    avatar: null,
    initials: 'МС',
    color: '#f43f5e',
    bio: 'Психолог, коуч. Помогаю разобраться в себе через живые эфиры.',
    categories: ['psychology', 'health', 'lifestyle'],
    formats: ['podcast', 'qa', 'discussion'],
    followers: 8900,
    totalStreams: 124,
    rating: 4.8,
    isLive: false,
    collabOpen: true,
    desiredCollabs: ['Психология + бизнес', 'Осознанность и здоровье'],
    products: ['Групповая терапия', 'Чек-лист осознанности'],
  },
  {
    id: 3,
    name: 'Дмитрий Кодов',
    avatar: null,
    initials: 'ДК',
    color: '#06b6d4',
    bio: 'Senior разработчик, 15 лет в IT. Разбираю технологии простым языком.',
    categories: ['tech', 'education', 'career'],
    formats: ['education', 'workshop', 'qa'],
    followers: 21300,
    totalStreams: 203,
    rating: 4.95,
    isLive: true,
    collabOpen: true,
    desiredCollabs: ['AI + бизнес', 'Код и карьера'],
    products: ['Менторство', 'Курс Python'],
  },
  {
    id: 4,
    name: 'Елена Маркова',
    avatar: null,
    initials: 'ЕМ',
    color: '#10b981',
    bio: 'Маркетолог, ex-Яндекс. Рассказываю как продвигать себя и свой продукт.',
    categories: ['marketing', 'business', 'creativity'],
    formats: ['interview', 'discussion', 'podcast'],
    followers: 15700,
    totalStreams: 96,
    rating: 4.7,
    isLive: false,
    collabOpen: true,
    desiredCollabs: ['Маркетинг + психология продаж'],
    products: ['Аудит маркетинга', 'Вебинар по SMM'],
  },
  {
    id: 5,
    name: 'Игорь Фитнесов',
    avatar: null,
    initials: 'ИФ',
    color: '#ef4444',
    bio: 'Фитнес-тренер, нутрициолог. Живые тренировки и разборы питания.',
    categories: ['sports', 'health', 'lifestyle'],
    formats: ['workshop', 'qa', 'education'],
    followers: 6200,
    totalStreams: 45,
    rating: 4.6,
    isLive: false,
    collabOpen: false,
    desiredCollabs: [],
    products: ['План тренировок', 'Консультация по питанию'],
  },
  {
    id: 6,
    name: 'Анна Научная',
    avatar: null,
    initials: 'АН',
    color: '#6366f1',
    bio: 'Популяризатор науки. Объясняю сложное просто в формате живых эфиров.',
    categories: ['science', 'education', 'tech'],
    formats: ['podcast', 'discussion', 'education'],
    followers: 18100,
    totalStreams: 156,
    rating: 4.85,
    isLive: true,
    collabOpen: true,
    desiredCollabs: ['Наука + бизнес', 'AI и будущее'],
    products: ['Лекторий', 'Научный клуб'],
  },
  {
    id: 7,
    name: 'Сергей Инвестов',
    avatar: null,
    initials: 'СИ',
    color: '#f59e0b',
    bio: 'Инвестор, финансовый консультант. Разбираю рынки в прямом эфире.',
    categories: ['finance', 'business', 'education'],
    formats: ['podcast', 'qa', 'discussion'],
    followers: 9400,
    totalStreams: 68,
    rating: 4.75,
    isLive: false,
    collabOpen: true,
    desiredCollabs: ['Финансы + психология денег'],
    products: ['Инвест-клуб', 'Разбор портфеля'],
  },
  {
    id: 8,
    name: 'Ольга Креатив',
    avatar: null,
    initials: 'ОК',
    color: '#14b8a6',
    bio: 'Дизайнер, арт-директор. Учу создавать визуал, который продаёт.',
    categories: ['creativity', 'marketing', 'education'],
    formats: ['workshop', 'education', 'interview'],
    followers: 7800,
    totalStreams: 52,
    rating: 4.65,
    isLive: false,
    collabOpen: true,
    desiredCollabs: ['Дизайн + маркетинг'],
    products: ['Курс по Figma', 'Разбор портфолио'],
  },
];

export const LIVE_STREAMS = [
  {
    id: 1,
    authorId: 1,
    title: 'Как запустить стартап в 2026 без инвестиций',
    description: 'Разбираем реальные кейсы бутстрэп-стартапов, которые вышли на прибыль за 6 месяцев.',
    categories: ['business', 'finance'],
    format: 'podcast',
    isLive: true,
    viewers: 342,
    startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    isPaid: false,
    price: 0,
    guestName: 'Виктор Стартапов',
    guestInitials: 'ВС',
  },
  {
    id: 2,
    authorId: 3,
    title: 'AI в 2026: что реально работает, а что хайп',
    description: 'Честный разбор AI-инструментов для разработчиков и предпринимателей.',
    categories: ['tech', 'business'],
    format: 'discussion',
    isLive: true,
    viewers: 891,
    startedAt: new Date(Date.now() - 20 * 60000).toISOString(),
    isPaid: false,
    price: 0,
    guestName: null,
    guestInitials: null,
  },
  {
    id: 3,
    authorId: 6,
    title: 'Квантовые компьютеры: когда они изменят мир?',
    description: 'Простым языком о самой горячей теме в науке.',
    categories: ['science', 'tech'],
    format: 'education',
    isLive: true,
    viewers: 567,
    startedAt: new Date(Date.now() - 60 * 60000).toISOString(),
    isPaid: false,
    price: 0,
    guestName: 'Проф. Квантов',
    guestInitials: 'ПК',
  },
];

export const UPCOMING_STREAMS = [
  {
    id: 101,
    authorId: 2,
    title: 'Как перестать откладывать: нейробиология прокрастинации',
    categories: ['psychology', 'health'],
    format: 'qa',
    scheduledAt: new Date(Date.now() + 2 * 3600000).toISOString(),
    isPaid: false,
    price: 0,
    interestedCount: 234,
    guestName: null,
  },
  {
    id: 102,
    authorId: 4,
    title: 'Личный бренд в 2026: стратегия с нуля',
    categories: ['marketing', 'business'],
    format: 'workshop',
    scheduledAt: new Date(Date.now() + 5 * 3600000).toISOString(),
    isPaid: true,
    price: 299,
    interestedCount: 189,
    guestName: null,
  },
  {
    id: 103,
    authorId: 7,
    title: 'Портфель 2026: куда вложить деньги',
    categories: ['finance'],
    format: 'podcast',
    scheduledAt: new Date(Date.now() + 24 * 3600000).toISOString(),
    isPaid: false,
    price: 0,
    interestedCount: 412,
    guestName: 'Алексей Громов',
  },
  {
    id: 104,
    authorId: 5,
    title: 'Тренировка в прямом эфире: жиросжигание за 30 мин',
    categories: ['sports', 'health'],
    format: 'workshop',
    scheduledAt: new Date(Date.now() + 48 * 3600000).toISOString(),
    isPaid: false,
    price: 0,
    interestedCount: 156,
    guestName: null,
  },
];

export const PAST_STREAMS = [
  {
    id: 201,
    authorId: 1,
    title: 'Ошибки первого года в бизнесе',
    categories: ['business'],
    format: 'podcast',
    recordedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    duration: '1:23:45',
    views: 2340,
    isPaid: false,
  },
  {
    id: 202,
    authorId: 3,
    title: 'React vs Vue в 2026',
    categories: ['tech'],
    format: 'discussion',
    recordedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    duration: '58:12',
    views: 4521,
    isPaid: false,
  },
  {
    id: 203,
    authorId: 6,
    title: 'Мифы о космосе, в которые все верят',
    categories: ['science'],
    format: 'education',
    recordedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    duration: '45:30',
    views: 8912,
    isPaid: false,
  },
];

export const COLLAB_REQUESTS = [
  {
    id: 1,
    title: 'Бизнес vs Психология: как мышление влияет на доход',
    author1Id: 1,
    author2Id: 2,
    proposedBy: 'audience',
    votes: 567,
    funded: 12400,
    goal: 25000,
    categories: ['business', 'psychology'],
    status: 'collecting',
    supportersCount: 234,
  },
  {
    id: 2,
    title: 'AI-революция в маркетинге: разработчик vs маркетолог',
    author1Id: 3,
    author2Id: 4,
    proposedBy: 'author',
    votes: 892,
    funded: 8200,
    goal: 15000,
    categories: ['tech', 'marketing'],
    status: 'collecting',
    supportersCount: 412,
  },
  {
    id: 3,
    title: 'Наука о спорте: мифы фитнес-индустрии',
    author1Id: 6,
    author2Id: 5,
    proposedBy: 'audience',
    votes: 345,
    funded: 5600,
    goal: 10000,
    categories: ['science', 'sports'],
    status: 'collecting',
    supportersCount: 178,
  },
  {
    id: 4,
    title: 'Финансовая грамотность vs Психология денег',
    author1Id: 7,
    author2Id: 2,
    proposedBy: 'audience',
    votes: 723,
    funded: 19800,
    goal: 20000,
    categories: ['finance', 'psychology'],
    status: 'almost',
    supportersCount: 389,
  },
  {
    id: 5,
    title: 'Креативный дизайн в IT-продуктах',
    author1Id: 8,
    author2Id: 3,
    proposedBy: 'author',
    votes: 456,
    funded: 3200,
    goal: 12000,
    categories: ['creativity', 'tech'],
    status: 'collecting',
    supportersCount: 201,
  },
];

export const TOPIC_REQUESTS = [
  {
    id: 1,
    title: 'Как уйти с найма и не потерять всё',
    categories: ['business', 'career'],
    votes: 1234,
    funded: 8900,
    goal: 15000,
    requestedAuthors: [1, 7],
    status: 'hot',
  },
  {
    id: 2,
    title: 'Нейросети для не-программистов: практическое руководство',
    categories: ['tech', 'education'],
    votes: 2100,
    funded: 12300,
    goal: 20000,
    requestedAuthors: [3],
    status: 'hot',
  },
  {
    id: 3,
    title: 'Осознанное потребление контента: как не утонуть в инфошуме',
    categories: ['psychology', 'lifestyle'],
    votes: 678,
    funded: 4500,
    goal: 10000,
    requestedAuthors: [2],
    status: 'collecting',
  },
  {
    id: 4,
    title: 'Инвестиции в здоровье: что реально работает',
    categories: ['health', 'finance'],
    votes: 890,
    funded: 6700,
    goal: 12000,
    requestedAuthors: [5, 7],
    status: 'collecting',
  },
];

export const CHAT_MESSAGES = [
  { id: 1, user: 'Андрей К.', text: 'Отличная тема! 🔥', time: '2 мин назад', isPaid: false },
  { id: 2, user: 'Света М.', text: 'А что насчет крипто-стартапов?', time: '1 мин назад', isPaid: false },
  { id: 3, user: 'Игорь П.', text: 'Расскажите про bootstrapping подробнее!', time: '1 мин назад', isPaid: true, amount: 100 },
  { id: 4, user: 'Ольга С.', text: 'Супер полезно, спасибо! 👏', time: '30 сек назад', isPaid: false },
  { id: 5, user: 'Дмитрий В.', text: 'Какой минимальный бюджет для старта?', time: '15 сек назад', isPaid: true, amount: 200 },
  { id: 6, user: 'Наталья Р.', text: 'Можно ли совмещать с основной работой?', time: '10 сек назад', isPaid: false },
  { id: 7, user: 'Максим Б.', text: '❤️🔥❤️', time: '5 сек назад', isPaid: false },
];

// ============================================================
// Recommendation Engine (client-side simulation)
// ============================================================

export function getPersonalizedFeed(userInterests, userFormats) {
  if (!userInterests || userInterests.length === 0) {
    return {
      liveNow: LIVE_STREAMS,
      upcoming: UPCOMING_STREAMS,
      recommended: AUTHORS.slice(0, 4),
      collabs: COLLAB_REQUESTS.slice(0, 3),
      topics: TOPIC_REQUESTS.slice(0, 2),
      pastStreams: PAST_STREAMS,
    };
  }

  // Score streams based on category overlap with user interests
  const scoreStream = (stream) => {
    let score = 0;
    stream.categories.forEach((cat) => {
      if (userInterests.includes(cat)) score += 3;
    });
    if (userFormats && userFormats.includes(stream.format)) score += 2;
    return score;
  };

  const scoreAuthor = (author) => {
    let score = 0;
    author.categories.forEach((cat) => {
      if (userInterests.includes(cat)) score += 3;
    });
    if (userFormats) {
      author.formats.forEach((fmt) => {
        if (userFormats.includes(fmt)) score += 1;
      });
    }
    score += author.rating * 2;
    score += Math.log(author.followers + 1);
    return score;
  };

  const scoreCollab = (collab) => {
    let score = 0;
    collab.categories.forEach((cat) => {
      if (userInterests.includes(cat)) score += 3;
    });
    score += collab.votes / 100;
    score += (collab.funded / collab.goal) * 5;
    return score;
  };

  const scoreTopic = (topic) => {
    let score = 0;
    topic.categories.forEach((cat) => {
      if (userInterests.includes(cat)) score += 3;
    });
    score += topic.votes / 200;
    return score;
  };

  const sortedLive = [...LIVE_STREAMS].sort((a, b) => scoreStream(b) - scoreStream(a));
  const sortedUpcoming = [...UPCOMING_STREAMS].sort((a, b) => scoreStream(b) - scoreStream(a));
  const sortedAuthors = [...AUTHORS].sort((a, b) => scoreAuthor(b) - scoreAuthor(a));
  const sortedCollabs = [...COLLAB_REQUESTS].sort((a, b) => scoreCollab(b) - scoreCollab(a));
  const sortedTopics = [...TOPIC_REQUESTS].sort((a, b) => scoreTopic(b) - scoreTopic(a));
  const sortedPast = [...PAST_STREAMS].sort((a, b) => scoreStream(b) - scoreStream(a));

  return {
    liveNow: sortedLive,
    upcoming: sortedUpcoming,
    recommended: sortedAuthors.slice(0, 6),
    collabs: sortedCollabs.slice(0, 4),
    topics: sortedTopics.slice(0, 3),
    pastStreams: sortedPast,
  };
}

export function getAuthorById(id) {
  return AUTHORS.find((a) => a.id === id);
}

export function getStreamsByAuthor(authorId) {
  return {
    live: LIVE_STREAMS.filter((s) => s.authorId === authorId),
    upcoming: UPCOMING_STREAMS.filter((s) => s.authorId === authorId),
    past: PAST_STREAMS.filter((s) => s.authorId === authorId),
  };
}

export function getCollabsForAuthor(authorId) {
  return COLLAB_REQUESTS.filter(
    (c) => c.author1Id === authorId || c.author2Id === authorId
  );
}

// Dashboard mock stats
export const DASHBOARD_STATS = {
  totalEarnings: 145600,
  monthEarnings: 23400,
  totalDonations: 312,
  totalPaidQuestions: 89,
  totalViewers: 34500,
  avgViewers: 290,
  subscriberCount: 12400,
  newSubscribers: 340,
  streams: [
    { date: '14 мар', viewers: 320, earnings: 3400 },
    { date: '15 мар', viewers: 280, earnings: 2100 },
    { date: '16 мар', viewers: 410, earnings: 5600 },
    { date: '17 мар', viewers: 350, earnings: 4200 },
    { date: '18 мар', viewers: 290, earnings: 2800 },
    { date: '19 мар', viewers: 520, earnings: 7300 },
    { date: '20 мар', viewers: 342, earnings: 3100 },
  ],
  recentDonations: [
    { user: 'Андрей К.', amount: 500, message: 'Спасибо за контент!', time: '10 мин назад' },
    { user: 'Мария В.', amount: 200, message: 'Отличный эфир!', time: '25 мин назад' },
    { user: 'Игорь С.', amount: 1000, message: 'За разбор моего кейса', time: '1 час назад' },
    { user: 'Дмитрий Л.', amount: 300, message: '', time: '2 часа назад' },
    { user: 'Ольга П.', amount: 150, message: 'Жду следующий эфир!', time: '3 часа назад' },
  ],
};
