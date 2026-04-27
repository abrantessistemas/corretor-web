import { MongoClient } from 'mongodb';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const uri = process.env["MONGODB_URI"]; // Variável de ambiente segura
const client = new MongoClient(uri as string);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Bloqueia qualquer método que não seja POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        await client.connect();
        const database = client.db('meu_banco_de_dados');
        const collection = database.collection('mensagens');

        // Insere os dados que vieram do formulário Angular
        const resultado = await collection.insertOne(req.body);

        return res.status(200).json({ mensagem: 'Sucesso!', id: resultado.insertedId });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao conectar no MongoDB' });
    } finally {
        await client.close();
    }
}