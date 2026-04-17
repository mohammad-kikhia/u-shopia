// get the direction of the text based on the first written character..
// comes in handy for inputs and other things
export function getTextDirection(text: string) {
  const firstChar = text.charAt(0);
  // arabic characters!!!!! "hopefully"
  const arabic = /[\u0600-\u06FF]/;
  return arabic.test(firstChar) ? 'rtl' : 'ltr';
}
