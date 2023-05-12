import {filterObjectValues} from "@util/func/filter/filterTypeFromObejct";

export const generateSearchQuerybySearchValues = (searchValues:object, typeObject:object):string => {
    const queryArr = [];
    for (const key in searchValues) {
        let val = searchValues[key];
        if (val === "ALL") {
            val = filterObjectValues(typeObject).join(",");
        }
        queryArr.push(`${key}=${val}`);
    }

    return `${queryArr.join('&')}`;
}
