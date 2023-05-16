export const filter_multipleSpaces = (string:string) => {
    if (typeof string !== 'string') throw new Error("Paramter type must be string!");
    return string.trim().split(" ").filter(v => v.trim().length).join(" ")
};
