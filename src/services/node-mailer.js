import nodemailer from "nodemailer";

export const sendMail = async (order) => {
    const {buyPrice, sellPrice} = order;
    let auth = {user: "test", pass: "test"};
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth
    });
    return await transporter.sendMail({
        from: '"Kraken" <test@gmail.com>', // sender address
        to: "test", // list of receivers
        subject: "Alerta", // Subject line
        text: "", // plain text body . el html se deberia editar para notificar.
        html: ` <p>El precio de compra del ltc es ${buyPrice}</p> 
                <p>El precio de venta del ltc es ${sellPrice}</p>`
    });
};