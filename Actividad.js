const express = require("express");
const app = express();
const parser = require("body-parser");
const fs = require("fs");
const host = "localhost";
const port = 8000;
const file = "producto.json";

app.use(express.json());
app.use(parser.json());

app.get("/home", (req, res) => {
  res.send("bienvenidos");
});

app.get("/home/productos", (req, res) => {
    const productos = JSON.parse(fs.readFileSync(file)).productos;
    res.json(productos);
});

app.get("/home/leerid/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const productos = JSON.parse(fs.readFileSync(file)).productos;
    const productoId = productos.find((p) => p.id === id);
    if (productoId) {
      res.json(productoId);
    } else {
      res.status(404).send("Producto no encontrado");
    }
});

app.post("/home/agregar", (req, res) => {
     const productos = JSON.parse(fs.readFileSync(file)).productos;
     const nuevoProducto = req.body;
     nuevoProducto.id = productos.length + 1;
     productos.push(nuevoProducto);
     fs.writeFileSync(file, JSON.stringify({ productos }));
     res.status(201).json(nuevoProducto);
});

app.put("/home/actualizar", (req, res) => {
    const id = parseInt(req.params.id);
    const productos = JSON.parse(fs.readFileSync(file)).productos;
    const productoLista = productos.productoLista((p) => p.id === id);
    if (productoLista === -1) {
      res.status(404).send("Producto no encontrado");
    } else {
      const nuevoProducto = req.body;
      nuevoProducto.id = id;
      productos[productoLista] = nuevoProducto;
      fs.writeFileSync(file, JSON.stringify({ productos }));
      res.json(nuevoProducto);
    }
});

app.delete("/home/eliminar/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const productos = JSON.parse(fs.readFileSync(file)).productos;
  const productoId = productos.findIndex((p) => p.id === id);
  if (productoId === -1) {
    res.status(404).send("Producto no encontrado");
  } else {
    productos.splice(productoId, 1);
    fs.writeFileSync(file, JSON.stringify({ productos }));
    res.send(`producto eliminado ${id}`);
  }
});

app.use((req, res) => {
    res.status(404).send("<h1>Error 404</h1>")
});

app.listen(port, host, () => {
    console.log(`el link de acc es http://${host}:${port}`)
})