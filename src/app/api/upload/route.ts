import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Verifica se é uma imagem
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "O arquivo deve ser uma imagem" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Cria um nome único para o arquivo
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `${timestamp}${extension}`;
    
    // Define o caminho para salvar o arquivo
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Cria o diretório se não existir
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, filename);
    
    // Salva o arquivo
    await writeFile(filePath, buffer);
    
    // Retorna a URL do arquivo
    const fileUrl = `/uploads/${filename}`;
    
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    return NextResponse.json({ 
      error: "Erro ao fazer upload do arquivo",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
