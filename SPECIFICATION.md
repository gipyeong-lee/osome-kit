# osome-kit 상세 스펙 문서

> **Version:** 1.2.25
> **License:** MIT
> **Description:** Pure JavaScript Calendar & Gantt Chart React Module

---

## 1. 프로젝트 개요

osome-kit은 React 기반의 캘린더(OSCalendar)와 간트차트(OSGantt) 컴포넌트 라이브러리입니다.
내부적으로 Vanilla DOM 조작을 사용하며, React 컴포넌트는 래퍼(wrapper) 역할을 합니다.

### 아키텍처

```
React Components (src/index.js)
  ├── OSCalendar → OsomeCalendar (src/calendar/assets/js/script.js)
  └── OSGantt    → OsomeGantt   (src/gantt/assets/js/script.js)
                        └── utils (src/common/util.js)
```

---

## 2. 데이터 구조

### 2.1 Categories (공통)

```javascript
categories = [
  {
    content: {
      order: Number,        // 카테고리 순서 (0-based index)
      title: String,        // 카테고리 제목
      type: 'main' | 'sub', // 카테고리 유형
      style: {
        color: String,       // 텍스트 색상
        padding: String,     // 패딩
        ...                  // 기타 CSS 속성
      }
    },
    events: [
      {
        id: Any,                    // 이벤트 고유 ID
        index: Number,              // 이벤트 인덱스
        title: String,              // 이벤트 제목
        startDate: Date | String,   // 시작일
        endDate: Date | String,     // 종료일
        style: {
          color: String,            // 텍스트 색상
          backgroundColor: String   // 배경 색상
        },
        // 아래는 내부 계산 필드
        start: Number,              // 계산된 시작 타일 번호
        total: Number               // 계산된 총 타일 수
      }
    ]
  }
]
```

### 2.2 Options - Calendar

```javascript
options = {
  maxEvent: 2000,              // 최대 이벤트 표시 수
  style: {
    grid: { width: 800 },     // 그리드 너비
    row: { minHeight: 180 },   // 행 최소 높이
    cellHeader: {
      height: 30,              // 셀 헤더 높이
      fontSize: '0.8em',       // 폰트 크기
      textAlign: 'center',     // 텍스트 정렬
      gap: 30                  // 이벤트 시작 갭 (헤더 아래 여백)
    },
    event: { height: 20 },     // 이벤트 블록 높이
    todayHeader: {
      backgroundColor: 'red',  // 오늘 날짜 배경색
      numberColor: 'white',    // 오늘 날짜 번호 색상
      titleColor: 'red'        // 오늘 날짜 제목 색상
    },
    holidayHeader: {
      backgroundColor: '',
      numberColor: 'white',
      titleColor: 'red'
    }
  },
  offsetY: 0,                 // 스크롤 위치 저장
  refresh: false,              // 리프레시 여부
  country: 'ko',              // 국가 코드 ('ko' | 'jp')
  days: {                      // 요일 표시 문자열
    ko: ['일', '월', '화', '수', '목', '금', '토'],
    jp: ['日', '月', '火', '水', '木', '金', '土']
  },
  moreButton: {                // 더보기 버튼 텍스트
    ko: '+ 더보기',
    jp: '+ もっと見る'
  },
  today: new Date(),           // 기준 날짜
  year: Number,                // 표시 연도
  month: Number                // 표시 월 (0-based)
}
```

### 2.3 Options - Gantt

