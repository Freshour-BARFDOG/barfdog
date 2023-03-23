export const filter_userIndexOnRewardName = (rewardName:string):string => {
  // ex. [친구초대] 초대한 친구 첫 구매 적립금(테스트유저/198)
  const rewardNameDivider = '(';
  if ( rewardName.indexOf( rewardNameDivider ) < 0 ) return rewardName;
  const n = rewardName.split( rewardNameDivider );
  const originRewardName = n[0];
  const userNameDivider = '/';
  if (  n[1].indexOf( userNameDivider ) < 0 ) return;
  const userName = n[1].split(userNameDivider)[0];
  return `${originRewardName} (${userName})`;
};
