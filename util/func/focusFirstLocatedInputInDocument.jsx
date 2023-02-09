export const focusFirstLocatedInputInDocument = () => {
  const firstInput = document.body.querySelector( 'input' );
  firstInput.focus();
};
