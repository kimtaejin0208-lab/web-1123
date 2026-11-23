/**
 * 입체 도형 DIY 교구 설명서 데이터 모듈
 * 원본: 입체도형_DIY_교구_설명서.pdf
 */
window.SHAPES_APP_DATA = {
  videoUrl: 'https://youtube.com/shorts/BmUZ8yaFT3I',

  colorPalette: [
    { id: 'mint', name: '민트 그린', hex: '#34C785', dark: '#1E9E63', light: '#D1FAE5' },
    { id: 'yellow', name: '웜 옐로우', hex: '#F4D03F', dark: '#CA9A08', light: '#FEF9C3' },
    { id: 'lime', name: '라임 그린', hex: '#A3E635', dark: '#65A30D', light: '#ECFCCB' },
    { id: 'pastel-green', name: '파스텔 그린', hex: '#6EE7B7', dark: '#059669', light: '#D1FAE5' },
    { id: 'lavender', name: '라벤더', hex: '#A78BFA', dark: '#7C3AED', light: '#EDE9FE' },
    { id: 'pink', name: '비비드 핑크', hex: '#EC4899', dark: '#BE185D', light: '#FCE7F3' },
    { id: 'sky', name: '스카이 블루', hex: '#38BDF8', dark: '#0284C7', light: '#E0F2FE' }
  ],

  educationEffects: [
    {
      num: '1',
      title: '평면과 입체의 직관적 이해',
      desc: '말로 설명하기 어려운 2D 전개도와 3D 입체 도형의 관계를 눈앞에서 펼쳐지고 접히는 과정으로 즉각 이해합니다.',
      tip: '아이에게 "접기 전에는 어떤 모양이었지?"라고 물어보며 2D와 3D를 연결해 주세요.',
      icon: 'layers'
    },
    {
      num: '2',
      title: '능동적 체험 학습 (암기 탈피)',
      desc: '단순히 그림을 보고 외우는 방식이 아니라, 아이가 직접 실을 당기고 만지며 도형의 구조를 몸으로 익힙니다.',
      tip: '손으로 직접 실을 당기는 촉각 경험이 기억을 훨씬 오래 남게 합니다.',
      icon: 'hand'
    },
    {
      num: '3',
      title: '높은 흥미와 반복 탐색',
      desc: '실을 당길 때마다 모양이 신기하게 바뀌기 때문에 아이가 스스로 계속 만져보고 놀이처럼 즐깁니다.',
      tip: '실을 놓으면 다시 평면으로 펼쳐져 몇 번이든 반복 체험이 가능합니다.',
      icon: 'sparkles'
    },
    {
      num: '4',
      title: '공간 감각 및 초등 수학 대비',
      desc: '다양한 각기둥·각뿔·원기둥의 전개도를 반복 체험하며 공간 지각력과 초등 도형 단원 기초를 자연스럽게 키웁니다.',
      tip: '초등 5~6학년 직육면체·각기둥·각뿔·원기둥 단원의 핵심 기초가 됩니다.',
      icon: 'compass'
    }
  ],

  shapes: [
    {
      id: 'hexagonal-pyramid',
      badge: '대표 DIY',
      name: '육각뿔',
      engName: 'Hexagonal Pyramid',
      timestamp: '00:15 ~ 00:20',
      category: '뿔',
      defaultColor: '#34C785',
      structure: '정육각형 밑면 1개 + 이등변삼각형 옆면 6개',
      baseInfo: '정육각형 1개',
      sideInfo: '삼각형 6개',
      facesCount: 7,
      desc: '별 모양 전개도의 각 꼭짓점 구멍에 실을 연결해 위로 당기면 6개의 삼각형 옆면이 한 점으로 모이며 뾰족한 육각뿔이 완성됩니다.',
      highlight: 'PDF 3페이지 단계별 DIY 제작 시연 도형입니다.'
    },
    {
      id: 'hexagonal-prism',
      badge: '① 기둥',
      name: '육각기둥',
      engName: 'Hexagonal Prism',
      timestamp: '00:01 ~ 00:02',
      category: '기둥',
      defaultColor: '#F4D03F',
      structure: '정육각형 밑면 2개 + 직사각형 옆면 6개',
      baseInfo: '정육각형 2개',
      sideInfo: '직사각형 6개',
      facesCount: 8,
      desc: '실을 당기면 6개의 직사각형 옆면이 수직으로 서고 윗면 육각형이 뚜껑처럼 덮이며 육각기둥이 완성됩니다.',
      highlight: '육각뿔과 나란히 두고 밑면 개수와 옆면 모양을 비교해 보세요.'
    },
    {
      id: 'cube-pull',
      badge: '② 정육면체',
      name: '정육면체 (Pull 손잡이형)',
      engName: 'Cube · Pull Handle',
      timestamp: '00:02 ~ 00:03',
      category: '기둥',
      defaultColor: '#A3E635',
      structure: '합동인 정사각형 6개',
      baseInfo: '정사각형 2개',
      sideInfo: '정사각형 4개',
      facesCount: 6,
      desc: '아래쪽 Pull 손잡이를 잡아당기면 십자형으로 배열된 6개의 정사각형 면들이 동시에 접혀 주사위 모양이 됩니다.',
      highlight: '모든 면의 크기와 모양이 똑같은 정사각형입니다.'
    },
    {
      id: 'rectangular-prism',
      badge: '③ 직육면체',
      name: '직육면체',
      engName: 'Rectangular Prism',
      timestamp: '00:04 ~ 00:05',
      category: '기둥',
      defaultColor: '#6EE7B7',
      structure: '마주 보는 면이 합동인 직사각형 6개',
      baseInfo: '직사각형 2개',
      sideInfo: '직사각형 4개',
      facesCount: 6,
      desc: '양옆 날개와 위아래 면이 동시에 접혀 직사각형 상자 형태로 세워집니다.',
      highlight: '마주 보는 3쌍의 면이 서로 합동(크기와 모양이 같음)입니다.'
    },
    {
      id: 'tetrahedron',
      badge: '④ 각뿔',
      name: '삼각뿔 / 정사면체',
      engName: 'Tetrahedron',
      timestamp: '00:06 ~ 00:08',
      category: '뿔',
      defaultColor: '#A78BFA',
      structure: '삼각형 4개 (밑면 1개 + 옆면 3개)',
      baseInfo: '정삼각형 1개',
      sideInfo: '정삼각형 3개',
      facesCount: 4,
      desc: '평행사변형처럼 이어진 삼각형 4개가 실을 당기면 한 꼭짓점으로 모여 뾰족한 삼각뿔(정사면체)을 이룹니다.',
      highlight: '전개도가 평행사변형처럼 보이지만 접으면 멋진 뿔이 됩니다.'
    },
    {
      id: 'cube-staircase',
      badge: '⑤ 전개도 변형',
      name: '정육면체 (계단형 전개도)',
      engName: 'Cube · Staircase Net',
      timestamp: '00:09 ~ 00:11',
      category: '기둥',
      defaultColor: '#38BDF8',
      structure: '정사각형 6개가 대각선 계단 형태로 연결',
      baseInfo: '정사각형 2개',
      sideInfo: '정사각형 4개',
      facesCount: 6,
      desc: '정사각형 6개가 대각선 계단 모양으로 이어진 전개도입니다. 같은 정육면체도 다양한 전개도가 존재함을 보여줄 수 있습니다.',
      highlight: '정육면체는 총 11가지의 서로 다른 전개도 모양을 가집니다.'
    },
    {
      id: 'cylinder',
      badge: '⑥ 회전체',
      name: '원기둥',
      engName: 'Cylinder',
      timestamp: '00:11 ~ 00:14',
      category: '원기둥',
      defaultColor: '#EC4899',
      structure: '곡면이 되는 직사각형 옆면 1개 + 원형 밑면 2개',
      baseInfo: '원 2개',
      sideInfo: '직사각형(곡면) 1개',
      facesCount: 3,
      desc: '실을 당기면 평평한 직사각형이 둥글게 말리며 양쪽 원과 맞물려 원기둥이 됩니다.',
      highlight: '직사각형의 가로 길이는 밑면 원의 둘레와 정확히 같습니다.'
    }
  ],

  materials: [
    { id: 'paper', name: '입체 도형 전개도 도안', detail: '색도화지 또는 180g~250g 두꺼운 종이 권장', required: true },
    { id: 'string', name: '실 (노끈 / 면사)', detail: '길이 40~50cm, 잘 끊어지지 않는 실', required: true },
    { id: 'punch', name: '펀치 (구멍 뚫기용)', detail: '각 꼭짓점에 실이 통과할 구멍 뚫기', required: true },
    { id: 'scissors', name: '가위', detail: '전개도 외곽선 자르기용', required: true },
    { id: 'ruler', name: '자 (및 안 나오는 볼펜)', detail: '접는 선을 미리 눌러 깔끔하게 접기', required: true },
    { id: 'pull-tag', name: 'Pull 손잡이용 종이 & 테이프', detail: '(선택) 실 끝에 손잡이 부착 및 구멍 보강', required: false }
  ],

  diySteps: [
    {
      step: 1,
      title: '전개도 준비 및 접는 선 접기',
      desc: '별 모양 육각뿔 전개도를 오리고 각 꼭짓점에 구멍을 뚫습니다. 점선(밑면 경계)을 안쪽으로 미리 접어두면 부드럽게 세워집니다.',
      tip: '자와 안 나오는 볼펜(또는 철필)으로 점선을 먼저 긋고 접으면 각이 훨씬 잘 살아납니다.',
      foldPreview: 0.08
    },
    {
      step: 2,
      title: '첫 번째 구멍부터 실 끼우기',
      desc: '전개도를 바닥에 평평하게 펼친 뒤, 실 한쪽 끝을 삼각형 꼭짓점 구멍에 통과시켜 순서대로 끼우기 시작합니다.',
      tip: '실 끝부분에 투명 테이프를 얇게 말아주면 구멍에 훨씬 쉽게 통과합니다.',
      foldPreview: 0.12
    },
    {
      step: 3,
      title: '모든 꼭짓점 구멍 연결하기',
      desc: '시계 방향(또는 반시계 방향)으로 돌아가며 6개의 삼각형 꼭짓점 구멍에 실이 꼬이지 않도록 차례대로 통과시킵니다.',
      tip: '모든 구멍을 같은 방향(위→아래 또는 아래→위)으로 통과시켜야 매끄럽게 당겨집니다.',
      foldPreview: 0.2
    },
    {
      step: 4,
      title: '양쪽 실 끝을 한곳으로 모으기',
      desc: '모든 구멍을 한 바퀴 통과시킨 뒤, 실의 양쪽 끝을 아래쪽 한 방향으로 나란히 모아 정리합니다. 필요 시 Pull 손잡이를 붙입니다.',
      tip: '손잡이에 "PULL"이라고 적어두면 아이가 어디를 당겨야 할지 바로 알 수 있어요.',
      foldPreview: 0.3
    },
    {
      step: 5,
      title: '실을 천천히 잡아당기기',
      desc: '밑면 육각형이 바닥에 닿은 상태에서 두 가닥의 실을 함께 잡고 천천히 당기면 6개의 옆면이 동시에 위로 오므라듭니다.',
      tip: '너무 세게 당기면 구멍이 찢어질 수 있으니 천천히 일정한 힘으로 당겨 주세요.',
      foldPreview: 0.68
    },
    {
      step: 6,
      title: '입체 육각뿔 완성 및 반복 체험',
      desc: '실을 위로 끝까지 당기면 입체 육각뿔 완성! 실을 느슨하게 놓으면 다시 별 모양 평면 전개도로 돌아가 반복 놀이할 수 있습니다.',
      tip: '전개도 상태에서 아이가 직접 색칠하거나 스티커를 붙인 뒤 입체로 세워 보세요!',
      foldPreview: 1.0
    }
  ],

  cautions: [
    {
      title: '종이 두께 선택',
      desc: '일반 A4 용지보다 도화지·머메이드지 등 180~250g 두께의 종이를 사용해야 구겨지지 않고 각이 잘 살아납니다.'
    },
    {
      title: '접는 선 미리 누르기',
      desc: '자와 안 나오는 볼펜(또는 철필)으로 점선을 먼저 긋고 접으면 훨씬 부드럽게 접힙니다.'
    },
    {
      title: '구멍 찢어짐 주의',
      desc: '실을 너무 강하게 잡아당기면 종이 구멍이 찢어질 수 있으니, 구멍 주변에 투명 테이프를 보강하면 오래 사용할 수 있습니다.'
    }
  ],

  learningTips: [
    {
      title: '질문하며 놀이하기',
      desc: '"펼쳤을 때 삼각형이 몇 개야?", "실을 당기면 어떤 모양이 될까?"처럼 예측하고 확인하는 대화를 나눠보세요.'
    },
    {
      title: '기둥과 뿔 비교하기',
      desc: '육각기둥과 육각뿔을 나란히 두고 밑면 개수(2개 vs 1개)와 옆면 모양(직사각형 vs 삼각형)을 비교해 보세요.'
    },
    {
      title: '색칠 및 꾸미기',
      desc: '전개도 상태에서 아이가 직접 색칠하거나 스티커를 붙인 뒤 입체로 세우면 몰입도가 더욱 높아집니다.'
    }
  ],

  videoTimeline: [
    {
      range: '00:00 ~ 00:03',
      shapes: ['육각뿔', '육각기둥', '정육면체'],
      targetShapeId: 'hexagonal-prism',
      desc: '실을 당겨 평면 전개도가 입체로 세워지는 모습을 보여주며 평면·입체 개념 학습의 어려움을 소개합니다.'
    },
    {
      range: '00:04 ~ 00:10',
      shapes: ['직육면체', '삼각뿔', '정육면체(계단형)'],
      targetShapeId: 'rectangular-prism',
      desc: '평평한 종이의 손잡이(PULL)를 살짝 당기면 순식간에 입체 도형으로 변하는 모습을 시연합니다.'
    },
    {
      range: '00:11 ~ 00:14',
      shapes: ['원기둥 (분홍색)'],
      targetShapeId: 'cylinder',
      desc: '직사각형과 두 원이 둥글게 말리며 원기둥이 되는 모습과 다시 펼쳐지는 과정을 시연합니다.'
    },
    {
      range: '00:15 ~ 00:20',
      shapes: ['육각뿔 DIY'],
      targetShapeId: 'hexagonal-pyramid',
      desc: '별 모양 육각뿔 전개도의 각 구멍에 실을 순서대로 끼운 뒤 당겨 입체로 완성하는 방법을 보여줍니다.'
    }
  ],

  quizQuestions: [
    {
      question: '별 모양 육각뿔 전개도를 평평하게 펼쳤을 때, 삼각형 옆면은 모두 몇 개일까요?',
      options: ['4개', '5개', '6개', '8개'],
      answerIndex: 2,
      explanation: '육각뿔은 밑면이 정육각형(변 6개)이므로, 각 변에 삼각형 옆면이 1개씩 총 6개가 붙어 있어요!'
    },
    {
      question: '직사각형 옆면 1개와 원형 밑면 2개로 이루어진 전개도의 실을 당기면 어떤 도형이 될까요?',
      options: ['정육면체', '원기둥', '삼각뿔', '육각기둥'],
      answerIndex: 1,
      explanation: '직사각형이 둥글게 말리며 양쪽 원형 밑면과 맞물려 원기둥이 완성됩니다!'
    },
    {
      question: '육각기둥과 육각뿔을 비교했을 때, 밑면이 2개이고 옆면이 직사각형인 도형은 무엇일까요?',
      options: ['육각기둥', '육각뿔', '둘 다 같다', '둘 다 아니다'],
      answerIndex: 0,
      explanation: '기둥(육각기둥)은 밑면이 2개·옆면이 직사각형이고, 뿔(육각뿔)은 밑면이 1개·옆면이 삼각형이에요!'
    },
    {
      question: '평행사변형처럼 이어진 삼각형 4개의 실을 당기면 어떤 입체 도형이 완성될까요?',
      options: ['직육면체', '육각뿔', '삼각뿔 (정사면체)', '원기둥'],
      answerIndex: 2,
      explanation: '밑면 삼각형 1개와 옆면 삼각형 3개가 한 꼭짓점으로 모여 삼각뿔(정사면체)을 이룹니다!'
    },
    {
      question: '정육면체의 전개도는 십자 모양 딱 한 가지만 존재할까요?',
      options: ['네, 한 가지만 있어요', '아니요, 계단형 등 여러 모양이 있어요'],
      answerIndex: 1,
      explanation: '맞아요! 정육면체는 Pull 손잡이형, 계단형 등 총 11가지의 다양한 전개도 모양이 존재합니다.'
    }
  ]
};
