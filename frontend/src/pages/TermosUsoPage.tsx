import { motion } from 'framer-motion';
import { FileText, Shield, Users, AlertTriangle, CheckCircle2, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { typography } from '@/styles/design-system';

export default function TermosUsoPage() {
  const lastUpdated = '15 de Janeiro de 2025';

  const sections = [
    {
      id: 'aceitacao',
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: '1. Aceitação dos Termos',
      content: [
        'Ao acessar e usar o Empresta aê, você concorda em cumprir estes Termos de Uso.',
        'Se você não concordar com qualquer parte destes termos, não deve usar nossos serviços.',
        'Reservamo-nos o direito de modificar ess termos a qualquer momento.',
        'É sua responsabilidade revisar periodicamente estes termos para estar ciente de quaisquer alterações.',
      ],
    },
    {
      id: 'servicos',
      icon: <Users className="h-5 w-5" />,
      title: '2. Descrição dos Serviços',
      content: [
        'O Empresta aê é uma plataforma que conecta pessoas que desejam alugar itens com pessoas que possuem esses itens.',
        'Facilitamos a comunicação entre usuários, mas não somos parte das transações entre eles.',
        'Não garantimos a disponibilidade, qualidade ou condição dos itens listados.',
        'Os usuários são responsáveis por suas próprias transações e acordos.',
      ],
    },
    {
      id: 'cadastro',
      icon: <FileText className="h-5 w-5" />,
      title: '3. Cadastro e Conta de Usuário',
      content: [
        'Para usar nossos serviços, você deve criar uma conta fornecendo informações precisas e atualizadas.',
        'Você é responsável por manter a confidencialidade de sua senha e por todas as atividades em sua conta.',
        'Deve notificar-nos imediatamente sobre qualquer uso não autorizado de sua conta.',
        'Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos.',
      ],
    },
    {
      id: 'responsabilidades',
      icon: <Shield className="h-5 w-5" />,
      title: '4. Responsabilidades dos Usuários',
      content: [
        'Você deve usar a plataforma de forma legal e respeitosa.',
        'É proibido publicar conteúdo ofensivo, ilegal ou que viole direitos de terceiros.',
        'Você é responsável pela veracidade das informações que fornece sobre seus itens.',
        'Deve cumprir todos os acordos feitos com outros usuários através da plataforma.',
      ],
    },
    {
      id: 'transacoes',
      icon: <Scale className="h-5 w-5" />,
      title: '5. Transações e Pagamentos',
      content: [
        'As transações são realizadas diretamente entre os usuários.',
        'O Empresta aê não é responsável por disputas relacionadas a pagamentos ou qualidade dos itens.',
        'Recomendamos o uso de métodos de pagamento seguros e a verificação dos itens antes do aluguel.',
        'Taxas de serviço podem ser aplicadas conforme nossa política de preços.',
      ],
    },
    {
      id: 'limitacoes',
      icon: <AlertTriangle className="h-5 w-5" />,
      title: '6. Limitações de Responsabilidade',
      content: [
        'O Empresta aê não se responsabiliza por danos, perdas ou prejuízos decorrentes do uso da plataforma.',
        'Não garantimos que o serviço será ininterrupto ou livre de erros.',
        'Nossa responsabilidade é limitada ao máximo permitido por lei.',
        'Você usa nossos serviços por sua própria conta e risco.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className={cn(typography.heading.h2, 'mb-4')}>Termos de Uso</h1>
          <p className={cn(typography.body.default, 'mx-auto max-w-2xl text-muted-foreground')}>
            Leia atentamente nossos termos de uso antes de utilizar a plataforma Empresta aê.
          </p>
          <Badge variant="secondary" className="mt-4">
            Última atualização: {lastUpdated}
          </Badge>
        </motion.div>

        {/* Introdução */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Importante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Estes Termos de Uso estabelecem as regras e condições para o uso da plataforma
                Empresta aê. Ao criar uma conta ou usar nossos serviços, você concorda em seguir
                estas diretrizes. Se tiver dúvidas, entre em contato conosco.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Seções dos Termos */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 3) }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/60" />
                        <p className="leading-relaxed text-muted-foreground">{item}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contato e Suporte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Dúvidas sobre os Termos?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                Se você tiver alguma dúvida sobre estes Termos de Uso ou precisar de
                esclarecimentos, não hesite em entrar em contato conosco.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">Email:</span>
                  <span className="text-primary">contato@emprestae.com.br</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="font-medium">Telefone:</span>
                  <span className="text-primary">(11) 9999-9999</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rodapé Legal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8"
        >
          <Separator className="mb-6" />
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Empresta aê. Todos os direitos reservados.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Estes termos são regidos pelas leis brasileiras e qualquer disputa será resolvida nos
              tribunais competentes do Brasil.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
