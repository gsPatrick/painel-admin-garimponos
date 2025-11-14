// src/app/(dashboard)/settings/page.js
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

// Importação dos componentes de UI
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AuthInput } from "@/components/auth/AuthInput";
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();

  // Estado para os dados do formulário de perfil
  const [profileData, setProfileData] = useState({ name: '', phone: '', email: '' });
  // Estado para os dados do formulário de alteração de senha
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  
  // Estados para controlar o feedback visual (loading e mensagens)
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Preenche o formulário com os dados do usuário assim que eles estiverem disponíveis
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phoneWhatsE164 || '',
        email: user.email || '',
      });
    }
  }, [user]);

  // Handlers para atualizar o estado dos formulários
  const handleProfileChange = (e) => {
    setProfileData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };
  
  /**
   * Função para enviar a atualização do perfil para a API.
   */
  const handleUpdateProfile = async (e) => {
    e.preventDefault(); // Previne o recarregamento da página
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });
    try {
      await api.patch('/users/me', {
        name: profileData.name,
        phoneWhatsE164: profileData.phone,
      });
      setProfileMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      setProfileMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao atualizar o perfil.' });
    } finally {
      setProfileLoading(false);
    }
  };
  
  /**
   * Função para enviar a alteração de senha para a API.
   */
  const handleUpdatePassword = async (e) => {
    e.preventDefault(); // Previne o recarregamento da página
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    try {
      await api.patch('/users/me/change-password', passwordData);
      setPasswordMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
      setPasswordData({ currentPassword: '', newPassword: '' }); // Limpa os campos
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao atualizar a senha.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Exibe um esqueleto de UI enquanto o usuário está sendo autenticado
  if (authLoading) {
    return (
        <main className="flex-1 p-6 space-y-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-12 w-48 mt-4" />
            <div className="space-y-6 mt-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </main>
    );
  }

  return (
    <main className="flex-1 p-6 space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Configurações</h2>
      <Tabs defaultValue="perfil">
        <TabsList className="bg-transparent p-0 h-auto">
          <TabsTrigger value="perfil" className="text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2">
            Perfil
          </TabsTrigger>
          <TabsTrigger value="conta" className="text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-lg px-4 py-2">
            Conta
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil" className="mt-6">
          <div className="space-y-6">
            {/* Card: Dados do Perfil com tag <form> explícita */}
            <Card className="bg-white shadow-sm rounded-xl border">
              <form onSubmit={handleUpdateProfile}>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">Dados do perfil</CardTitle>
                  <CardDescription>Atualize seu nome e informações de contato.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AuthInput id="name" label="Nome *" value={profileData.name} onChange={handleProfileChange} />
                    <AuthInput id="phone" label="Telefone" mask="(99) 99999-9999" value={profileData.phone} onChange={handleProfileChange} />
                    <AuthInput id="email" label="Email" value={profileData.email} readOnly disabled />
                  </div>
                  {profileMessage.text && (
                    <p className={`text-sm font-medium ${profileMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {profileMessage.text}
                    </p>
                  )}
                  <div className="flex justify-end">
                      <Button type="submit" disabled={profileLoading} className="bg-[#1c4ed8] hover:bg-[#1c4ed8]/90">
                          {profileLoading ? 'Salvando...' : 'Salvar dados pessoais'}
                      </Button>
                  </div>
                </CardContent>
              </form>
            </Card>

            {/* Card: Alterar Senha com tag <form> explícita */}
            <Card className="bg-white shadow-sm rounded-xl border">
              <form onSubmit={handleUpdatePassword}>
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-gray-800">Alterar Senha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AuthInput id="currentPassword" label="Senha atual" type="password" required value={passwordData.currentPassword} onChange={handlePasswordChange} />
                      <AuthInput id="newPassword" label="Nova senha" type="password" required value={passwordData.newPassword} onChange={handlePasswordChange} />
                   </div>
                   {passwordMessage.text && (
                    <p className={`text-sm font-medium ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                      {passwordMessage.text}
                    </p>
                   )}
                   <div className="flex justify-end">
                      <Button type="submit" disabled={passwordLoading} className="bg-[#1c4ed8] hover:bg-[#1c4ed8]/90">
                          {passwordLoading ? 'Atualizando...' : 'Atualizar senha'}
                      </Button>
                  </div>
                </CardContent>
              </form>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conta" className="mt-6">
            <Card className="bg-white shadow-sm rounded-xl border">
                <CardHeader><CardTitle>Dados da Conta</CardTitle></CardHeader>
                <CardContent><p>Conteúdo da aba Conta (a ser implementado).</p></CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}