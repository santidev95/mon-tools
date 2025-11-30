import { BannerConfig } from "@/components/ui/Banner";

/**
 * Configuração do Banner Informativo
 * 
 * Para desabilitar o banner, defina enabled: false
 * Para alterar a mensagem, modifique o campo message
 * 
 * Tipos disponíveis:
 * - info: Informações gerais (azul)
 * - warning: Avisos importantes (amarelo)
 * - success: Mensagens de sucesso (verde)
 * - error: Erros ou problemas (vermelho)
 * - custom: Banner personalizado com cores customizadas (requer customColor)
 */
export const bannerConfig: BannerConfig = {
  enabled: true, // Banner habilitado
  message: "MonTools is live on the Monad Mainnet!",
  type: "custom", // info | warning | success | error | custom
  dismissible: false, // Se false, o usuário não poderá fechar o banner
  hideOnScroll: false, // Se true, o banner esconde ao rolar a página
  
  // Opcional: Adicionar botão de ação
  // action: {
  //   label: "Saiba mais",
  //   onClick: () => {
  //     window.open("https://example.com", "_blank");
  //   },
  // },
  
  // Opcional: Cores personalizadas (usado quando type: "custom")
  // customColor: {
  //   bg: "bg-purple-500/20",      // Cor de fundo com opacidade
  //   border: "border-purple-500/30", // Cor da borda com opacidade
  //   text: "text-purple-200",     // Cor do texto
  // },
};