```javascript
options = {
  type: 'row',                // 레이아웃 타입
  fixed: false,               // 고정 여부
  disabled: false,            // 비활성화 여부
  style: {
    container: {
      leftWidth: '30%'        // 왼쪽 카테고리 패널 너비
    },
    row: {
      height: 40,             // 행 높이
      ratio: 0.5              // 비율
    },
    event: { height: 20 },    // 이벤트 블록 높이
    eventHeader: {
      width: 100,             // 이벤트 헤더 너비
      height: 20              // 이벤트 헤더 높이
    },
    cellHeader: {
      height: 20,             // 셀 헤더 높이
      gap: 10                 // 헤더 갭
    }
  },
  offsetY: 0,
  refresh: false,
  country: 'ko',
  days: { ... },              // Calendar과 동일
  today: new Date(),
  year: Number,
  month: Number,              // 0-based
  handleMin: 5,               // 핸들바 최소 위치 (%)
  handleMax: 35               // 핸들바 최대 위치 (%)
}
```

---

## 3. React 컴포넌트 스펙

### 3.1 OSCalendar

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `Object` | No | `{}` | 캘린더 옵션 설정 |
| `categories` | `Array` | No | `[]` | 카테고리 및 이벤트 데이터 |
| `style` | `Object` | No | - | 컨테이너 인라인 스타일 |
| `onClickSchedule` | `Function(element, category, event)` | No | noop | 스케줄 클릭 콜백 |
| `onClickMoreButton` | `Function(element, events)` | No | noop | 더보기 버튼 클릭 콜백 |
| `onDragEndTile` | `Function(start, end, renderOption)` | No | console.log | 타일 드래그 종료 콜백 (새 이벤트 생성) |
| `onChangedSchedule` | `Function(order, event, afterEvent)` | No | noop | 스케줄 변경 콜백 (리사이즈/이동) |

#### 인스턴스 메서드

| Method | Parameters | Description |
|--------|------------|-------------|
| `attachEvent(start, end, option)` | start: Number, end: Number, option: Object | 이벤트 블록 추가 |
| `resetEvent()` | - | 캘린더 초기화 |
| `createSchedule(start, end, eventOption)` | start/end: Number, eventOption: Object | 스케줄 생성 |
| `moveSchedule(eventId, startDay, endDay)` | eventId: Any, start/endDay: Date | 스케줄 이동 (미구현) |

#### 라이프사이클

- **componentDidMount**: `OsomeCalendar.init()` 호출, 콜백 함수 바인딩
- **shouldComponentUpdate**: `options` 또는 `categories` 변경 시 `OsomeCalendar.init()` 재호출

### 3.2 OSGantt

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `options` | `Object` | No | `{}` | 간트차트 옵션 설정 |
| `categories` | `Array` | No | `[]` | 카테고리 및 이벤트 데이터 |
| `style` | `Object` | No | - | 컨테이너 인라인 스타일 |
| `onClickSchedule` | `Function(element, category, event)` | No | noop | 스케줄 클릭 콜백 |
| `onMouseRightClick` | `Function(element, event)` | No | console.log | 우클릭 콜백 |
| `onDragEndTile` | `Function(start, end, renderOption)` | No | console.log | 타일 드래그 종료 콜백 |
| `onChangedSchedule` | `Function(order, event, afterEvent)` | No | noop | 스케줄 변경 콜백 |
| `onChangedCategory` | `Function(categories, afterCategories)` | No | noop | 카테고리 변경 콜백 |
| `onChangeContainer` | `Function(left, right)` | No | console.log | 컨테이너 크기 변경 콜백 |
| `onCompleteContainerResize` | `Function(left, right)` | No | console.log | 컨테이너 리사이즈 완료 콜백 |

#### 인스턴스 메서드

| Method | Parameters | Description |
|--------|------------|-------------|
| `attachEvent(start, end, option)` | start: Number, end: Number, option: Object | 이벤트 블록 추가 |
| `resetEvent()` | - | 간트차트 초기화 |
| `createSchedule(start, end, eventOption)` | start/end: Number, eventOption: Object | 스케줄 생성 |

---

## 4. 내부 엔진 스펙

### 4.1 OsomeCalendar 엔진

#### 상태 관리

