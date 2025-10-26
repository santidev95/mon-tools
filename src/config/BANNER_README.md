# Banner Informativo - Guia de Uso

Este arquivo explica como usar o banner informativo no topo da aplicação.

## 📍 Localização do Config

O banner é configurado através do arquivo `src/config/banner.ts`.

## 🚀 Como Habilitar o Banner

1. Abra o arquivo `src/config/banner.ts`
2. Altere `enabled: false` para `enabled: true`
3. Modifique a mensagem conforme necessário
4. Salve o arquivo

## 📝 Exemplos de Configuração

### Exemplo 1: Banner Informativo Simples

```typescript
export const bannerConfig: BannerConfig = {
  enabled: true,
  message: "🚀 Nova atualização disponível! Conheça as novas funcionalidades.",
  type: "info",
  dismissible: true,
};
```

### Exemplo 2: Aviso de Manutenção

```typescript
export const bannerConfig: BannerConfig = {
  enabled: true,
  message: "⚠️ Manutenção programada para hoje às 23h. Alguns serviços podem ficar indisponíveis.",
  type: "warning",
  dismissible: true,
};
```

### Exemplo 3: Banner com Botão de Ação

```typescript
export const bannerConfig: BannerConfig = {
  enabled: true,
  message: "📢 Novidades! Veja o que mudou na plataforma.",
  type: "info",
  dismissible: true,
  action: {
    label: "Ver novidades",
    onClick: () => {
      window.open("https://montools.xyz", "_blank");
    },
  },
};
```

### Exemplo 4: Banner de Sucesso

```typescript
export const bannerConfig: BannerConfig = {
  enabled: true,
  message: "✅ Problemas de conectividade foram resolvidos!",
  type: "success",
  dismissible: true,
};
```

### Exemplo 5: Banner de Erro/Aviso Crítico

```typescript
export const bannerConfig: BannerConfig = {
  enabled: true,
  message: "🚨 Serviço temporariamente indisponível. Estamos trabalhando para resolver.",
  type: "error",
  dismissible: true,
};
```

### Exemplo 6: Banner Não Removível

```typescript
export const bannerConfig: BannerConfig = {
  enabled: true,
  message: "⚡ Importante: Todos os dados são armazenados localmente.",
  type: "warning",
  dismissible: false, // Usuários não podem fechar
};
```

### Exemplo 7: Banner que Esconde ao Rolar

```typescript
export const bannerConfig: BannerConfig = {
  enabled: true,
  message: "💡 Dica: Use Ctrl+K para buscar rapidamente.",
  type: "info",
  dismissible: true,
  hideOnScroll: true, // Esconde quando o usuário rola a página
};
```

## 🎨 Tipos de Banner Disponíveis

| Tipo | Cor | Icone | Uso |
|------|-----|-------|-----|
| `info` | Azul | ℹ️ | Informações gerais |
| `warning` | Amarelo | ⚠️ | Avisos importantes |
| `success` | Verde | ✅ | Mensagens de sucesso |
| `error` | Vermelho | 🚨 | Erros ou problemas |

## ⚙️ Propriedades do Banner

- **`enabled`**: `boolean` - Ativa/desativa o banner
- **`message`**: `string` - Texto a ser exibido no banner
- **`type`**: `"info" | "warning" | "success" | "error"` - Tipo do banner
- **`dismissible`**: `boolean` - Se `false`, o usuário não pode fechar
- **`hideOnScroll`**: `boolean` - Se `true`, esconde quando o usuário rola
- **`action`**: `object` (opcional) - Adiciona um botão clicável
  - `label`: Texto do botão
  - `onClick`: Função a ser executada

## 🔧 Comportamento

- O banner aparece no **topo da página** (acima do header)
- Quando fechado, o estado é **salvo no localStorage**
- Uma mensagem fechada **não será exibida novamente** até limpar o localStorage
- Animações suaves de entrada/saída (Framer Motion)
- Responsivo para mobile e desktop

## 📱 Onde Aparece

O banner aparece em todas as páginas **exceto**:
- Página OS (`/os`)
- Qualquer página que comece com `/os`

## 💡 Dicas

1. Use `info` para informações gerais
2. Use `warning` para avisos que merecem atenção
3. Use `success` para comunicar resoluções de problemas
4. Use `error` raramente, apenas para problemas críticos
5. Mantenha as mensagens curtas e diretas
6. Use emojis para tornar as mensagens mais amigáveis

## 🧹 Limpar Estado do Banner

Se precisar que um banner já fechado apareça novamente para todos os usuários, altere a mensagem no config. O localStorage usa os primeiros 20 caracteres da mensagem como chave.

Para desenvolvimento/teste, você pode limpar o localStorage no console do navegador:

```javascript
localStorage.clear();
```

