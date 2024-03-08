import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { TarefaModel } from "@/models/TarefaModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";


const endpointExclusaoTarefas = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
        if (req.method === "DELETE") {

            const { userId, id } = req.query;
            const tarefaPorId = await TarefaModel.findById(id); // Procura no banco o ID da tarefa para o ID logado

            if (!id) {
                return res.status(400).json({ erro: `É preciso informar um ID de uma tarefa` });

            } else if (!tarefaPorId || tarefaPorId.idUsuario != userId) //idUsuário do banco Tarefas é diferente do ID do usuário logado no banco de usuários
            {
                return res.status(404).json({ erro: "Tarefa não encontrada para esse usuário" });

            } else {

                await TarefaModel.findByIdAndDelete(id);

                return res.status(200).json({ msg: `Tarefa deletada com sucesso` });

            }

        }
        console.log("Foi requisitado um " + req.method + ` mas correto é um DELETE`);
        return res.status(405).json({ erro: "Método informado não é válido" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: "Erro ao cadastrar tarefa. Tente novamente mais tarde" });
    }
}

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default validarTokenJWT(conectarMongoDB(endpointExclusaoTarefas));