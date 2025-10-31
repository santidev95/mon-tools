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
 */
export const bannerConfig: BannerConfig = {
  enabled: false, // Banner habilitado
  message: "Our platform is currently experiencing issues when performing token swaps. We are working to fix it as soon as possible.",
  type: "warning", // info | warning | success | error
  dismissible: false, // Se false, o usuário não poderá fechar o banner
  hideOnScroll: false, // Se true, o banner esconde ao rolar a página
  
  // Opcional: Adicionar botão de ação
  // action: {
  //   label: "Saiba mais",
  //   onClick: () => {
  //     window.open("https://example.com", "_blank");
  //   },
  // },
};

