# HOTEL YO:ON Website

HOTEL YO:ON은 도심 속에서 잠시 멈추고 자신만의 리듬을 되찾는 어반 웰니스 호텔 웹사이트입니다.  
정적인 HTML/CSS/JavaScript 사이트라 별도 빌드 과정 없이 바로 배포할 수 있습니다.

## 구성

- `index.html` - 웹사이트 메인 페이지
- `styles.css` - 전체 레이아웃, 반응형, 타이포그래피 스타일
- `script.js` - 예약 폼, 모바일 메뉴, 룸 이미지 전환, 히어로 영상 제어
- `assets/` - 로고, 이미지, 영상, PDF 자료

## 실행 방법

별도 설치 없이 `index.html` 파일을 브라우저에서 열면 됩니다.

로컬 서버로 확인하려면 아래처럼 실행할 수 있습니다.

```bash
python3 -m http.server 8000
```

그 다음 브라우저에서 `http://localhost:8000`으로 접속합니다.

## GitHub 업로드 방법

1. GitHub에서 새 저장소를 만듭니다.
2. 이 폴더의 `index.html`, `styles.css`, `script.js`, `README.md`, `.gitignore`, `assets/`를 업로드합니다.
3. 저장소의 `Settings` → `Pages`로 이동합니다.
4. `Build and deployment`에서 `Deploy from a branch`를 선택합니다.
5. Branch를 `main`, folder를 `/root`로 선택한 뒤 저장합니다.
6. 잠시 후 GitHub Pages 주소가 생성됩니다.

## 참고

- `assets/main-hero.mp4`는 메인 히어로 배경 영상입니다.
- Pretendard 웹폰트는 CDN으로 불러옵니다. 네트워크가 없을 경우 시스템 기본 한글 폰트로 표시됩니다.
- 모든 주요 이미지는 현재 프로젝트 안의 `assets/` 폴더에 포함되어 있습니다.
