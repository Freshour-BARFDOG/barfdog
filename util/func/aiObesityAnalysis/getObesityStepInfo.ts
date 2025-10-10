import { OBESITY_BCS_COLORS, OBESITY_GROUP_INFO } from "constants/aiObesityAnalysis";

/**
 * 비만도 단계별 정보를 반환하는 함수
 * @param step - 비만도 단계 (1-9)
 * @returns 단계별 label과 color 정보
 */
export interface ObesityStepInfo {
  label: string;
  imageColor: string;
  chipsColor: string;
  category: 'danger' | 'warning' | 'normal';
}

export const getObesityStepInfo = (step: number): ObesityStepInfo => {
  // 단계별 카테고리 매핑
  const stepCategoryMap: Record<number, 'danger' | 'warning' | 'normal'> = {
    1: 'danger',
    2: 'warning',
    3: 'warning',
    4: 'normal',
    5: 'normal',
    6: 'normal',
    7: 'warning',
    8: 'warning',
    9: 'danger',
  };

  // 카테고리별 정보 매핑
  const categoryInfo: Record<'danger' | 'warning' | 'normal', { 
    label: string; 
    imageColor: string; 
    chipsColor: string; 
  }> = {
    ...OBESITY_BCS_COLORS,
  };

  const category = stepCategoryMap[step];
  
  if (!category) {
    throw new Error(`유효하지 않은 단계입니다: ${step}. 1-9 사이의 값을 입력해주세요.`);
  }

  const info = categoryInfo[category];

  return {
    label: info.label,
    imageColor: info.imageColor,
    chipsColor: info.chipsColor,
    category,
  };
};


/**
 * 단계별로 노출할 앞뒤 단계들을 반환하는 함수
 * @param step - 현재 단계 (1-9)
 * @returns 노출할 단계들의 배열
 */
export const getObesityStepRange = (step: number): number[] => {
  if (step < 1 || step > 9) {
    throw new Error(`유효하지 않은 단계입니다: ${step}. 1-9 사이의 값을 입력해주세요.`);
  }

  switch (step) {
    case 1:
      return [2, 3]; // 1단계: 2, 3
    case 9:
      return [7, 8]; // 9단계: 7, 8
    default:
      // 2단계~8단계: 앞, 뒤단계
      return [step - 1, step + 1];
  }
};


/**
 * 단계별 그룹 정보를 반환하는 함수
 * @param step - 비만도 단계 (1-9)
 * @returns 해당 단계가 속한 그룹의 정보
 */
export const getObesityGroupInfo = (step: number) => {
  if (step < 1 || step > 9) {
    throw new Error(`유효하지 않은 단계입니다: ${step}. 1-9 사이의 값을 입력해주세요.`);
  }

  // 단계가 속한 그룹 찾기
  for (const [groupKey, groupInfo] of Object.entries(OBESITY_GROUP_INFO)) {
    if (groupInfo.steps.includes(step)) {
      return {
        groupKey: groupKey as keyof typeof OBESITY_GROUP_INFO,
        ...groupInfo,
      };
    }
  }

  throw new Error(`단계 ${step}에 대한 그룹 정보를 찾을 수 없습니다.`);
};