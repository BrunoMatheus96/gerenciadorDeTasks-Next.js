//DESCRIBE -> Bloco de teste
//IT or TEST -> Declara um unico teste unitário
//EXPECT -> Validar resultados

import { NextApiRequest, NextApiResponse } from "next";
import endpointLogin from "../pages/api/login";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { UsuarioModel } from "../models/UsuarioModel";
import { LoginResposta } from "@/types/LoginResposta"; // Importando a tipagem LoginResposta

// Mock para o model UsuarioModel
jest.mock("@/models/UsuarioModel");

// Mock para jwt.sign
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "fake_token")
}));

// Mock para a função conectarMongoDB
jest.mock("@/middlewares/conectarMongoDB", () => {
  return {
    conectarMongoDB: jest.fn().mockImplementation((handler) => handler),
  };
});

let req: NextApiRequest;
let res: NextApiResponse<RespostaPadraoMsg | LoginResposta>; // Ajustando o tipo da resposta para incluir LoginResposta

beforeEach(() => {
  req = {} as NextApiRequest;
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as NextApiResponse<RespostaPadraoMsg | LoginResposta>; // Ajustando o tipo da resposta para incluir LoginResposta
  jest.clearAllMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Login realizado com sucesso - Status 200", () => {
  test("Login realizado com sucesso", async () => {
    const usuario = {
      login: "teste@example.com",
      senha: "123456"
    };

    // Simula que um usuário com o mesmo e-mail existe no banco
    (UsuarioModel.find as jest.Mock).mockResolvedValueOnce([{ email: "teste@example.com", senha: "123456", nome: "Nome do Usuário" }]);
    
    req.method = "POST";
    req.body = usuario;

    await endpointLogin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      nome: "Nome do Usuário",
      email: "teste@example.com",
      token: "fake_token"
    });
  });
});
