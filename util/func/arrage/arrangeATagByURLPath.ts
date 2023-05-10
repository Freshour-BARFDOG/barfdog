import {filter_originFromURL} from "@util/func/filter_originFromURL";

type Atag = {href:string};
type ATagList = Atag[];

export const arrangeATagByURLPath = (aTagList: ATagList, originPath:string) => {
    if (!Array.isArray(aTagList) || aTagList.length === 0) return;
    aTagList.forEach((atag, i) => {
        const path = filter_originFromURL(atag.href);

        // Condition: 완전 일치 1순위
        if (path === originPath) {
            const item = aTagList.splice(i, 1)[0];
            aTagList.splice(0, 0, item);
        } else {
            // TODO: Condition: 길이가 길 경우 2순위
        }
    });
    return aTagList;
};
