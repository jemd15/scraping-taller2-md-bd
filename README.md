# Scrapping para el desarrollo del Taller nº2 de Minería de Datos y Big Data

Este respositorio consta de 2 archivos principales, los cuales realizan una obtención de data de 2 sitios web mediante la técnica del scrapping. El archivo cars.js realiza un scrapping al sitio web www.autosusados.cl para obtener los siguientes datos (la cantidad de datos a obtener se debe asignar en la variable `carsToRead`):

- Título
- Precio de venta
- Año del vehículo
- Tipo de transmisión
- Tipo de combustible
- Kilometraje

Por otro lado, el archivo dolar.js hace una obtencion del precio del dolar desde el sitio web www.valor-dolar.cl obteniendo los siguientes datos:

- Valor del Dolar en CLP
- Valor de Compra del Dolar en CLP
- Valor de Venta del Dolar en CLP

Para hacer funcionar estos 2 archivos los pasos son los siguientes:

1) instalar dependencias con npm usando el comando: 
```sh
npm install
```
o
```sh
npm i
```
2) ejecutar el archivo .js correspondiente con el comando: 
```ssh
node [nombre_del_archivo].js
```

License
----

MIT
