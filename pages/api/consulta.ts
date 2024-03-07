import { conectarMongoDB } from "@/middlewares/conectarMongoDB";
import { validarTokenJWT } from "@/middlewares/validarTokenJWT";
import { TarefaModel } from "@/models/TarefaModel";
import { UsuarioModel } from "@/models/UsuarioModel";
import { RespostaPadraoMsg } from "@/types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const endpointConsulta = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any>) => {
    try {
        //Definição da requisição e tratativa do método
        //Se meu método for um POST então ele irá requisitar um payload
        if (req.method === "GET") {

            const { userId, id } = req.query; // Utiliza um destructor para pegar um campo "userID" e "id" da query do request que fazemos no Postman
            const usuarioLogado = await UsuarioModel.findById(userId); // Procura no banco de usuários o ID do usuário logado

            //Vai buscar no banco de Tarefas as tarefas correspondentes com o ID do usuário logado
            const tarefaPorUsuario = await TarefaModel.find({
                idUsuario: usuarioLogado._id
            })

            if (req?.query?.id) {
                //Dado que eu vou mandar para pesquisar a tarefa
                const tarefa = await TarefaModel.findById(id); // Procura no banco o ID da tarefa para o ID logado
                console.log("O id enviado no postman foi " + id);

                //Se não tiver tarefa regitrada ou essa tarefa não for do o Usuário logado
                if (!tarefa || tarefa.idUsuario != userId ) //idUsuário do banco Tarefas é diferente do ID do usuário logado no banco de usuários
                {
                    return res.status(404).json("Tarefa não encontrada para esse usuário");
                }

                const tarefaPorId = await TarefaModel.findById(req?.query?.id); // Busca no BD a tarefa usando o id


                //console.log(tarefaPorID)
                return res.status(200).json(tarefaPorId);
            } else {
                if (!tarefaPorUsuario) {
                    return res.status(404).json("Ainda não há tarefas cadastradas");
                }
                return res.status(200).json(tarefaPorUsuario);
            }
        }
        console.log("Foi requisitado um " + req.method + ` mas correto é um GET`);
        return res.status(405).json({ erro: "Método informado não é válido" });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: "Erro na consulta de tarefas. Tente novamente mais tarde" });
    }
}

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default validarTokenJWT(conectarMongoDB(endpointConsulta));