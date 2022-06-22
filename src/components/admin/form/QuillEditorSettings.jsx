

export const formats = [
  'header',
  // "font",
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'align',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'background',
  'color',
  'link',
  'image',
  'video',
  'width',
];


export const toolbarOptions = [
  [{header: [false, 6, 5, 4, 3, 2, 1]}],
  [{size: ['small', false, 'large', 'huge']}],
  [{color: []}, {background: []}],
  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{align: []}],
  [{indent: '-1'}, {indent: '+1'}, {list: 'ordered'}, {list: 'bullet'}],
  ['link', 'image'],
  ['clean'],
];