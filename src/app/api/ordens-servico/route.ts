import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getNextOSNumber } from '@/lib/counters';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const ordensServico = await db.collection('ordemservicos')
      .aggregate([
        {
          $lookup: {
            from: "clientes",
            localField: "cliente",
            foreignField: "_id",
            as: "clienteData"
          }
        },
        {
          $lookup: {
            from: "prestadors",
            localField: "prestador",
            foreignField: "_id",
            as: "prestadorData"
          }
        },
        {
          $addFields: {
            cliente: { $arrayElemAt: ["$clienteData", 0] },
            prestador: { $arrayElemAt: ["$prestadorData", 0] }
          }
        },
        {
          $project: {
            clienteData: 0,
            prestadorData: 0
          }
        },
        {
          $sort: { dataCriacao: -1 }
        }
      ])
      .toArray();

    return NextResponse.json(ordensServico);
  } catch (error) {
    console.error('Erro ao buscar ordens de serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ordens de serviço' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { db } = await connectToDatabase();

    // Gera o próximo número da OS
    const numero = await getNextOSNumber();

    // Cria a ordem de serviço com o número gerado
    const ordemServico = {
      ...data,
      numero,
      dataCriacao: new Date().toISOString(),
      status: 'aberto',
    };

    // Converte os IDs de string para ObjectId
    if (ordemServico.cliente) {
      ordemServico.cliente = new ObjectId(ordemServico.cliente);
    }
    if (ordemServico.prestador) {
      ordemServico.prestador = new ObjectId(ordemServico.prestador);
    }

    const result = await db.collection('ordemservicos').insertOne(ordemServico);

    return NextResponse.json({
      _id: result.insertedId,
      ...ordemServico
    });
  } catch (error) {
    console.error('Erro ao criar ordem de serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao criar ordem de serviço' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase();
    const data = await request.json();
    const { _id, ...updateData } = data;

    if (updateData.cliente) {
      updateData.cliente = new ObjectId(updateData.cliente);
    }
    if (updateData.prestador) {
      updateData.prestador = new ObjectId(updateData.prestador);
    }

    const result = await db.collection('ordemservicos').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Ordem de serviço não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao atualizar ordem de serviço:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar ordem de serviço' },
      { status: 500 }
    );
  }
}
