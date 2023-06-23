import {isWindowLoaded} from "@util/func/validation/IsWindowLoaded";

export const removeIamportPaymentWindow = ():void => {
    if (!isWindowLoaded()) return;
    document.body.style.cssText = '';
    const iamportDialog = document.body.querySelector(`.imp-dialog`) as HTMLElement;
    iamportDialog.innerHTML = '';
    iamportDialog.style.cssText = 'display:none !important';
}