```javascript
focus = {
  current: Element,    // 현재 포커스된 타일
  type: String,        // 'create' | 'resize' | 'move'
  start: Number,       // 시작 타일 번호
  end: Number,         // 종료 타일 번호
  last: Number         // 마지막 타일 번호
}
```

#### 핵심 메서드

| Method | Description |
|--------|-------------|
| `init(id, opt, categories)` | 캘린더 초기화: 옵션 병합, DOM 생성, 이벤트 렌더링 |
| `createGrid(element, options)` | 6주 × 7일 그리드 DOM 생성 |
| `createEvents(options)` | 모든 카테고리의 이벤트를 그리드에 렌더링 |
| `renderEventBlock(...)` | 개별 이벤트 블록을 주(week) 단위로 분할하여 배치 |
| `attachGridEvent(element)` | 그리드에 마우스 이벤트 리스너 연결 |
| `attachEventCreate` | 드래그로 새 이벤트 생성 핸들링 |
| `attachResizeEvent` | 이벤트 리사이즈 핸들링 |
| `syncEvent(option)` | 이벤트 날짜 동기화 후 콜백 호출 |
| `setupMoreButton()` | 더보기 버튼 설정 (maxEvent 초과 시) |
| `saveOffset()` | 스크롤 위치 저장 |

#### 그리드 구조

```
#osome-cal-grid (스크롤 컨테이너)
  └── .osome-cal-grid-header (요일 헤더)
       └── .header-tile × 7 (일~토)
  └── .osome-cal-grid-row × 6 (주)
       └── .osome-cal-grid-day-tile × 7 (일)
            ├── .osome-cal-grid-day-header (날짜 숫자)
            └── .event-block (이벤트 블록들)
```

#### 타일 번호 매핑

- 총 42개 타일 (6주 × 7일), 0-based index
- `endNum`: 기본값 34 (표시 영역의 끝)
- 이전 달 / 다음 달 날짜도 포함

#### 이벤트 렌더링 로직

1. 각 카테고리의 이벤트를 순회
2. `convertDateToNumber()`로 시작/종료 타일 번호 계산
3. 주(week) 경계에서 이벤트 블록 분할
4. `eventCounter`로 각 타일의 이벤트 수 추적
5. `eventRenderCounter`로 렌더링된 이벤트 수 추적
6. `maxEvent` 초과 시 더보기 버튼 표시

### 4.2 OsomeGantt 엔진

#### 상태 관리

```javascript
focus = {
  event: Element,      // 현재 포커스된 이벤트
  current: Element,    // 현재 타일
  type: String,        // 'create' | 'resize' | 'move'
  start: Number,       // 시작 위치
  end: Number,         // 종료 위치
  last: Number         // 마지막 위치
}

dragging = {
  row: Number,         // 드래그 중인 행
  index: Number,       // 드래그 중인 인덱스
  startNum: Number,    // 시작 번호
  endNum: Number,      // 종료 번호
  days: Number,        // 일수
  status: String       // 드래그 상태
}
```

#### 핵심 메서드

| Method | Description |
|--------|-------------|
| `init(id, opt, categories)` | 간트차트 초기화 |
| `createGrid(element, options)` | 2-패널 레이아웃 생성 (카테고리 + 타임라인) |
| `createRow(container, options, ...)` | 개별 행 생성 (카테고리 또는 데이터) |
| `renderEventBlocks(options)` | 모든 이벤트 블록 렌더링 |
| `createEventBlock(row, startTile, endTile, option)` | 개별 이벤트 블록 생성 |
| `attachGridEvent(element)` | 그리드 이벤트 리스너 연결 |
| `attachEventCreate` | 드래그로 새 이벤트 생성 |
| `attachDragAndDropEvent` | 이벤트 드래그 앤 드롭 |
| `attachDragAndDropCategory` | 카테고리 행 드래그 앤 드롭 (순서 변경) |
| `attachContainerHandleBarEvent` | 패널 크기 조절 핸들바 |
| `syncEvent(option)` | 이벤트 날짜 동기화 |

