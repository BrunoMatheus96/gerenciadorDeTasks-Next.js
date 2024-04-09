import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { TarefaModel } from "../../models/TarefaModel";
import { TarefaRequisicao } from "../../types/TarefaRequisicao";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validarRepeticaoTarefa } from "../../utils/validacao";
import { NextApiRequest, NextApiResponse } from "next";

const endpointEdicaoDeCampos = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    if (req.method === "PUT") {
      const tarefaAtualizada = req.body as TarefaRequisicao;

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
        // Validações do "Dia todo?"
        if (
          typeof tarefaAtualizada.diaTodo !== "undefined" &&
          typeof tarefaAtualizada.diaTodo !== "boolean"
        ) {
          return res
            .status(400)
            .json({
              erro: `O campo 'diaTodo' deve ser do tipo booleano (true ou false)`,
            });
        }

        //Validações do "Se repete?"
        if (!validarRepeticaoTarefa(tarefaAtualizada.repeticao)) {
          return res
            .status(400)
            .json({ erro: `Essa opção no campo 'repetição' não é válida` });
        }

        // Busca a tarefa pelo ID no banco de dados
        const atualizarCampos = await TarefaModel.findByIdAndUpdate(
          id, // ID da tarefa a ser atualizada
          {
            titulo: tarefaAtualizada.titulo,
            descricao: tarefaAtualizada.descricao,
            data: tarefaAtualizada.data,
            diaTodo: tarefaAtualizada.diaTodo,
            repeticao: tarefaAtualizada.repeticao,
          }, // Novos dados a serem substituídos
          { new: true } // Para retornar o documento atualizado
        );

        //await TarefaModel.updateOne(atualizacaoASerSalva); // O método create cria o objeto definido em tarefaASerSalvo na Coleção
        return res.status(200).json(atualizarCampos);
      }
    }
    console.log("Foi requisitado um " + req.method + ` mas correto é um PUT`);
    return res.status(405).json({ erro: "Método informado não é válido" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ erro: "Erro ao editar tarefa. Tente novamente mais tarde" });
  }
};

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default validarTokenJWT(conectarMongoDB(endpointEdicaoDeCampos));
