# pre-onboarding-12th-3-5

- 검색어 추천 기능과 검색어 캐싱 기능이 있는 검색창을 구현하는 과제입니다.
- 추천 검색어는 키보드 상하 키로 탐색이 가능해야 합니다.

### 기술 스택

<div>
  <img src="https://img.shields.io/badge/react-61DAFB?style=flat&logo=react&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-3178C6?style=flat&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/sass-DB7093?style=flat&logo=sass&logoColor=white">
  <img src="https://img.shields.io/badge/axios-5A29E4?style=flat&logo=axios&logoColor=white">
</div>

## 🗓️ 프로젝트 기간

### 2023.9.5 ~ 2023.9.8 (4일)

<br />

## 📌 프로젝트 실행 방법

1. Clone the repo

```javascript
$ git clone https://github.com/wanted-pre-onboarding-12th-team-5/pre-onboarding-12th-3-5.git
```

2. Install NPM packages

```javascript
$ npm install
```

3. Getting Started

```javascript
$ npm start
```

<br/>


## 🚀 배포

### [원티드 프리온보딩 인턴십 3차 과제 - 5팀 배포 링크]()


## ⭐️ 팀 구성원 및 역할

|                          최지윤                           |                           유지혜                           |                           김태근                           |                          최선호                           |                          이효식                           |                 김형일(팀장)                 |
| :-------------------------------------------------------: | :--------------------------------------------------------: | :--------------------------------------------------------: | :-------------------------------------------------------: | :-------------------------------------------------------: | :------------------------------------------: |
|          [chichoon](https://github.com/chichoon)          |        [dbwlgp1yng](https://github.com/dbwlgp1yng)         |       [taegeun1111](https://github.com/taegeun1111)        |        [preferchoi](https://github.com/preferchoi)        |           [teetee6](https://github.com/teetee6)           | [brother1](https://github.com/brother1-4752) |
| ![](https://avatars.githubusercontent.com/u/37893979?v=4) | ![](https://avatars.githubusercontent.com/u/126330595?v=4) | ![](https://avatars.githubusercontent.com/u/122959190?v=4) | ![](https://avatars.githubusercontent.com/u/74041004?v=4) | ![](https://avatars.githubusercontent.com/u/17748068?v=4) |            ![](https://avatars.githubusercontent.com/u/60454376?v=4)          |
|                 디자인 및 README             |              검색어 키보드 탐색 기능            |                            검색어 캐싱 기능                            |         검색 API 호출 횟수 감소 전략               |               프로젝트 배포                         |                프로젝트 셋팅                 |

<br />


## [📋 협업 컨벤션](https://www.notion.so/brotherone/5-fd85a49386724f34abe49a309e9b9e3e)

### 1. Husky && lint-staged (commitlint 적용)

### 2. Commit message

| Tag Name | Explanation                                                            |
| -------- | ---------------------------------------------------------------------- |
| build    | 시스템 또는 외부 종속성에 영향을 미치는 변경사항 (npm, yarn 레벨)      |
| chore    | 코드나 기능 변경 없는 단순 수정                                        |
| docs     | documentation 변경                                                     |
| feat     | 새로운 기능                                                            |
| fix      | 버그 수정                                                              |
| refactor | 버그를 수정하거나 기능을 추가하지 않는 코드 변경, 리팩토링             |
| style    | 코드 의미에 영향을 주지 않는 변경사항(formatting, colons, white space) |

### 3. Issue && PR 템플릿 통일

### 4. Git-flow branch전략(feat/세부기능 -> develop -> master)

<br />

### 🗂️ 폴더 구조

```
📦src
 ┣ 📂components
 ┃ ┗ 📂InputSearch
 ┃   ┗ 📜InputSearch.tsx 
 ┣ 📂constants
 ┃ ┣ 📜cacheInfo.ts
 ┃ ┗ 📜apiUrl.ts
 ┣ 📂apis
 ┃ ┣ 📜finderApi.ts
 ┃ ┗ 📜index.ts
 ┣ 📂service
 ┃ ┗ 📜cacheStorage.ts
 ┣ 📂types
 ┃ ┗ 📜recommend.ts
 ┣ 📜App.tsx
 ┗ 📜index.tsx
```


## 상세 기능 및 구현 방법

### API 호출별 로컬 캐싱 기능 + 검색바 컴포넌트

![Sep-08-2023 20-26-27](https://github.com/wanted-pre-onboarding-12th-team-5/pre-onboarding-12th-3-5/assets/37893979/c2b57fdf-a2ab-40b8-9072-6a9c52d5b40c)

- LocalStorage는 동기식이며 기본 스레드를 차단하므로 사용을 피해야 하고, 약 5MB로 제한되며 문자열만 포함할 수 있지만, Cache Storage API의 경우 많이 저장할 수 있으며 적어도 수백 MB, 경우에 따라 수 GB 이상까지도 될 수 있기 때문에 Cache Storage를 사용했습니다.
- api를 통해 데이터를 저장할 때 cache storage를 통해 사용할 키와 데이터를 입력받고, 데이터를 캐시에 저장 후 추가로 header에 만료일을 현재 시간에 정해둔 시간을 더해 설정해줘서 api를 호출할 때 특정 키로 저장된 데이터를 확인하고, 데이터가 있다면 그 데이터의 만료일을 현재 시간과 비교한 후 만료 되었다면 해당 키를 자동으로 삭제한 후 데이터를 반환해줍니다.

<details>
  
<summary>코드보기</summary>
  
```ts
    export const getCacheData = async (debouncedValue: string) => {
      try {
        const cacheStorage = await caches.open(CACHE_NAME);
        const cachedResponse = await cacheStorage.match(debouncedValue);
        if (cachedResponse) {
          const expirationTime = Number(cachedResponse.headers.get('Expiration'));
          if (expirationTime && expirationTime < Date.now()) {
            await cacheStorage.delete(debouncedValue);
          }
          return await cachedResponse.json();
        } else {
          return false;
        }
      } catch (error) {
        console.error('Cache Data Error : ', error);
        return false;
      }
    };
    
    export const setCacheData = async (debouncedValue: string, response: RecommendType[]) => {
      if (debouncedValue.length > 0) {
        const cache = await caches.open(CACHE_NAME);
        const expirationTime = Date.now() + CACHE_EXPIRATION_TIME;
        const init = {
          headers: {
            'Content-Type': 'application/json',
            Expiration: expirationTime.toString(),
          },
        };
        const CachedData = new Response(JSON.stringify(response), init);
        await cache.put(debouncedValue, CachedData);
      }
    };
```

</details>

<br />

### API 호출 횟수 줄이기 전략

```ts
useEffect(() => {
  const timerId = setTimeout(() => {
    fetchRecommendations();
  }, 500);
  return () => {
    clearTimeout(timerId);
  };
}, [inputValue]);
```

- 캐시 스토리지를 이용하여 캐시를 저장하는 방식으로 호출을 줄일 수 있었고, debouncing 을 사용하여 입력값이 변할 때마다 API를 호출하는 것이 아닌, 일정 시간이 지난 후 단 한 번만 API를 호출할 수 있도록 하였습니다.
- Debouncing은 `useEffect` 내부에서 `setTimeout`을 걸고, 이벤트가 발생할 때마다 `clearTimeout` 을 발동하여 이전 이벤트가 지워지도록 하는 기법입니다.

<br />

### 키보드로 추천 검색어 이동 기능

![Sep-08-2023 20-34-10](https://github.com/wanted-pre-onboarding-12th-team-5/pre-onboarding-12th-3-5/assets/37893979/e21d8b8e-f1ad-4088-a1ad-136e561bbed9)

```ts
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      if (selected > 0) {
        event.preventDefault();
        setSelected((prevSelected) => prevSelected - 1);
      }
    } else if (event.key === 'ArrowDown' && selected < recommend.length - 1) {
      event.preventDefault();
      setSelected((prevSelected) => prevSelected + 1);
    }
  };
```

- input 태그에 keyDown 이벤트를 설정하여 상하 버튼이 눌릴 때마다 인덱스를 변화시켜 주는 방식으로 추천 검색어 이동 기능을 구현하였습니다.

```ts
  useEffect(() => {
    const selectedElement = document.querySelector('.selected');
    if (selectedElement) {
      selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selected]);
```

- scrollIntoView 를 이용하여 스크롤이 같이 내려가거나 올라갈 수 있도록 구현하였습니다.
