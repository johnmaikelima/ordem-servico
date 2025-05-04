import mongoose from 'mongoose';

const ordemServicoSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
  prestador: { type: mongoose.Schema.Types.ObjectId, ref: 'Prestador', required: true },
  dataPrevisao: { type: Date, required: true },
  descricao: { type: String, required: true },
  servicos: [{
    descricao: { type: String, required: true },
    quantidade: { type: Number, required: true },
    precoUnitario: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  produtos: [{
    produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
    quantidade: { type: Number, required: true },
    precoUnitario: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  status: {
    type: String,
    enum: ['Aberta', 'Em Andamento', 'Concluída', 'Cancelada'],
    default: 'Aberta'
  },
  valorServicos: { type: Number, required: true },
  valorProdutos: { type: Number, required: true },
  valorTotal: { type: Number, required: true },
  dataCriacao: { type: Date, default: Date.now }
});

export default mongoose.models.OrdemServico || mongoose.model('OrdemServico', ordemServicoSchema);
