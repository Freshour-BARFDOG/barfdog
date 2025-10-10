import { general_itemType, itemTypeOption } from "@store/TYPE/itemType";

const communityOptions = [
  {
    label: '공지사항',
    value: '/community/notice',
  },
  {
    label: '이벤트',
    value: '/community/event',
  },
  {
    label: '블로그',
    value: '/community/blog',
  },
  {
    label: '어바웃',
    value: '/community/about',
  },
];

const menuList = [
    {
      title: '샵',
      link: `/shop?itemType=${general_itemType.ALL}`,
      subMenu: itemTypeOption.map(type => (
        {
          title: type.label,
          link: `/shop?itemType=${type.value}`,
        }
      )),
    },
    {
      title: '비만 AI 진단',
      link: '/ai-obesity-analysis',
    },
    {
      title: '레시피',
      link: '/recipes',
    },
    {
      title: '커뮤니티',
      link: '/community/notice',
      subMenu: communityOptions.map(option => (
        {
          title: option.label,
          link: option.value,
        }
      )),
    },
    {
      title: '리뷰',
      link: '/review',
    },
  ];

export {
  communityOptions,
  menuList,
}