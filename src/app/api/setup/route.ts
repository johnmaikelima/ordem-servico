import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/types/user';

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase();
    
    // Verifica se já existe algum usuário
    const usersCount = await db.collection('users').countDocuments();
    if (usersCount > 0) {
      return NextResponse.json(
        { error: 'Setup já foi realizado' },
        { status: 400 }
      );
    }

    // Cria o primeiro usuário admin
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser: User = {
      name: 'Administrador',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'admin'
    };

    await db.collection('users').insertOne(adminUser);

    return NextResponse.json({
      message: 'Usuário administrador criado com sucesso',
      email: adminUser.email,
      password: 'admin123'
    });
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
    return NextResponse.json(
      { error: 'Erro ao criar usuário admin' },
      { status: 500 }
    );
  }
}
