//Introdução a Node.JS na aula Schemas - Parte 1

import { CadastroRequisicao } from "@/types/CadastroRequisicao";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectarMongoDB"; // Importando o middleware de conexão com DB que foi criado


const endpointCadastro = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    //Definição da requisição e tratativa do método
    //Se meu método for um POST então ele irá requisitar um payload
    try {
        if (req.method === "POST") {
            const usuario = req.body as CadastroRequisicao;

            //Verifcação de nome
            //Verifcação de email
            //Verifcação de senha
            //Verificação da confirmação de senha


            return res.status(200).json({ erro: "Usuário cadastrado com sucesso" });
        }
        return res.status(405).json({ erro: "Método informado não é válido" });
    } catch (e) {
        console.log(e);
    }
    return res.status(500).json({ erro: "Erro ao cadastrar usuário. Tente novamente mais tarde" });
}

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default conectarMongoDB(endpointCadastro);