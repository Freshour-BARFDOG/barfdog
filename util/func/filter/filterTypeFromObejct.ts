type TargetsType = {
    targets: string[];
};

export const filterObjectKeys = (typeObject, option:TargetsType={targets:[]} ) =>
    Object.keys(typeObject).filter(key=>
        key !== "KOR"
        && (option.targets?.length > 0 ? option.targets.indexOf(key) < 0 : true)
    );
export const filterObjectValues = (typeObject, option:TargetsType={targets:[]} ) =>
    Object.values(typeObject).filter(val =>
        typeof val === "string"
        && (option.targets?.length > 0 ? option.targets.indexOf(val) < 0 : true)
    );
