import {isWindowLoaded} from "@util/func/validation/IsWindowLoaded";

export const removeIamportPaymentWindow = ():void => {
    if (!isWindowLoaded()) return;
    document.body.style.cssText = '';
    const iamportDialog = document.body.querySelector(`.imp-dialog`) as HTMLElement;
    if(!iamportDialog) return;
    iamportDialog.innerHTML = '';
    iamportDialog.style.cssText = 'display:none !important';
}
