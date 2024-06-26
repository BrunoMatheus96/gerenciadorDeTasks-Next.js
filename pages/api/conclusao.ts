import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { TarefaModel } from "../../models/TarefaModel";
import { ConclusapRequisicao } from "../../types/ConclusaoRequisicao";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";

const endpointConclusao = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    if (req.method === "PATCH") {
      const { userId, id } = req.query;

      if (!id) {
        return res.status(400).json({ erro: `É preciso informar um ID` });
        //Se não tiver tarefa regitrada ou essa tarefa não for do o Usuário logado
      }

      const tarefaPorId = await TarefaModel.findById(id); // Procura no banco o ID da tarefa para o ID logado

      if (!tarefaPorId || tarefaPorId.idUsuario != userId) {
        //idUsuário do banco Tarefas é diferente do ID do usuário logado no banco de usuários
        return res
          .status(404)
          .json({ erro: "Tarefa não encontrada para esse usuário" });
      } else {
        const { concluido } = req.body as ConclusapRequisicao;

        const statusAtual = tarefaPorId.conclusao;

        if (statusAtual === false && concluido === false) {
          return res.status(400).json({
            erro: "Essa tarefa não pode ser reaberta, pois ela não está concluída",
          });
        }

        if (statusAtual === true && concluido === true) {
          return res.status(400).json({ erro: "Essa tarefa já foi concluída" });
        }

        // Busca a tarefa pelo ID no banco de dados
        const atualizarConclusao = await TarefaModel.findByIdAndUpdate(
          id, // ID da tarefa a ser atualizada
          { conclusao: concluido }, // Novos dados a serem substituídos
          { new: true } // Para retornar o documento atualizado
        );

        return res.status(200).json(atualizarConclusao);
      }
    }
    console.log("Foi requisitado um " + req.method + ` mas correto é um PATCH`);
    return res.status(405).json({ erro: "Método informado não é válido" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ erro: "Erro ao concluir tarefa. Tente novamente mais tarde" });
  }
};

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default validarTokenJWT(conectarMongoDB(endpointConclusao));
