

export const global_reviewStateType = [
  {ENG:'ALL',KOR:'전체'},
  {ENG:'REQUEST',KOR:'요청'},
  {ENG:'RETURN',KOR:'반려'},
  {ENG:'APPROVAL',KOR:'승인'},
  {ENG:'ADMIN',KOR:'관리자'},
]

export const reviewStatusOnMemberPage = {
  REQUEST:'REQUEST',
  RETURN:'RETURN',
  APPROVAL:'APPROVAL',
  ADMIN:'ADMIN',
  KOR: {
    REQUEST:'승인대기',
    RETURN:'반려됨',
    APPROVAL:'적립금 지급완료',
    ADMIN:'관리자 리뷰',
  }
}