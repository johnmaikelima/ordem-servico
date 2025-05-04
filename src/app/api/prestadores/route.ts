import { NextResponse, NextRequest } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    
    const prestadores = await db.collection("prestadores").find({}).toArray();
    
    if (!prestadores) {
      return NextResponse.json({ error: 'Nenhum prestador encontrado' }, { status: 404 });
    }

    return NextResponse.json(prestadores);
  } catch (error) {
    console.error('Erro ao buscar prestadores:', error);
    return NextResponse.json(
      { error: 'Erro interno ao buscar prestadores' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    
    const result = await db.collection("prestadores").insertOne(body);
    
    if (!result.insertedId) {
      return NextResponse.json(
        { error: 'Erro ao criar prestador' },
        { status: 400 }
      );
    }

    return NextResponse.json({ _id: result.insertedId });
  } catch (error) {
    console.error('Erro ao criar prestador:', error);
    return NextResponse.json(
      { error: 'Erro interno ao criar prestador' },
      { status: 500 }
    );
  }
}
