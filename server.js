// const express =require('express');
// const app= express();
// const PORT = 8080

// //Metodos HTTP
// app.get('/',(req, res)=>{
//     res.json({
//         msg:"GET"
//     })
// })

// app.post('/',(req, res)=>{
//     res.json({
//         msg:"POST"
//     })
// })

// app.put('/',(req, res)=>{
//     res.json({
//         msg:"PUT"
//     })
// })

// app.delete('/',(req, res)=>{
//     res.json({
//         msg:"DELETE"
//     })
// })





// //Middleware para poder trabajar con datos JSON:
// app.use(express.json());

// //Array:
// let usuarios= [];

// app.get("/usuarios", (req, res)=>{
//     res.json(usuarios)
// })

// app.post("/usuarios", (req, res)=>{
//     const {nombre, edad}=req.body
//     const nuevoUsuario={id: usuarios.length+1, nombre, edad}
    
//     usuarios.push(nuevoUsuario)
//     res.status(201).json(nuevoUsuario)
// })

// app.put("/usuarios/:id", (req, res)=>{
//     const {id} = req.params
//     const {nombre, edad}=req.body
    
//     const usuario= usuarios.find(u => u.id === parseInt(id));
//     if(!usuario) return res.status(404).json({mensaje: "Usuario no encontrado"})
//         usuario.nombre = nombre || usuario.nombre
//     usuario.edad = edad || usuario.edad
//     res.json(usuario)
// })

// app.delete("/usuarios/:id", (req, res)=>{
//     const {id} = req.params
//     usuarios =usuarios.filter(u => u.id !== parseInt(id))
//     res.json({mensaje:"Usuario Eliminado"})

// })



// app.listen(PORT, ()=>{
//     console.log(`Servidor corriendo en el puerto ${PORT}`)
// })