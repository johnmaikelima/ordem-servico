import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Verifica se é uma imagem
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "O arquivo deve ser uma imagem" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Garante que o diretório public existe
    const publicDir = join(process.cwd(), 'public');
    const uploadsDir = join(publicDir, 'uploads');
    
    if (!existsSync(publicDir)) {
      await mkdir(publicDir, { recursive: true });
    }
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = join(file.name);
    const filename = file.name.replace(/\.[^/.]+$/, '') + '-' + uniqueSuffix + extension;
    const filepath = join(uploadsDir, filename);
    
    await writeFile(filepath, buffer);
    
    return NextResponse.json({ 
      success: true,
      filename: '/uploads/' + filename
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload: ' + error.message },
      { status: 500 }
    );
  }
}
