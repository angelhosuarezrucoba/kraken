import WebSocket from "ws";
import {LTCSubscription} from "./src/events/messages.js";
import {book, updateBook} from "./src/services/book-service.js";
import {Subject} from "rxjs";

const wss = new WebSocket("wss://ws.kraken.com");
const observer = new Subject();

wss.addEventListener("open", () => {
    wss.send(JSON.stringify(LTCSubscription));
});

observer.subscribe((data) => {
    if (data.a) {
        updateBook("a", "as", data.a);
    } else {
        updateBook("b", "bs", data.b);
    }
});

wss.addEventListener("message", ({data: textData}) => {
    const parsedData = JSON.parse(textData); // parsedData[1] es el objeto de update o el libro
    if (parsedData instanceof Array) {
        const data = parsedData[1];
        const isSnapShot = Object.keys(data).some(key => key === "as");
        const isUpdate = Object.keys(data).some(key => key === "a" || key === "b");
        if (isSnapShot) {
            book.as = data.as;
            book.bs = data.bs;
        }
        if (isUpdate) {
            observer.next(data);
        }
    }
});