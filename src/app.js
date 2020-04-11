const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({
      error: 'Invalid Id'
    })
  }

  return next();
}

function repositoryExists(request, response, next) {
    if (request.repositoryIndex < 0) {
    return response.status(400).json({
      error: 'Repository not found'
    });
  }

  return next();
}

const repositories = [];


app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", repositoryExists, validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const { title, url, techs } = request.body;
   const repository = {
     id,
     title,
     url,
     techs,
     likes: repositories[repositoryIndex].likes,
   }

   repositories[repositoryIndex] = repository;

   return response.json(repository)
});

app.delete("/repositories/:id", repositoryExists, validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", repositoryExists, validateRepositoryId,(request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const repository = repositories[repositoryIndex];
  
  repository.likes ++;

  return response.json(repository)
});

module.exports = app;
