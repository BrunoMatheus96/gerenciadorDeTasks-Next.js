//DESCRIBE -> Bloco de teste
//IT or TEST -> Declara um unico teste unitário
//EXPECT -> Vaidar resultados

import { NextApiRequest, NextApiResponse } from "next";
import endpointCadastro from "../pages/api/cadastro"; // Verifique o caminho correto para o arquivo cadastro.ts
import { CadastroRequisicao } from "@/types/CadastroRequisicao";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { UsuarioModel } from "../models/UsuarioModel";

// Mock para o model UsuarioModel
jest.mock("@/models/UsuarioModel");

// Mock para a função conectarMongoDB
jest.mock("@/middlewares/conectarMongoDB", () => {
  return {
    conectarMongoDB: jest.fn().mockImplementation((handler) => handler),
  };
});

let req: NextApiRequest;
let res: NextApiResponse<RespostaPadraoMsg>;

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

describe("Cadastro com sucesso - Status 200", () => {
  test("Cadastro realizado com sucesso", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "123456",
    };

    // Simula que nenhum usuário com o mesmo e-mail existe
    (UsuarioModel.find as jest.Mock).mockResolvedValueOnce([]);

    // Simula a criação do usuário
    (UsuarioModel.create as jest.Mock).mockResolvedValueOnce(1);

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      msg: "Usuário cadastrado com sucesso!",
    });
  });
});

describe("Campos vazios - Status 400", () => {
  test("Campo nome vazio", async () => {
    const usuario: CadastroRequisicao = {
      nome: "",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "123456",
    };

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "O campo nome é obrigatório",
    });
  });

  test("Campo email vazio", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "",
      senha: "123456",
      confSenha: "123456",
    };

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "O campo email é obrigatório",
    });
  });

  test("Campo senha vazio", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "",
      confSenha: "123456",
    };

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "O campo senha é obrigatório",
    });
  });

  test("Campo Confirmação de Senha vazio", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "",
    };

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "As senhas estão diferentes",
    });
  });
});

describe("Campos inválidos - Status 400", () => {
  test("Campo nome inválido", async () => {
    const usuario: CadastroRequisicao = {
      nome: "T",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "123456",
    };

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Nome inválido. Favor colocar um nome com mais de 2 caracteres",
    });
  });

  test("Campo email inválido", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "@e.",
      senha: "123456",
      confSenha: "123456",
    };

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "E-mail inválido. Para o mesmo ser válido siga o exemplo: tasks@gmail.com",
    });
  });

  test("Campo email inválido 02", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "testeexample.com",
      senha: "123456",
      confSenha: "123456",
    };

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "E-mail inválido. Para o mesmo ser válido siga o exemplo: tasks@gmail.com",
    });
  });

  test("Campo email inválido 03", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@examplecom",
      senha: "123456",
      confSenha: "123456",
    };

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "E-mail inválido. Para o mesmo ser válido siga o exemplo: tasks@gmail.com",
    });
  });

  test("Campo senha inválido", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "123",
      confSenha: "123",
    };

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Senha inválida. O campo precisa ter pelo menos 6 caracteres",
    });
  });

  test("Campo Confirmação de Senha inválido", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "123",
    };

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "As senhas estão diferentes",
    });
  });
});

describe("Cadastro com e-mail já cadastrado - Status 400", () => {
  test("Tenta cadastrar usuário com e-mail já cadastrado", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "123456",
    };

    // Simula que um usuário com o mesmo e-mail já existe
    (UsuarioModel.find as jest.Mock).mockResolvedValueOnce([
      { email: "teste@example.com" },
    ]);

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Email já cadastrado",
    });
  });
});

describe("Erro interno", () => {
  test("Tenta cadastrar usuário com banco desconectado", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "123456",
    };

    // Simula que ocorreu um erro ao conectar ao banco de dados
    (UsuarioModel.find as jest.Mock).mockRejectedValueOnce(
      new Error("Erro ao conectar ao banco de dados")
    );

    req.method = "POST";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Erro ao cadastrar usuário. Tente novamente mais tarde",
    });
  });
});

describe("Métodos diferentes de POST", () => {
  test("GET", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "123456",
    };

    // Simula que nenhum usuário com o mesmo e-mail existe
    (UsuarioModel.find as jest.Mock).mockResolvedValueOnce([]);

    // Simula a criação do usuário
    (UsuarioModel.create as jest.Mock).mockResolvedValueOnce(1);

    req.method = "GET";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Método informado não é válido",
    });
  });

  test("PUT", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "123456",
    };

    // Simula que nenhum usuário com o mesmo e-mail existe
    (UsuarioModel.find as jest.Mock).mockResolvedValueOnce([]);

    // Simula a criação do usuário
    (UsuarioModel.create as jest.Mock).mockResolvedValueOnce(1);

    req.method = "PUT";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Método informado não é válido",
    });
  });

  test("PATCH", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "123456",
    };

    // Simula que nenhum usuário com o mesmo e-mail existe
    (UsuarioModel.find as jest.Mock).mockResolvedValueOnce([]);

    // Simula a criação do usuário
    (UsuarioModel.create as jest.Mock).mockResolvedValueOnce(1);

    req.method = "PATCH";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Método informado não é válido",
    });
  });

  test("DELETE", async () => {
    const usuario: CadastroRequisicao = {
      nome: "Teste",
      email: "teste@example.com",
      senha: "123456",
      confSenha: "123456",
    };

    // Simula que nenhum usuário com o mesmo e-mail existe
    (UsuarioModel.find as jest.Mock).mockResolvedValueOnce([]);

    // Simula a criação do usuário
    (UsuarioModel.create as jest.Mock).mockResolvedValueOnce(1);

    req.method = "DELETE";
    req.body = usuario;

    await endpointCadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({
      erro: "Método informado não é válido",
    });
  });
});
