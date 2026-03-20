import { useState, useEffect, useRef, useCallback } from 'react';
import {
  CATEGORIES,
  FORMATS,
  AUTHORS,
  LIVE_STREAMS,
  UPCOMING_STREAMS,
  PAST_STREAMS,
  COLLAB_REQUESTS,
  TOPIC_REQUESTS,
  CHAT_MESSAGES,
  DASHBOARD_STATS,
  getPersonalizedFeed,
  getAuthorById,
  getStreamsByAuthor,
  getCollabsForAuthor,
} from './data/mockData';

// ============================================================
// Helper: format numbers
// ============================================================
function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'М';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'К';
  return String(n);
}

function timeFromNow(dateStr) {
  const diff = new Date(dateStr) - Date.now();
  if (diff < 0) {
    const mins = Math.floor(-diff / 60000);
    if (mins < 60) return `${mins} мин назад`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ч назад`;
    return `${Math.floor(hrs / 24)} дн назад`;
  }
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `через ${mins} мин`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `через ${hrs} ч`;
  return `через ${Math.floor(hrs / 24)} дн`;
}

function timeUntil(dateStr) {
  const diff = new Date(dateStr) - Date.now();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return { value: mins, label: 'мин' };
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return { value: hrs, label: 'час' };
  return { value: Math.floor(hrs / 24), label: 'дн' };
}

// ============================================================
// Main App
// ============================================================
export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [userInterests, setUserInterests] = useState([]);
  const [userFormats, setUserFormats] = useState([]);
  const [currentView, setCurrentView] = useState('feed');
  const [activeStream, setActiveStream] = useState(null);
  const [activeProfile, setActiveProfile] = useState(null);
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const navigate = useCallback((view, data) => {
    if (view === 'stream') setActiveStream(data);
    else if (view === 'profile') setActiveProfile(data);
    setCurrentView(view);
  }, []);

  if (!onboarded) {
    return (
      <div className="app">
        <Onboarding
          userInterests={userInterests}
          setUserInterests={setUserInterests}
          userFormats={userFormats}
          setUserFormats={setUserFormats}
          onComplete={() => setOnboarded(true)}
        />
      </div>
    );
  }

  return (
    <div className="app">
      {currentView === 'stream' && activeStream ? (
        <StreamView
          stream={activeStream}
          onBack={() => setCurrentView('feed')}
          navigate={navigate}
          showToast={showToast}
          setModal={setModal}
        />
      ) : (
        <>
          <Header navigate={navigate} currentView={currentView} />
          <div className="app-content">
            {currentView === 'feed' && (
              <Feed
                userInterests={userInterests}
                userFormats={userFormats}
                navigate={navigate}
              />
            )}
            {currentView === 'marketplace' && (
              <Marketplace navigate={navigate} showToast={showToast} setModal={setModal} />
            )}
            {currentView === 'create' && (
              <CreateStream showToast={showToast} navigate={navigate} />
            )}
            {currentView === 'dashboard' && (
              <Dashboard navigate={navigate} />
            )}
            {currentView === 'profile' && activeProfile && (
              <ProfileView
                author={activeProfile}
                navigate={navigate}
                showToast={showToast}
                setModal={setModal}
              />
            )}
          </div>
          <BottomNav current={currentView} navigate={navigate} setCurrentView={setCurrentView} />
        </>
      )}

      {modal && <Modal modal={modal} setModal={setModal} showToast={showToast} />}
      {toast && <div className="toast">✅ {toast}</div>}
    </div>
  );
}

// ============================================================
// Onboarding (First-touch interest selection)
// ============================================================
function Onboarding({ userInterests, setUserInterests, userFormats, setUserFormats, onComplete }) {
  const [step, setStep] = useState(0);

  const toggleInterest = (id) => {
    setUserInterests((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleFormat = (id) => {
    setUserFormats((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="onboarding">
      <div className="step-indicator">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`step-dot ${step === i ? 'active' : ''}`} />
        ))}
      </div>

      {step === 0 && (
        <div className="onboarding-step" key="s0">
          <div className="onboarding-header">
            <div className="logo-big">📡</div>
            <h1>RadioTube</h1>
            <p>
              Платформа живого контента, где автор зарабатывает, а зритель влияет на происходящее
            </p>
          </div>
          <div style={{ flex: 1 }} />
          <div className="onboarding-actions">
            <button className="btn-primary" onClick={() => setStep(1)}>
              Начать
            </button>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="onboarding-step" key="s1">
          <div className="onboarding-subtitle">
            <h2>Что вам интересно?</h2>
            <p>Выберите темы — мы подберём контент для вас</p>
          </div>
          <div className="category-grid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`category-chip ${userInterests.includes(cat.id) ? 'selected' : ''}`}
                onClick={() => toggleInterest(cat.id)}
              >
                <span className="chip-icon">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="onboarding-actions">
            <button className="btn-secondary" onClick={() => setStep(0)}>
              Назад
            </button>
            <button
              className="btn-primary"
              disabled={userInterests.length === 0}
              onClick={() => setStep(2)}
            >
              Далее ({userInterests.length})
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="onboarding-step" key="s2">
          <div className="onboarding-subtitle">
            <h2>Какие форматы нравятся?</h2>
            <p>Подберём эфиры в вашем стиле</p>
          </div>
          <div className="format-grid">
            {FORMATS.map((fmt) => (
              <button
                key={fmt.id}
                className={`format-chip ${userFormats.includes(fmt.id) ? 'selected' : ''}`}
                onClick={() => toggleFormat(fmt.id)}
              >
                <span className="chip-icon">{fmt.icon}</span>
                {fmt.label}
              </button>
            ))}
          </div>
          <div className="onboarding-actions">
            <button className="btn-secondary" onClick={() => setStep(1)}>
              Назад
            </button>
            <button className="btn-primary" onClick={onComplete}>
              Войти в RadioTube 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Header
// ============================================================
function Header({ navigate, currentView }) {
  const titles = {
    feed: null,
    marketplace: 'Маркетплейс',
    create: 'Новый эфир',
    dashboard: null,
    profile: null,
  };
  return (
    <div className="header">
      <div className="header-logo">
        <div className="logo-icon">📡</div>
        <span>{titles[currentView] || 'RadioTube'}</span>
      </div>
      <div className="header-actions">
        <button className="header-btn" onClick={() => navigate('feed')} title="Поиск">🔍</button>
        <button className="header-btn notification" title="Уведомления">🔔</button>
      </div>
    </div>
  );
}

// ============================================================
// Bottom Navigation
// ============================================================
function BottomNav({ current, navigate, setCurrentView }) {
  const items = [
    { id: 'feed', icon: '🏠', label: 'Главная' },
    { id: 'marketplace', icon: '🔥', label: 'Маркет' },
    { id: 'create', icon: '+', label: '' },
    { id: 'dashboard', icon: '📊', label: 'Кабинет' },
    { id: 'myprofile', icon: '👤', label: 'Профиль' },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${item.id === 'create' ? 'create-btn' : ''} ${
            current === item.id ? 'active' : ''
          }`}
          onClick={() => {
            if (item.id === 'myprofile') {
              navigate('profile', AUTHORS[0]);
            } else {
              setCurrentView(item.id);
            }
          }}
        >
          {item.id === 'create' ? (
            <div className="nav-icon">{item.icon}</div>
          ) : (
            <>
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </>
          )}
        </button>
      ))}
    </nav>
  );
}

