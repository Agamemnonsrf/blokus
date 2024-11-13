export const GRID_SIZE = 20;

export const OUTER_GRID_SIZE = 40;
export const CELL_SIZE = 20;

enum Polyominoes {
    monomino = "1000000000000000000000000",
    domino = "1000010000000000000000000",
    trimino1 = "1100010000000000000000000",
    trimino2 = "100001000010000000000000",
    tetramino1 = "100001000010000100000000",
    tetramino2 = "100001000011000000000000",
    tetramino3 = "110000110000000000000000",
    tetramino4 = "110001100000000000000000",
    tetramino5 = "111000100000000000000000",
    pentomino1 = "011001100001000000000000",
    pentomino2 = "100001000010000100001000",
    pentomino3 = "100001000010000110000000",
    pentomino4 = "1100001110000000000000000",
    pentomino5 = "110001110000000000000000",
    pentomino6 = "1110001000010000000000000",
    pentomino7 = "1010011100000000000000000",
    pentomino8 = "1110010000100000000000000",
    pentomino9 = "0110011000100000000000000",
    pentomino10 = "0100011100010000000000000",
    pentomino11 = "0011011100000000000000000",
    pentomino12 = "1100001000011000000000000",
}

export type Block = {
    name: string;
    shapeCode: string;
};

const blocks: Block[] = Object.entries(Polyominoes).map(([name, shapeCode]) => ({
    name,
    shapeCode,
}));

export { Polyominoes, blocks };
// export const blocks = [
//     monomino,
//     domino,
//     trimino1,
//     trimino2,
//     tetramino1,
//     tetramino2,
//     tetramino3,
//     tetramino4,
//     tetramino5,
//     pentomino1,
//     pentomino2,
//     pentomino3,
//     pentomino4,
//     pentomino5,
//     pentomino6,
//     pentomino7,
//     pentomino8,
//     pentomino9,
//     pentomino10,
//     pentomino11,
//     pentomino12,
// ]

export const colors = ["#f2c346", "#e24433", "#65b43d", "#3469a5"]