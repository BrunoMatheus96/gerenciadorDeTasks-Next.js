//Introdução a Node.JS na aula Schemas - Parte 1
import { CadastroRequisicao } from "@/types/CadastroRequisicao";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB"; // Importando o middleware de conexão com DB que foi criado
import { UsuarioModel } from "../../models/UsuarioModel"; // Importando o model do Usuário


const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    //Definição da requisição e tratativa do método
    //Se meu método for um POST então ele irá requisitar um payload
    try {
        if (req.method === "POST") {
            const usuario = req.body as CadastroRequisicao;

            //Verifcação de nome
            //Verifcação de email
            //Verifcação de senha
            if(usuario.senha != usuario.confSenha){
                return res.status(400).json({ erro: "As senhas estão diferentes" });
            }
            //Verificação da confirmação de senha

            if (!usuario.nome.trim() || !usuario.email.trim() || !usuario.senha.trim() || !usuario.confSenha.trim()) {
                return res.status(400).json({ erro: "Nenhum campo pode estar vazio" });

            }

            // salvar no banco de dados
            const usuarioASerSalvo = { // Cria uma const com o que é esperado de um usuario e isso foi definido no Model
                nome: usuario.nome,
                email: usuario.email,
                senha: (usuario.senha), // Utilização do md5 para que o dado seja guardado criptografado, caso haja algum vazamento a senha ao menos estará com uma criptografia
            }

            await UsuarioModel.create(usuarioASerSalvo); // O método create cria o objeto definido em usuarioASerSalvo na Coleção
            return res.status(200).json({ msg: "Usuário cadastrado com sucesso" });
        }
        return res.status(405).json({ erro: "Método informado não é válido" });
    } catch (e) {
        console.log(e);
    return res.status(500).json({ erro: "Erro ao cadastrar usuário. Tente novamente mais tarde" });
    }
}

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default conectarMongoDB(endpointCadastro);