// ============================================================
// Feed (Personalized home)
// ============================================================
function Feed({ userInterests, userFormats, navigate }) {
  const feed = getPersonalizedFeed(userInterests, userFormats);

  return (
    <div className="page-enter">
      {/* Live Now */}
      {feed.liveNow.length > 0 && (
        <>
          <div className="section-header">
            <h2>🔴 Сейчас в эфире</h2>
          </div>
          <div className="live-scroll">
            {feed.liveNow.map((stream) => {
              const author = getAuthorById(stream.authorId);
              return (
                <div
                  key={stream.id}
                  className="live-card"
                  onClick={() => navigate('stream', stream)}
                >
                  <div className="live-card-preview">
                    <span className="wave-icon">🎙️</span>
                    <div className="live-badge">LIVE</div>
                    <div className="viewers-badge">👁 {formatNum(stream.viewers)}</div>
                  </div>
                  <div className="live-card-info">
                    <h3>{stream.title}</h3>
                    <div className="live-card-author">
                      <div className="avatar-sm" style={{ background: author.color }}>
                        {author.initials}
                      </div>
                      <span>{author.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Recommended Authors */}
      <div className="section-header">
        <h2>✨ Подобрано для вас</h2>
        <button className="see-all">Все</button>
      </div>
      <div className="authors-scroll">
        {feed.recommended.map((author) => (
          <div
            key={author.id}
            className="author-card"
            onClick={() => navigate('profile', author)}
          >
            <div className={`avatar-lg ${author.isLive ? 'live' : ''}`} style={{ background: author.color }}>
              {author.initials}
            </div>
            <h4>{author.name}</h4>
            <div className="cat-tags">
              {author.categories.slice(0, 2).map((catId) => {
                const cat = CATEGORIES.find((c) => c.id === catId);
                return cat ? <span key={catId} className="cat-tag">{cat.icon} {cat.label}</span> : null;
              })}
            </div>
            <div className="followers">{formatNum(author.followers)} подписчиков</div>
          </div>
        ))}
      </div>

      {/* Trending Collabs */}
      <div className="section-header">
        <h2>🤝 Горячие коллаборации</h2>
        <button className="see-all" onClick={() => navigate('marketplace')}>Все</button>
      </div>
      <div className="collab-scroll">
        {feed.collabs.map((collab) => {
          const a1 = getAuthorById(collab.author1Id);
          const a2 = getAuthorById(collab.author2Id);
          const pct = Math.round((collab.funded / collab.goal) * 100);
          return (
            <div key={collab.id} className={`collab-card ${collab.status === 'almost' ? 'almost' : ''}`}>
              <div className="collab-authors">
                <div className="avatar-md" style={{ background: a1.color }}>{a1.initials}</div>
                <span className="vs">×</span>
                <div className="avatar-md" style={{ background: a2.color }}>{a2.initials}</div>
              </div>
              <h4>{collab.title}</h4>
              <div className="collab-progress">
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${collab.status === 'almost' ? 'almost' : ''}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="progress-info">
                  <span>{formatNum(collab.funded)} ₽</span>
                  <span>{pct}%</span>
                  <span>{formatNum(collab.goal)} ₽</span>
                </div>
              </div>
              <div className="collab-stats">
                <span className="collab-stat">🗳 {collab.votes}</span>
                <span className="collab-stat">👥 {collab.supportersCount}</span>
                <button className={`support-btn ${collab.status === 'almost' ? 'almost' : ''}`}>
                  Поддержать
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming */}
      <div className="section-header">
        <h2>📅 Скоро в эфире</h2>
      </div>
      <div className="upcoming-list">
        {feed.upcoming.map((stream) => {
          const author = getAuthorById(stream.authorId);
          const t = timeUntil(stream.scheduledAt);
          return (
            <div key={stream.id} className="upcoming-card">
              <div className="upcoming-time">
                <span className="time-value">{t.value}</span>
                <span className="time-label">{t.label}</span>
              </div>
              <div className="upcoming-info">
                <h4>{stream.title}</h4>
                <div className="upcoming-meta">
                  <span>{author.name}</span>
                  {stream.guestName && <span>+ {stream.guestName}</span>}
                  {stream.isPaid && <span className="paid-badge">{stream.price} ₽</span>}
                </div>
                <div className="upcoming-interested">
                  🔥 {stream.interestedCount} ждут
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Past Streams */}
      <div className="section-header">
        <h2>📼 Записи эфиров</h2>
      </div>
      <div className="upcoming-list">
        {feed.pastStreams.map((stream) => {
          const author = getAuthorById(stream.authorId);
          return (
            <div key={stream.id} className="past-stream-card">
              <div className="past-thumb">
                🎬
                <span className="duration">{stream.duration}</span>
              </div>
              <div className="past-info">
                <h4>{stream.title}</h4>
                <div className="past-meta">
                  {author.name} · {formatNum(stream.views)} просмотров · {timeFromNow(stream.recordedAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Stream View (Live viewer)
// ============================================================
function StreamView({ stream, onBack, navigate, showToast, setModal }) {
  const author = getAuthorById(stream.authorId);
  const [reactions, setReactions] = useState({ '❤️': 234, '🔥': 189, '👏': 156, '😮': 78, '💡': 45 });
  const [activeReactions, setActiveReactions] = useState([]);
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [newMsg, setNewMsg] = useState('');
  const [floatingEmoji, setFloatingEmoji] = useState([]);
  const chatRef = useRef(null);

  const handleReaction = (emoji) => {
    setReactions((prev) => ({ ...prev, [emoji]: prev[emoji] + 1 }));
    setActiveReactions((prev) => [...prev, emoji]);
    const id = Date.now();
    setFloatingEmoji((prev) => [...prev, { id, emoji }]);
    setTimeout(() => {
      setFloatingEmoji((prev) => prev.filter((f) => f.id !== id));
    }, 2000);
  };

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    const msg = {
      id: Date.now(),
      user: 'Вы',
      text: newMsg,
      time: 'сейчас',
      isPaid: false,
    };
    setMessages((prev) => [...prev, msg]);
    setNewMsg('');
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 50);
  };

  return (
    <div className="stream-view">
      <div className="stream-header">
        <button className="stream-back" onClick={onBack}>←</button>
        <div className="live-badge">LIVE</div>
        <button className="join-request-btn" onClick={() => showToast('Запрос на подключение отправлен')}>
          🎙 Войти в эфир
        </button>
      </div>

      <div className="stream-player">
        <div className="stream-wave-visual">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bar" />
          ))}
        </div>
        <div className="stream-live-overlay">
          <div className="viewers-badge">👁 {formatNum(stream.viewers)}</div>
        </div>
        <div className="stream-guests">
          <div className="stream-guest-avatar" style={{ background: author.color }}>
            {author.initials}
          </div>
          {stream.guestInitials && (
            <div className="stream-guest-avatar" style={{ background: '#06b6d4' }}>
              {stream.guestInitials}
            </div>
          )}
        </div>
      </div>

      <div className="stream-info-bar">
        <h2>{stream.title}</h2>
        <div className="stream-info-meta">
          <span
            className="stream-author-link"
            onClick={() => navigate('profile', author)}
          >
            <div className="avatar-sm" style={{ background: author.color }}>{author.initials}</div>
            {author.name}
          </span>
          <span>{timeFromNow(stream.startedAt)}</span>
        </div>
      </div>

      <div className="reactions-bar">
        {Object.entries(reactions).map(([emoji, count]) => (
          <button
            key={emoji}
            className={`reaction-btn ${activeReactions.includes(emoji) ? 'active' : ''}`}
            onClick={() => handleReaction(emoji)}
          >
            {emoji} <span className="count">{count}</span>
          </button>
        ))}
      </div>

      <div className="stream-chat">
        <div className="chat-messages" ref={chatRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-msg ${msg.isPaid ? 'paid' : ''}`}>
              <div className="chat-avatar-mini">{msg.user[0]}</div>
              <div className="chat-msg-content">
                <div className="chat-msg-header">
                  <span className="name">{msg.user}</span>
                  {msg.isPaid && <span className="paid-tag">{msg.amount} ₽</span>}
                  <span className="time">{msg.time}</span>
                </div>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            className="chat-input"
            placeholder="Написать сообщение..."
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            className="chat-action-btn donate"
            onClick={() => setModal({ type: 'donate', author })}
            title="Донат"
          >
            💰
          </button>
          <button
            className="chat-action-btn ask"
            onClick={() => setModal({ type: 'question', author })}
            title="Платный вопрос"
          >
            ❓
          </button>
        </div>
      </div>

      {floatingEmoji.map((f) => (
        <div key={f.id} className="floating-reaction" style={{ right: 20 + Math.random() * 40 }}>
          {f.emoji}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// Marketplace
// ============================================================
function Marketplace({ navigate, showToast, setModal }) {
  const [tab, setTab] = useState('collabs');

  return (
    <div className="page-enter">
      <div className="section-header">
        <h2>🔥 Marketplace</h2>
      </div>
      <div className="marketplace-tabs">
        <button className={`market-tab ${tab === 'collabs' ? 'active' : ''}`} onClick={() => setTab('collabs')}>
          Коллаборации
        </button>
        <button className={`market-tab ${tab === 'topics' ? 'active' : ''}`} onClick={() => setTab('topics')}>
          Темы
        </button>
        <button className={`market-tab ${tab === 'authors' ? 'active' : ''}`} onClick={() => setTab('authors')}>
          Авторы
        </button>
      </div>

      {tab === 'collabs' && (
        <div className="marketplace-list">
          {COLLAB_REQUESTS.map((collab) => {
            const a1 = getAuthorById(collab.author1Id);
            const a2 = getAuthorById(collab.author2Id);
            const pct = Math.round((collab.funded / collab.goal) * 100);
            return (
              <div key={collab.id} className={`collab-card ${collab.status === 'almost' ? 'almost' : ''}`} style={{ minWidth: 'auto' }}>
                <div className="collab-authors">
                  <div className="avatar-md" style={{ background: a1.color }} onClick={() => navigate('profile', a1)}>{a1.initials}</div>
                  <span className="vs">×</span>
                  <div className="avatar-md" style={{ background: a2.color }} onClick={() => navigate('profile', a2)}>{a2.initials}</div>
                </div>
                <h4>{collab.title}</h4>
                <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 8 }}>
                  {collab.categories.map((catId) => {
                    const cat = CATEGORIES.find((c) => c.id === catId);
                    return cat ? <span key={catId} className="cat-tag">{cat.icon} {cat.label}</span> : null;
                  })}
                </div>
                <div className="collab-progress">
                  <div className="progress-bar">
                    <div className={`progress-fill ${collab.status === 'almost' ? 'almost' : ''}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="progress-info">
                    <span>{formatNum(collab.funded)} ₽</span>
                    <span>{pct}%</span>
                    <span>{formatNum(collab.goal)} ₽</span>
                  </div>
                </div>
                <div className="collab-stats">
                  <span className="collab-stat">🗳 {collab.votes} голосов</span>
                  <button
                    className={`support-btn ${collab.status === 'almost' ? 'almost' : ''}`}
                    onClick={() => setModal({ type: 'support-collab', collab })}
                  >
                    Поддержать
                  </button>
                </div>
              </div>
            );
          })}
          <button className="create-request-btn" onClick={() => setModal({ type: 'create-collab' })}>
            ➕ Предложить коллаборацию
          </button>
        </div>
      )}

      {tab === 'topics' && (
        <div className="marketplace-list">
          {TOPIC_REQUESTS.map((topic) => {
            const pct = Math.round((topic.funded / topic.goal) * 100);
            return (
              <div key={topic.id} className={`topic-card ${topic.status === 'hot' ? 'hot' : ''}`}>
                {topic.status === 'hot' && <div className="hot-badge">🔥 HOT</div>}
                <h4>{topic.title}</h4>
                <div className="topic-tags">
                  {topic.categories.map((catId) => {
                    const cat = CATEGORIES.find((c) => c.id === catId);
                    return cat ? <span key={catId} className="cat-tag">{cat.icon} {cat.label}</span> : null;
                  })}
                </div>
                <div className="collab-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="progress-info">
                    <span>{formatNum(topic.funded)} ₽</span>
                    <span>{pct}%</span>
                    <span>{formatNum(topic.goal)} ₽</span>
                  </div>
                </div>
                <div className="topic-stats">
                  <span className="topic-stat">🗳 {formatNum(topic.votes)} голосов</span>
                  <button className="support-btn" onClick={() => setModal({ type: 'support-topic', topic })}>
                    Поддержать
                  </button>
                </div>
                <div className="requested-authors" style={{ marginTop: 10 }}>
                  {topic.requestedAuthors.map((aId) => {
                    const a = getAuthorById(aId);
                    return a ? (
                      <div
                        key={aId}
                        className="avatar-sm"
                        style={{ background: a.color, cursor: 'pointer' }}
                        onClick={() => navigate('profile', a)}
                      >
                        {a.initials}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            );
          })}
          <button className="create-request-btn" onClick={() => setModal({ type: 'create-topic' })}>
            ➕ Предложить тему
          </button>
        </div>
      )}

      {tab === 'authors' && (
        <div className="marketplace-list">
          {AUTHORS.filter((a) => a.collabOpen).map((author) => (
            <div
              key={author.id}
              className="upcoming-card"
              onClick={() => navigate('profile', author)}
            >
              <div className="avatar-md" style={{ background: author.color }}>{author.initials}</div>
              <div className="upcoming-info">
                <h4>{author.name}</h4>
                <div className="upcoming-meta">
                  <span>{formatNum(author.followers)} подписчиков</span>
                  <span>⭐ {author.rating}</span>
                </div>
                {author.desiredCollabs.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    {author.desiredCollabs.map((dc, i) => (
                      <span key={i} className="cat-tag" style={{ marginRight: 4 }}>🤝 {dc}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Creator Profile
// ============================================================
function ProfileView({ author, navigate, showToast, setModal }) {
  const [tab, setTab] = useState('streams');
  const streams = getStreamsByAuthor(author.id);
  const collabs = getCollabsForAuthor(author.id);

  return (
    <div className="profile-view page-enter">
      <div className="profile-header">
        <div className="profile-avatar" style={{ background: author.color }}>{author.initials}</div>
        <h1>{author.name}</h1>
        <p className="bio">{author.bio}</p>
        <div className="profile-stats">
          <div className="profile-stat">
            <div className="stat-value">{formatNum(author.followers)}</div>
            <div className="stat-label">подписчиков</div>
          </div>
          <div className="profile-stat">
            <div className="stat-value">{author.totalStreams}</div>
            <div className="stat-label">эфиров</div>
          </div>
          <div className="profile-stat">
            <div className="stat-value">⭐ {author.rating}</div>
            <div className="stat-label">рейтинг</div>
          </div>
        </div>
        <div className="profile-actions">
          <button className="profile-btn primary" onClick={() => showToast('Вы подписались на ' + author.name)}>
            Подписаться
          </button>
          <button className="profile-btn secondary" onClick={() => setModal({ type: 'donate', author })}>
            💰 Поддержать
          </button>
          {author.collabOpen && (
            <button className="profile-btn secondary" onClick={() => showToast('Запрос на коллаб отправлен')}>
              🤝
            </button>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button className={`profile-tab ${tab === 'streams' ? 'active' : ''}`} onClick={() => setTab('streams')}>
          Эфиры
        </button>
        <button className={`profile-tab ${tab === 'collabs' ? 'active' : ''}`} onClick={() => setTab('collabs')}>
          Коллабы
        </button>
        <button className={`profile-tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>
          Продукты
        </button>
      </div>

      <div className="profile-content">
        {tab === 'streams' && (
          <>
            {streams.live.map((s) => (
              <div key={s.id} className="live-card" style={{ minWidth: 'auto', marginBottom: 10 }} onClick={() => navigate('stream', s)}>
                <div className="live-card-preview" style={{ height: 100 }}>
                  <span className="wave-icon">🎙️</span>
                  <div className="live-badge">LIVE</div>
                  <div className="viewers-badge">👁 {formatNum(s.viewers)}</div>
                </div>
                <div className="live-card-info">
                  <h3>{s.title}</h3>
                </div>
              </div>
            ))}
            {streams.upcoming.map((s) => {
              const t = timeUntil(s.scheduledAt);
              return (
                <div key={s.id} className="upcoming-card" style={{ marginBottom: 10 }}>
                  <div className="upcoming-time">
                    <span className="time-value">{t.value}</span>
                    <span className="time-label">{t.label}</span>
                  </div>
                  <div className="upcoming-info">
                    <h4>{s.title}</h4>
                    <div className="upcoming-interested">🔥 {s.interestedCount} ждут</div>
                  </div>
                </div>
              );
            })}
            {streams.past.map((s) => (
              <div key={s.id} className="past-stream-card" style={{ marginBottom: 10 }}>
                <div className="past-thumb">
                  🎬<span className="duration">{s.duration}</span>
                </div>
                <div className="past-info">
                  <h4>{s.title}</h4>
                  <div className="past-meta">{formatNum(s.views)} просмотров</div>
                </div>
              </div>
            ))}
            {streams.live.length + streams.upcoming.length + streams.past.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📡</div>
                <h3>Пока нет эфиров</h3>
              </div>
            )}
          </>
        )}
        {tab === 'collabs' && (
          <>
            {collabs.map((c) => {
              const a1 = getAuthorById(c.author1Id);
              const a2 = getAuthorById(c.author2Id);
              const pct = Math.round((c.funded / c.goal) * 100);
              return (
                <div key={c.id} className="collab-card" style={{ minWidth: 'auto', marginBottom: 10 }}>
                  <div className="collab-authors">
                    <div className="avatar-md" style={{ background: a1.color }}>{a1.initials}</div>
                    <span className="vs">×</span>
                    <div className="avatar-md" style={{ background: a2.color }}>{a2.initials}</div>
                  </div>
                  <h4>{c.title}</h4>
                  <div className="collab-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="progress-info">
                      <span>{formatNum(c.funded)} ₽</span>
                      <span>{pct}%</span>
                      <span>{formatNum(c.goal)} ₽</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {author.desiredCollabs.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#9ca3af' }}>Хочет коллаб на темы:</div>
                {author.desiredCollabs.map((dc, i) => (
                  <span key={i} className="cat-tag" style={{ marginRight: 4, marginBottom: 4, display: 'inline-block' }}>🤝 {dc}</span>
                ))}
              </div>
            )}
          </>
        )}
        {tab === 'products' && (
          <div>
            {author.products.map((product, i) => (
              <div key={i} className="upcoming-card" style={{ marginBottom: 10 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {i === 0 ? '🎓' : '📋'}
                </div>
                <div className="upcoming-info">
                  <h4>{product}</h4>
                  <button
                    className="support-btn"
                    style={{ marginTop: 4 }}
                    onClick={() => showToast('Запрос отправлен автору')}
                  >
                    Подробнее
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// Dashboard
// ============================================================
function Dashboard({ navigate }) {
  const stats = DASHBOARD_STATS;
  const maxViewers = Math.max(...stats.streams.map((s) => s.viewers));

  return (
    <div className="dashboard page-enter">
      <div className="dash-greeting">
        <h1>Кабинет автора</h1>
        <p>Добро пожаловать, Алексей 👋</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value gradient">{formatNum(stats.monthEarnings)} ₽</div>
          <div className="stat-label">Доход за месяц</div>
          <div className="stat-change">↑ +23% к прошлому</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{formatNum(stats.subscriberCount)}</div>
          <div className="stat-label">Подписчиков</div>
          <div className="stat-change">↑ +{stats.newSubscribers} за неделю</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👁</div>
          <div className="stat-value">{formatNum(stats.totalViewers)}</div>
          <div className="stat-label">Всего зрителей</div>
          <div className="stat-change">↑ avg {stats.avgViewers}/эфир</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎁</div>
          <div className="stat-value">{stats.totalDonations}</div>
          <div className="stat-label">Донатов</div>
          <div className="stat-change">{stats.totalPaidQuestions} платных вопросов</div>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-card">
          <h3>📈 Зрители за неделю</h3>
          <div className="chart-bars">
            {stats.streams.map((s, i) => (
              <div key={i} className="chart-bar-col">
                <div className="chart-bar" style={{ height: `${(s.viewers / maxViewers) * 100}%` }} />
                <span className="chart-bar-label">{s.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-header">
        <h2>💰 Последние донаты</h2>
      </div>
      <div className="donation-list">
        {stats.recentDonations.map((d, i) => (
          <div key={i} className="donation-item">
            <div className="donation-avatar">{d.user[0]}</div>
            <div className="donation-info">
              <div className="name">{d.user}</div>
              <div className="message">{d.message || '—'}</div>
            </div>
            <div className="donation-amount">{d.amount} ₽</div>
            <div className="donation-time">{d.time}</div>
          </div>
        ))}
      </div>

      <div className="section-header">
        <h2>📡 Мои эфиры</h2>
      </div>
      <div className="upcoming-list" style={{ paddingBottom: 20 }}>
        {LIVE_STREAMS.filter((s) => s.authorId === 1).map((s) => (
          <div key={s.id} className="live-card" style={{ minWidth: 'auto' }} onClick={() => navigate('stream', s)}>
            <div className="live-card-preview" style={{ height: 80 }}>
              <span className="wave-icon">🎙️</span>
              <div className="live-badge">LIVE</div>
            </div>
            <div className="live-card-info">
              <h3>{s.title}</h3>
            </div>
          </div>
        ))}
        {UPCOMING_STREAMS.filter((s) => s.authorId === 1).map((s) => {
          const t = timeUntil(s.scheduledAt);
          return (
            <div key={s.id} className="upcoming-card">
              <div className="upcoming-time">
                <span className="time-value">{t.value}</span>
                <span className="time-label">{t.label}</span>
              </div>
              <div className="upcoming-info">
                <h4>{s.title}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// Create Stream
// ============================================================
function CreateStream({ showToast, navigate }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [format, setFormat] = useState('audio');
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState('');
  const [hasGuest, setHasGuest] = useState(false);
  const [guestName, setGuestName] = useState('');

  const handleGoLive = () => {
    if (!title.trim()) return;
    showToast('Эфир запущен! 🎙️');
    const mockStream = {
      id: Date.now(),
      authorId: 1,
      title,
      description: desc,
      categories: ['business'],
      format,
      isLive: true,
      viewers: 1,
      startedAt: new Date().toISOString(),
      isPaid,
      price: isPaid ? Number(price) : 0,
      guestName: hasGuest ? guestName : null,
      guestInitials: hasGuest && guestName ? guestName.split(' ').map((w) => w[0]).join('').slice(0, 2) : null,
    };
    navigate('stream', mockStream);
  };

  return (
    <div className="create-stream page-enter">
      <h1>🎙️ Новый эфир</h1>

      <div className="form-group">
        <label className="form-label">Название эфира</label>
        <input
          className="form-input"
          placeholder="О чём будет ваш эфир?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Описание</label>
        <textarea
          className="form-input"
          placeholder="Расскажите подробнее..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Формат</label>
        <div className="format-select">
          <button className={`format-option ${format === 'audio' ? 'selected' : ''}`} onClick={() => setFormat('audio')}>
            🎙️ Аудио
          </button>
          <button className={`format-option ${format === 'video' ? 'selected' : ''}`} onClick={() => setFormat('video')}>
            📹 Видео
          </button>
          <button className={`format-option ${format === 'podcast' ? 'selected' : ''}`} onClick={() => setFormat('podcast')}>
            🎧 Подкаст
          </button>
        </div>
      </div>

      <div className="toggle-row">
        <div>
          <div className="toggle-label">💰 Платный вход</div>
          <div className="toggle-desc">Зрители платят за доступ</div>
        </div>
        <button className={`toggle-switch ${isPaid ? 'on' : ''}`} onClick={() => setIsPaid(!isPaid)} />
      </div>

      {isPaid && (
        <div className="form-group" style={{ marginTop: 12 }}>
          <label className="form-label">Цена входа (₽)</label>
          <input
            className="form-input"
            placeholder="299"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      )}

      <div className="toggle-row">
        <div>
          <div className="toggle-label">🤝 Пригласить гостя</div>
          <div className="toggle-desc">Совместный эфир с другим автором</div>
        </div>
        <button className={`toggle-switch ${hasGuest ? 'on' : ''}`} onClick={() => setHasGuest(!hasGuest)} />
      </div>

      {hasGuest && (
        <div className="form-group" style={{ marginTop: 12 }}>
          <label className="form-label">Имя гостя</label>
          <input
            className="form-input"
            placeholder="Имя или ник гостя"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {AUTHORS.slice(1, 5).map((a) => (
              <button
                key={a.id}
                className={`format-option ${guestName === a.name ? 'selected' : ''}`}
                style={{ padding: '6px 12px', fontSize: 12 }}
                onClick={() => setGuestName(a.name)}
              >
                <div className="avatar-sm" style={{ background: a.color, width: 20, height: 20, fontSize: 8 }}>{a.initials}</div>
                {a.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <button className="go-live-btn" onClick={handleGoLive} disabled={!title.trim()}>
        📡 Выйти в эфир
      </button>
    </div>
  );
}

// ============================================================
// Modal (Donate, Question, Collab, Topic)
// ============================================================
function Modal({ modal, setModal, showToast }) {
  const [amount, setAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');

  const amounts = [50, 100, 200, 500, 1000, 2000];

  const handleClose = () => setModal(null);

  if (modal.type === 'donate') {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <h3>💰 Поддержать {modal.author.name}</h3>
          <div className="donate-amounts">
            {amounts.map((a) => (
              <button
                key={a}
                className={`donate-amount-btn ${amount === a ? 'selected' : ''}`}
                onClick={() => { setAmount(a); setCustomAmount(''); }}
              >
                {a} ₽
              </button>
            ))}
          </div>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Или своя сумма..."
              type="number"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setAmount(null); }}
            />
          </div>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Сообщение (необязательно)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button
            className="donate-submit"
            onClick={() => { showToast(`Донат ${amount || customAmount} ₽ отправлен!`); handleClose(); }}
          >
            Отправить {amount || customAmount || '...'} ₽
          </button>
        </div>
      </div>
    );
  }

  if (modal.type === 'question') {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <h3>❓ Платный вопрос</h3>
          <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 16 }}>
            Платные вопросы показываются автору первыми
          </p>
          <div className="donate-amounts">
            {[100, 200, 500].map((a) => (
              <button
                key={a}
                className={`donate-amount-btn ${amount === a ? 'selected' : ''}`}
                onClick={() => setAmount(a)}
              >
                {a} ₽
              </button>
            ))}
          </div>
          <div className="form-group">
            <textarea
              className="form-input"
              placeholder="Ваш вопрос автору..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ minHeight: 100 }}
            />
          </div>
          <button
            className="donate-submit"
            onClick={() => { showToast('Вопрос отправлен!'); handleClose(); }}
            disabled={!message.trim()}
          >
            Отправить вопрос за {amount || 100} ₽
          </button>
        </div>
      </div>
    );
  }

  if (modal.type === 'support-collab' || modal.type === 'support-topic') {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <h3>🔥 Поддержать {modal.type === 'support-collab' ? 'коллаборацию' : 'тему'}</h3>
          <p style={{ color: '#9ca3af', fontSize: 13, marginBottom: 16 }}>
            Ваша поддержка приближает запуск этого эфира
          </p>
          <div className="donate-amounts">
            {[100, 300, 500, 1000, 2000, 5000].map((a) => (
              <button
                key={a}
                className={`donate-amount-btn ${amount === a ? 'selected' : ''}`}
                onClick={() => setAmount(a)}
              >
                {a} ₽
              </button>
            ))}
          </div>
          <button
            className="donate-submit"
            onClick={() => { showToast(`Вы поддержали на ${amount || 100} ₽! 🎉`); handleClose(); }}
          >
            Поддержать {amount || 100} ₽
          </button>
        </div>
      </div>
    );
  }

  if (modal.type === 'create-collab') {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <h3>🤝 Предложить коллаборацию</h3>
          <div className="form-group">
            <label className="form-label">Тема коллаборации</label>
            <input
              className="form-input"
              placeholder="О чём должен быть совместный эфир?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Выберите авторов</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {AUTHORS.filter((a) => a.collabOpen).map((a) => (
                <button key={a.id} className="format-option" style={{ padding: '6px 12px', fontSize: 12 }}>
                  <div className="avatar-sm" style={{ background: a.color, width: 20, height: 20, fontSize: 8 }}>{a.initials}</div>
                  {a.name}
                </button>
              ))}
            </div>
          </div>
          <button
            className="donate-submit"
            style={{ background: 'var(--gradient-primary)' }}
            onClick={() => { showToast('Запрос на коллаборацию создан!'); handleClose(); }}
          >
            Создать запрос
          </button>
        </div>
      </div>
    );
  }

  if (modal.type === 'create-topic') {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-handle" />
          <h3>💡 Предложить тему</h3>
          <div className="form-group">
            <label className="form-label">Тема эфира</label>
            <input
              className="form-input"
              placeholder="Какую тему хотите увидеть?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Категория</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORIES.slice(0, 6).map((cat) => (
                <button key={cat.id} className="format-option" style={{ padding: '6px 12px', fontSize: 12 }}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </div>
          <button
            className="donate-submit"
            style={{ background: 'var(--gradient-primary)' }}
            onClick={() => { showToast('Тема предложена! 🎯'); handleClose(); }}
          >
            Предложить тему
          </button>
        </div>
      </div>
    );
  }

  return null;
}
