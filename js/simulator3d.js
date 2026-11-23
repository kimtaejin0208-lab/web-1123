/**
 * 순수 바닐라 JS 3D 전개도 시뮬레이터 엔진 (Canvas 2D + 계층적 3D 힌지 변환)
 * 외부 라이브러리 없이 60fps로 7종 입체 도형의 2D 전개도 ↔ 3D 입체 변신을 렌더링합니다.
 */
(function () {
  'use strict';

  // --- 3D 벡터 수학 유틸리티 ---
  function vSub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; }
  function vAdd(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
  function vScale(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
  function vDot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function vCross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }
  function vLen(a) { return Math.hypot(a[0], a[1], a[2]); }
  function vNorm(a) {
    const l = vLen(a) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  }

  // Rodrigues' rotation formula: 점 p를 (pivot, axis) 중심으로 angle만큼 회전
  function rotateAround(p, pivot, axis, angle) {
    if (Math.abs(angle) < 1e-7) return [p[0], p[1], p[2]];
    const v = vSub(p, pivot);
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const kCrossV = vCross(axis, v);
    const kDotV = vDot(axis, v);
    const rot = [
      v[0] * c + kCrossV[0] * s + axis[0] * kDotV * (1 - c),
      v[1] * c + kCrossV[1] * s + axis[1] * kDotV * (1 - c),
      v[2] * c + kCrossV[2] * s + axis[2] * kDotV * (1 - c)
    ];
    return vAdd(pivot, rot);
  }

  // 바깥쪽 점(outwardHint)이 +Y(위쪽) 방향으로 들리도록 회전축 부호를 자동 보정
  function autoAxis(pA, pB, outwardHint) {
    let axis = vNorm(vSub(pB, pA));
    const outVec = vSub(outwardHint, pA);
    const lift = vCross(axis, outVec);
    if (lift[1] < 0) {
      axis = [-axis[0], -axis[1], -axis[2]];
    }
    return axis;
  }

  // 색상 밝기 조절 (Hex -> RGB)
  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function shadeColor(rgb, factor) {
    const r = Math.max(0, Math.min(255, Math.round(rgb[0] * factor)));
    const g = Math.max(0, Math.min(255, Math.round(rgb[1] * factor)));
    const b = Math.max(0, Math.min(255, Math.round(rgb[2] * factor)));
    return `rgb(${r}, ${g}, ${b})`;
  }

  // --- 계층적 힌지 트리에서 월드 좌표 폴리곤/구멍/실 추출 ---
  function evaluateNode(node, t, parentTransforms, outFaces, outHoles, outStrings) {
    const angle = (node.maxAngle || 0) * t;
    const myTransform = node.axis ? { pivot: node.pivot, axis: node.axis, angle } : null;
    const transforms = myTransform ? [myTransform, ...parentTransforms] : parentTransforms;

    const applyAll = (pt) => {
      let cur = pt;
      for (let i = 0; i < transforms.length; i++) {
        const tr = transforms[i];
        cur = rotateAround(cur, tr.pivot, tr.axis, tr.angle);
      }
      return cur;
    };

    if (node.faces) {
      for (const face of node.faces) {
        outFaces.push({
          pts: face.pts.map(applyAll),
          isBase: !!face.isBase,
          tint: face.tint || 1.0,
          noBorder: !!face.noBorder
        });
      }
    }

    if (node.holes) {
      for (const h of node.holes) {
        outHoles.push(applyAll(h));
      }
    }

    if (node.stringPoints) {
      for (const sp of node.stringPoints) {
        outStrings.push({ order: sp.order, pt: applyAll(sp.pt) });
      }
    }

    if (node.children) {
      for (const child of node.children) {
        evaluateNode(child, t, transforms, outFaces, outHoles, outStrings);
      }
    }
  }

  // --- 7종 도형 전개도 모델 빌더 ---
  function buildHexagonalPyramid() {
    const R = 0.85;
    const hs = 1.55;
    const apothem = R * Math.cos(Math.PI / 6);
    const maxAngle = Math.PI - Math.acos(apothem / hs);

    const basePts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      basePts.push([R * Math.cos(a), 0, R * Math.sin(a)]);
    }

    const children = [];
    for (let i = 0; i < 6; i++) {
      const pA = basePts[i];
      const pB = basePts[(i + 1) % 6];
      const mid = vScale(vAdd(pA, pB), 0.5);
      const outDir = vNorm(mid); // 중심(0,0,0)에서 바깥쪽
      const apex = vAdd(mid, vScale(outDir, hs));
      const hole = vAdd(mid, vScale(outDir, hs * 0.84));
      const axis = autoAxis(pA, pB, apex);

      children.push({
        pivot: pA,
        axis,
        maxAngle,
        faces: [{ pts: [pA, pB, apex], tint: i % 2 === 0 ? 1.0 : 0.96 }],
        holes: [hole],
        stringPoints: [{ order: i, pt: hole }]
      });
    }

    return {
      root: {
        faces: [{ pts: basePts, isBase: true, tint: 0.92 }],
        children
      },
      cameraDist: 6.2,
      pullDirection: 'up',
      centerOffset: [0, 0.35, 0]
    };
  }

  function buildHexagonalPrism() {
    const R = 0.72;
    const H = 1.12;
    const maxAngle = Math.PI / 2;

    const basePts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i;
      basePts.push([R * Math.cos(a), 0, R * Math.sin(a)]);
    }

    const children = [];
    for (let i = 0; i < 6; i++) {
      const pA = basePts[i];
      const pB = basePts[(i + 1) % 6];
      const mid = vScale(vAdd(pA, pB), 0.5);
      const outDir = vNorm(mid);
      const pA2 = vAdd(pA, vScale(outDir, H));
      const pB2 = vAdd(pB, vScale(outDir, H));
      const axis = autoAxis(pA, pB, pA2);

      const sideNode = {
        pivot: pA,
        axis,
        maxAngle,
        faces: [{ pts: [pA, pB, pB2, pA2], tint: i % 2 === 0 ? 1.0 : 0.95 }],
        holes: [vScale(vAdd(pA2, pB2), 0.5)],
        stringPoints: [{ order: i, pt: vScale(vAdd(pA2, pB2), 0.5) }],
        children: []
      };

      // 첫 번째 옆면(i === 0)의 바깥 변에 윗면 정육각형 부착
      if (i === 0) {
        const edgeMid = vScale(vAdd(pA2, pB2), 0.5);
        const topCenter = vAdd(edgeMid, vScale(outDir, R * Math.cos(Math.PI / 6)));
        // 기존 밑면 정육각형을 edgeMid 기준 반사/평행이동하여 바깥쪽에 배치
        const topPts = [];
        for (let k = 0; k < 6; k++) {
          const ang = (Math.PI / 3) * k;
          // 중심에서 바깥 방향으로 정확히 이어지도록 각도 정렬
          topPts.push([
            topCenter[0] + R * Math.cos(ang + Math.PI / 3),
            0,
            topCenter[2] + R * Math.sin(ang + Math.PI / 3)
          ]);
        }
        const topAxis = autoAxis(pA2, pB2, topCenter);
        sideNode.children.push({
          pivot: pA2,
          axis: topAxis,
          maxAngle: Math.PI / 2,
          faces: [{ pts: topPts, isBase: true, tint: 1.04 }]
        });
      }

      children.push(sideNode);
    }

    return {
      root: {
        faces: [{ pts: basePts, isBase: true, tint: 0.9 }],
        children
      },
      cameraDist: 6.6,
      pullDirection: 'up',
      centerOffset: [0, 0.45, 0]
    };
  }

  function buildCubePull() {
    const S = 1.08;
    const h = S / 2;
    const maxAngle = Math.PI / 2;

    const p0 = [-h, 0, -h];
    const p1 = [h, 0, -h];
    const p2 = [h, 0, h];
    const p3 = [-h, 0, h];

    // 뒤쪽 면 (-Z) + 윗면 (-2Z)
    const backPts = [[-h, 0, -h], [h, 0, -h], [h, 0, -h - S], [-h, 0, -h - S]];
    const topPts = [[-h, 0, -h - S], [h, 0, -h - S], [h, 0, -h - 2 * S], [-h, 0, -h - 2 * S]];

    // 앞쪽 면 (+Z)
    const frontPts = [[-h, 0, h], [h, 0, h], [h, 0, h + S], [-h, 0, h + S]];
    // 왼쪽 면 (-X)
    const leftPts = [[-h, 0, -h], [-h, 0, h], [-h - S, 0, h], [-h - S, 0, -h]];
    // 오른쪽 면 (+X)
    const rightPts = [[h, 0, -h], [h, 0, h], [h + S, 0, h], [h + S, 0, -h]];

    return {
      root: {
        faces: [{ pts: [p0, p1, p2, p3], isBase: true, tint: 0.92 }],
        children: [
          {
            pivot: p0,
            axis: autoAxis(p0, p1, [0, 0, -h - S]),
            maxAngle,
            faces: [{ pts: backPts, tint: 0.97 }],
            holes: [[0, 0, -h - S * 0.85]],
            stringPoints: [{ order: 0, pt: [0, 0, -h - S * 0.85] }],
            children: [
              {
                pivot: [-h, 0, -h - S],
                axis: autoAxis([-h, 0, -h - S], [h, 0, -h - S], [0, 0, -h - 2 * S]),
                maxAngle,
                faces: [{ pts: topPts, isBase: true, tint: 1.04 }],
                holes: [[0, 0, -h - 1.85 * S]],
                stringPoints: [{ order: 1, pt: [0, 0, -h - 1.85 * S] }]
              }
            ]
          },
          {
            pivot: p3,
            axis: autoAxis(p3, p2, [0, 0, h + S]),
            maxAngle,
            faces: [{ pts: frontPts, tint: 1.0 }],
            holes: [[0, 0, h + S * 0.85]],
            stringPoints: [{ order: 2, pt: [0, 0, h + S * 0.85] }]
          },
          {
            pivot: p0,
            axis: autoAxis(p0, p3, [-h - S, 0, 0]),
            maxAngle,
            faces: [{ pts: leftPts, tint: 0.95 }],
            holes: [[-h - S * 0.85, 0, 0]],
            stringPoints: [{ order: 3, pt: [-h - S * 0.85, 0, 0] }]
          },
          {
            pivot: p1,
            axis: autoAxis(p1, p2, [h + S, 0, 0]),
            maxAngle,
            faces: [{ pts: rightPts, tint: 0.98 }],
            holes: [[h + S * 0.85, 0, 0]],
            stringPoints: [{ order: 4, pt: [h + S * 0.85, 0, 0] }]
          }
        ]
      },
      cameraDist: 6.4,
      pullDirection: 'front',
      centerOffset: [0, 0.45, -0.2]
    };
  }

  function buildRectangularPrism() {
    const W = 1.48;
    const D = 0.88;
    const H = 0.78;
    const hw = W / 2;
    const hd = D / 2;
    const maxAngle = Math.PI / 2;

    const p0 = [-hw, 0, -hd];
    const p1 = [hw, 0, -hd];
    const p2 = [hw, 0, hd];
    const p3 = [-hw, 0, hd];

    const backPts = [[-hw, 0, -hd], [hw, 0, -hd], [hw, 0, -hd - H], [-hw, 0, -hd - H]];
    const topPts = [[-hw, 0, -hd - H], [hw, 0, -hd - H], [hw, 0, -hd - H - D], [-hw, 0, -hd - H - D]];
    const frontPts = [[-hw, 0, hd], [hw, 0, hd], [hw, 0, hd + H], [-hw, 0, hd + H]];
    const leftPts = [[-hw, 0, -hd], [-hw, 0, hd], [-hw - H, 0, hd], [-hw - H, 0, -hd]];
    const rightPts = [[hw, 0, -hd], [hw, 0, hd], [hw + H, 0, hd], [hw + H, 0, -hd]];

    return {
      root: {
        faces: [{ pts: [p0, p1, p2, p3], isBase: true, tint: 0.92 }],
        children: [
          {
            pivot: p0,
            axis: autoAxis(p0, p1, [0, 0, -hd - H]),
            maxAngle,
            faces: [{ pts: backPts, tint: 0.97 }],
            children: [
              {
                pivot: [-hw, 0, -hd - H],
                axis: autoAxis([-hw, 0, -hd - H], [hw, 0, -hd - H], [0, 0, -hd - H - D]),
                maxAngle,
                faces: [{ pts: topPts, isBase: true, tint: 1.04 }],
                holes: [[0, 0, -hd - H - D * 0.85]],
                stringPoints: [{ order: 0, pt: [0, 0, -hd - H - D * 0.85] }]
              }
            ]
          },
          {
            pivot: p3,
            axis: autoAxis(p3, p2, [0, 0, hd + H]),
            maxAngle,
            faces: [{ pts: frontPts, tint: 1.0 }],
            holes: [[0, 0, hd + H * 0.85]],
            stringPoints: [{ order: 1, pt: [0, 0, hd + H * 0.85] }]
          },
          {
            pivot: p0,
            axis: autoAxis(p0, p3, [-hw - H, 0, 0]),
            maxAngle,
            faces: [{ pts: leftPts, tint: 0.95 }],
            holes: [[-hw - H * 0.85, 0, 0]],
            stringPoints: [{ order: 2, pt: [-hw - H * 0.85, 0, 0] }]
          },
          {
            pivot: p1,
            axis: autoAxis(p1, p2, [hw + H, 0, 0]),
            maxAngle,
            faces: [{ pts: rightPts, tint: 0.98 }],
            holes: [[hw + H * 0.85, 0, 0]],
            stringPoints: [{ order: 3, pt: [hw + H * 0.85, 0, 0] }]
          }
        ]
      },
      cameraDist: 6.4,
      pullDirection: 'front',
      centerOffset: [0, 0.35, -0.15]
    };
  }

  function buildTetrahedron() {
    // 평행사변형 모양의 정삼각형 4개 전개도
    const S = 1.65;
    const h = (S * Math.sqrt(3)) / 2;
    const maxAngle = Math.PI - Math.acos(1 / 3); // 약 109.47도

    // 밑면 A (중앙 아래쪽)
    const v0 = [0, 0, -h * 0.5];
    const v1 = [-S / 2, 0, h * 0.5];
    const v2 = [S / 2, 0, h * 0.5];

    // 삼각형 C: v0-v1 변 바깥쪽 (왼쪽 위)
    const vC = [-S, 0, -h * 0.5];
    // 삼각형 B: v0-v2 변 바깥쪽 (오른쪽 위)
    const vB = [S, 0, -h * 0.5];
    // 삼각형 D: B의 v2-vB 변 바깥쪽 (맨 오른쪽) -> 평행사변형 완성!
    const vD = [S * 1.5, 0, h * 0.5];

    return {
      root: {
        faces: [{ pts: [v0, v1, v2], isBase: true, tint: 0.92 }],
        children: [
          {
            pivot: v0,
            axis: autoAxis(v0, v1, vC),
            maxAngle,
            faces: [{ pts: [v0, v1, vC], tint: 0.97 }],
            holes: [vScale(vAdd(vAdd(v0, v1), vScale(vC, 4)), 1 / 6)],
            stringPoints: [{ order: 0, pt: vScale(vAdd(vAdd(v0, v1), vScale(vC, 4)), 1 / 6) }]
          },
          {
            pivot: v0,
            axis: autoAxis(v0, v2, vB),
            maxAngle,
            faces: [{ pts: [v0, v2, vB], tint: 1.0 }],
            holes: [vScale(vAdd(vAdd(v0, v2), vScale(vB, 4)), 1 / 6)],
            stringPoints: [{ order: 1, pt: vScale(vAdd(vAdd(v0, v2), vScale(vB, 4)), 1 / 6) }],
            children: [
              {
                pivot: v2,
                axis: autoAxis(v2, vB, vD),
                maxAngle,
                faces: [{ pts: [v2, vB, vD], tint: 1.04 }],
                holes: [vScale(vAdd(vAdd(v2, vB), vScale(vD, 4)), 1 / 6)],
                stringPoints: [{ order: 2, pt: vScale(vAdd(vAdd(v2, vB), vScale(vD, 4)), 1 / 6) }]
              }
            ]
          }
        ]
      },
      cameraDist: 6.2,
      pullDirection: 'up',
      centerOffset: [0.3, 0.35, 0]
    };
  }

  function buildCubeStaircase() {
    // 6개 정사각형이 대각선 계단 형태로 연결된 전개도 (오른쪽 -> 위 -> 오른쪽 -> 위 -> 오른쪽)
    const S = 0.92;
    const ox = -1.65;
    const oz = 1.25;
    const maxAngle = Math.PI / 2;

    const sq = (gx, gz) => [
      [ox + gx * S, 0, oz - gz * S],
      [ox + (gx + 1) * S, 0, oz - gz * S],
      [ox + (gx + 1) * S, 0, oz - (gz + 1) * S],
      [ox + gx * S, 0, oz - (gz + 1) * S]
    ];

    // 계단 체인 구성 (안쪽에서 바깥쪽으로 중첩)
    const f6 = {
      pivot: [ox + 3 * S, 0, oz - 2 * S],
      axis: autoAxis([ox + 3 * S, 0, oz - 2 * S], [ox + 3 * S, 0, oz - 3 * S], [ox + 3.5 * S, 0, oz - 2.5 * S]),
      maxAngle,
      faces: [{ pts: sq(3, 2), tint: 1.04 }],
      holes: [[ox + 3.5 * S, 0, oz - 2.5 * S]],
      stringPoints: [{ order: 4, pt: [ox + 3.5 * S, 0, oz - 2.5 * S] }]
    };

    const f5 = {
      pivot: [ox + 2 * S, 0, oz - 2 * S],
      axis: autoAxis([ox + 2 * S, 0, oz - 2 * S], [ox + 3 * S, 0, oz - 2 * S], [ox + 2.5 * S, 0, oz - 2.5 * S]),
      maxAngle,
      faces: [{ pts: sq(2, 2), tint: 0.96 }],
      holes: [[ox + 2.5 * S, 0, oz - 2.5 * S]],
      stringPoints: [{ order: 3, pt: [ox + 2.5 * S, 0, oz - 2.5 * S] }],
      children: [f6]
    };

    const f4 = {
      pivot: [ox + 2 * S, 0, oz - 1 * S],
      axis: autoAxis([ox + 2 * S, 0, oz - 1 * S], [ox + 2 * S, 0, oz - 2 * S], [ox + 2.5 * S, 0, oz - 1.5 * S]),
      maxAngle,
      faces: [{ pts: sq(2, 1), isBase: true, tint: 1.02 }],
      holes: [[ox + 2.5 * S, 0, oz - 1.5 * S]],
      stringPoints: [{ order: 2, pt: [ox + 2.5 * S, 0, oz - 1.5 * S] }],
      children: [f5]
    };

    const f3 = {
      pivot: [ox + 1 * S, 0, oz - 1 * S],
      axis: autoAxis([ox + 1 * S, 0, oz - 1 * S], [ox + 2 * S, 0, oz - 1 * S], [ox + 1.5 * S, 0, oz - 1.5 * S]),
      maxAngle,
      faces: [{ pts: sq(1, 1), tint: 0.95 }],
      holes: [[ox + 1.5 * S, 0, oz - 1.5 * S]],
      stringPoints: [{ order: 1, pt: [ox + 1.5 * S, 0, oz - 1.5 * S] }],
      children: [f4]
    };

    const f2 = {
      pivot: [ox + 1 * S, 0, oz - 0 * S],
      axis: autoAxis([ox + 1 * S, 0, oz - 0 * S], [ox + 1 * S, 0, oz - 1 * S], [ox + 1.5 * S, 0, oz - 0.5 * S]),
      maxAngle,
      faces: [{ pts: sq(1, 0), tint: 1.0 }],
      holes: [[ox + 1.5 * S, 0, oz - 0.5 * S]],
      stringPoints: [{ order: 0, pt: [ox + 1.5 * S, 0, oz - 0.5 * S] }],
      children: [f3]
    };

    return {
      root: {
        faces: [{ pts: sq(0, 0), isBase: true, tint: 0.92 }],
        children: [f2]
      },
      cameraDist: 7.0,
      pullDirection: 'up',
      centerOffset: [-0.9, 0.4, 0.5]
    };
  }

  function buildCylinder() {
    const R = 0.62;
    const H = 1.25;
    const N = 16;
    const dw = (2 * Math.PI * R) / N;
    const stepAngle = (2 * Math.PI) / N;
    const hh = H / 2;

    const stripRect = (x0, x1) => [
      [x0, 0, -hh],
      [x1, 0, -hh],
      [x1, 0, hh],
      [x0, 0, hh]
    ];

    // 원형 밑면 근사 다각형 (24각형)
    const makeCirclePts = (cx, cz) => {
      const pts = [];
      const segs = 24;
      for (let i = 0; i < segs; i++) {
        const a = (2 * Math.PI * i) / segs;
        pts.push([cx + R * Math.cos(a), 0, cz + R * Math.sin(a)]);
      }
      return pts;
    };

    // 오른쪽 스트립 체인 (7개)
    const buildRightChain = (idx, count) => {
      const x0 = dw / 2 + idx * dw;
      const x1 = x0 + dw;
      const node = {
        pivot: [x0, 0, 0],
        axis: autoAxis([x0, 0, -hh], [x0, 0, hh], [x1, 0, 0]),
        maxAngle: stepAngle,
        faces: [{ pts: stripRect(x0, x1), tint: 0.98, noBorder: true }],
        children: []
      };
      if (idx + 1 < count) {
        node.children.push(buildRightChain(idx + 1, count));
      } else {
        node.holes = [[x1 - dw * 0.25, 0, 0]];
        node.stringPoints = [{ order: 1, pt: [x1 - dw * 0.25, 0, 0] }];
      }
      return node;
    };

    // 왼쪽 스트립 체인 (8개)
    const buildLeftChain = (idx, count) => {
      const x1 = -dw / 2 - idx * dw;
      const x0 = x1 - dw;
      const node = {
        pivot: [x1, 0, 0],
        axis: autoAxis([x1, 0, -hh], [x1, 0, hh], [x0, 0, 0]),
        maxAngle: stepAngle,
        faces: [{ pts: stripRect(x0, x1), tint: 0.98, noBorder: true }],
        children: []
      };
      if (idx + 1 < count) {
        node.children.push(buildLeftChain(idx + 1, count));
      } else {
        node.holes = [[x0 + dw * 0.25, 0, 0]];
        node.stringPoints = [{ order: 0, pt: [x0 + dw * 0.25, 0, 0] }];
      }
      return node;
    };

    // 위/아래 원형 밑면
    const topCircle = {
      pivot: [0, 0, -hh],
      axis: autoAxis([-dw / 2, 0, -hh], [dw / 2, 0, -hh], [0, 0, -hh - R]),
      maxAngle: Math.PI / 2,
      faces: [{ pts: makeCirclePts(0, -hh - R), isBase: true, tint: 1.04 }]
    };

    const bottomCircle = {
      pivot: [0, 0, hh],
      axis: autoAxis([-dw / 2, 0, hh], [dw / 2, 0, hh], [0, 0, hh + R]),
      maxAngle: Math.PI / 2,
      faces: [{ pts: makeCirclePts(0, hh + R), isBase: true, tint: 0.92 }]
    };

    return {
      root: {
        faces: [{ pts: stripRect(-dw / 2, dw / 2), tint: 0.98, noBorder: true }],
        children: [
          buildRightChain(0, 7),
          buildLeftChain(0, 8),
          topCircle,
          bottomCircle
        ]
      },
      cameraDist: 6.8,
      pullDirection: 'up',
      centerOffset: [0, 0.55, 0]
    };
  }

  const MODEL_BUILDERS = {
    'hexagonal-pyramid': buildHexagonalPyramid,
    'hexagonal-prism': buildHexagonalPrism,
    'cube-pull': buildCubePull,
    'rectangular-prism': buildRectangularPrism,
    'tetrahedron': buildTetrahedron,
    'cube-staircase': buildCubeStaircase,
    'cylinder': buildCylinder
  };

  // --- 3D 시뮬레이터 클래스 ---
  class FoldSimulator3D {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.shapeId = options.shapeId || 'hexagonal-pyramid';
      this.colorHex = options.color || '#34C785';
      this.rgb = hexToRgb(this.colorHex);
      this.fold = typeof options.initialFold === 'number' ? options.initialFold : 0;
      this.targetFold = this.fold;
      this.yaw = options.yaw !== undefined ? options.yaw : 0.6;
      this.pitch = options.pitch !== undefined ? options.pitch : 0.55;
      this.autoRotate = !!options.autoRotate;
      this.showString = options.showString !== false;
      this.onFoldChange = options.onFoldChange || null;

      this.isDragging = false;
      this.lastX = 0;
      this.lastY = 0;
      this.loopMode = false;
      this.loopDir = 1;

      this.model = MODEL_BUILDERS[this.shapeId]();
      this.bindEvents();
      this.resize();
      this.startLoop();
    }

    setShape(shapeId, colorHex) {
      if (!MODEL_BUILDERS[shapeId]) return;
      this.shapeId = shapeId;
      this.model = MODEL_BUILDERS[shapeId]();
      if (colorHex) this.setColor(colorHex);
    }

    setColor(colorHex) {
      this.colorHex = colorHex;
      this.rgb = hexToRgb(colorHex);
    }

    setFold(val, immediate = false) {
      const clamped = Math.max(0, Math.min(1, val));
      this.targetFold = clamped;
      if (immediate) this.fold = clamped;
    }

    setLoop(enabled) {
      this.loopMode = enabled;
      if (enabled) {
        this.loopDir = this.fold > 0.5 ? -1 : 1;
      }
    }

    resetView() {
      this.yaw = 0.6;
      this.pitch = 0.55;
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = Math.round(rect.width * dpr);
      this.canvas.height = Math.round(rect.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    bindEvents() {
      const onDown = (clientX, clientY) => {
        this.isDragging = true;
        this.lastX = clientX;
        this.lastY = clientY;
        this.canvas.style.cursor = 'grabbing';
      };

      const onMove = (clientX, clientY) => {
        if (!this.isDragging) return;
        const dx = clientX - this.lastX;
        const dy = clientY - this.lastY;
        this.lastX = clientX;
        this.lastY = clientY;
        this.yaw += dx * 0.01;
        this.pitch = Math.max(0.12, Math.min(1.42, this.pitch + dy * 0.01));
      };

      const onUp = () => {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
      };

      this.canvas.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
      window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
      window.addEventListener('mouseup', onUp);

      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          onDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      this.canvas.addEventListener('touchmove', (e) => {
        if (this.isDragging && e.touches.length === 1) {
          e.preventDefault();
          onMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: false });

      window.addEventListener('touchend', onUp);
      window.addEventListener('resize', () => this.resize());
    }

    project(pt, centerShift) {
      // 도형 중심 이동 (접힐수록 중심 보정 부드럽게 적용)
      const x0 = pt[0] - centerShift[0];
      const y0 = pt[1] - centerShift[1];
      const z0 = pt[2] - centerShift[2];

      // Yaw (Y축 회전)
      const cy = Math.cos(this.yaw);
      const sy = Math.sin(this.yaw);
      const x1 = x0 * cy - z0 * sy;
      const z1 = x0 * sy + z0 * cy;

      // Pitch (X축 회전)
      const cp = Math.cos(this.pitch);
      const sp = Math.sin(this.pitch);
      const y2 = y0 * cp - z1 * sp;
      const z2 = y0 * sp + z1 * cp;

      const dist = this.model.cameraDist || 6.4;
      const zCam = z2 + dist;
      const fov = Math.min(this.width, this.height) * 1.15;
      const scale = fov / Math.max(0.5, zCam);

      return {
        x: this.width / 2 + x1 * scale,
        y: this.height / 2 - y2 * scale,
        z: zCam,
        scale
      };
    }

    drawFloorGrid(centerShift) {
      const ctx = this.ctx;
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
      ctx.lineWidth = 1;
      const size = 2.6;
      const step = 0.65;

      for (let v = -size; v <= size + 0.01; v += step) {
        const a = this.project([v, -0.02, -size], centerShift);
        const b = this.project([v, -0.02, size], centerShift);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        const c = this.project([-size, -0.02, v], centerShift);
        const d = this.project([size, -0.02, v], centerShift);
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    render() {
      const ctx = this.ctx;
      if (!this.width || !this.height) return;

      ctx.clearRect(0, 0, this.width, this.height);

      // 접힘에 따른 부드러운 중심 이동
      const co = this.model.centerOffset || [0, 0.35, 0];
      const centerShift = [co[0] * this.fold, co[1] * this.fold, co[2] * this.fold];

      this.drawFloorGrid(centerShift);

      const faces = [];
      const holes = [];
      const stringPts = [];
      evaluateNode(this.model.root, this.fold, [], faces, holes, stringPts);

      // 부드러운 그림자 (바닥 투영)
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.07)';
      for (const f of faces) {
        ctx.beginPath();
        f.pts.forEach((p, idx) => {
          const sp = this.project([p[0] + 0.12, -0.015, p[2] + 0.12], centerShift);
          if (idx === 0) ctx.moveTo(sp.x, sp.y);
          else ctx.lineTo(sp.x, sp.y);
        });
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // 면 깊이 정렬 및 조명 계산
      const lightDir = vNorm([0.45, 0.85, 0.55]);
      const projectedFaces = faces.map((f) => {
        const proj = f.pts.map((p) => this.project(p, centerShift));
        const avgZ = proj.reduce((sum, p) => sum + p.z, 0) / proj.length;

        // 법선 계산
        const e1 = vSub(f.pts[1], f.pts[0]);
        const e2 = vSub(f.pts[2], f.pts[0]);
        const n = vNorm(vCross(e1, e2));
        const ndl = Math.abs(vDot(n, lightDir));
        const shade = (0.64 + 0.38 * ndl) * f.tint;

        return { proj, avgZ, shade, isBase: f.isBase, noBorder: f.noBorder };
      });

      projectedFaces.sort((a, b) => b.avgZ - a.avgZ);

      // 면 그리기
      for (const pf of projectedFaces) {
        ctx.beginPath();
        pf.proj.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();

        ctx.fillStyle = shadeColor(this.rgb, pf.shade);
        ctx.fill();

        if (!pf.noBorder) {
          ctx.strokeStyle = pf.isBase ? 'rgba(15, 23, 42, 0.45)' : 'rgba(15, 23, 42, 0.28)';
          ctx.lineWidth = pf.isBase ? 1.5 : 1.1;
          ctx.setLineDash(pf.isBase && this.fold < 0.85 ? [4, 3] : []);
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          ctx.strokeStyle = shadeColor(this.rgb, pf.shade * 0.96);
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // 꼭짓점 구멍 & 가상 실(String) 렌더링
      if (this.showString && stringPts.length > 0) {
        stringPts.sort((a, b) => a.order - b.order);
        const projStrings = stringPts.map((s) => this.project(s.pt, centerShift));

        // 구멍 그리기
        for (const h of holes) {
          const ph = this.project(h, centerShift);
          ctx.beginPath();
          ctx.arc(ph.x, ph.y, 3.6, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }

        // 구멍을 잇는 노끈/실
        ctx.save();
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        projStrings.forEach((p, idx) => {
          if (idx === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        if (projStrings.length > 2) {
          ctx.closePath();
        }
        ctx.stroke();

        // 위로 또는 앞으로 당겨지는 두 가닥 실
        const avgPt = stringPts.reduce(
          (acc, s) => [acc[0] + s.pt[0], acc[1] + s.pt[1], acc[2] + s.pt[2]],
          [0, 0, 0]
        ).map((v) => v / stringPts.length);

        const pullTarget = this.model.pullDirection === 'front'
          ? [avgPt[0], avgPt[1] + 0.15, avgPt[2] + 0.8 + this.fold * 0.65]
          : [avgPt[0], avgPt[1] + 0.55 + this.fold * 0.75, avgPt[2]];

        const pPull = this.project(pullTarget, centerShift);
        const pStart = projStrings[0];
        const pEnd = projStrings[projStrings.length - 1];

        ctx.beginPath();
        ctx.moveTo(pStart.x, pStart.y);
        ctx.lineTo(pPull.x, pPull.y);
        ctx.moveTo(pEnd.x, pEnd.y);
        ctx.lineTo(pPull.x, pPull.y);
        ctx.stroke();

        // 손잡이 매듭 포인트
        ctx.beginPath();
        ctx.arc(pPull.x, pPull.y, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = '#F59E0B';
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      }
    }

    startLoop() {
      const tick = () => {
        if (this.loopMode) {
          this.targetFold += this.loopDir * 0.011;
          if (this.targetFold >= 1) {
            this.targetFold = 1;
            this.loopDir = -1;
          } else if (this.targetFold <= 0) {
            this.targetFold = 0;
            this.loopDir = 1;
          }
          if (this.onFoldChange) this.onFoldChange(this.targetFold);
        }

        const diff = this.targetFold - this.fold;
        if (Math.abs(diff) > 0.0005) {
          this.fold += diff * 0.14;
        } else {
          this.fold = this.targetFold;
        }

        if (this.autoRotate && !this.isDragging) {
          this.yaw += 0.004;
        }

        this.render();
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    }
  }

  window.FoldSimulator3D = FoldSimulator3D;
})();
