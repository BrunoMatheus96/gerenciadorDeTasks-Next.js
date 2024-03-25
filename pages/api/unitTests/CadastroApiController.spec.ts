//DESCRIBE -> Bloco de teste
//IT or TEST -> Declara um unico teste unitário
//EXPECT -> Vaidar resultados

import { NextApiRequest, NextApiResponse } from "next";
import endpointCadastro from "../cadastro"; // Verifique o caminho correto para o arquivo cadastro.ts
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { UsuarioModel } from "@/models/UsuarioModel";

describe("Cadastro de Usuário", () => {
  let req: NextApiRequest;
  let res: NextApiResponse<RespostaPadraoMsg>;

// Mock do modelo de usuário
jest.mock("../../../models/UsuarioModel", () => ({
  UsuarioModel: {
    find: jest.fn().mockReturnValue(Promise.resolve([])), // Retorna uma promessa vazia por padrão
    create: jest.fn(), // Mock da função create para simular a criação de usuário
  },

}));

  beforeEach(() => {
    req = {} as NextApiRequest;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse<RespostaPadraoMsg>;
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar sucesso ao cadastrar usuário", async () => {
    req.body = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "123456",
    };

    // Simule a função find para retornar um array vazio, indicando que o usuário não existe
    (UsuarioModel.find as jest.Mock).mockResolvedValue([]);

    await endpointCadastro(req, res);

    expect(UsuarioModel.find).toHaveBeenCalledWith({ email: "teste@example.com" });
    expect(UsuarioModel.create).toHaveBeenCalledWith({
      nome: "Teste",
      email: "teste@example.com",
      senha: expect.any(String), // Você pode verificar se a senha foi criptografada corretamente
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Usuário cadastrado com sucesso!",
    });
  });
});
