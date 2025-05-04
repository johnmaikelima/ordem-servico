import { connectToDatabase } from './mongodb';
import { Document, Filter } from 'mongodb';

interface Counter extends Document {
  _id: string;
  sequence_value: number;
}

export async function getNextOSNumber(): Promise<string> {
  const { db } = await connectToDatabase();
  
  const filter: Filter<Counter> = { _id: 'osNumber' };
  
  // Primeiro, tenta encontrar o contador existente
  const existingCounter = await db.collection<Counter>('counters').findOne(filter);
  
  if (!existingCounter) {
    // Se não existe, cria com o valor inicial 966
    await db.collection<Counter>('counters').insertOne({
      _id: 'osNumber',
      sequence_value: 966
    });
  }
  
  // Incrementa o contador
  const counter = await db.collection<Counter>('counters').findOneAndUpdate(
    filter,
    { $inc: { sequence_value: 1 } },
    { 
      returnDocument: 'after'
    }
  );

  // O número retornado será 967 ou maior
  const nextNumber = counter?.value?.sequence_value || 967;
  
  return nextNumber.toString().padStart(4, '0'); // Formata com zeros à esquerda
}
