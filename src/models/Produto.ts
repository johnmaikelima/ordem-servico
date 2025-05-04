import mongoose from 'mongoose';

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  quantidade: { type: Number, required: true },
  precoUnitario: { type: Number, required: true },
  categoria: { type: String, required: true },
  dataCadastro: { type: Date, default: Date.now }
});

export default mongoose.models.Produto || mongoose.model('Produto', produtoSchema);
