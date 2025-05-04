import mongoose from 'mongoose';

const prestadorSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true, unique: true },
  especialidade: { type: String, required: true },
  telefone: { type: String, required: true },
  email: { type: String, required: true },
  dataCadastro: { type: Date, default: Date.now }
});

export default mongoose.models.Prestador || mongoose.model('Prestador', prestadorSchema);
