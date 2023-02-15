// export const defaultTerms = {
//     "Spri S1": 1,
//     "Freshman S2": 2,
//     "Sophomore S1": 3,
//     "Sophomore S2": 4,
//     "Junior S1": 5,
//     "Junior S2": 6,
//     "Senior S1": 7,
//     "Senior S2": 8,
// };

// export type Keys = keyof typeof defaultTerms;

export type Keys = "Freshman S1" | "Freshman S2" | "Sophomore S1" | "Sophomore S2" | "Junior S1" | "Junior S2" | "Senior S1" | "Senior S2";
export type StatusFromUnion = {
    [key in Keys]: string;
};