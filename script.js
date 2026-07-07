/* ==========================================================
   ひだまり工務店 デモサイト
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- ハンバーガーメニュー ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const gnav = document.getElementById('gnav');

  const closeMenu = () => {
    menuBtn.classList.remove('is-open');
    gnav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  menuBtn.addEventListener('click', () => {
    const isOpen = gnav.classList.toggle('is-open');
    menuBtn.classList.toggle('is-open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    // メニュー表示中は背景スクロールを止める
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ナビのリンクを押したらメニューを閉じる
  gnav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // ESCキーでも閉じられるように
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gnav.classList.contains('is-open')) {
      closeMenu();
    }
  });

  /* ---------- ヘッダーの影 & トップへ戻るボタン ---------- */
  const header = document.getElementById('header');
  const toTop = document.getElementById('toTop');

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
    toTop.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- スクロールで要素をふわっと表示 ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px' }
  );
  fadeEls.forEach((el) => observer.observe(el));

  /* ---------- 施工事例の絞り込み ---------- */
  const filterBtns = document.querySelectorAll('.works__filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;
      workCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('is-hidden', !show);
        if (show) {
          // 再表示時にフェードインをかけ直す
          card.classList.remove('is-visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add('is-visible'));
          });
        }
      });
    });
  });

  /* ---------- お問い合わせフォーム(デモ用) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 必須項目の簡易チェック
    let firstError = null;
    form.querySelectorAll('[required]').forEach((field) => {
      const isEmpty = !field.value.trim();
      const isBadEmail =
        field.type === 'email' &&
        field.value.trim() !== '' &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
      const hasError = isEmpty || isBadEmail;
      field.classList.toggle('is-error', hasError);
      if (hasError && !firstError) firstError = field;
    });

    if (firstError) {
      status.textContent = '未入力の必須項目、または形式に誤りがある項目があります。';
      status.className = 'form-status is-error';
      firstError.focus();
      return;
    }

    // デモサイトなので実際の送信は行わない
    status.textContent = 'お問い合わせありがとうございます。担当者より2営業日以内にご連絡いたします。(デモのため実際には送信されていません)';
    status.className = 'form-status is-success';
    form.reset();
  });

  // 入力し直したらエラー表示を消す
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('is-error'));
  });
});
