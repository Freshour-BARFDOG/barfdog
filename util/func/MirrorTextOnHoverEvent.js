export const MirrorTextOnHoverEvent = (window) => {
  if (!window || typeof window === 'undefined') return;
  // Target identification via <ul> tag & 'table_body' class name
  const targets = document.querySelectorAll('ul.table_body li span');
  
  targets.forEach((t) => {
    const originalText = t.innerText;
    if (isTextOverflowing(t)) return;
    createOriginalTextWrapper(t, originalText);

    let TIMER;
    let mirrorTextName = 'mirrorText'; // Identification for creating and removing mirror text
    t.addEventListener('mouseenter', function () {
      if (TIMER) return;
      const delay = 500;
      TIMER = setTimeout(
        () => createMirrorText(t, originalText, mirrorTextName),
        delay,
      );
    });

    t.addEventListener('mouseleave', function () {
      if (TIMER) {
        removeMirrorText(t, mirrorTextName);
        // Reset and remove TIMER
        clearTimeout(TIMER);
        TIMER = null;
      }
    });
  });
};


const createOriginalTextWrapper = (box, ogText) => {
  // Set wrapper props & CSS style
  box.innerHTML = ''; // clear innerHTML
  box.className = 'mirrorBoxWrapper';
  const boxStyles = {
    overflow: 'initial',
    position: 'relative',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    justifyContent: 'flex-start',
  };
  Object.assign(box.style, boxStyles);

  // Copy original text as child
  const ogtw = document.createElement('em');
  ogtw.className = 'ogText';
  ogtw.innerText = ogText;
  const ogtwStyles = {
    overflow: 'hidden',
    witdh: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  Object.assign(ogtw.style, ogtwStyles);

  // Append on BOX
  box.append(ogtw);
};

const createMirrorText = (box, ogText, mirrorTextName) => {
  // Validation for avoid duplication
  const mirrorTexts = box.querySelectorAll(`em.${mirrorTextName}`);
  const hasChild = mirrorTexts.length;
  if (hasChild) return;

  // Set CSS style
  const child = document.createElement('em');
  child.innerText = ogText;
  child.className = mirrorTextName;
  const additionalWidth = 40;
  const boxWidth = box.clientWidth + additionalWidth;
  const styles = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    backgroundColor: '#000',
    color: '#fff',
    padding: '4px 8px',
    boxSizing: 'border-box',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    wordBreak: 'break-all',
    width: `${boxWidth}px`,
    zIndex: '10',
    whiteSpace: 'initial',
  };
  Object.assign(child.style, styles);

  // Append on BOX
  box.append(child);
};

const removeMirrorText = (box, mirrorTextName) => {
  const mirrorTexts = box.querySelectorAll(`em.${mirrorTextName}`);
  mirrorTexts.forEach((c) => c.remove());
};



const isTextOverflowing = (box) => {
  const boxWidth = box.clientWidth;
  const cssProps = getCanvasFont(box);
  const originalText = box.innerText;
  const textWidth = getTextWidth(originalText, cssProps);
  
  return boxWidth >= textWidth;
  
};

function getTextWidth(text, fontStyles) {
  // re-use canvas object for better performance
  const canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement('canvas'));
  const context = canvas.getContext('2d');
  context.font = fontStyles;
  const metrics = context.measureText(text);
  return metrics.width;
}

function getCanvasFont(el = document.body) {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
  const fontSize = getCssStyle(el, 'font-size') || '16px';
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

  return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function getCssStyle(element, prop) {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
}
