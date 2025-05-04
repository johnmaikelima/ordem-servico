import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    const prestadores = await db
      .collection("prestadors")
      .find({})
      .toArray();

    return NextResponse.json(prestadores);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao buscar prestadores' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const prestador = await mongoose.model('Prestador').create(body);
    return NextResponse.json(prestador, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar prestador:', error);
    return NextResponse.json({ error: 'Erro ao criar prestador' }, { status: 500 });
  }
}
