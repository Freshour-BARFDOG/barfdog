export const filterObjectKeys = (typeObject) => Object.keys(typeObject).filter(type => type !== "KOR");
export const filterObjectValues = (typeObject) => Object.values(typeObject).filter(val => typeof val !== "object" );
