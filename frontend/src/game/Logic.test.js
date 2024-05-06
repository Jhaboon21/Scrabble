import { findWords, getPoints } from './Logic';
import ScrabbleAPI from "../api/api";


describe('findWords', () => {
    it('should return an empty array if no words are found', () => {
        const playedLetters = [{ row: 0, col: 0 }];
        const grid = [
            [{ letter: '' }, { letter: '' }, { letter: '' }],
            [{ letter: '' }, { letter: '' }, { letter: '' }],
            [{ letter: '' }, { letter: '' }, { letter: '' }]
        ]
        expect(findWords(grid, playedLetters)).toEqual([]);
    });

    it('should return an array with words formed both horizontally and vertically', () => {
        const playedLetters = [{ row: 0, col: 0 }];
        const grid = [
            [{ letter: 'c' }, { letter: 'a' }, { letter: 't' }],
            [{ letter: 'o' }, { letter: 'r' }, { letter: 'n' }],
            [{ letter: 't' }, { letter: 'o' }, { letter: 'p' }]
        ];
        expect(findWords(grid, playedLetters)).toEqual(['cat', 'cot']);
    });
});

describe('getPoints', () => {
    it('should return the total score for valid words', async () => {
        const validWords = ['cat', 'dog'];
        jest.spyOn(ScrabbleAPI, 'scrabbleScore').mockResolvedValue({ data: { value: 5 } });
        expect(await getPoints(validWords)).toEqual(10);
    });

    it('should throw an error if there was an invalid word provided', async () => {
        const invalidWord = ['xyz'];
        jest.spyOn(ScrabbleAPI, 'scrabbleScore').mockRejectedValue(new Error('Invalid word'));
        await expect(getPoints(invalidWord)).rejects.toThrow('The word xyz is not valid.');
    });

    it('should throw an error if no words are provided', async () => {
        const emptyArray = [];
        await expect(getPoints(emptyArray)).rejects.toThrow('You must place at least 2 letters and form a word.');
    });
});
