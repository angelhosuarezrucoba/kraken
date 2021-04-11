import WebSocket from "ws";
import {LTCSubscription} from "./src/events/messages.js";
import {book, updateBook} from "./src/services/book-service.js";
import {of, Subject} from "rxjs";
import {map, mergeMap, tap} from "rxjs/operators/index.js";
import {sendMail} from "./src/services/node-mailer.js";

const wss = new WebSocket("wss://ws.kraken.com");
const observer = new Subject();

wss.addEventListener("open", () => {
    wss.send(JSON.stringify(LTCSubscription)); /* la suscripcion es un array , se puede elegir varias monedas pero se requiere mas libros */
});


observer.pipe(
    mergeMap((data) => {
        if (data.a) {
            return of(updateBook("a", "as", data.a));
        } else {
            return of(updateBook("b", "bs", data.b));
        }
    }),
    tap((data) => console.log(JSON.stringify(data))),
    map((order) => {
            if (order.sellPrice < "190.5") {
                return of(sendMail(order)) /* funcion para envio de correos, este map es solo una prueba */
            }
    }),
    tap((data) => console.log(data)),
).subscribe();

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