### El primer mensaje es el snapshot del libro de ordenes

- contiene 10 rojos y 10 verdes
- El primer numero del array al conectarme es el channelId
- as : ( rojo ) ascendente as es compra 
- bs : ( verde ) descendente  bs es venta

### El segundo mensaje es el evento de actualización del libro

- El primer valor es el channelId con que me conecte
- "c" es el checksum
- "a/b" , a es ask (rojo) , b es  bid ( verde)

### Hay un evento vacío que no sirve

- {"event":"heartbeat"}
  