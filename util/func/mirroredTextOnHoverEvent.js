export const MirroredTextOnHoverEvent = (window) => {
  console.log('실행');
  if ( !window || typeof window === 'undefined' ) return;
  const targets = document.querySelectorAll( '.cont ul li span' );
  targets.forEach( (t) => {
    const boxWidth = t.clientWidth;
    const originalText = t.innerText
    const cssProps = getCanvasFont( t );
    const textWidth = getTextWidth( originalText, cssProps );
    if ( boxWidth >= textWidth ) return;
    // console.log("\nBoxWidth: "  +boxWidth + "\nTEXTWidth:"+  textWidth);
    
    
    let timer;
    t.addEventListener( "mouseenter", function () {
      if ( timer ) return;
      const delay = 500;
      timer = setTimeout( () => createMirrorText( t, originalText ), delay );
    } );
    
    t.addEventListener( "mouseleave", function () {
      if ( timer ) {
        clearTimeout( timer );
        removeMirrorText( t, originalText );
        timer = null; // 타이머 초기화
      }
      
    } );
  } )
}
const createMirrorText = (box, originalText) => {
  const hasChild = box.querySelectorAll( 'em' ).length;
  if ( hasChild ) return;
  box.innerText = ""; // 글자넘침으로 인해 숨김처리
  box.style.position = "relative";
  box.style.overflow = "initial";
  const additionalWidth = 40;
  const boxWidth = box.clientWidth + additionalWidth;
  const styles = {
    position: "absolute",
    left: "50%",
    top: "50%",
    backgroundColor: "#000",
    color: "#fff",
    padding: "4px 8px",
    boxSizing: "border-box",
    transform: "translate(-50%, -50%)",
    borderRadius: "10px",
    wordBreak: "break-all",
    width: boxWidth + 'px',
    zIndex: "10",
    
  }
  const child = document.createElement( 'em' );
  child.innerText = originalText;
  Object.assign( child.style, styles )
  box.append( child );
}
const removeMirrorText = (box, originalText) => {
  const child = box.querySelectorAll( 'em' );
  child.forEach( c => c.remove() );
  box.style.position = "";
  box.style.overflow = "";
  box.innerText = originalText;
}

function getTextWidth (text, fontStyles) {
  // re-use canvas object for better performance
  const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement( "canvas" ));
  const context = canvas.getContext( "2d" );
  context.font = fontStyles;
  const metrics = context.measureText( text );
  return metrics.width;
}

function getCanvasFont (el = document.body) {
  const fontWeight = getCssStyle( el, 'font-weight' ) || 'normal';
  const fontSize = getCssStyle( el, 'font-size' ) || '16px';
  const fontFamily = getCssStyle( el, 'font-family' ) || 'Times New Roman';
  
  return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function getCssStyle (element, prop) {
  return window.getComputedStyle( element, null ).getPropertyValue( prop );
}
