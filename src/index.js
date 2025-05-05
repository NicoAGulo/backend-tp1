const express= require('express')
const handlebars= require("express-handlebars")

const app = express();
const PORT = 3001

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('views engine', 'handlebars');
app.use(express.static(__dirname + '/views'))

app.get('/', (req, res)=>{
    let testUser={
        name: "Coder",
        last_name: "House"
    }    

    res.render("index", testUser)
});

app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})