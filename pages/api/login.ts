import { LoginResposta } from "@/types/LoginResposta";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from 'jsonwebtoken';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';


const endpointLogin = async (
    req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | LoginResposta>) => {

    //Token de segurança
    const { MINHA_CHAVE_JWT } = process.env;
    if (!MINHA_CHAVE_JWT) {
        return res.status(500).json({ erro: 'Token nao informado' });
    }

    //Definição da requisição e tratativa do método
    if (req.method === "POST") {
        //Se meu método for um POST então ele irá requisitar um payload
        const { login, senha } = req.body; //Criação dos campos do payload


        //Dados imputados porque ainda não fiz integração no banco
        if (login === "Bruno" && senha === "123") {
            return res.status(200).json({ msg: "Conseguimo porra" })
        }
        return res.status(400).json({ erro: 'Usuario ou senha invalidos. Tente novamente.' }); //Vai retornar se colocarem alguma informação de login e senha errada
    }
    return res.status(405).json({ erro: 'O metodo informado não é valido' }); //Vai retornar o método 405 (solicitação de algo que não está permitido) se usarem outro método diferente de POST
}

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default conectarMongoDB(endpointLogin);