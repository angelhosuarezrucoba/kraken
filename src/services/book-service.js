export const book = {as: [], bs: []};
export const orderAsc = (a, b) => a[0] - b[0];
export const orderDesc = (a, b) => b[0] - a[0];
const ZERO = "0.00000000";

const addOrderToBook = (bookSide, price, order) => {
    if (!book[bookSide].some(oldOrder => oldOrder[0] === price)) {
        book[bookSide].push(order);
    }
};

const filterNonZeroVolumesForBookOrder = (bookSide, price, volume) => {
    for (const item of book[bookSide]) {
        if (item[0] === price) {
            item[1] = volume;
        }
    }
    book[bookSide] = book[bookSide].filter(item => item[1] !== ZERO);
};

const orderBookBySide = (updateSide, bookSide) => {
    if (updateSide === "a") {
        book[bookSide].sort(orderAsc);
    }
    if (updateSide === "b") {
        book[bookSide].sort(orderDesc);
    }
};

export const updateBook = (updateSide, bookSide, data) => {//Podría ser "a" o "b" (rojo y verde) compra -venta
    for (const order of data) {
        const price = order[0];
        const volume = order[1];
        if (volume === ZERO) {
            filterNonZeroVolumesForBookOrder(bookSide, price, volume);
        } else {
            addOrderToBook(bookSide, price, order);
        }
        orderBookBySide(updateSide, bookSide);
    }
    console.log(`compra: ${book.as[0][0]} - venta: ${book.bs[0][0]}`);
}


