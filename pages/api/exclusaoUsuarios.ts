import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { TarefaModel } from "@/models/TarefaModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";


const endpointExclusaoUsuarios = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
        if (req.method === "DELETE") {

            const { userId } = req.query;
            const usuarioPorId = await UsuarioModel.findById(userId); // Procura no banco o ID da tarefa para o ID logado

            if (!usuarioPorId) {
                return res.status(400).json({ erro: `Usuário inativo ou inexistente` });

            } else {

                // Exclui todas as tarefas do usuário
                await TarefaModel.deleteMany({ idUsuario: userId });

                // Exclui o usuário
                await UsuarioModel.findByIdAndDelete(userId);

                return res.status(200).json({ msg: `Usuário deletado com sucesso` });

            }

        }
        console.log("Foi requisitado um " + req.method + ` mas correto é um DELETE`);
        return res.status(405).json({ erro: "Método informado não é válido" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: "Erro ao excluir usuário. Tente novamente mais tarde" });
    }
}

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default validarTokenJWT(conectarMongoDB(endpointExclusaoUsuarios));