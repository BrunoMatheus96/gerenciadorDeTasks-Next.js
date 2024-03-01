import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validarTokenJWT = (handler: NextApiHandler) =>
    (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) => {

        //Tratamento de excessão
        try {
            //Pegando a chave de acesso
            const { MINHA_CHAVE_JWT } = process.env;

            /*Verificar se a chave de segurança ta preenchida
            Caso a chave não esteja preenchida, vai retornar 500*/
            if (!MINHA_CHAVE_JWT) {
                return res.status(500).json({ erro: 'ENV chave JWT nao inforada na execucao do projeto' });
            }

            //Validando o header e verificando se o Token está sendo enviado ou não. Se o usuário está ou não autorizado.
            if (!req || !req.headers) {
                return res.status(401).json({ erro: 'Nao foi possivel validar o token de acesso' });
            }

            //Validando se o método é diferente de Options
            if (req.method !== 'OPTIONS') {
                const authorization = req.headers['authorization'];
                //Verificando de o Option tem valor, se sim ele vai barrar
                if (!authorization) {
                    return res.status(401).json({ erro: 'Nao foi possivel validar o token de acesso' });
                }

                //Validando se veio o Token
                const token = authorization.substring(7); //Esse 7 indica a posição no no VALUE do Header do Postman, indicando para ele ignorar os 7 primeiros caracteres que seria o "Bearer" + espaço
                //Validando se o Token é válido
                if (!token) {
                    return res.status(401).json({ erro: 'Nao foi possivel validar o token de acesso' });
                }

                //Buscando o Token, decodificando ele e verirficando o token da chave
                const decoded = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
                //Caso não consiga decodificar o token
                if (!decoded) {
                    return res.status(401).json({ erro: 'Nao foi possivel validar o token de acesso' });
                }

                //Verificando se a requisição tem uma query
                //Se não tiver, vai retornar vazio
                if (!req.query) {
                    req.query = {};
                }

                //Adicionando na Query o userId que está dentro do decoded. Dentro do decoded passamos o _is
                req.query.userId = decoded._id;
            }
        } catch (e) {
            console.log(e);
            return res.status(401).json({ erro: 'Nao foi possivel validar o token de acesso' });

        }

        return handler(req, res);
    }