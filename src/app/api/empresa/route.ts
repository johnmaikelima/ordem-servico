import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Empresa } from '@/types/empresa';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    
    const empresa = await db.collection("empresa").findOne({});
    return NextResponse.json(empresa);
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    return NextResponse.json({ error: "Erro ao buscar dados da empresa" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    
    // Verifica se já existe uma empresa cadastrada
    const existingEmpresa = await db.collection("empresa").findOne({});
    
    if (existingEmpresa) {
      // Se existir, atualiza
      await db.collection("empresa").updateOne(
        { _id: existingEmpresa._id },
        { $set: data }
      );
      return NextResponse.json({ message: "Empresa atualizada com sucesso" });
    } else {
      // Se não existir, cria
      await db.collection("empresa").insertOne(data);
      return NextResponse.json({ message: "Empresa cadastrada com sucesso" });
    }
  } catch (error) {
    console.error('Erro ao salvar empresa:', error);
    return NextResponse.json({ error: "Erro ao salvar dados da empresa" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    
    // Guarda o ID e remove do objeto para não tentar atualizar o _id
    const id = data._id;
    const { _id, ...updateData } = data;
    
    await db.collection("empresa").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    return NextResponse.json({ message: "Empresa atualizada com sucesso" });
  } catch (error) {
    console.error('Erro ao atualizar empresa:', error);
    return NextResponse.json({ 
      error: "Erro ao atualizar dados da empresa",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
