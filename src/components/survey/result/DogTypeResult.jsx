import React from 'react';
import s from './dogTypeResult.module.scss';
import Height from '/public/img/survey/height.png';

const dummyData = {
  dogType: '고든 세터',
  keyword: '자신감 있는/다정한/대담한',
  minHeight: 58,
  maxHeight: 68,
  minWeight: 24,
  maxWeight: 36,
  lifeExpectancy: '12-13',
  familyAffection: 5,
  childrenInteraction: 3,
  friendliness: 3,
  shedding: 3,
  groomingFrequency: 2,
  droolingLevel: 4,
  furType: '이중모',
  furLength: '중간',
  sociability: 3,
  playfulness: 3,
  guardingStance: 4,
  adaptability: 4,
  trainability: 5,
  activityLevel: 5,
  barkingFrequency: 3,
  mentalStimulationNeeds: 4,
  health:
    '고든은 일반적으로 건강한 개이지만, 갑작스럽고 생명을 위협하는 위장 상태인 부풀음이 이 품종에서 발생할 수 있다는 점을 인지해야 할 몇 가지 우려 사항이 있습니다. 고든 소유자는 복부 팽만감의 징후와 이러한 증상이 발생할 경우 어떻게 해야 하는지를 배워야 합니다. 암은 모든 품종에서 노견의 가장 흔한 사망 원인입니다. Gordons에서 더 널리 퍼진 특정 유형의 암은 없습니다. 어린 개가 암으로 죽는 것은 드문 일입니다. 책임 있는 육종가는 팔꿈치 및 고관절 이형성증 및 눈 상태에 대한 검사와 다양한 건강 관련 문제에 대한 DNA 검사를 포함하여 품종이 걸리기 쉬운 상태에 대해 가축을 테스트합니다.',
  recommendedHealthTests:
    '고관절 평가Hip Evaluation 진행성 망막 위축, 간상체 이형성증 4(PRA-rcd4) - DNA 테스트 Progressive Retinal Atrophy, Rod-Cone Dysplasia 4 (PRA-rcd4) - DNA Test CHIC DNA 저장소 CHIC DNA Repository 팔꿈치 평가 Elbow Evaluation 안과의사 평가 Ophthalmologist Evaluation',
  grooming:
    '엉킴을 방지하려면 적어도 매주 브러싱하는 것이 필수적입니다. 매달 목욕하는 것이 좋습니다. 건조한 피부와 비듬은 목욕과 컨디셔닝으로 예방할 수 있습니다.',
  exercise:
    '그들의 유전적 구성은 달리기에 대한 추진력을 요구하므로 운동이 필요합니다. 아파트에 거주할 수도 있지만 그렇다면 매일 운동이 필요하며, 이는 개와 함께 걷기, 조깅, 자전거 타기 등으로 충족할 수 있습니다. 뛰어다닐 수 있는 마당이 있으면 스스로 운동을 하게 되지만, 고든은 결속된 주인과 함께 무언가를 하는 것이 항상 가장 행복할 것입니다.',
  training:
    "몇 가지 간단한 인명 구조 훈련 명령이 필수입니다. 강아지나 개는 '오세요'라는 명령을 알고 부르면 오도록 훈련을 받아야 합니다. 그의 이름을 알고 응답하기 위해; 그리고 '아니요'라는 말에 순종하는 것입니다. 고든은 완고하지만 매우 부드럽고 사랑이 많으며 주인을 기쁘게 하기 위해 삽니다. 그들은 매우 똑똑하고 빨리 배웁니다. 가장 좋은 훈련은 할 일을 갖는 것이고, 그들이 가질 수 있는 가장 좋은 직업은 훈련을 받든 재미있게 놀든 주인과 함께 시간을 보내는 것입니다. 이들은 가족과 긴밀하게 유대관계를 맺고 함께 있기 위해 생활하지만, 가족이 떨어져 있을 때는 혼자 있어도 괜찮습니다. 고든 강아지에게는 조기 사회화 및 강아지 훈련 수업이 권장되며, 이들이 잘 적응하고 예의바른 반려견으로 성장할 수 있도록 도와줍니다.",
  nutritionIntake:
    '고든 세터에게 단백질 함량이 높은(26% 이상) 식단을 먹이는 것은 권장되지 않습니다. 급격한 성장을 강요하면 건강 문제가 발생할 수 있기 때문입니다. 단단한 변을 위해서는 섬유질 함량이 최소 4% 이상인 것이 가장 좋습니다. 고품질 건사료, 습식사료, 그리고 원한다면 닭고기, 연어, 과일, 조리된 신선한 야채와 같은 소량의 건강에 좋은 첨가물을 먹이십시오.',
  _links: {
    self: {
      href: 'http://localhost:8080/api/dogs/commonDogInfo',
    },
  },
};

export default function DogTypeResult({ info, dogInfo }) {
  console.log('dogInfo', dogInfo);
  console.log('info', info);

  const keywords = dummyData.keyword
    .replace(/\s/g, '')
    .split('/')
    .map((keyword) => `#${keyword}`)
    .join(' ');

  return (
    <div className={s.dog_type_container}>
      <div className={s.last_survey_date}>
        {info.lastSurveyDate} 설문 결과 입니다
      </div>
      <div className={s.dog_name_type}>
        <span>{info.myDogName}</span> (이)는 <span>{dogInfo.dogType}</span>{' '}
        (이)군요 !
      </div>
      <div className={s.dog_type_keyword}>
        {dogInfo.dogType} (과)와 어울리는 키워드는 <span>{keywords}</span>{' '}
        이에요! <br />
        {dogInfo.dogType} 견종에 대한 정보를 알려드릴게요! 본 자료는
        참고용으로만 확인해주세요 :)
      </div>
      {/* 키, 몸무게, 질병 */}
      <div className={s.dog_physical_info_box}></div>
      <br />
      <div className={s.dog_physical_info_box}></div>
      <br />
      <div className={s.dog_physical_info_box}></div>
      <br />
      <div className={s.dog_physical_info_box}></div>
    </div>
  );
}
