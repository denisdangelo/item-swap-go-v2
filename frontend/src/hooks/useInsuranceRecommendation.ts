import { useState, useEffect } from 'react';

interface InsuranceRecommendation {
  recommended: boolean;
  urgency: 'low' | 'medium' | 'high';
  reason: string;
  suggestedPlan: 'basic' | 'standard' | 'premium';
  potentialSavings: number;
  riskFactors: string[];
}

interface UseInsuranceRecommendationProps {
  itemPrice: number;
  itemCategory: string;
  ownerRating?: number;
  itemAge?: number;
}

export function useInsuranceRecommendation({
  itemPrice,
  itemCategory,
  ownerRating = 5,
  itemAge = 0,
}: UseInsuranceRecommendationProps): InsuranceRecommendation {
  const [recommendation, setRecommendation] = useState<InsuranceRecommendation>({
    recommended: false,
    urgency: 'low',
    reason: '',
    suggestedPlan: 'basic',
    potentialSavings: 0,
    riskFactors: [],
  });

  useEffect(() => {
    const calculateRecommendation = () => {
      const riskFactors: string[] = [];
      let riskScore = 0;

      // Análise por categoria
      const highRiskCategories = [
        'eletrônicos',
        'electronics',
        'ferramentas',
        'tools',
        'equipamentos',
        'equipment',
        'veículos',
        'vehicles',
      ];

      const mediumRiskCategories = [
        'móveis',
        'furniture',
        'eletrodomésticos',
        'appliances',
        'esportes',
        'sports',
        'música',
        'music',
      ];

      const categoryLower = itemCategory.toLowerCase();

      if (highRiskCategories.some((cat) => categoryLower.includes(cat))) {
        riskScore += 3;
        riskFactors.push('Categoria de alto risco');
      } else if (mediumRiskCategories.some((cat) => categoryLower.includes(cat))) {
        riskScore += 2;
        riskFactors.push('Categoria de risco moderado');
      }

      // Análise por preço
      if (itemPrice > 500) {
        riskScore += 3;
        riskFactors.push('Item de alto valor');
      } else if (itemPrice > 200) {
        riskScore += 2;
        riskFactors.push('Item de valor moderado');
      } else if (itemPrice > 100) {
        riskScore += 1;
        riskFactors.push('Item de valor médio');
      }

      // Análise por rating do proprietário
      if (ownerRating < 4) {
        riskScore += 2;
        riskFactors.push('Proprietário com rating baixo');
      } else if (ownerRating < 4.5) {
        riskScore += 1;
        riskFactors.push('Proprietário com rating moderado');
      }

      // Análise por idade do item (se disponível)
      if (itemAge > 5) {
        riskScore += 1;
        riskFactors.push('Item mais antigo');
      }

      // Determinar urgência e plano sugerido
      let urgency: 'low' | 'medium' | 'high' = 'low';
      let suggestedPlan: 'basic' | 'standard' | 'premium' = 'basic';
      let reason = '';

      if (riskScore >= 6) {
        urgency = 'high';
        suggestedPlan = 'premium';
        reason = 'Item de alto risco - proteção total recomendada';
      } else if (riskScore >= 4) {
        urgency = 'medium';
        suggestedPlan = 'standard';
        reason = 'Proteção recomendada para sua tranquilidade';
      } else if (riskScore >= 2) {
        urgency = 'low';
        suggestedPlan = 'basic';
        reason = 'Proteção básica oferece boa cobertura';
      } else {
        reason = 'Item de baixo risco, mas proteção ainda é recomendada';
      }

      // Calcular economia potencial
      const potentialLoss = itemPrice * 0.4; // 40% do valor em caso de dano
      const insuranceCosts = { basic: 5, standard: 10, premium: 15 };
      const potentialSavings = potentialLoss - insuranceCosts[suggestedPlan];

      setRecommendation({
        recommended: riskScore >= 2,
        urgency,
        reason,
        suggestedPlan,
        potentialSavings: Math.max(0, potentialSavings),
        riskFactors,
      });
    };

    calculateRecommendation();
  }, [itemPrice, itemCategory, ownerRating, itemAge]);

  return recommendation;
}
