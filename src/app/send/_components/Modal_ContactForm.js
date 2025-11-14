"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AuthInput } from '@/components/auth/AuthInput';

// Agora recebe um contato existente para preencher o formulário no modo de edição
export default function Modal_ContactForm({ open, onOpenChange, onSave, existingContact }) {
  const [formData, setFormData] = useState({ name: '', email: '', cpf: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Preenche o formulário se um contato existente for passado (modo de edição)
  useEffect(() => {
    if (existingContact) {
      setFormData({
        name: existingContact.name || '',
        email: existingContact.email || '',
        cpf: existingContact.cpf || '',
        phone: existingContact.phone || '',
      });
    } else {
      // Limpa o formulário para o modo de criação
      setFormData({ name: '', email: '', cpf: '', phone: '' });
    }
  }, [existingContact, open]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      setError("Nome e Email são obrigatórios.");
      return;
    }
    setLoading(true);
    setError('');

    try {
      await onSave(formData); // A função onSave (passada como prop) fará a chamada de API
      onOpenChange(false);
    } catch (err) {
      setError(err.message || 'Erro ao salvar contato.');
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
          <AuthInput id="name" label="Nome" required onChange={handleChange} value={formData.name} />
          <AuthInput id="email" label="Email" type="email" required onChange={handleChange} value={formData.email} />
          <AuthInput id="cpf" label="CPF" mask="999.999.999-99" onChange={handleChange} value={formData.cpf} />
          <AuthInput id="phone" label="Celular" mask="(99) 99999-9999" onChange={handleChange} value={formData.phone} />
          {error && <p className="text-sm text-red-600">{error}</p>}
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