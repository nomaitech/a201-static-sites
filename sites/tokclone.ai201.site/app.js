(() => {
  const POSTS = [
    {
      id: 1, video: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
      color: "linear-gradient(160deg,#ff7a45,#c02949)",
      handle: "wildtrails", verified: true,
      desc: "POV: the road doesn't end where the map does 🛣️ #joyride #roadtrip #goldenhour",
      song: "original sound - wildtrails",
      likes: 128400, comments: 2043, shares: 3510, saves: 8820, liked: false, saved: false, following: false,
    },
    {
      id: 2, video: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
      color: "linear-gradient(160deg,#2dd4bf,#1e3a8a)",
      handle: "sundaycrew", verified: false,
      desc: "we said we'd only stay an hour lol #beachday #friends #fyp",
      song: "Sunny Afternoons - Lo-Fi Beach Mix",
      likes: 54200, comments: 812, shares: 990, saves: 2210, liked: false, saved: false, following: true,
    },
    {
      id: 3, video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      color: "linear-gradient(160deg,#f59e0b,#7c2d12)",
      handle: "no.map.needed", verified: true,
      desc: "left the phone signal three valleys ago #vanlife #escape #nature",
      song: "Dust and Gravel - Lior Adar",
      likes: 902000, comments: 15600, shares: 44200, saves: 61300, liked: true, saved: false, following: false,
    },
    {
      id: 4, video: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4",
      color: "linear-gradient(160deg,#ef4444,#450a0a)",
      handle: "afterhours.kitchen", verified: false,
      desc: "the sear is EVERYTHING 🔥🥩 recipe in comments #cooking #foodtok",
      song: "original sound - afterhours.kitchen",
      likes: 33900, comments: 1290, shares: 410, saves: 5200, liked: false, saved: true, following: false,
    },
    {
      id: 5, video: "https://download.samplelib.com/mp4/sample-5s.mp4",
      color: "linear-gradient(160deg,#a855f7,#1e1b4b)",
      handle: "studio.afterdark", verified: true,
      desc: "when the drop finally hits at 2am 🎛️ #producer #studio #edm",
      song: "Neon Circuit - DJ Kessler",
      likes: 210500, comments: 4310, shares: 8890, saves: 15400, liked: false, saved: false, following: false,
    },
    {
      id: 6, video: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4",
      color: "linear-gradient(160deg,#0ea5e9,#0c4a6e)",
      handle: "shortfilm.club", verified: true,
      desc: "3 minutes that will ruin your whole week 😭 full film linked #shortfilm #animation",
      song: "Sintel Theme - Jan Morgenstern",
      likes: 1500000, comments: 89000, shares: 210000, saves: 340000, liked: false, saved: false, following: false,
    },
  ];

  const COMMENT_BANK = [
    ["marisol_v", "okay but the transition tho 😭"],
    ["depot.jay", "not me watching this for the third time"],
    ["kkendrx", "the algorithm knew exactly what I needed today"],
    ["ohitsfen", "wait this is actually insane"],
    ["ravi.codes", "who's the artist for the sound??"],
    ["lunanoir", "screaming crying throwing up"],
    ["petergrows", "saving this for later fr"],
    ["dee_dubz", "the way I gasped"],
  ];

  const SHARE_OPTS = [
    { name: "Copy link", bg: "#5c5c5c", icon: "M17 7h-3a1 1 0 0 0 0 2h3a3 3 0 0 1 0 6h-3a1 1 0 0 0 0 2h3a5 5 0 0 0 0-10Zm-7 8H7a3 3 0 0 1 0-6h3a1 1 0 0 0 0-2H7a5 5 0 0 0 0 10h3a1 1 0 0 0 0-2Zm-1-3h6v-2H9Z" },
    { name: "WhatsApp", bg: "#25D366", icon: "M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm5.4 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.7-2.8-1.1-4.6-3.9-4.8-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.6.7 1.9.8 2 .1.2.1.4 0 .6-.5 1-1 1-.7 1.5.9 1.7 2.1 2.4 3.5 3 .3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.7-.1.3.1 1.6.8 1.9.9.3.1.5.2.5.3.1.3.1.9-.1 1.5Z" },
    { name: "Messages", bg: "#3ddc84", icon: "M12 2C6.5 2 2 5.9 2 10.7c0 2.7 1.5 5.1 3.8 6.7-.1.9-.5 2.4-1.6 3.9 1.9-.3 3.5-1.1 4.6-1.9 1 .3 2.1.4 3.2.4 5.5 0 10-3.9 10-8.7S17.5 2 12 2Z" },
    { name: "Facebook", bg: "#1877F2", icon: "M13.5 22v-8.5H16l.4-3H13.5V8.3c0-.9.2-1.5 1.5-1.5H16.5V4.2C16.2 4.2 15 4 13.6 4c-2.8 0-4.7 1.7-4.7 4.9V10.5H6v3h2.9V22Z" },
    { name: "Telegram", bg: "#29b6f6", icon: "M21.9 4.5 2.6 11.9c-1.3.5-1.3 1.2-.2 1.5l4.9 1.5 1.9 5.9c.2.6.4.9.9.9.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14c.3-1.2-.4-1.8-1.5-1.3Z" },
    { name: "Twitter", bg: "#000000", icon: "M17.5 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.8L4.2 21H1l7.7-8.8L1 3h6.8l4.7 6.2Zm-1.2 16.2h1.8L7.8 4.7H5.9Z" },
    { name: "SMS", bg: "#6b7280", icon: "M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4Z" },
    { name: "More", bg: "#444", icon: "M6 10a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm6 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2Zm6 0a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z" },
  ];

  const feedEl = document.getElementById("feed");
  const commentsSheet = document.getElementById("commentsSheet");
  const shareSheet = document.getElementById("shareSheet");
  const commentList = document.getElementById("commentList");
  const commentCountEl = document.getElementById("commentCount");
  const commentInput = document.getElementById("commentInput");
  const shareGrid = document.getElementById("shareGrid");

  let activePostId = POSTS[0].id;

  function formatCount(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K";
    return String(n);
  }

  function svgIcon(path) {
    return `<svg viewBox="0 0 24 24"><path d="${path}"/></svg>`;
  }

  const ICONS = {
    heart: "M12 21s-7.5-4.6-10-9C.3 8.2 1.6 4 5.4 3.2 8 2.6 10.3 4 12 6.5 13.7 4 16 2.6 18.6 3.2 22.4 4 23.7 8.2 22 12c-2.5 4.4-10 9-10 9Z",
    comment: "M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4V6a2 2 0 0 1 2-2Z",
    bookmark: "M6 2h12a1 1 0 0 1 1 1v19l-7-4-7 4V3a1 1 0 0 1 1-1Z",
    share: "M14 9V5l8 7-8 7v-4c-5 0-8.5 1.6-11 5 1-6 4-11 11-12Z",
    plus: "M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6Z",
  };

  function buildPost(post) {
    const el = document.createElement("section");
    el.className = "post";
    el.dataset.id = post.id;

    el.innerHTML = `
      <video src="${post.video}" loop muted playsinline preload="metadata"></video>
      <div class="fallback" style="background:${post.color}; display:none;">${escapeHtml(post.desc.split("#")[0])}</div>
      <div class="tap-zone"></div>
      <svg class="heart-burst" viewBox="0 0 24 24"><path d="${ICONS.heart}"/></svg>
      <svg class="pause-glyph" viewBox="0 0 24 24"><path d="M8 5h4v14H8Zm8 0h4v14h-4Z"/></svg>

      <div class="rail">
        <div class="rail-avatar">
          <div class="av-fallback"></div>
          <button class="follow-plus ${post.following ? "followed" : ""}" data-action="follow">${svgIcon(ICONS.plus)}</button>
        </div>
        <button class="rail-action" data-action="like">
          <span class="rail-icon like-icon ${post.liked ? "is-liked" : ""}">${svgIcon(ICONS.heart)}</span>
          <span class="count" data-count="likes">${formatCount(post.likes)}</span>
        </button>
        <button class="rail-action" data-action="comment">
          <span class="rail-icon">${svgIcon(ICONS.comment)}</span>
          <span class="count" data-count="comments">${formatCount(post.comments)}</span>
        </button>
        <button class="rail-action" data-action="save">
          <span class="rail-icon bookmark-icon ${post.saved ? "is-saved" : ""}">${svgIcon(ICONS.bookmark)}</span>
          <span class="count" data-count="saves">${formatCount(post.saves)}</span>
        </button>
        <button class="rail-action" data-action="share">
          <span class="rail-icon">${svgIcon(ICONS.share)}</span>
          <span class="count" data-count="shares">${formatCount(post.shares)}</span>
        </button>
        <div class="rail-disc paused"></div>
      </div>

      <div class="meta">
        <div class="handle">@${post.handle}${post.verified ? '<span class="badge-tick">✔</span>' : ""}</div>
        <div class="desc">${formatDesc(post.desc)}</div>
        <div class="sound">
          <svg viewBox="0 0 24 24"><path d="M12 3v10.6a3.5 3.5 0 1 0 2 3.15V7h4V3Z"/></svg>
          <span class="sound-track"><span>${post.song} &nbsp;•&nbsp; ${post.song} &nbsp;•&nbsp;</span></span>
        </div>
      </div>

      <div class="progress-wrap"><div class="progress-bar"></div></div>
    `;
    return el;
  }

  function formatDesc(desc) {
    return escapeHtml(desc).replace(/#(\w+)/g, '<span class="tag">#$1</span>');
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  function renderFeed() {
    feedEl.innerHTML = "";
    POSTS.forEach((post) => feedEl.appendChild(buildPost(post)));
    wireUpPosts();
  }

  function getPostData(id) {
    return POSTS.find((p) => String(p.id) === String(id));
  }

  function wireUpPosts() {
    const postEls = [...feedEl.querySelectorAll(".post")];

    // Autoplay the visible post, pause the rest.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target.querySelector("video");
          const disc = entry.target.querySelector(".rail-disc");
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            activePostId = entry.target.dataset.id;
            video.play().catch(() => {});
            disc.classList.remove("paused");
          } else {
            video.pause();
            disc.classList.add("paused");
          }
        });
      },
      { threshold: [0, 0.6, 1] }
    );
    postEls.forEach((el) => io.observe(el));

    postEls.forEach((el) => {
      const id = el.dataset.id;
      const video = el.querySelector("video");
      const fallback = el.querySelector(".fallback");
      const progressBar = el.querySelector(".progress-bar");
      const tapZone = el.querySelector(".tap-zone");
      const heartBurst = el.querySelector(".heart-burst");
      const pauseGlyph = el.querySelector(".pause-glyph");

      video.addEventListener("error", () => {
        video.style.display = "none";
        fallback.style.display = "flex";
      });

      video.addEventListener("timeupdate", () => {
        if (video.duration) progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
      });

      let lastTap = 0;
      let tapTimer = null;
      tapZone.addEventListener("click", () => {
        const now = Date.now();
        if (now - lastTap < 300) {
          clearTimeout(tapTimer);
          lastTap = 0;
          triggerLike(id, el, true);
          burstHeart(heartBurst);
        } else {
          lastTap = now;
          tapTimer = setTimeout(() => {
            togglePlay(video, pauseGlyph);
          }, 300);
        }
      });

      el.querySelector('[data-action="like"]').addEventListener("click", () => triggerLike(id, el, false));
      el.querySelector('[data-action="save"]').addEventListener("click", () => toggleSave(id, el));
      el.querySelector('[data-action="follow"]').addEventListener("click", (e) => toggleFollow(id, e.currentTarget));
      el.querySelector('[data-action="comment"]').addEventListener("click", () => openComments(id));
      el.querySelector('[data-action="share"]').addEventListener("click", () => openShare(id));
    });
  }

  function togglePlay(video, glyph) {
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
      glyph.classList.remove("show");
      void glyph.offsetWidth;
      glyph.classList.add("show");
    }
  }

  function burstHeart(heartEl) {
    heartEl.classList.remove("animate");
    void heartEl.offsetWidth;
    heartEl.classList.add("animate");
  }

  function triggerLike(id, el, forceLikeOnly) {
    const post = getPostData(id);
    if (forceLikeOnly && post.liked) return; // double-tap only ever likes, never unlikes
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    const likeIcon = el.querySelector(".like-icon");
    const countEl = el.querySelector('[data-count="likes"]');
    likeIcon.classList.toggle("is-liked", post.liked);
    countEl.textContent = formatCount(post.likes);
    if (post.liked) {
      likeIcon.classList.remove("bump");
      void likeIcon.offsetWidth;
      likeIcon.classList.add("bump");
    }
  }

  function toggleSave(id, el) {
    const post = getPostData(id);
    post.saved = !post.saved;
    post.saves += post.saved ? 1 : -1;
    el.querySelector(".bookmark-icon").classList.toggle("is-saved", post.saved);
    el.querySelector('[data-count="saves"]').textContent = formatCount(post.saves);
  }

  function toggleFollow(id, btn) {
    const post = getPostData(id);
    post.following = true;
    btn.classList.add("followed");
  }

  // ---------- Comments sheet ----------
  let currentCommentPostId = null;

  function openComments(id) {
    currentCommentPostId = id;
    const post = getPostData(id);
    commentCountEl.textContent = `${formatCount(post.comments)} comments`;
    commentList.innerHTML = COMMENT_BANK.slice(0, 5)
      .map((c) => commentRowHtml(c[0], c[1]))
      .join("");
    commentsSheet.classList.add("open");
  }

  function commentRowHtml(user, text, mine) {
    return `
      <div class="comment-row">
        <div class="comment-avatar"></div>
        <div class="comment-body">
          <div class="comment-user">${escapeHtml(user)}${mine ? " · just now" : ""}</div>
          <div class="comment-text">${escapeHtml(text)}</div>
          <div class="comment-meta">
            <span>Reply</span>
          </div>
        </div>
        <button class="comment-like">
          <svg viewBox="0 0 24 24"><path d="${ICONS.heart}"/></svg>
        </button>
      </div>`;
  }

  document.getElementById("closeComments").addEventListener("click", () => commentsSheet.classList.remove("open"));
  commentsSheet.addEventListener("click", (e) => {
    if (e.target === commentsSheet) commentsSheet.classList.remove("open");
  });

  function submitComment() {
    const text = commentInput.value.trim();
    if (!text || !currentCommentPostId) return;
    const post = getPostData(currentCommentPostId);
    post.comments += 1;
    commentList.insertAdjacentHTML("afterbegin", commentRowHtml("you", text, true));
    commentCountEl.textContent = `${formatCount(post.comments)} comments`;
    const postEl = feedEl.querySelector(`.post[data-id="${currentCommentPostId}"]`);
    if (postEl) postEl.querySelector('[data-count="comments"]').textContent = formatCount(post.comments);
    commentInput.value = "";
  }

  document.querySelector(".send-btn").addEventListener("click", submitComment);
  commentInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") submitComment();
  });

  // ---------- Share sheet ----------
  shareGrid.innerHTML = SHARE_OPTS.map(
    (opt) => `
    <button class="share-opt" data-name="${opt.name}">
      <span class="share-glyph" style="background:${opt.bg}">${svgIcon(opt.icon)}</span>
      <span>${opt.name}</span>
    </button>`
  ).join("");

  function openShare(id) {
    shareSheet.dataset.postId = id;
    shareSheet.classList.add("open");
  }

  document.getElementById("closeShare").addEventListener("click", () => shareSheet.classList.remove("open"));
  shareSheet.addEventListener("click", (e) => {
    if (e.target === shareSheet) shareSheet.classList.remove("open");
  });
  shareGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".share-opt");
    if (!btn) return;
    const id = shareSheet.dataset.postId;
    const post = getPostData(id);
    if (btn.dataset.name === "Copy link") {
      const url = `${location.origin}${location.pathname}#post-${id}`;
      navigator.clipboard?.writeText(url).catch(() => {});
    }
    post.shares += 1;
    const postEl = feedEl.querySelector(`.post[data-id="${id}"]`);
    if (postEl) postEl.querySelector('[data-count="shares"]').textContent = formatCount(post.shares);
    shareSheet.classList.remove("open");
  });

  // ---------- Top feed tabs ----------
  const feedTabs = document.querySelectorAll(".feed-tab");
  const EMPTY_FOLLOWING = `
    <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 40px;text-align:center;color:rgba(255,255,255,.6);gap:10px;">
      <div style="font-size:40px;">👥</div>
      <div style="color:#fff;font-weight:700;font-size:16px;">No videos yet</div>
      <div style="font-size:13.5px;">Videos from accounts you follow will show up here.</div>
    </div>`;

  feedTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      feedTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      if (tab.dataset.tab === "following") {
        feedEl.innerHTML = EMPTY_FOLLOWING;
      } else {
        renderFeed();
      }
    });
  });

  // ---------- Bottom nav ----------
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navItems.forEach((n) => n.classList.remove("is-active"));
      item.classList.add("is-active");
    });
  });

  renderFeed();
})();
