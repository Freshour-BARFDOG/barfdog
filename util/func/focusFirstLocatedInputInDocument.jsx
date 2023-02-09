export const focusFirstLocatedInputInDocument = () => {
  if(window && typeof window !== 'undefined') {
    const firstInput = document.body.querySelector( 'input[type="text"]' );
    firstInput && firstInput.focus();
  };
};
