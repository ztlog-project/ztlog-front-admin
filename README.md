# ZTLog Admin

ZTLog 블로그 관리자 대시보드 프론트엔드

## 기술 스택

- **Next.js 15** - 프레임워크 (App Router)
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS 4** - 스타일링
- **TipTap** - 리치 텍스트 에디터

## 프로젝트 구조

```
app/
├── layout.tsx              # Root layout (AuthProvider 포함)
├── page.tsx                # /admin으로 리다이렉트
├── login/
│   └── page.tsx            # 로그인 페이지
└── admin/
    ├── layout.tsx          # Auth Guard + Sidebar + Header
    ├── page.tsx            # 대시보드
    ├── contents/
    │   ├── page.tsx        # 게시물 목록
    │   ├── new/page.tsx    # 게시물 작성
    │   └── [id]/page.tsx   # 게시물 수정
    ├── tags/
    │   └── page.tsx        # 태그 관리
    ├── profile/
    │   └── page.tsx        # 프로필
    └── settings/
        └── page.tsx        # 설정

src/
├── components/             # 공통 컴포넌트
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   ├── Pagination.tsx
│   ├── StatCard.tsx
│   └── TipTapEditor.tsx
├── lib/
│   ├── api/                # API 클라이언트 (TypeScript)
│   │   ├── client.ts       # 기본 API 클라이언트 (JWT 인증, 세션 쿠키)
│   │   ├── auth.ts         # 인증 API (로그인/로그아웃/회원가입)
│   │   ├── contents.ts     # 게시물 CRUD API
│   │   ├── tags.ts         # 태그 CRUD API
│   │   ├── dashboard.ts    # 대시보드 API
│   │   └── types.ts        # 공통 타입 정의
│   └── contexts/
│       └── AuthContext.tsx  # 인증 상태 Context
└── app.css                 # Tailwind CSS + 테마 변수
```

## 환경 설정

`.env.example`을 복사하여 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

```env
NEXT_PUBLIC_API_BASE_URL=/admin/api    # API 기본 경로
VITE_API_TARGET=http://localhost:8080  # 백엔드 서버 주소
```

## 개발 서버 실행

```bash
npm install
npm run dev
```

개발 서버가 `http://localhost:3000`에서 실행됩니다.
Next.js 리라이트가 `/admin/api/v1` 요청을 백엔드 서버로 전달합니다.

## 빌드

```bash
npm run build
npm run start
```

## API 연동

백엔드 API 기본 URL: `{API_TARGET}/admin/api/v1/`

| 기능 | 메서드 | 엔드포인트 |
|------|--------|-----------|
| 로그인 | POST | `/v1/user/login` |
| 로그아웃 | POST | `/v1/user/logout` |
| 회원가입 | POST | `/v1/user/signup` |
| 대시보드 | GET | `/v1/main` |
| 게시물 목록 | GET | `/v1/contents` |
| 게시물 상세 | GET | `/v1/contents/{ctntNo}` |
| 게시물 작성 | POST | `/v1/contents` |
| 게시물 수정 | PUT | `/v1/contents` |
| 게시물 삭제 | DELETE | `/v1/contents/{ctntNo}` |
| 태그 목록 | GET | `/v1/tags` |
| 태그 상세 | GET | `/v1/tags/{tagNo}` |
| 태그 생성 | POST | `/v1/tags` |
| 태그 수정 | PUT | `/v1/tags` |
| 태그 삭제 | DELETE | `/v1/tags/{tagNo}` |

## 인증 방식

- JWT Bearer 토큰 인증 (`Authorization: Bearer <accessToken>`)
- 세션 쿠키 (`ZTLOG_SESSION_ID`) 자동 전송 (`credentials: include`)
- 로그인 후 `accessToken`을 `localStorage`에 저장
- 401 응답 시 자동 로그아웃 후 로그인 페이지로 이동
