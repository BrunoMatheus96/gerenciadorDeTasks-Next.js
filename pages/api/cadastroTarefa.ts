import { conectarMongoDB } from "../../middlewares/conectarMongoDB";
import { validarTokenJWT } from "../../middlewares/validarTokenJWT";
import { TarefaModel } from "../../models/TarefaModel";
import { UsuarioModel } from "../../models/UsuarioModel";
import { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";
import { TarefaRequisicao } from "../../types/TarefaRequisicao";
import { validarRepeticaoTarefa } from "../../utils/validacao.js";

const endpointCadastroTarefa = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    const { userId } = req.query; // Usando um destructor cria uma constante userID com a propriedade userID que vem no query da request se a request existe

    //Definição da requisição e tratativa do método
    //Se meu método for um POST então ele irá requisitar um payload
    if (req.method === "POST") {
      const tarefa = req.body as TarefaRequisicao;

      //Validações do Título
      if (!tarefa.titulo) {
        return res.status(400).json({ erro: `O campo título é obrigatório` });
      }

      if (tarefa.titulo.length > 60) {
        console.log("Paassou de 60 caracteres");
        return res.status(413).json({ erro: `Limite de caracteres alcançado` });
      }

      //Validações da Descrição
      if (tarefa.descricao.length >= 160) {
        console.log("Paassou de 160 caracteres");
        return res.status(413).json({ erro: `Limite de caracteres alcançado` });
      }

      //Validações de "Hora"

      // Validações do "Dia todo?"
      if (
        typeof tarefa.diaTodo !== "undefined" &&
        typeof tarefa.diaTodo !== "boolean"
      ) {
        return res.status(400).json({
          erro: `O campo 'diaTodo' deve ser do tipo booleano (true ou false)`,
        });
      }

      //Validações do "Se repete?"
      if (!validarRepeticaoTarefa(tarefa.repeticao)) {
        return res
          .status(400)
          .json({ erro: `Essa opção no campo 'repetição' não é válida` });
      }

      const usuarioLogado = await UsuarioModel.findById(userId); // Busca no Banco de Dados o usuário pelo id

      //salvar no banco de dados
      const tarefaASerSalva = {
        // Cria uma const com o que é esperado de uma tarefa e isso foi definido no Model
        idUsuario: usuarioLogado._id,
        tituloTarefa: tarefa.titulo,
        descricao: tarefa.descricao,
        data: tarefa.data ? moment(tarefa.data, "DD/MM/YYYY hh:mm") : "",
        diaTodo: tarefa.diaTodo,
        repeticao: tarefa.repeticao,
        conclusao: tarefa.conclusao,
      };

      await TarefaModel.create(tarefaASerSalva); // O método create cria o objeto definido em tarefaASerSalvo na Coleção
      console.log(tarefa);
      return res.status(200).json({ msg: "Tarefa criada com sucesso!" });
    }
    console.log("Foi requisitado um " + req.method + ` mas correto é um POST`);
    return res.status(405).json({ erro: "Método informado não é válido" });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ erro: "Erro ao cadastrar tarefa. Tente novamente mais tarde" });
  }
};

/*Essa linha faz com que quando o if for chamado, ele primeiro vai tentar se conectar ao banco de dados e depois executar o endpoint (if)*/
export default validarTokenJWT(conectarMongoDB(endpointCadastroTarefa));
