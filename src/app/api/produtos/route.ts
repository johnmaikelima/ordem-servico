import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    const produtos = await db
      .collection("produtos")
      .find({})
      .toArray();

    return NextResponse.json(produtos);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    const data = await request.json();

    const result = await db.collection("produtos").insertOne(data);
    return NextResponse.json({ success: true, data: result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 });
  }
}
