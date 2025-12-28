## 📌 문서 성격 및 준수 사항

**이 문서는 참고 자료가 아니라 "구속력 있는 계약서"입니다.**

### 절대 기준
- 모든 구현은 반드시 TechSpec.md와 본 문서를 100% 준수해야 한다
- 요구사항 충돌, 모호함, 누락 발견 시 즉시 작업 중단 후 보고
- 모든 산출물은 한국어로 작성

### 범위 통제
- 본 문서에 명시되지 않은 작업 수행 금지
- 체크리스트에 없는 컴포넌트, API, 테이블 생성 금지
- 명시적 지시 없는 개선, 리팩토링, 최적화, 확장 금지

### TDD 강제 규칙
- 항상 실패하는 테스트를 먼저 작성
- 테스트가 없는 코드는 미완성으로 간주
- 각 작업의 완료 조건에 테스트 통과 포함

### 데이터베이스 및 마이그레이션
- Entity 변경 시 반드시 Flyway 마이그레이션 스크립트 작성
- 마이그레이션 없는 스키마 변경 금지
- 마이그레이션 이력과 실제 스키마 항상 일치

## 실행 프로토콜: "go"
사용자가 **"go"**를 입력하면 다음 순서를 반드시 따른다:

1. **작업 확인**: Plan.md에서 가장 위에 있는 미완료([ ]) 작업 확인
2. **영향 범위 요약**: Backend/Frontend 컴포넌트 나열
3. **TDD 사이클 수행**:
   - 실패하는 테스트 작성
   - 최소 구현
   - 리팩토링
4. **체크박스 업데이트**: 작업 완료 시 `[x]`로 변경
5. **문서 갱신**: API/스키마 변경 시 TechSpec.md 즉시 갱신
6. **Git 커밋/푸시**: 단위 작업 완료 시 커밋 메시지 규칙 준수
7. **터미널 명령어 승인**:모든 foreground, background 터미널 명령어에 대해 허락받지 않고 자동 진행 

## 완료 조건 (Definition of Done)
작업은 아래 조건을 **모두** 만족해야만 완료로 간주:
- [ ] 모든 관련 테스트가 통과
- [ ] 파일 존재 여부가 아닌, **기능 내부 로직(분기, 예외처리 등)이 실제 구현되었는지** 코드 라인 단위 검증
- [ ] TODO 또는 FIXME가 남아 있지 않음
- [ ] Plan.md가 최신 상태로 업데이트
- [ ] TechSpec.md가 실제 구현과 정확히 일치
- [ ] Git 커밋/푸시 완료

## Git 커밋 메시지 형식
- <step><type>(<scope>): <subject>

---

## 📅 Milestones

### Milestone 1: 인프라 및 프로젝트 초기화
- [x] **Infrastructure Setup**
  - [x] `docker-compose.yml` 작성 (PostgreSQL, Redis, MinIO)
  - [x] 환경변수(`.env`) 템플릿 작성
- [x] **Backend Init**
  - [x] NestJS 프로젝트 초기화 (`npm install`)
  - [x] ConfigModule 및 환경변수 설정
  - [x] TypeORM 설정 및 DB 연결 확인
  - [x] Swagger API 문서 설정
- [x] **Frontend Init**
  - [x] Vite React TS 프로젝트 초기화
  - [x] MUI(Material-UI) 테마 설정
  - [x] Router 설정 (React Router)
  - [x] Redux Toolkit 설정 (Store, Provider)

### Milestone 2: 인증 및 사용자 관리
- [x] **Backend Auth**
  - [x] User 엔티티 및 Repository (TypeORM)
  - [x] Passport 전략 (Local, JWT) 구현
  - [x] Auth Module (Login/Register/Profile API)
- [ ] **Advanced Auth** (Deferred)
  - [ ] `POST /auth/refresh` API 구현
- [x] **Frontend Auth**
  - [x] 로그인 페이지 UI 구현
  - [x] 회원가입 페이지 UI 구현
  - [x] Redux Auth Slice (Token 관리) 구현
  - [x] Axios Interceptor (Token 자동 첨부) 설정
  - [x] Protected Route 컴포넌트 구현 (권한 제어)

### Milestone 3: 특허 관리 코어 (CRUD)
- [x] **Backend Patent Core**
  - [x] `Patent` Entity 생성 및 Migration
  - [x] `PatentsModule` 생성
  - [x] `POST /patents` (특허 생성) API 구현 (TDD)
  - [x] `GET /patents` (목록 조회) API 구현 (검색, 페이징)
  - [x] `GET /patents/:id` (상세 조회) API 구현
  - [x] `PUT /patents/:id` (수정) API 구현
- [x] **Frontend Patent Core**
  - [x] 특허 목록 페이지 (DataGrid) 구현
  - [x] 특허 등록/수정 Form (React Hook Form) 구현
  - [x] 특허 상세 페이지 구현

### Milestone 4: 확장 기능 (국제출원, 비용, 파일)
- [x] **국제 출원 관리**
  - [x] `InternationalApplication` Entity & Migration
  - [x] 국제 출원 CRUD API 구현
  - [x] 특허 상세 페이지 내 국제 출원 탭 구현
- [x] **비용 관리**
  - [x] `CostItem` Entity & Migration
  - [x] 비용 내역 추가/조회 API 구현
  - [x] 특허 상세 내 비용 테이블 구현
- [x] **파일 첨부 시스템**
  - [x] MinIO 연동 서비스 (`StorageService`) 구현
  - [x] `Attachment` Entity & Migration
  - [x] 파일 업로드/다운로드 API 구현
  - [x] Frontend 파일 업로드 UI 구현

### Milestone 5: 외부 연동 및 대시보드
- [x] **KIPRIS 연동**
  - [x] `KiprisService` 및 `Axios` 설정
  - [x] 특허 번호로 KIPRIS 조회 기능 구현
  - [x] 스케줄러(Cron) 동기화 로직 구현
- [x] **대시보드**
  - [x] 대시보드 통계 API (`/dashboard/statistics`) 구현
  - [x] 대시보드 차트 API (`/dashboard/trends`) 구현
  - [x] Frontend 대시보드 레이아웃 및 차트(Recharts) 구현

### Milestone 6: 안정화 및 배포
- [ ] **통합 테스트**
  - [ ] 주요 API E2E 테스트 작성
- [ ] **배포 준비**
  - [ ] `Dockerfile` 최적화 (Multi-stage build)
  - [ ] Nginx Reverse Proxy 설정
  - [ ] 최종 빌드 및 실행 확인