#### 그리드 구조

```
#osome-gantt
  ├── #osome-gantt-grid-left (카테고리 패널)
  │    ├── .header-row (헤더)
  │    └── #osome-gantt-grid-container
  │         └── .gantt-grid-row × N (카테고리별)
  ├── .osome-gantt-handle-bar (크기 조절 바)
  └── #osome-gantt-grid-right (타임라인 패널)
       ├── .header-row (날짜 헤더)
       └── #osome-gantt-grid-container
            └── .gantt-grid-row × N
                 └── .back-tile × M (날짜별 타일)
```

#### 핸들바 동작

- 왼쪽 패널과 오른쪽 패널 사이의 드래그 가능한 구분선
- `handleMin` (5%) ~ `handleMax` (35%) 범위 내에서 조절
- 드래그 중 `onChangeContainer` 콜백 호출
- 드래그 완료 시 `onCompleteContainerResize` 콜백 호출

---

## 5. 유틸리티 함수 스펙 (src/common/util.js)

### 5.1 프로토타입 확장

| Prototype | Method | Description |
|-----------|--------|-------------|
| `String` | `toNumber()` | 문자열을 숫자로 변환 |
| `String` | `numOfPercent()` | `'50%'` → `50` |
| `String` | `numOfPixel()` | `'100px'` → `100` |
| `Number` | `toNumber()` | 숫자 그대로 반환 (인터페이스 통일) |
| `Number` | `pad(len)` | 숫자를 지정 길이로 0-패딩 (예: `5.pad(2)` → `'05'`) |
| `Array` | `insert(index, item)` | 지정 인덱스에 아이템 삽입 |
| `HTMLElement` | `remove()` | DOM에서 자신을 제거 |
| `Date` | `getPrevMonth()` | 이전 달의 Date 객체 반환 |
| `Date` | `getNextMonth()` | 다음 달의 Date 객체 반환 |
| `Date` | `getLastDate()` | 해당 월의 마지막 날짜 반환 |
| `Date` | `startOfDay()` | 해당 월 1일의 요일 번호 (0=일, 6=토) |
| `Date` | `endOfDay()` | 해당 월 마지막일의 요일 번호 |
| `Date` | `addDays(n)` | n일 후의 Date 반환 |
| `Date` | `zeroTimeDate()` | 시간을 00:00:00으로 설정한 복사본 반환 |
| `Date` | `midasFormat()` | `'MM/DD HH:mm'` 형식 문자열 반환 |

### 5.2 변환 함수

#### `convertDateToNumber(sDate, eDate, currentYear, indexOfCurrentMonth, startOfDay, firstTile, endOfMonthDate, eNum)`

캘린더 타일 번호로 날짜 범위를 변환합니다.

- **입력**: 시작/종료 날짜, 현재 연도/월, 시작 요일, 첫 타일 DOM 요소, 월말 날짜, 마지막 타일 번호
- **출력**: `{ startNum, endNum }` 또는 `undefined` (범위 밖인 경우)
- **처리**: 이전 달/현재 달/다음 달에 걸친 이벤트의 타일 번호를 정확히 계산

#### `convertDateToGanttNumber(sDate, eDate, currentYear, indexOfCurrentMonth, eNum)`

간트차트 열 번호로 날짜 범위를 변환합니다.

- **입력**: 시작/종료 날짜, 현재 연도/월, 마지막 열 번호
- **출력**: `{ startNum, endNum }` 또는 `undefined` (범위 밖인 경우)

#### `convertGanttNumberToDate(startNumber, endNumber, eNum)`

간트차트 열 번호를 제한된 범위로 클램핑합니다.

- **입력**: 시작/종료 번호, 최대 번호
- **출력**: `{ startNum, endNum }` (1-based, 범위 내로 제한)

---

## 6. 인터랙션 스펙

