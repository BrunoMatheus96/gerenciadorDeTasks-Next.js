import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const endpointEdicaoDeCampo = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
        if (req.method === "PUT") {

            return res.status(200).json({ msg: "Tamo indo" });

        }
        console.log("Foi requisitado um " + req.method + ` mas correto é um PUT`);
        return res.status(405).json({ erro: "Método informado não é válido" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: "Erro ao cadastrar tarefa. Tente novamente mais tarde" });
    }
}

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default validarTokenJWT(conectarMongoDB(endpointEdicaoDeCampo));