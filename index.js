const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Respostas = require("./database/Respostas");

// Conexão para o banco de dados
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com sucesso");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  });

// estou dizendo para o express usar o ejs como view engine
app.set("view engine", "ejs");
// Para poder usaar arquivos estaticos
app.use(express.static("public"));

// Serve para traduzir o que for mandado pela url
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota responsável por pegar os dados no banco
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((perguntas) => {
    res.render("index", {
      perguntas,
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta", (req, res) => {
  let titulo = req.body.titulo;
  let descricao = req.body.descricao;
  Pergunta.create({
    titulo,
    descricao,
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/pergunta/:id", (req, res) => {
  let id = req.params.id;
  Pergunta.findOne({
    where: { id: id },
  }).then((pergunta) => {
    if (pergunta != undefined) {
      Respostas.findAll({
        where: { perguntaId: pergunta.id },
        order: [["id", "DESC"]],
      }).then((respostas) => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas,
        });
      });
    } else {
      res.redirect("/");
    }
  });
});

app.post("/responder", (req, res) => {
  let corpo = req.body.corpo;
  let perguntaId = req.body.pergunta;

  Respostas.create({
    corpo,
    perguntaId,
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId);
  });
});

app.listen(3002, (erro) => {
  if (erro) {
    console.log("Servidor não encontrado");
  } else {
    console.log("Servidor UP!");
  }
});
