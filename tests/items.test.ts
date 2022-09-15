import supertest from "supertest";
import app from "../src/app";
import {prisma} from "../src/database";

const agent = supertest(app);

describe("/items", () => {
  beforeAll(async () => {
      await prisma.$executeRaw`TRUNCATE TABLE "items"`;
  });

  afterAll(async () => {
      await prisma.$disconnect();
  });

  let itemId = undefined;

  describe('Testa POST /items ', () => {
    it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
      const newItem = {title: "Teste", url: "https://javascript.plainenglish.io/typed-express-request-and-response-with-typescript-7277aea028c", description: "Teste", amount: 1}
      const result = await agent.post("/items").send(newItem)

      itemId = result.body.id

      expect(result.status).toBe(201)
    });
    it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
      const newItem = {title: "Teste", url: "https://javascript.plainenglish.io/typed-express-request-and-response-with-typescript-7277aea028c", description: "Teste", amount: 1}
      const result = await agent.post("/items").send(newItem)

      expect(result.status).toBe(409)
    });
  });
  
  describe('Testa GET /items ', () => {
    it('Deve retornar status 200 e o body no formato de Array', async () => {
      const result = await agent.get("/items")

      expect(result.status).toBe(200)
      expect(Array.isArray(result.body)).toBe(true)
    });
  });
  
  describe('Testa GET /items/:id ', () => {
    it('Deve retornar status 200 e um objeto igual a o item cadastrado', async ()=> {
      const result = await agent.get(`/items/${itemId}`)

      expect(result.status).toBe(200)
    });
    it('Deve retornar status 404 caso não exista um item com esse id', async () =>{
      const result = await agent.get("/items/10000000000")

      expect(result.status).toBe(404)
    });
  });
})

