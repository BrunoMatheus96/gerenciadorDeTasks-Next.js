import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const endpointConsulta = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
        //Definição da requisição e tratativa do método
        //Se meu método for um GET então ele irá requisitar um payload
        if (req.method === "GET") {

            return res.status(200).json({});
        }
        console.log("Foi requisitado um " + req.method + ` mas correto é um POST`);
        return res.status(405).json({ erro: "Método informado não é válido" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: "Erro ao cadastrar tarefa. Tente novamente mais tarde" });
    }
}

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default validarTokenJWT(conectarMongoDB(endpointConsulta));