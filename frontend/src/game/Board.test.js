import buildBoard from './Board';

describe('buildBoard', () => {
    it('should return a 15x15 grid', () => {
        const board = buildBoard();
        expect(board.length).toBe(15); // Check the number of rows
        board.forEach(row => {
            expect(row.length).toBe(15); // Check the number of columns in each row
        });
    });

    it('should initialize each cell with an empty string', () => {
        const board = buildBoard();
        board.forEach(row => {
            row.forEach(cell => {
                expect(cell.letter).toBe(''); // Check if each cell has an empty string
            });
        });
    });

    it('should have correct row and column indices for each cell', () => {
        const board = buildBoard();
        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                expect(cell.row).toBe(rowIndex); // Check if the row index is correct
                expect(cell.col).toBe(colIndex); // Check if the column index is correct
            });
        });
    });
});
