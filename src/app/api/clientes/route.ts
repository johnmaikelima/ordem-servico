import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    const clientes = await db
      .collection("clientes")
      .find({})
      .toArray();

    return NextResponse.json(clientes);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validação do nome
    if (!body.nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    
    // Estrutura o documento antes de inserir
    const cliente = {
      nome: body.nome,
      tipo_documento: body.tipo_documento || 'cpf',
      documento: body.documento || '',
      telefone: body.telefone || '',
      email: body.email || '',
      endereco: body.endereco ? {
        rua: body.endereco.rua || '',
        numero: body.endereco.numero || '',
        bairro: body.endereco.bairro || '',
        cidade: body.endereco.cidade || '',
        estado: body.endereco.estado || '',
        cep: body.endereco.cep || ''
      } : {
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      }
    };
    
    const result = await db.collection("clientes").insertOne(cliente);
    
    return NextResponse.json(
      { ...cliente, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao criar cliente: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    if (!body._id) {
      return NextResponse.json(
        { error: 'ID do cliente é obrigatório' },
        { status: 400 }
      );
    }

    // Validação do nome
    if (!body.nome) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    
    // Estrutura o documento para atualização
    const cliente = {
      nome: body.nome,
      tipo_documento: body.tipo_documento || 'cpf',
      documento: body.documento || '',
      telefone: body.telefone || '',
      email: body.email || '',
      endereco: body.endereco ? {
        rua: body.endereco.rua || '',
        numero: body.endereco.numero || '',
        bairro: body.endereco.bairro || '',
        cidade: body.endereco.cidade || '',
        estado: body.endereco.estado || '',
        cep: body.endereco.cep || ''
      } : {
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      }
    };
    
    const result = await db.collection("clientes").updateOne(
      { _id: new ObjectId(body._id) },
      { $set: cliente }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { ...cliente, _id: body._id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar cliente: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID do cliente é obrigatório' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("assistencia_tecnica");
    
    const result = await db.collection("clientes").deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Cliente excluído com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir cliente: ' + (error as Error).message },
      { status: 500 }
    );
  }
}
