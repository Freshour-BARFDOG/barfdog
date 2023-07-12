import {isWindowLoaded} from "@util/func/validation/IsWindowLoaded";

export const redirectTo = (url: string) => {
    if (!isWindowLoaded()) return;
    window.location.href = url;
};
