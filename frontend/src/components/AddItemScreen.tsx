import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Camera,
  CheckCircle2,
  DollarSign,
  Info,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from 'lucide-react';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppHeader } from '@/components/ui/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageContainer from '@/components/ui/page-container';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';

import type { AddItemData, Category, ItemSpecification } from '@/types';

interface AddItemScreenProps {
  onBack: () => void;
  onSave: (item: AddItemData) => Promise<void>;
}

export default function AddItemScreen({ onBack, onSave }: AddItemScreenProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { categories, loadCategories } = useCategories();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AddItemData>({
    title: '',
    description: '',
    price: '',
    period: 'dia',
    categoryId: '',
    address: '',
    latitude: undefined,
    longitude: undefined,
    images: [],
    specifications: [],
  });

  const [newSpecification, setNewSpecification] = useState<ItemSpecification>({
    label: '',
    value: '',
  });

  // Estados para validação inline
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const totalSteps = 3;

  // Carregar categorias quando o componente montar
  useState(() => {
    loadCategories();
  });

  // Especificações comuns por categoria (mantidas como fallback)
  const SPECIFICATIONS_BY_CATEGORY: Record<string, string[]> = {
    'Ferramentas': ['Marca', 'Modelo', 'Potência', 'Condição', 'Garantia'],
    'Eletrônicos': ['Marca', 'Modelo', 'Voltagem', 'Condição', 'Garantia'],
    'Casa e Jardim': ['Marca', 'Modelo', 'Potência', 'Voltagem', 'Condição'],
    'Esportes': ['Marca', 'Modelo', 'Tamanho', 'Material', 'Condição'],
    'Livros e Mídia': ['Autor', 'Editora', 'Ano', 'Condição', 'Idioma'],
    'Música': ['Marca', 'Modelo', 'Tamanho', 'Material', 'Condição'],
    'Roupas e Acessórios': ['Marca', 'Modelo', 'Tamanho', 'Material', 'Condição'],
    'Veículos': ['Marca', 'Modelo', 'Capacidade', 'Condição', 'Certificação'],
  };

  // Função para marcar campo como tocado
  const markFieldAsTouched = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
  };

  // Função para verificar se campo é válido
  const isFieldValid = (fieldName: string) => {
    if (!touchedFields.has(fieldName)) return true;

    switch (fieldName) {
      case 'title': {
        return formData.title.trim().length > 0;
      }
      case 'categoryId': {
        return formData.categoryId.length > 0;
      }
      case 'description': {
        return formData.description.trim().length > 0;
      }
      case 'price': {
        return formData.price && parseFloat(formData.price) > 0;
      }
      case 'address': {
        return formData.address.trim().length > 0;
      }
      case 'images': {
        return formData.images.length > 0;
      }
      default:
        return true;
    }
  };

  // Função para obter mensagem de erro do campo
  const getFieldError = (fieldName: string) => {
    if (!touchedFields.has(fieldName)) return '';

    switch (fieldName) {
      case 'title': {
        return formData.title.trim().length === 0 ? 'Título é obrigatório' : '';
      }
      case 'categoryId': {
        return formData.categoryId.length === 0 ? 'Categoria é obrigatória' : '';
      }
      case 'description': {
        return formData.description.trim().length === 0 ? 'Descrição é obrigatória' : '';
      }
      case 'price': {
        return !formData.price || parseFloat(formData.price) <= 0
          ? 'Preço deve ser maior que zero'
          : '';
      }
      case 'address': {
        return formData.address.trim().length === 0 ? 'Endereço é obrigatório' : '';
      }
      case 'images': {
        return formData.images.length === 0 ? 'Adicione pelo menos uma imagem' : '';
      }
      default:
        return '';
    }
  };

  // Validação do formulário
  const validateForm = () => {
    const requiredFields = ['title', 'categoryId', 'description', 'price', 'address', 'images'];

    for (const field of requiredFields) {
      if (!isFieldValid(field)) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos obrigatórios.',
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1: {
        const fields = ['title', 'categoryId', 'description', 'price'];
        return fields.every((field) => isFieldValid(field));
      }
      case 2: {
        const fields = ['address'];
        return fields.every((field) => isFieldValid(field));
      }
      case 3: {
        const fields = ['images'];
        return fields.every((field) => isFieldValid(field));
      }
      default:
    return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      // Marcar campos como tocados para mostrar erros
      const fields = currentStep === 1 ? ['title', 'categoryId', 'description', 'price'] : 
                    currentStep === 2 ? ['address'] : ['images'];
      fields.forEach(markFieldAsTouched);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImage(true);
    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Tipo de arquivo inválido',
            description: 'Por favor, selecione apenas arquivos de imagem.',
            variant: 'destructive',
          });
          continue;
        }

        // Validar tamanho (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'Arquivo muito grande',
            description: 'Por favor, selecione imagens menores que 5MB.',
            variant: 'destructive',
          });
          continue;
        }

        // Converter para base64
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new window.FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newImages.push(base64);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));

      markFieldAsTouched('images');
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Erro ao fazer upload',
        description: 'Ocorreu um erro ao processar as imagens. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        toast({
          title: 'Geolocalização não suportada',
          description: 'Seu navegador não suporta geolocalização.',
          variant: 'destructive',
        });
        return;
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude } = position.coords;
      setFormData((prev) => ({
        ...prev,
        latitude,
        longitude,
      }));

      // Tentar obter endereço usando reverse geocoding
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        if (data.display_name) {
          setFormData((prev) => ({
            ...prev,
            address: data.display_name,
          }));
        }
      } catch (error) {
        console.error('Error getting address:', error);
      }

      toast({
        title: 'Localização obtida',
        description: 'Sua localização atual foi definida com sucesso.',
      });
    } catch (error) {
      console.error('Error getting location:', error);
      toast({
        title: 'Erro ao obter localização',
        description: 'Não foi possível obter sua localização atual.',
        variant: 'destructive',
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

  const addSpecification = () => {
    if (newSpecification.label.trim() && newSpecification.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: [...(prev.specifications || []), { ...newSpecification }],
      }));
      setNewSpecification({ label: '', value: '' });
    }
  };

  const removeSpecification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications?.filter((_, i) => i !== index) || [],
    }));
  };

  const addSuggestedSpecifications = () => {
    const category = categories.find((c) => c.id === formData.categoryId);
    if (!category) return;

    const suggestedSpecs = SPECIFICATIONS_BY_CATEGORY[category.name] || [];
    const existingLabels = formData.specifications?.map((s) => s.label.toLowerCase()) || [];

    const newSpecs = suggestedSpecs
      .filter((label) => !existingLabels.includes(label.toLowerCase()))
      .map((label) => ({ label, value: '' }));

    setFormData((prev) => ({
      ...prev,
      specifications: [...(prev.specifications || []), ...newSpecs],
    }));

    toast({
      title: 'Especificações adicionadas',
      description: `${newSpecs.length} especificação(ões) sugerida(s) foi adicionada.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      toast({
        title: 'Item adicionado com sucesso!',
        description: 'Seu item foi publicado e está disponível para aluguel.',
      });
      navigate('/');
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: 'Erro ao salvar item',
        description: 'Ocorreu um erro ao salvar o item. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        showBackButton
        title="Adicionar Item"
        user={
          user
            ? {
                id: 'temp-id',
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            : null
        }
        onBack={onBack}
      />
      <PageContainer>
        {/* Progress Bar - Seguindo design system */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-title-lg font-semibold text-foreground">
              Etapa {currentStep} de {totalSteps}
            </span>
            <span className="text-body-sm text-muted-foreground">
              {Math.round((currentStep / totalSteps) * 100)}% completo
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Etapa 1: Informações Básicas */}
          {currentStep === 1 && (
            <Card className="bg-surface animate-fade-in border-border shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-title-lg flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  Informações Básicas
                </CardTitle>
                <CardDescription className="text-body">
                  Descreva o item que você quer disponibilizar para aluguel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Seletor de categoria - Design system atualizado */}
                <div>
                  <Label className="text-body mb-4 block font-semibold text-foreground">
                    Categoria <span className="text-error">*</span>
                  </Label>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        aria-label={cat.name}
                        aria-pressed={formData.categoryId === cat.id}
                        className={cn(
                          'flex min-h-[44px] flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                          formData.categoryId === cat.id
                            ? 'border-primary bg-primary/5 text-primary shadow-md'
                            : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:bg-primary/5'
                        )}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, categoryId: cat.id }))}
                      >
                        <span className="text-2xl">{cat.icon}</span>
                        <span className="text-body-sm font-medium">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                  {getFieldError('categoryId') && (
                    <p className="text-body-sm mt-2 flex items-center gap-2 text-error">
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError('categoryId')}
                    </p>
                  )}
                </div>

                {/* Título */}
                <div>
                  <Label
                    className="text-body mb-2 block font-semibold text-foreground"
                    htmlFor="title"
                  >
                    Título <span className="text-error">*</span>
                  </Label>
                  <Input
                    aria-describedby={getFieldError('title') ? 'title-error' : undefined}
                    className={cn(
                      'text-body h-12 transition-all duration-200',
                      !isFieldValid('title') && touchedFields.has('title')
                        ? 'border-error focus:border-error focus:ring-error/20'
                        : 'focus:border-primary focus:ring-primary/20'
                    )}
                    id="title"
                    placeholder="Ex: Furadeira Bosch 500W"
                    value={formData.title}
                    onBlur={() => markFieldAsTouched('title')}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  />
                  {getFieldError('title') && (
                    <p
                      className="text-body-sm mt-2 flex items-center gap-2 text-error"
                      id="title-error"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError('title')}
                    </p>
                  )}
                </div>

                {/* Descrição */}
                <div>
                  <Label
                    className="text-body mb-2 block font-semibold text-foreground"
                    htmlFor="description"
                  >
                    Descrição <span className="text-error">*</span>
                  </Label>
                  <Textarea
                    aria-describedby={
                      getFieldError('description') ? 'description-error' : undefined
                    }
                    className={cn(
                      'text-body min-h-[120px] transition-all duration-200',
                      !isFieldValid('description') && touchedFields.has('description')
                        ? 'border-error focus:border-error focus:ring-error/20'
                        : 'focus:border-primary focus:ring-primary/20'
                    )}
                    id="description"
                    placeholder="Descreva o item, estado de conservação, funcionalidades, etc."
                    value={formData.description}
                    onBlur={() => markFieldAsTouched('description')}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                  {getFieldError('description') && (
                    <p
                      className="text-body-sm mt-2 flex items-center gap-2 text-error"
                      id="description-error"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError('description')}
                    </p>
                  )}
                </div>

                {/* Especificações */}
                {formData.categoryId && (
                  <div>
                    <div className="mb-4 flex items-center justify-between">
                      <Label className="text-body flex items-center gap-2 font-semibold text-foreground">
                        <Info className="h-4 w-4 text-primary" />
                        Especificações
                      </Label>
                      <Button
                        className="h-8 px-3 text-xs"
                        disabled={isSubmitting}
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={addSuggestedSpecifications}
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Sugeridas
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {formData.specifications?.map((spec, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            className="flex-1"
                            placeholder="Especificação"
                            value={spec.label}
                            onChange={(e) => {
                              const newSpecs = [...(formData.specifications || [])];
                              newSpecs[index].label = e.target.value;
                              setFormData({ ...formData, specifications: newSpecs });
                            }}
                          />
                          <Input
                            className="flex-1"
                            placeholder="Valor"
                            value={spec.value}
                            onChange={(e) => {
                              const newSpecs = [...(formData.specifications || [])];
                              newSpecs[index].value = e.target.value;
                              setFormData({ ...formData, specifications: newSpecs });
                            }}
                          />
                          <Button
                            className="h-10 w-10"
                            size="icon"
                            type="button"
                            variant="outline"
                            onClick={() => removeSpecification(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}

                      <div className="flex gap-2">
                        <Input
                          className="flex-1"
                          placeholder="Nova especificação"
                          value={newSpecification.label}
                          onChange={(e) =>
                            setNewSpecification({ ...newSpecification, label: e.target.value })
                          }
                        />
                        <Input
                          className="flex-1"
                          placeholder="Valor"
                          value={newSpecification.value}
                          onChange={(e) =>
                            setNewSpecification({ ...newSpecification, value: e.target.value })
                          }
                        />
                        <Button
                          className="h-10 w-10"
                          size="icon"
                          type="button"
                          variant="outline"
                          onClick={addSpecification}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Etapa 2: Preço e Localização */}
          {currentStep === 2 && (
            <Card className="bg-surface animate-fade-in border-border shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-title-lg flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  Preço e Localização
                </CardTitle>
                <CardDescription className="text-body">
                  Defina o preço de aluguel e a localização do item
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label
                      className="text-body mb-2 block font-semibold text-foreground"
                      htmlFor="price"
                    >
                      Preço de Aluguel <span className="text-error">*</span>
                    </Label>
                    <Input
                      aria-describedby={getFieldError('price') ? 'price-error' : undefined}
                      className={cn(
                        'text-body h-12 transition-all duration-200',
                        !isFieldValid('price') && touchedFields.has('price')
                          ? 'border-error focus:border-error focus:ring-error/20'
                          : 'focus:border-primary focus:ring-primary/20'
                      )}
                      id="price"
                      min="0"
                      placeholder="Ex: 25,00"
                      step="0.01"
                      type="number"
                      value={formData.price}
                      onBlur={() => markFieldAsTouched('price')}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    />
                    {getFieldError('price') && (
                      <p
                        className="text-body-sm mt-2 flex items-center gap-2 text-error"
                        id="price-error"
                      >
                        <AlertCircle className="h-4 w-4" />
                        {getFieldError('price')}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      className="text-body mb-2 block font-semibold text-foreground"
                      htmlFor="period"
                    >
                      Período
                    </Label>
                    <Select
                      value={formData.period}
                      onValueChange={(value) => setFormData({ ...formData, period: value as any })}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hora">Por hora</SelectItem>
                        <SelectItem value="dia">Por dia</SelectItem>
                        <SelectItem value="semana">Por semana</SelectItem>
                        <SelectItem value="mes">Por mês</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    className="text-body mb-2 block font-semibold text-foreground"
                    htmlFor="address"
                  >
                    Endereço <span className="text-error">*</span>
                  </Label>
                  <div className="space-y-3">
                    <Input
                      aria-describedby={getFieldError('address') ? 'address-error' : undefined}
                      className={cn(
                        'text-body h-12 transition-all duration-200',
                        !isFieldValid('address') && touchedFields.has('address')
                          ? 'border-error focus:border-error focus:ring-error/20'
                          : 'focus:border-primary focus:ring-primary/20'
                      )}
                      id="address"
                      placeholder="Digite o endereço completo"
                      value={formData.address}
                      onBlur={() => markFieldAsTouched('address')}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                    <Button
                      className="h-12 w-full"
                      disabled={isGettingLocation || isSubmitting}
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                    >
                      {isGettingLocation ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Obtendo localização...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Usar minha localização atual
                        </>
                      )}
                    </Button>
                  </div>
                  {getFieldError('address') && (
                    <p
                      className="text-body-sm mt-2 flex items-center gap-2 text-error"
                      id="address-error"
                    >
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError('address')}
                    </p>
                  )}
                  {formData.address.trim().length > 0 && isFieldValid('address') && (
                    <p className="text-body-sm mt-2 flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      Endereço válido
                    </p>
                  )}
                </div>

                {/* Coordenadas (ocultas) */}
                {(formData.latitude !== undefined || formData.longitude !== undefined) && (
                  <Alert>
                    <MapPin className="h-4 w-4" />
                    <AlertTitle>Coordenadas definidas</AlertTitle>
                    <AlertDescription>
                      Lat: {formData.latitude?.toFixed(6)}, Lon: {formData.longitude?.toFixed(6)}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Etapa 3: Imagens */}
          {currentStep === 3 && (
            <Card className="bg-surface animate-fade-in border-border shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="text-title-lg flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  Imagens do Item
                </CardTitle>
                <CardDescription className="text-body">
                  Adicione fotos do item para que as pessoas possam vê-lo melhor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Upload de Imagens */}
                <div>
                  <Label className="text-body mb-4 block font-semibold text-foreground">
                    Fotos do Item <span className="text-error">*</span>
                    {formData.images.length > 0 && (
                      <CheckCircle2 className="ml-2 inline h-4 w-4 text-success" />
                    )}
                  </Label>
                  <p className="text-body-sm mb-4 text-muted-foreground">
                    Adicione até 5 imagens (máximo 5MB cada)
                  </p>

                  <div className="space-y-4">
                    <input
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      className="hidden"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <Button
                      className="h-16 w-full border-2 border-dashed"
                      disabled={isUploadingImage || formData.images.length >= 5}
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Fazendo upload...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-5 w-5" />
                          Selecionar Imagens
                        </>
                      )}
                    </Button>
                  </div>

                  {getFieldError('images') && (
                    <p className="text-body-sm mt-2 flex items-center gap-2 text-error">
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError('images')}
                    </p>
                  )}
                </div>

                {/* Preview das Imagens */}
                {formData.images.length > 0 && (
                  <div>
                    <Label className="text-body mb-4 block font-semibold text-foreground">
                      Imagens Selecionadas ({formData.images.length}/5)
                    </Label>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {formData.images.map((image, index) => (
                        <div key={index} className="group relative">
                          <img
                            alt={`Imagem ${index + 1}`}
                            className="h-32 w-full rounded-lg border border-border object-cover shadow-sm"
                            src={image}
                          />
                          <Button
                            className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                            size="icon"
                            type="button"
                            variant="destructive"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dicas */}
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Dicas para boas fotos:</AlertTitle>
                  <AlertDescription className="mt-2 space-y-1">
                    <div>• Tire fotos em boa luz natural</div>
                    <div>• Mostre o item de diferentes ângulos</div>
                    <div>• Inclua detalhes importantes como marca e modelo</div>
                    <div>• Evite fotos borradas ou escuras</div>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Navegação entre Etapas */}
          <div className="flex gap-4 pt-4">
            {currentStep > 1 && (
              <Button
                className="h-12 flex-1"
                disabled={isSubmitting}
                type="button"
                variant="outline"
                onClick={prevStep}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            )}
            {currentStep < totalSteps ? (
              <Button
                className="h-12 flex-1"
                disabled={isSubmitting}
                type="button"
                onClick={nextStep}
              >
                Próximo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button className="h-12 flex-1" disabled={isSubmitting} type="submit">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  'Publicar Item'
                )}
              </Button>
            )}
          </div>
        </form>
      </PageContainer>
    </div>
  );
}
