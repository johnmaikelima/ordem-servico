import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    
    const ordensServico = await db
      .collection("ordemservicos")
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
          $sort: { numero: -1 }
        }
      ])
      .toArray();

    return NextResponse.json(ordensServico);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao buscar ordens de serviço' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    const data = await request.json();

    // Converte os IDs de string para ObjectId
    if (data.cliente) {
      data.cliente = new ObjectId(data.cliente);
    }
    if (data.prestador) {
      data.prestador = new ObjectId(data.prestador);
    }

    // Se não foi fornecido um número, pega o último número e incrementa
    if (!data.numero) {
      const ultimaOS = await db
        .collection("ordemservicos")
        .findOne({}, { sort: { numero: -1 } });
      
      data.numero = ultimaOS ? String(Number(ultimaOS.numero) + 1) : "1";
    }

    // Define o status inicial como 'aberto' se não foi fornecido
    if (!data.status) {
      data.status = 'aberto';
    }

    // Adiciona a data de criação
    data.dataCriacao = new Date();

    const result = await db.collection("ordemservicos").insertOne(data);
    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao criar ordem de serviço' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    const data = await request.json();
    const { _id, ...updateData } = data;

    // Converte os IDs de string para ObjectId
    if (updateData.cliente) {
      updateData.cliente = new ObjectId(updateData.cliente);
    }
    if (updateData.prestador) {
      updateData.prestador = new ObjectId(updateData.prestador);
    }

    const result = await db.collection("ordemservicos").updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao atualizar ordem de serviço' }, { status: 500 });
  }
}
