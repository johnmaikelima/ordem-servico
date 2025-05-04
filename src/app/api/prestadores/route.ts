import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    
    const prestadores = await db.collection("prestadores").find({}).toArray();
    return NextResponse.json(prestadores);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar prestadores" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    
    const prestador = await db.collection("prestadores").insertOne(body);
    return NextResponse.json(prestador, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar prestador" }, { status: 500 });
  }
}
