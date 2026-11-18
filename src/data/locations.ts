export type CityId =
  | 'seoul'
  | 'suwon'
  | 'incheon'
  | 'daejeon'
  | 'daegu'
  | 'gwangju'
  | 'busan'
  | 'jeju';

export interface SubRegion {
  id: string;
  name: string;
  gu?: string; // Used for Seoul dongs so users can optionally filter by 구
  lat: number;
  lon: number;
}

export interface CityInfo {
  id: CityId;
  name: string;
  subLabel: string;
  subRegions: SubRegion[];
}

export const SEOUL_DISTRICTS = [
  '전체',
  '종로구',
  '중구',
  '용산구',
  '성동구',
  '광진구',
  '동대문구',
  '중랑구',
  '성북구',
  '강북구',
  '도봉구',
  '노원구',
  '은평구',
  '서대문구',
  '마포구',
  '양천구',
  '강서구',
  '구로구',
  '금천구',
  '영등포구',
  '동작구',
  '관악구',
  '서초구',
  '강남구',
  '송파구',
  '강동구',
] as const;

export const CITIES: CityInfo[] = [
  {
    id: 'seoul',
    name: '서울',
    subLabel: '동 선택',
    subRegions: [
      // 종로구
      { id: 'seoul-sajik', name: '사직동', gu: '종로구', lat: 37.5761, lon: 126.9689 },
      { id: 'seoul-samcheong', name: '삼청동', gu: '종로구', lat: 37.5849, lon: 126.9817 },
      { id: 'seoul-jongno1', name: '종로1가동', gu: '종로구', lat: 37.5702, lon: 126.9830 },
      { id: 'seoul-hyehwa', name: '혜화동', gu: '종로구', lat: 37.5867, lon: 127.0017 },
      // 중구
      { id: 'seoul-myeong', name: '명동', gu: '중구', lat: 37.5636, lon: 126.9849 },
      { id: 'seoul-euljiro', name: '을지로동', gu: '중구', lat: 37.5665, lon: 126.9910 },
      { id: 'seoul-sindang', name: '신당동', gu: '중구', lat: 37.5625, lon: 127.0156 },
      // 용산구
      { id: 'seoul-itaewon', name: '이태원동', gu: '용산구', lat: 37.5345, lon: 126.9946 },
      { id: 'seoul-hannam', name: '한남동', gu: '용산구', lat: 37.5352, lon: 127.0055 },
      { id: 'seoul-ichon', name: '이촌동', gu: '용산구', lat: 37.5219, lon: 126.9736 },
      // 성동구
      { id: 'seoul-seongsu', name: '성수동', gu: '성동구', lat: 37.5446, lon: 127.0559 },
      { id: 'seoul-wangsimni', name: '왕십리동', gu: '성동구', lat: 37.5615, lon: 127.0377 },
      { id: 'seoul-geumho', name: '금호동', gu: '성동구', lat: 37.5484, lon: 127.0205 },
      // 광진구
      { id: 'seoul-hwayang', name: '화양동', gu: '광진구', lat: 37.5407, lon: 127.0715 },
      { id: 'seoul-jayang', name: '자양동', gu: '광진구', lat: 37.5342, lon: 127.0748 },
      { id: 'seoul-guui', name: '구의동', gu: '광진구', lat: 37.5418, lon: 127.0865 },
      // 동대문구
      { id: 'seoul-cheongnyangni', name: '청량리동', gu: '동대문구', lat: 37.5806, lon: 127.0468 },
      { id: 'seoul-hoegi', name: '회기동', gu: '동대문구', lat: 37.5898, lon: 127.0579 },
      { id: 'seoul-jangan', name: '장안동', gu: '동대문구', lat: 37.5715, lon: 127.0694 },
      // 중랑구
      { id: 'seoul-myeonmok', name: '면목동', gu: '중랑구', lat: 37.5886, lon: 127.0875 },
      { id: 'seoul-sangbong', name: '상봉동', gu: '중랑구', lat: 37.5963, lon: 127.0853 },
      { id: 'seoul-junghwa', name: '중화동', gu: '중랑구', lat: 37.6025, lon: 127.0794 },
      // 성북구
      { id: 'seoul-seongbuk', name: '성북동', gu: '성북구', lat: 37.5936, lon: 126.9984 },
      { id: 'seoul-anam', name: '안암동', gu: '성북구', lat: 37.5863, lon: 127.0293 },
      { id: 'seoul-gireum', name: '길음동', gu: '성북구', lat: 37.6034, lon: 127.0250 },
      // 강북구
      { id: 'seoul-mia', name: '미아동', gu: '강북구', lat: 37.6266, lon: 127.0263 },
      { id: 'seoul-suyu', name: '수유동', gu: '강북구', lat: 37.6380, lon: 127.0257 },
      { id: 'seoul-ui', name: '우이동', gu: '강북구', lat: 37.6552, lon: 127.0125 },
      // 도봉구
      { id: 'seoul-ssangmun', name: '쌍문동', gu: '도봉구', lat: 37.6484, lon: 127.0347 },
      { id: 'seoul-banghak', name: '방학동', gu: '도봉구', lat: 37.6675, lon: 127.0442 },
      { id: 'seoul-chang', name: '창동', gu: '도봉구', lat: 37.6531, lon: 127.0477 },
      // 노원구
      { id: 'seoul-sanggye', name: '상계동', gu: '노원구', lat: 37.6550, lon: 127.0613 },
      { id: 'seoul-junggye', name: '중계동', gu: '노원구', lat: 37.6502, lon: 127.0736 },
      { id: 'seoul-gongneung', name: '공릉동', gu: '노원구', lat: 37.6258, lon: 127.0729 },
      // 은평구
      { id: 'seoul-bulgwang', name: '불광동', gu: '은평구', lat: 37.6105, lon: 126.9298 },
      { id: 'seoul-galhyeon', name: '갈현동', gu: '은평구', lat: 37.6190, lon: 126.9173 },
      { id: 'seoul-eungam', name: '응암동', gu: '은평구', lat: 37.5974, lon: 126.9206 },
      // 서대문구
      { id: 'seoul-sinchon', name: '신촌동', gu: '서대문구', lat: 37.5598, lon: 126.9425 },
      { id: 'seoul-yeonhui', name: '연희동', gu: '서대문구', lat: 37.5683, lon: 126.9317 },
      { id: 'seoul-hongje', name: '홍제동', gu: '서대문구', lat: 37.5889, lon: 126.9442 },
      // 마포구
      { id: 'seoul-seogyo', name: '서교동', gu: '마포구', lat: 37.5553, lon: 126.9225 },
      { id: 'seoul-hapjeong', name: '합정동', gu: '마포구', lat: 37.5495, lon: 126.9138 },
      { id: 'seoul-yeonnam', name: '연남동', gu: '마포구', lat: 37.5658, lon: 126.9255 },
      { id: 'seoul-gongdeok', name: '공덕동', gu: '마포구', lat: 37.5432, lon: 126.9515 },
      // 양천구
      { id: 'seoul-mok', name: '목동', gu: '양천구', lat: 37.5261, lon: 126.8643 },
      { id: 'seoul-sinjeong', name: '신정동', gu: '양천구', lat: 37.5173, lon: 126.8562 },
      { id: 'seoul-sinwol', name: '신월동', gu: '양천구', lat: 37.5210, lon: 126.8325 },
      // 강서구
      { id: 'seoul-magok', name: '마곡동', gu: '강서구', lat: 37.5602, lon: 126.8255 },
      { id: 'seoul-hwagok', name: '화곡동', gu: '강서구', lat: 37.5416, lon: 126.8404 },
      { id: 'seoul-balsan', name: '발산동', gu: '강서구', lat: 37.5586, lon: 126.8376 },
      // 구로구
      { id: 'seoul-guro', name: '구로동', gu: '구로구', lat: 37.4955, lon: 126.8876 },
      { id: 'seoul-sindorim', name: '신도림동', gu: '구로구', lat: 37.5088, lon: 126.8913 },
      { id: 'seoul-gocheok', name: '고척동', gu: '구로구', lat: 37.5015, lon: 126.8632 },
      // 금천구
      { id: 'seoul-gasan', name: '가산동', gu: '금천구', lat: 37.4795, lon: 126.8826 },
      { id: 'seoul-doksan', name: '독산동', gu: '금천구', lat: 37.4666, lon: 126.8962 },
      { id: 'seoul-siheung', name: '시흥동', gu: '금천구', lat: 37.4519, lon: 126.9016 },
      // 영등포구
      { id: 'seoul-yeouido', name: '여의도동', gu: '영등포구', lat: 37.5219, lon: 126.9245 },
      { id: 'seoul-dangsan', name: '당산동', gu: '영등포구', lat: 37.5344, lon: 126.9022 },
      { id: 'seoul-yeongdeungpo', name: '영등포동', gu: '영등포구', lat: 37.5159, lon: 126.9076 },
      // 동작구
      { id: 'seoul-sadang', name: '사당동', gu: '동작구', lat: 37.4765, lon: 126.9816 },
      { id: 'seoul-noryangjin', name: '노량진동', gu: '동작구', lat: 37.5133, lon: 126.9422 },
      { id: 'seoul-sangdo', name: '상도동', gu: '동작구', lat: 37.5028, lon: 126.9477 },
      // 관악구
      { id: 'seoul-sillim', name: '신림동', gu: '관악구', lat: 37.4842, lon: 126.9297 },
      { id: 'seoul-bongcheon', name: '봉천동', gu: '관악구', lat: 37.4812, lon: 126.9527 },
      { id: 'seoul-nakseongdae', name: '낙성대동', gu: '관악구', lat: 37.4769, lon: 126.9636 },
      // 서초구
      { id: 'seoul-seocho', name: '서초동', gu: '서초구', lat: 37.4919, lon: 127.0079 },
      { id: 'seoul-banpo', name: '반포동', gu: '서초구', lat: 37.5049, lon: 127.0049 },
      { id: 'seoul-bangbae', name: '방배동', gu: '서초구', lat: 37.4814, lon: 126.9975 },
      { id: 'seoul-yangjae', name: '양재동', gu: '서초구', lat: 37.4842, lon: 127.0347 },
      // 강남구
      { id: 'seoul-yeoksam', name: '역삼동', gu: '강남구', lat: 37.5007, lon: 127.0365 },
      { id: 'seoul-samseong', name: '삼성동', gu: '강남구', lat: 37.5140, lon: 127.0565 },
      { id: 'seoul-apgujeong', name: '압구정동', gu: '강남구', lat: 37.5271, lon: 127.0285 },
      { id: 'seoul-daechi', name: '대치동', gu: '강남구', lat: 37.4946, lon: 127.0636 },
      { id: 'seoul-nonhyeon', name: '논현동', gu: '강남구', lat: 37.5110, lon: 127.0286 },
      // 송파구
      { id: 'seoul-jamsil', name: '잠실동', gu: '송파구', lat: 37.5133, lon: 127.1001 },
      { id: 'seoul-garak', name: '가락동', gu: '송파구', lat: 37.4925, lon: 127.1182 },
      { id: 'seoul-munjeong', name: '문정동', gu: '송파구', lat: 37.4859, lon: 127.1225 },
      { id: 'seoul-bangi', name: '방이동', gu: '송파구', lat: 37.5139, lon: 127.1205 },
      // 강동구
      { id: 'seoul-cheonho', name: '천호동', gu: '강동구', lat: 37.5387, lon: 127.1238 },
      { id: 'seoul-gil', name: '길동', gu: '강동구', lat: 37.5378, lon: 127.1400 },
      { id: 'seoul-myeongil', name: '명일동', gu: '강동구', lat: 37.5513, lon: 127.1440 },
    ],
  },
  {
    id: 'suwon',
    name: '수원',
    subLabel: '구 선택',
    subRegions: [
      { id: 'suwon-jangan', name: '장안구', lat: 37.3039, lon: 127.0102 },
      { id: 'suwon-gwonseon', name: '권선구', lat: 37.2576, lon: 126.9718 },
      { id: 'suwon-paldal', name: '팔달구', lat: 37.2825, lon: 127.0201 },
      { id: 'suwon-yeongtong', name: '영통구', lat: 37.2596, lon: 127.0465 },
    ],
  },
  {
    id: 'incheon',
    name: '인천',
    subLabel: '군·구 선택',
    subRegions: [
      { id: 'incheon-jung', name: '중구', lat: 37.4737, lon: 126.6217 },
      { id: 'incheon-dong', name: '동구', lat: 37.4739, lon: 126.6432 },
      { id: 'incheon-michuhol', name: '미추홀구', lat: 37.4636, lon: 126.6503 },
      { id: 'incheon-yeonsu', name: '연수구', lat: 37.4102, lon: 126.6783 },
      { id: 'incheon-namdong', name: '남동구', lat: 37.4472, lon: 126.7314 },
      { id: 'incheon-bupyeong', name: '부평구', lat: 37.5070, lon: 126.7219 },
      { id: 'incheon-gyeyang', name: '계양구', lat: 37.5374, lon: 126.7377 },
      { id: 'incheon-seo', name: '서구', lat: 37.5454, lon: 126.6759 },
      { id: 'incheon-ganghwa', name: '강화군', lat: 37.7465, lon: 126.4879 },
      { id: 'incheon-ongjin', name: '옹진군', lat: 37.4465, lon: 126.6368 },
    ],
  },
  {
    id: 'daejeon',
    name: '대전',
    subLabel: '구 선택',
    subRegions: [
      { id: 'daejeon-dong', name: '동구', lat: 36.3120, lon: 127.4549 },
      { id: 'daejeon-jung', name: '중구', lat: 36.3258, lon: 127.4214 },
      { id: 'daejeon-seo', name: '서구', lat: 36.3554, lon: 127.3837 },
      { id: 'daejeon-yuseong', name: '유성구', lat: 36.3623, lon: 127.3561 },
      { id: 'daejeon-daedeok', name: '대덕구', lat: 36.3466, lon: 127.4153 },
    ],
  },
  {
    id: 'daegu',
    name: '대구',
    subLabel: '군·구 선택',
    subRegions: [
      { id: 'daegu-jung', name: '중구', lat: 35.8693, lon: 128.6062 },
      { id: 'daegu-dong', name: '동구', lat: 35.8866, lon: 128.6355 },
      { id: 'daegu-seo', name: '서구', lat: 35.8718, lon: 128.5591 },
      { id: 'daegu-nam', name: '남구', lat: 35.8461, lon: 128.5976 },
      { id: 'daegu-buk', name: '북구', lat: 35.8858, lon: 128.5829 },
      { id: 'daegu-suseong', name: '수성구', lat: 35.8581, lon: 128.6307 },
      { id: 'daegu-dalseo', name: '달서구', lat: 35.8299, lon: 128.5326 },
      { id: 'daegu-dalseong', name: '달성군', lat: 35.7747, lon: 128.4314 },
      { id: 'daegu-gunwi', name: '군위군', lat: 36.2428, lon: 128.5728 },
    ],
  },
  {
    id: 'gwangju',
    name: '광주',
    subLabel: '구 선택',
    subRegions: [
      { id: 'gwangju-dong', name: '동구', lat: 35.1460, lon: 126.9231 },
      { id: 'gwangju-seo', name: '서구', lat: 35.1520, lon: 126.8895 },
      { id: 'gwangju-nam', name: '남구', lat: 35.1329, lon: 126.9025 },
      { id: 'gwangju-buk', name: '북구', lat: 35.1742, lon: 126.9120 },
      { id: 'gwangju-gwangsan', name: '광산구', lat: 35.1396, lon: 126.7937 },
    ],
  },
  {
    id: 'busan',
    name: '부산',
    subLabel: '군·구 선택',
    subRegions: [
      { id: 'busan-jung', name: '중구', lat: 35.1066, lon: 129.0323 },
      { id: 'busan-seo', name: '서구', lat: 35.0979, lon: 129.0242 },
      { id: 'busan-dong', name: '동구', lat: 35.1293, lon: 129.0454 },
      { id: 'busan-yeongdo', name: '영도구', lat: 35.0912, lon: 129.0679 },
      { id: 'busan-busanjin', name: '부산진구', lat: 35.1631, lon: 129.0531 },
      { id: 'busan-dongnae', name: '동래구', lat: 35.2049, lon: 129.0837 },
      { id: 'busan-nam', name: '남구', lat: 35.1366, lon: 129.0842 },
      { id: 'busan-buk', name: '북구', lat: 35.1972, lon: 128.9903 },
      { id: 'busan-haeundae', name: '해운대구', lat: 35.1631, lon: 129.1636 },
      { id: 'busan-saha', name: '사하구', lat: 35.1045, lon: 128.9749 },
      { id: 'busan-geumjeong', name: '금정구', lat: 35.2430, lon: 129.0921 },
      { id: 'busan-gangseo', name: '강서구', lat: 35.2122, lon: 128.9806 },
      { id: 'busan-yeonje', name: '연제구', lat: 35.1764, lon: 129.0798 },
      { id: 'busan-suyeong', name: '수영구', lat: 35.1456, lon: 129.1132 },
      { id: 'busan-sasang', name: '사상구', lat: 35.1526, lon: 128.9912 },
      { id: 'busan-gijang', name: '기장군', lat: 35.2446, lon: 129.2223 },
    ],
  },
  {
    id: 'jeju',
    name: '제주',
    subLabel: '시 선택',
    subRegions: [
      { id: 'jeju-si', name: '제주시', lat: 33.4996, lon: 126.5312 },
      { id: 'jeju-seogwipo', name: '서귀포시', lat: 33.2541, lon: 126.5601 },
    ],
  },
];