### 6.1 캘린더 인터랙션

| 인터랙션 | 동작 | 콜백 |
|----------|------|------|
| 타일 드래그 | 빈 타일에서 드래그하여 새 이벤트 생성 | `onDragEndTile(start, end, renderOption)` |
| 이벤트 클릭 | 이벤트 블록 클릭 | `onClickSchedule(element, category, event)` |
| 이벤트 리사이즈 | 이벤트 오른쪽 핸들러를 드래그하여 종료일 변경 | `onChangedSchedule(order, before, after)` |
| 이벤트 드래그 | 이벤트 블록을 다른 타일로 이동 | `onChangedSchedule(order, before, after)` |
| 더보기 클릭 | maxEvent 초과 시 표시되는 더보기 버튼 클릭 | `onClickMoreButton(element, events)` |

### 6.2 간트차트 인터랙션

| 인터랙션 | 동작 | 콜백 |
|----------|------|------|
| 타일 드래그 | 빈 타일에서 드래그하여 새 이벤트 생성 | `onDragEndTile(start, end, renderOption)` |
| 이벤트 클릭 | 이벤트 블록 클릭 | `onClickSchedule(element, category, event)` |
| 이벤트 드래그 | 이벤트를 좌/우로 이동하여 날짜 변경 | `onChangedSchedule(order, before, after)` |
| 이벤트 리사이즈 | 이벤트 핸들러 드래그로 종료일 변경 | `onChangedSchedule(order, before, after)` |
| 카테고리 드래그 | 카테고리 행을 위/아래로 이동하여 순서 변경 | `onChangedCategory(categories, afterCategories)` |
| 우클릭 | 카테고리 행에서 우클릭 | `onMouseRightClick(element, event)` |
| 핸들바 드래그 | 좌/우 패널 구분선을 드래그하여 크기 조절 | `onChangeContainer(left, right)` / `onCompleteContainerResize(left, right)` |

---

## 7. 빌드 및 배포

### 빌드 설정

- **번들러**: Rollup 0.64
- **트랜스파일**: Babel 6 (env, stage-0, react 프리셋)
- **출력**: CJS (`dist/index.js`) + ESM (`dist/index.es.js`) + sourcemaps
- **CSS**: PostCSS (CSS Modules)

### NPM 스크립트

| Script | Command | Description |
|--------|---------|-------------|
| `build` | `rollup -c` | 프로덕션 빌드 |
| `start` | `rollup -c -w` | 개발 모드 (watch) |
| `test` | `cross-env CI=1 react-scripts test --env=jsdom` | 테스트 실행 |
| `test:watch` | `react-scripts test --env=jsdom` | 테스트 watch 모드 |
| `prepare` | `yarn run build` | npm publish 전 빌드 |
| `deploy` | `gh-pages -d example/build` | GitHub Pages 배포 |

---

## 8. 알려진 이슈 및 개선 필요 사항

### 코드 품질

1. **프로토타입 오염**: `String`, `Number`, `Date`, `Array`, `HTMLElement`의 네이티브 프로토타입을 확장 → 독립 유틸리티 함수로 리팩토링 필요
2. **전역 싱글턴 패턴**: `OsomeCalendar`, `OsomeGantt`가 전역 객체로 동일 페이지에 다중 인스턴스 불가
3. **미구현 메서드**: `OSCalendar.moveSchedule()`이 빈 함수
4. **버그**: `OSCalendar.resetEvent()`와 `OSGantt.resetEvent()`에서 정의되지 않은 `options` 변수 참조
5. **테스트 부재**: 단 1개의 trivial 테스트만 존재

### 의존성

1. Babel 6 (EOL) → Babel 7+ 업그레이드 권장
2. react-scripts 1.x → 5.x 업그레이드 권장
3. Rollup 0.64 → 최신 버전 업그레이드 권장
4. `moment` peer dependency 선언되어 있으나 실제 미사용
