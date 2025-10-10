import BCS1 from 'public/img/aiObesityAnalysis/bcs1.svg';
import BCS2 from 'public/img/aiObesityAnalysis/bcs2.svg';
import BCS3 from 'public/img/aiObesityAnalysis/bcs3.svg';
import BCS4 from 'public/img/aiObesityAnalysis/bcs4.svg';
import BCS5 from 'public/img/aiObesityAnalysis/bcs5.svg';
import BCS6 from 'public/img/aiObesityAnalysis/bcs6.svg';
import BCS7 from 'public/img/aiObesityAnalysis/bcs7.svg';
import BCS8 from 'public/img/aiObesityAnalysis/bcs8.svg';
import BCS9 from 'public/img/aiObesityAnalysis/bcs9.svg';

const LIFET_USERNAME = 'BARFDOG';
const LIFET_PASSWORD = 'QmFyZkRvRzIxNTEkIWE=';

const OBESITY_DEFAULT_COLOR = {
  imageColor: '#959595',
  backgroundColor: '#F8F9FB',
  borderColor: '#CCC',
};

const OBESITY_BCS_COLORS = {
  danger: {
    label: '위험',
    imageColor: '#E5696E',
    chipsColor: 'red',
  },
  warning: {
    label: '주의',
    imageColor: '#FFDD70',
    chipsColor: 'yellow500',
  },
  normal: {
    label: '정상',
    imageColor: '#78B5FF',
    chipsColor: 'blue500',
  },
};

const OBESITY_BCS = {
  1: {
    title: '극도로 마름',
    description: '갈비뼈, 척추, 골반뼈가 두드러지게 보이고 복부가 심하게 들어감',
    image: BCS1,
  },
  2: {
    title: '매우 마름',
    description: '갈비뼈와 허리선이 뚜렷하고 복부가 지나치게 움푹 들어감',
    image: BCS2,
  },
  3: {
    title: '마름',
    description: '갈비뼈 사이사이가 잘 느껴지고 복부가 잘록해 허리가 잘 구분됨',
    image: BCS3,
  },
  4: {
    title: '약간 마름',
    description: '갈비뼈가 쉽게 만져지며 허리선과 복부의 굴곡이 뚜렷함',
    image: BCS4,
  },
  5: {
    title: '정상체중',
    description: '갈비뼈 사이가 적당한 지방으로 덮여 있고 허리와 복부가 자연스럽게 구분됨',
    image: BCS5,
  },
  6: {
    title: '약간 과체중',
    description: '갈비뼈를 만지기 어렵고 허리선이 흐릿하고 복부가 약간 처짐',
    image: BCS6,
  },
  7: {
    title: '과체중',
    description: '갈비뼈가 잘 느껴지지 않고 위에서 볼 때 허리 구분이 거의 없음',
    image: BCS7,
  },
  8: {
    title: '비만',
    description: '갈비뼈 사이 굴곡이 거의 느껴지지 않고 복부가 크게 처지고 허리선이 없음',
    image: BCS8,
  },
  9: {
    title: '고도 비만',
    description: '전신에 지방이 축적되어 갈비뼈와 허리, 복부 구분이 전혀 불가능함',
    image: BCS9,
  },
}

// 단계별 그룹화된 정보
const OBESITY_GROUP_INFO = {
  underweight: {
    title: '조금 더 살이 붙어야 건강해요!',
    description: '이 단계의 아이들은 체중이 많이 부족한 상태예요. 체력이 떨어져 있거나, 다른 질환이 있을 가능성도 있으니 가장 먼저 수의사와 상담해 주세요.',
    tags: ['고열량 식단', '기저질환 검사', '점진적 증량'],
    steps: [1, 2, 3],
    tips: [
      '소화가 잘 되는 고열량·고단백 식단을 소량씩 자주 급여해 주세요.',
      '너무 활발하게 움직이기보다는 충분한 휴식이 필요해요.',
      '기저 질환(장염, 흡수장애 등)이 의심된다면 건강검진도 함께 받아보는 게 좋아요.',
    ]
  },
  normal: {
    title: '지금처럼만 잘 유지해 주세요!',
    description: '이 단계의 아이들은 정상에 가까워요. 크게 걱정할 정도는 아니지만, 지금의 균형을 잘 유지하는 게 중요해요.',
    tags: ['식단밸런스', '체형유지', '생활리듬유지'],
    steps: [4, 5, 6],
    tips: [
      '하루 급여량과 간식 양을 규칙적으로 관리해 주세요.',
      '아이가 좋아하는 산책이나 놀이 시간을 꾸준히 유지하는 게 좋아요.',
      '체형에 변화가 느껴진다면 사료 종류나 양을 조절해보는 것도 방법이에요.',
    ]
  },
  overweight: {
    title: '조금씩 천천히, 건강하게 변화해봐요!',
    description: '이 단계의 아이들은 과체중에서 고도비만에 해당하는 상태로, 관절, 심장, 호흡기 등에 부담을 줄 수 있어요. 체중 조절은 서두르기보다, 천천히 그리고 꾸준하게 접근하는 것이 중요해요.',
    tags: ['저칼로리식', '꾸준한운동', '다이어트필요'],
    steps: [7, 8, 9],
    tips: [
      '체중 감량 계획을 세워야 해요',
      '사료는 저지방·고섬유질 제품으로 바꾸고, 간식은 꼭 필요한 경우만 주세요.',
      '매일 일정 시간, 산책이나 장난감 놀이로 활동량을 늘려주세요.',
    ]
  },
}

// 환경별 추천 아이템 ID
const OBESITY_RECOMMEND_ITEMS = {
  develop: [54, 12, 28, 13],
  production: [54, 12, 34, 13],
} as const;

/**
 * 현재 환경에 따른 추천 아이템 ID를 반환하는 함수
 * @returns 환경별 아이템 ID 배열
 */
const getRecommendItemIds = (): number[] => {
  const nodeEnv = process.env.NODE_ENV as keyof typeof OBESITY_RECOMMEND_ITEMS;
  
  // 환경 변수가 명시적으로 설정된 경우 해당 값 사용
  if (nodeEnv && OBESITY_RECOMMEND_ITEMS[nodeEnv]) {
    return [...OBESITY_RECOMMEND_ITEMS[nodeEnv]];
  }
  
  // 기본값은 develop 환경
  return [...OBESITY_RECOMMEND_ITEMS.develop];
};

/**
 * 환경별 아이템 ID를 직접 설정하는 함수 (테스트용)
 * @param env - 환경 ('develop' | 'production')
 * @returns 해당 환경의 아이템 ID 배열
 */
const getRecommendItemIdsByEnv = (env: keyof typeof OBESITY_RECOMMEND_ITEMS): number[] => {
  return [...OBESITY_RECOMMEND_ITEMS[env]];
};

export{
  LIFET_USERNAME,
  LIFET_PASSWORD,
  OBESITY_DEFAULT_COLOR,
  OBESITY_BCS_COLORS,
  OBESITY_BCS,
  OBESITY_GROUP_INFO,
  OBESITY_RECOMMEND_ITEMS,
  getRecommendItemIds,
  getRecommendItemIdsByEnv,
}