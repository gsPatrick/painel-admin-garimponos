// src/app/send/_components/Modal_ContactForm.js
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AuthInput } from '@/components/auth/AuthInput'; // Reutilizamos nosso AuthInput para consistência

export default function Modal_ContactForm({ open, onOpenChange, onSave, existingContact }) {
  // Estado único para todos os campos do formulário
  const [formData, setFormData] = useState({ name: '', email: '', cpf: '', phone: '' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Efeito para popular ou limpar o formulário quando o modal é aberto
  useEffect(() => {
    if (open) {
      if (existingContact) {
        // Modo Edição: Preenche com os dados do contato existente
        setFormData({
          name: existingContact.name || '',
          email: existingContact.email || '',
          cpf: existingContact.cpf || '',
          phone: existingContact.phone || '',
        });
      } else {
        // Modo Criação: Limpa todos os campos
        setFormData({ name: '', email: '', cpf: '', phone: '' });
      }
      setError(''); // Limpa mensagens de erro de usos anteriores
    }
  }, [existingContact, open]);

  // Handler genérico para atualizar o estado de todos os inputs
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  // Handler para o envio do formulário
  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      setError("Nome e Email são campos obrigatórios.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      // O payload agora é simplesmente o estado do formulário.
      // A validação e formatação do número ocorrerão no backend.
      await onSave(formData);
      onOpenChange(false); // Fecha o modal em caso de sucesso
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao salvar o contato.');
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!existingContact;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 text-center">
            {isEditing ? 'Editar Signatário' : 'Adicionar Novo Signatário'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <AuthInput id="name" label="Nome *" required onChange={handleChange} value={formData.name} />
          <AuthInput id="email" label="Email *" type="email" required onChange={handleChange} value={formData.email} />
          <AuthInput id="cpf" label="CPF (opcional)" mask="999.999.999-99" onChange={handleChange} value={formData.cpf} />
          
          {/* --- CAMPO DE TELEFONE SIMPLIFICADO --- */}
          <AuthInput
            id="phone"
            label="Celular (com código do país)"
            type="tel"
            placeholder="5571988887777"
            onChange={handleChange}
            value={formData.phone}
            // Nenhuma máscara é aplicada aqui, o usuário tem liberdade total
          />
          {/* -------------------------------------- */}

          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading} className="bg-[#1c4ed8] hover:bg-[#1c4ed8]/90">
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}