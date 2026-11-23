/**
 * 실을 당겨 만드는 입체 도형 DIY 교구 - 메인 인터랙션 스크립트 (Vanilla JS)
 */
(function () {
  'use strict';

  const DATA = window.SHAPES_APP_DATA;
  const FoldSimulator3D = window.FoldSimulator3D;

  document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeroDemo();
    initPrincipleSection();
    const mainSimController = initMainSimulator();
    initShapesGuide(mainSimController);
    initCompareWidget();
    initDiyGuide();
    initTimeline(mainSimController);
    initQuiz();
  });

  // --- 1. 모바일 네비게이션 ---
  function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 2. Hero 육각뿔 3D 데모 ---
  function initHeroDemo() {
    const canvas = document.getElementById('heroCanvas');
    const slider = document.getElementById('heroFoldSlider');
    const toggleBtn = document.getElementById('heroPullToggleBtn');
    const btnLabel = document.getElementById('heroPullBtnLabel');
    const statusText = document.getElementById('heroStatusText');
    if (!canvas) return;

    const heroSim = new FoldSimulator3D(canvas, {
      shapeId: 'hexagonal-pyramid',
      color: '#34C785',
      initialFold: 0,
      yaw: 0.55,
      pitch: 0.62,
      autoRotate: true
    });

    const updateUI = (val) => {
      const pct = Math.round(val * 100);
      slider.value = String(pct);
      if (pct <= 10) {
        statusText.textContent = `평면 전개도 (${pct}%)`;
        btnLabel.textContent = '실 당겨서 입체 만들기';
      } else if (pct >= 90) {
        statusText.textContent = `입체 육각뿔 완성! (${pct}%)`;
        btnLabel.textContent = '실 놓아서 다시 펼치기';
      } else {
        statusText.textContent = `입체 변신 중... (${pct}%)`;
        btnLabel.textContent = pct > 50 ? '실 놓아서 다시 펼치기' : '실 당겨서 입체 만들기';
      }
    };

    slider.addEventListener('input', () => {
      const val = Number(slider.value) / 100;
      heroSim.setFold(val);
      updateUI(val);
    });

    toggleBtn.addEventListener('click', () => {
      const next = Number(slider.value) < 50 ? 1 : 0;
      heroSim.setFold(next);
      updateUI(next);
    });
  }

  // --- 3. 작동 원리 & 4가지 교육 효과 ---
  function initPrincipleSection() {
    const pills = document.querySelectorAll('[data-principle-state]');
    const svgBox = document.getElementById('principleSvgBox');
    const caption = document.getElementById('principleCaption');

    const flatSvg = `
      <svg viewBox="0 0 240 170" width="220" height="160" aria-label="별 모양 평면 전개도">
        <g transform="translate(120,85)">
          <polygon points="0,-68 18,-31 59,-34 36,0 59,34 18,31 0,68 -18,31 -59,34 -36,0 -59,-34 -18,-31" fill="#34C785" stroke="#0F172A" stroke-width="1.5" stroke-linejoin="round"/>
          <polygon points="18,-31 36,0 18,31 -18,31 -36,0 -18,-31" fill="#22A86B" stroke="#0F172A" stroke-width="1.3" stroke-dasharray="4 3"/>
          <polyline points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29 0,-58" fill="none" stroke="#F59E0B" stroke-width="2.2"/>
          <circle cx="0" cy="-58" r="3.5" fill="#fff" stroke="#334155"/>
          <circle cx="50" cy="-29" r="3.5" fill="#fff" stroke="#334155"/>
          <circle cx="50" cy="29" r="3.5" fill="#fff" stroke="#334155"/>
          <circle cx="0" cy="58" r="3.5" fill="#fff" stroke="#334155"/>
          <circle cx="-50" cy="29" r="3.5" fill="#fff" stroke="#334155"/>
          <circle cx="-50" cy="-29" r="3.5" fill="#fff" stroke="#334155"/>
        </g>
      </svg>
    `;

    const solidSvg = `
      <svg viewBox="0 0 240 170" width="220" height="160" aria-label="입체 육각뿔 완성">
        <g transform="translate(120,96)">
          <ellipse cx="0" cy="36" rx="58" ry="18" fill="rgba(15,23,42,0.08)"/>
          <polygon points="0,-56 -52,22 -24,38" fill="#2BB673" stroke="#0F172A" stroke-width="1.5" stroke-linejoin="round"/>
          <polygon points="0,-56 -24,38 24,38" fill="#34C785" stroke="#0F172A" stroke-width="1.5" stroke-linejoin="round"/>
          <polygon points="0,-56 24,38 52,22" fill="#22A86B" stroke="#0F172A" stroke-width="1.5" stroke-linejoin="round"/>
          <line x1="0" y1="-56" x2="0" y2="-84" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
          <circle cx="0" cy="-84" r="5" fill="#F59E0B" stroke="#fff" stroke-width="2"/>
          <text x="12" y="-76" font-size="11" font-weight="700" fill="#B45309">PULL ↑</text>
        </g>
      </svg>
    `;

    const renderState = (state) => {
      pills.forEach((p) => p.classList.toggle('active', p.dataset.principleState === state));
      if (state === 'flat') {
        svgBox.innerHTML = flatSvg;
        caption.innerHTML = `
          <h3>① 평면(2D) 전개도 상태</h3>
          <p>바닥에 납작하게 펼쳐진 별 모양 종이에서 <strong>밑면 정육각형 1개</strong>와 <strong>옆면 삼각형 6개</strong>, 그리고 각 꼭짓점에 연결된 실을 한눈에 관찰할 수 있습니다.</p>
        `;
      } else {
        svgBox.innerHTML = solidSvg;
        caption.innerHTML = `
          <h3>② 입체(3D) 도형 완성</h3>
          <p>실을 위로 살짝 잡아당기면 6개의 삼각형 꼭짓점이 한곳으로 동시에 모이며 순식간에 입체 육각뿔이 세워집니다. <strong>실을 놓으면 다시 평면으로 펼쳐집니다.</strong></p>
        `;
      }
    };

    pills.forEach((pill) => {
      pill.addEventListener('click', () => renderState(pill.dataset.principleState));
    });
    renderState('flat');

    // 4가지 교육 효과 렌더링
    const effectsGrid = document.getElementById('effectsGrid');
    effectsGrid.innerHTML = DATA.educationEffects.map((ef) => `
      <article class="effect-card">
        <div class="effect-top">
          <span class="effect-num">${ef.num}</span>
          <h3>${ef.title}</h3>
        </div>
        <p>${ef.desc}</p>
        <div class="effect-tip">💡 ${ef.tip}</div>
      </article>
    `).join('');
  }

  // --- 4. 메인 3D 전개도 시뮬레이터 ---
  function initMainSimulator() {
    const canvas = document.getElementById('mainSimCanvas');
    const tabsWrap = document.getElementById('shapeTabs');
    const slider = document.getElementById('mainFoldSlider');
    const foldBadge = document.getElementById('simFoldPercent');
    const pullBtn = document.getElementById('simPullBtn');
    const unfoldBtn = document.getElementById('simUnfoldBtn');
    const loopBtn = document.getElementById('simLoopBtn');
    const toggleStringBtn = document.getElementById('simToggleStringBtn');
    const resetViewBtn = document.getElementById('simResetViewBtn');
    const swatchesWrap = document.getElementById('colorSwatches');

    let currentShape = DATA.shapes[0];
    let currentColor = currentShape.defaultColor;
    let isLooping = false;

    const updateFoldBadge = (val) => {
      const pct = Math.round(val * 100);
      slider.value = String(pct);
      let label = '변신 중';
      if (pct <= 5) label = '평면 전개도';
      else if (pct >= 95) label = '입체 도형 완성!';
      foldBadge.textContent = `${pct}% ${label}`;
    };

    const sim = new FoldSimulator3D(canvas, {
      shapeId: currentShape.id,
      color: currentColor,
      initialFold: 0,
      yaw: 0.6,
      pitch: 0.56,
      onFoldChange: (val) => updateFoldBadge(val)
    });

    const renderSwatches = () => {
      swatchesWrap.innerHTML = DATA.colorPalette.map((c) => `
        <button
          type="button"
          class="color-swatch ${c.hex.toLowerCase() === currentColor.toLowerCase() ? 'active' : ''}"
          style="background:${c.hex}"
          title="${c.name}"
          aria-label="${c.name}"
          data-color="${c.hex}"
        ></button>
      `).join('');

      swatchesWrap.querySelectorAll('.color-swatch').forEach((btn) => {
        btn.addEventListener('click', () => {
          currentColor = btn.dataset.color;
          sim.setColor(currentColor);
          renderSwatches();
        });
      });
    };

    const updateInfoPanel = (shape) => {
      document.getElementById('simShapeBadge').textContent = shape.badge;
      document.getElementById('simShapeName').textContent = shape.name;
      document.getElementById('simShapeEng').textContent = shape.engName;
      document.getElementById('simStructure').textContent = shape.structure;
      document.getElementById('simBaseInfo').textContent = shape.baseInfo;
      document.getElementById('simSideInfo').textContent = shape.sideInfo;
      document.getElementById('simFacesCount').textContent = `${shape.facesCount}개`;
      document.getElementById('simDesc').textContent = shape.desc;
      document.getElementById('simHighlight').textContent = `📌 ${shape.highlight}`;
      document.getElementById('simTimestamp').textContent = shape.timestamp;
    };

    const selectShape = (shapeId, autoPullDemo = false) => {
      const found = DATA.shapes.find((s) => s.id === shapeId);
      if (!found) return;
      currentShape = found;
      currentColor = found.defaultColor;
      isLooping = false;
      loopBtn.classList.remove('active');
      sim.setLoop(false);
      sim.setShape(found.id, currentColor);
      sim.resetView();

      tabsWrap.querySelectorAll('.shape-tab').forEach((t) => {
        const active = t.dataset.shapeId === shapeId;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });

      updateInfoPanel(found);
      renderSwatches();

      if (autoPullDemo) {
        sim.setFold(0, true);
        updateFoldBadge(0);
        setTimeout(() => {
          sim.setFold(1);
          updateFoldBadge(1);
        }, 350);
      } else {
        sim.setFold(0);
        updateFoldBadge(0);
      }
    };

    // 도형 탭 생성
    tabsWrap.innerHTML = DATA.shapes.map((s, idx) => `
      <button
        type="button"
        class="shape-tab ${idx === 0 ? 'active' : ''}"
        role="tab"
        aria-selected="${idx === 0}"
        data-shape-id="${s.id}"
      >${s.name}</button>
    `).join('');

    tabsWrap.querySelectorAll('.shape-tab').forEach((tab) => {
      tab.addEventListener('click', () => selectShape(tab.dataset.shapeId, false));
    });

    slider.addEventListener('input', () => {
      isLooping = false;
      loopBtn.classList.remove('active');
      sim.setLoop(false);
      const val = Number(slider.value) / 100;
      sim.setFold(val);
      updateFoldBadge(val);
    });

    pullBtn.addEventListener('click', () => {
      isLooping = false;
      loopBtn.classList.remove('active');
      sim.setLoop(false);
      sim.setFold(1);
      updateFoldBadge(1);
    });

    unfoldBtn.addEventListener('click', () => {
      isLooping = false;
      loopBtn.classList.remove('active');
      sim.setLoop(false);
      sim.setFold(0);
      updateFoldBadge(0);
    });

    loopBtn.addEventListener('click', () => {
      isLooping = !isLooping;
      loopBtn.classList.toggle('active', isLooping);
      sim.setLoop(isLooping);
    });

    toggleStringBtn.addEventListener('click', () => {
      sim.showString = !sim.showString;
      toggleStringBtn.textContent = sim.showString ? '🧵 실 표시 ON' : '🧵 실 표시 OFF';
    });

    resetViewBtn.addEventListener('click', () => sim.resetView());

    // 초기 상태 설정
    updateInfoPanel(currentShape);
    renderSwatches();
    updateFoldBadge(0);

    return { selectShape };
  }

  // --- 5. 영상 속 6종 도형 비교 가이드 ---
  function initShapesGuide(simController) {
    const grid = document.getElementById('shapesGrid');
    // PDF 2페이지의 6종 (육각뿔 제외 6종)
    const sixShapes = DATA.shapes.filter((s) => s.id !== 'hexagonal-pyramid');

    grid.innerHTML = sixShapes.map((s) => `
      <article class="shape-card" data-jump-shape="${s.id}" tabindex="0" role="button" aria-label="${s.name} 3D 체험하기">
        <div class="shape-card-head">
          <span class="shape-card-badge" style="background:${s.defaultColor}33">${s.badge}</span>
          <span class="shape-card-time">${s.timestamp}</span>
        </div>
        <h3>${s.name}</h3>
        <div class="shape-card-eng">${s.engName}</div>
        <div class="shape-card-struct">${s.structure}</div>
        <p>${s.desc}</p>
        <div class="shape-card-cta">3D 체험관에서 접어보기 →</div>
      </article>
    `).join('');

    const jumpToShape = (shapeId) => {
      simController.selectShape(shapeId, true);
      document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' });
    };

    grid.querySelectorAll('.shape-card').forEach((card) => {
      card.addEventListener('click', () => jumpToShape(card.dataset.jumpShape));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          jumpToShape(card.dataset.jumpShape);
        }
      });
    });
  }

  // --- 6. 기둥 vs 뿔 / 정육면체 전개도 비교 실험실 ---
  function initCompareWidget() {
    const tabs = document.querySelectorAll('[data-compare]');
    const body = document.getElementById('compareBody');

    const views = {
      'prism-vs-pyramid': `
        <div class="compare-grid">
          <div class="compare-box">
            <h4><span class="compare-dot" style="background:#F4D03F"></span> 육각기둥 (기둥)</h4>
            <ul>
              <li><strong>밑면 개수:</strong> 2개 (위·아래 정육각형이 서로 평행하고 합동)</li>
              <li><strong>옆면 모양:</strong> 직사각형 6개</li>
              <li><strong>전체 면의 수:</strong> 8개</li>
              <li><strong>실 당기기 특징:</strong> 옆면이 수직으로 서고 윗면이 뚜껑처럼 덮임</li>
            </ul>
          </div>
          <div class="compare-box">
            <h4><span class="compare-dot" style="background:#34C785"></span> 육각뿔 (뿔)</h4>
            <ul>
              <li><strong>밑면 개수:</strong> 1개 (바닥 정육각형)</li>
              <li><strong>옆면 모양:</strong> 이등변삼각형 6개</li>
              <li><strong>전체 면의 수:</strong> 7개</li>
              <li><strong>실 당기기 특징:</strong> 6개의 꼭짓점이 위쪽 한 점으로 모여 뾰족하게 완성</li>
            </ul>
          </div>
        </div>
        <div class="compare-takeaway">
          💡 핵심 비교 포인트: 기둥은 <strong>밑면이 2개 · 옆면이 직사각형</strong>, 뿔은 <strong>밑면이 1개 · 옆면이 삼각형</strong>이에요!
        </div>
      `,
      'cube-nets': `
        <div class="compare-grid">
          <div class="compare-box">
            <h4><span class="compare-dot" style="background:#A3E635"></span> 정육면체 (Pull 손잡이형)</h4>
            <ul>
              <li><strong>전개도 배열:</strong> 중앙 밑면을 기준으로 사방에 날개가 펼쳐진 형태</li>
              <li><strong>접히는 과정:</strong> 양옆과 앞뒤 면이 동시에 올라오며 상자 완성</li>
              <li><strong>학습 포인트:</strong> 가장 친숙한 기본 전개도 구조 익히기</li>
            </ul>
          </div>
          <div class="compare-box">
            <h4><span class="compare-dot" style="background:#38BDF8"></span> 정육면체 (계단형 전개도)</h4>
            <ul>
              <li><strong>전개도 배열:</strong> 정사각형 6개가 대각선 계단 모양으로 이어진 형태</li>
              <li><strong>접히는 과정:</strong> 계단처럼 이어진 면들이 연쇄적으로 감기며 주사위 완성</li>
              <li><strong>학습 포인트:</strong> 같은 입체 도형도 전개도 모양이 여러 가지임을 발견!</li>
            </ul>
          </div>
        </div>
        <div class="compare-takeaway">
          💡 핵심 비교 포인트: 정육면체는 모양은 달라도 접으면 똑같은 주사위가 되는 <strong>11가지 전개도</strong>가 존재합니다!
        </div>
      `
    };

    const renderCompare = (key) => {
      tabs.forEach((t) => t.classList.toggle('active', t.dataset.compare === key));
      body.innerHTML = views[key];
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => renderCompare(tab.dataset.compare));
    });
    renderCompare('prism-vs-pyramid');
  }

  // --- 7. 육각뿔 DIY 단계별 제작 가이드 ---
  function initDiyGuide() {
    // 준비물 체크리스트
    const materialsGrid = document.getElementById('materialsGrid');
    const progressText = document.getElementById('materialsProgressText');
    const progressFill = document.getElementById('materialsProgressFill');
    const checkedSet = new Set();

    const updateProgress = () => {
      const total = DATA.materials.length;
      const done = checkedSet.size;
      const pct = Math.round((done / total) * 100);
      progressText.textContent = `${done} / ${total} 준비 완료${done === total ? ' 🎉' : ''}`;
      progressFill.style.width = `${pct}%`;
    };

    materialsGrid.innerHTML = DATA.materials.map((m) => `
      <label class="material-item" data-mat-id="${m.id}">
        <input type="checkbox" value="${m.id}" />
        <span>
          <span class="material-name">${m.name}</span>
          <span class="material-detail">${m.detail}</span>
        </span>
      </label>
    `).join('');

    materialsGrid.querySelectorAll('input[type="checkbox"]').forEach((chk) => {
      chk.addEventListener('change', () => {
        const label = chk.closest('.material-item');
        if (chk.checked) {
          checkedSet.add(chk.value);
          label.classList.add('checked');
        } else {
          checkedSet.delete(chk.value);
          label.classList.remove('checked');
        }
        updateProgress();
      });
    });

    // STEP 1~6 스텝퍼
    const stepNav = document.getElementById('diyStepNav');
    const stepVisual = document.getElementById('diyStepVisual');
    const stepPill = document.getElementById('diyStepPill');
    const stepTitle = document.getElementById('diyStepTitle');
    const stepDesc = document.getElementById('diyStepDesc');
    const stepTip = document.getElementById('diyStepTip');
    const prevBtn = document.getElementById('diyPrevBtn');
    const nextBtn = document.getElementById('diyNextBtn');

    let currentStepIdx = 0;

    const getStepSvg = (stepNum) => {
      const starBase = `
        <polygon points="0,-68 18,-31 59,-34 36,0 59,34 18,31 0,68 -18,31 -59,34 -36,0 -59,-34 -18,-31" fill="#34C785" stroke="#0F172A" stroke-width="1.5" stroke-linejoin="round"/>
        <polygon points="18,-31 36,0 18,31 -18,31 -36,0 -18,-31" fill="#22A86B" stroke="#0F172A" stroke-width="1.4" stroke-dasharray="4 3"/>
      `;
      const holes = `
        <circle cx="0" cy="-58" r="4" fill="#fff" stroke="#334155" stroke-width="1.4"/>
        <circle cx="50" cy="-29" r="4" fill="#fff" stroke="#334155" stroke-width="1.4"/>
        <circle cx="50" cy="29" r="4" fill="#fff" stroke="#334155" stroke-width="1.4"/>
        <circle cx="0" cy="58" r="4" fill="#fff" stroke="#334155" stroke-width="1.4"/>
        <circle cx="-50" cy="29" r="4" fill="#fff" stroke="#334155" stroke-width="1.4"/>
        <circle cx="-50" cy="-29" r="4" fill="#fff" stroke="#334155" stroke-width="1.4"/>
      `;

      if (stepNum === 1) {
        return `<svg viewBox="0 0 260 200" width="250" height="190">
          <g transform="translate(130,100)">${starBase}${holes}
            <text x="0" y="88" text-anchor="middle" font-size="11" font-weight="700" fill="#0F172A">점선을 안쪽으로 미리 접어두기</text>
          </g>
        </svg>`;
      }
      if (stepNum === 2) {
        return `<svg viewBox="0 0 260 200" width="250" height="190">
          <g transform="translate(130,100)">${starBase}${holes}
            <path d="M -20,-84 Q -6,-72 0,-58" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
            <circle cx="0" cy="-58" r="7" fill="none" stroke="#EF4444" stroke-width="2.2"/>
            <text x="16" y="-68" font-size="11" font-weight="700" fill="#DC2626">① 첫 구멍 통과!</text>
          </g>
        </svg>`;
      }
      if (stepNum === 3) {
        return `<svg viewBox="0 0 260 200" width="250" height="190">
          <g transform="translate(130,100)">${starBase}
            <polyline points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linejoin="round"/>
            ${holes}
            <text x="0" y="88" text-anchor="middle" font-size="11" font-weight="700" fill="#B45309">시계 방향으로 6개 구멍 차례대로 연결</text>
          </g>
        </svg>`;
      }
      if (stepNum === 4) {
        return `<svg viewBox="0 0 260 200" width="250" height="190">
          <g transform="translate(130,90)">${starBase}
            <polygon points="0,-58 50,-29 50,29 0,58 -50,29 -50,-29" fill="none" stroke="#F59E0B" stroke-width="2.6"/>
            <line x1="0" y1="58" x2="-6" y2="86" stroke="#F59E0B" stroke-width="2.8"/>
            <line x1="0" y1="58" x2="6" y2="86" stroke="#F59E0B" stroke-width="2.8"/>
            <rect x="-24" y="82" width="48" height="20" rx="5" fill="#F59E0B"/>
            <text x="0" y="96" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">PULL</text>
            ${holes}
          </g>
        </svg>`;
      }
      if (stepNum === 5) {
        return `<svg viewBox="0 0 260 200" width="250" height="190">
          <g transform="translate(130,115)">
            <polygon points="-28,28 28,28 42,4 28,-20 -28,-20 -42,4" fill="#22A86B" stroke="#0F172A" stroke-width="1.3"/>
            <polygon points="-42,4 -28,28 -58,-34" fill="#34C785" stroke="#0F172A" stroke-width="1.4"/>
            <polygon points="-28,28 28,28 0,-42" fill="#4ADE80" stroke="#0F172A" stroke-width="1.4"/>
            <polygon points="28,28 42,4 58,-34" fill="#2BB673" stroke="#0F172A" stroke-width="1.4"/>
            <polyline points="-58,-34 0,-42 58,-34" fill="none" stroke="#F59E0B" stroke-width="2.5"/>
            <line x1="-58" y1="-34" x2="0" y2="-84" stroke="#F59E0B" stroke-width="2.4"/>
            <line x1="58" y1="-34" x2="0" y2="-84" stroke="#F59E0B" stroke-width="2.4"/>
            <text x="0" y="-90" text-anchor="middle" font-size="12" font-weight="800" fill="#D97706">↑ 천천히 잡아당기기</text>
          </g>
        </svg>`;
      }
      return `<svg viewBox="0 0 260 200" width="250" height="190">
        <g transform="translate(130,115)">
          <ellipse cx="0" cy="40" rx="64" ry="18" fill="rgba(15,23,42,0.08)"/>
          <polygon points="0,-60 -56,24 -26,42" fill="#2BB673" stroke="#0F172A" stroke-width="1.5" stroke-linejoin="round"/>
          <polygon points="0,-60 -26,42 26,42" fill="#34C785" stroke="#0F172A" stroke-width="1.5" stroke-linejoin="round"/>
          <polygon points="0,-60 26,42 56,24" fill="#22A86B" stroke="#0F172A" stroke-width="1.5" stroke-linejoin="round"/>
          <line x1="0" y1="-60" x2="0" y2="-86" stroke="#F59E0B" stroke-width="3"/>
          <circle cx="0" cy="-86" r="5.5" fill="#F59E0B" stroke="#fff" stroke-width="2"/>
          <text x="0" y="72" text-anchor="middle" font-size="12" font-weight="800" fill="#059669">✨ 입체 육각뿔 완성!</text>
        </g>
      </svg>`;
    };

    const renderStep = (idx) => {
      currentStepIdx = idx;
      const item = DATA.diySteps[idx];
      stepPill.textContent = `STEP ${item.step} / 6`;
      stepTitle.textContent = item.title;
      stepDesc.textContent = item.desc;
      stepTip.textContent = item.tip;
      stepVisual.innerHTML = getStepSvg(item.step);

      stepNav.querySelectorAll('.step-nav-btn').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
      });

      prevBtn.disabled = idx === 0;
      prevBtn.style.opacity = idx === 0 ? '0.45' : '1';
      nextBtn.textContent = idx === DATA.diySteps.length - 1 ? '처음부터 다시 보기 ↺' : '다음 단계 →';
    };

    stepNav.innerHTML = DATA.diySteps.map((s, i) => `
      <button type="button" class="step-nav-btn ${i === 0 ? 'active' : ''}" data-step-idx="${i}">
        STEP ${s.step}
      </button>
    `).join('');

    stepNav.querySelectorAll('.step-nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => renderStep(Number(btn.dataset.stepIdx)));
    });

    prevBtn.addEventListener('click', () => {
      if (currentStepIdx > 0) renderStep(currentStepIdx - 1);
    });

    nextBtn.addEventListener('click', () => {
      if (currentStepIdx < DATA.diySteps.length - 1) renderStep(currentStepIdx + 1);
      else renderStep(0);
    });

    renderStep(0);

    // 주의사항 & 학습 팁
    document.getElementById('cautionsList').innerHTML = DATA.cautions.map((c) => `
      <li><strong>${c.title}:</strong> ${c.desc}</li>
    `).join('');

    document.getElementById('learningTipsList').innerHTML = DATA.learningTips.map((t) => `
      <li><strong>${t.title}:</strong> ${t.desc}</li>
    `).join('');
  }

  // --- 8. 참고 영상 구간별 타임라인 ---
  function initTimeline(simController) {
    const list = document.getElementById('timelineList');
    list.innerHTML = DATA.videoTimeline.map((item) => `
      <div class="timeline-item">
        <div class="timeline-range">${item.range}</div>
        <div>
          <div class="timeline-shapes">
            ${item.shapes.map((s) => `<span class="timeline-shape-tag">${s}</span>`).join('')}
          </div>
          <p class="timeline-desc">${item.desc}</p>
        </div>
        <button type="button" class="btn btn-outline btn-sm" data-timeline-shape="${item.targetShapeId}">
          3D로 보기 →
        </button>
      </div>
    `).join('');

    list.querySelectorAll('[data-timeline-shape]').forEach((btn) => {
      btn.addEventListener('click', () => {
        simController.selectShape(btn.dataset.timelineShape, true);
        document.getElementById('simulator').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // --- 9. 공간 감각 미니 퀴즈 ---
  function initQuiz() {
    const quizCard = document.getElementById('quizCard');
    let qIdx = 0;
    let score = 0;
    let answered = false;

    const renderQuestion = () => {
      const total = DATA.quizQuestions.length;
      if (qIdx >= total) {
        const badge = score === total ? '🏆' : score >= 3 ? '🌟' : '🧩';
        const msg = score === total
          ? '완벽해요! 평면과 입체 도형의 원리를 모두 마스터했어요!'
          : '잘했어요! 3D 체험관에서 도형을 한 번 더 당겨보면 금방 마스터할 수 있어요.';

        quizCard.innerHTML = `
          <div class="quiz-result">
            <div class="quiz-badge">${badge}</div>
            <h3>공간 감각 퀴즈 완료!</h3>
            <div class="quiz-score">${total}문제 중 ${score}문제 정답</div>
            <p style="color:#475569;margin-bottom:22px;">${msg}</p>
            <button type="button" class="btn btn-primary" id="quizRestartBtn">다시 도전하기 ↺</button>
          </div>
        `;

        document.getElementById('quizRestartBtn').addEventListener('click', () => {
          qIdx = 0;
          score = 0;
          resetQuizTemplate();
          renderQuestion();
        });
        return;
      }

      answered = false;
      const q = DATA.quizQuestions[qIdx];
      document.getElementById('quizCounter').textContent = `문제 ${qIdx + 1} / ${total}`;
      document.getElementById('quizProgressFill').style.width = `${((qIdx + 1) / total) * 100}%`;
      document.getElementById('quizQuestion').textContent = `Q${qIdx + 1}. ${q.question}`;

      const optionsWrap = document.getElementById('quizOptions');
      const feedback = document.getElementById('quizFeedback');
      const nextBtn = document.getElementById('quizNextBtn');

      feedback.className = 'quiz-feedback hidden';
      feedback.textContent = '';
      nextBtn.classList.add('hidden');
      nextBtn.textContent = qIdx === total - 1 ? '결과 확인하기 🎉' : '다음 문제 →';

      optionsWrap.innerHTML = q.options.map((opt, idx) => `
        <button type="button" class="quiz-option" data-opt-idx="${idx}">
          ${idx + 1}. ${opt}
        </button>
      `).join('');

      optionsWrap.querySelectorAll('.quiz-option').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          const picked = Number(btn.dataset.optIdx);
          const isCorrect = picked === q.answerIndex;
          if (isCorrect) score++;

          optionsWrap.querySelectorAll('.quiz-option').forEach((b, i) => {
            b.disabled = true;
            if (i === q.answerIndex) b.classList.add('correct');
            else if (i === picked && !isCorrect) b.classList.add('wrong');
          });

          feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
          feedback.innerHTML = `<strong>${isCorrect ? '정답입니다! 🎉' : '아쉬워요! 💡'}</strong> ${q.explanation}`;
          nextBtn.classList.remove('hidden');
        });
      });
    };

    const resetQuizTemplate = () => {
      quizCard.innerHTML = `
        <div class="quiz-top">
          <span class="quiz-counter" id="quizCounter"></span>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" id="quizProgressFill"></div>
          </div>
        </div>
        <h3 class="quiz-question" id="quizQuestion"></h3>
        <div class="quiz-options" id="quizOptions"></div>
        <div class="quiz-feedback hidden" id="quizFeedback"></div>
        <div class="quiz-footer">
          <button type="button" class="btn btn-primary hidden" id="quizNextBtn">다음 문제 →</button>
        </div>
      `;
      document.getElementById('quizNextBtn').addEventListener('click', () => {
        qIdx++;
        renderQuestion();
      });
    };

    document.getElementById('quizNextBtn').addEventListener('click', () => {
      qIdx++;
      renderQuestion();
    });

    renderQuestion();
  }
})();
