# LicitaDoc

Sistema de Gestão Documental para Licitações

---

## Visão Geral

O LicitaDoc é um sistema para gerenciar documentos de licitações, garantindo que empresas mantenham certidões, comprovantes e declarações atualizados, organizados e acessíveis.

### Objetivos

- Centralizar documentos em um repositório seguro.
- Automatizar alertas de validade e renovação.
- Facilitar a montagem de pastas para editais.
- Integrar com APIs de órgãos emissores para validação de autenticidade.

---

## Stack Tecnológica

- **Frontend**: Next.js (React, Tailwind CSS, React Hook Form, TanStack Table, React Flow, Archiver).
- **Backend**: Next.js API Routes.
- **Banco de Dados**: PostgreSQL.
- **Automação**: node-cron, Nodemailer.
- **Storage**: AWS S3.
- **Autenticação**: Clerk.

---

## Funcionalidades Principais

- **Cadastro de Empresas**: Registro de empresas clientes e configuração de planos.
- **Gerenciamento de Documentos**: Upload, metadados e controle de validade.
- **Alertas Automáticos**: Notificações por e-mail/Slack para documentos próximos do vencimento.
- **Montagem de Pastas**: Seleção automática de documentos com base nos requisitos do edital.
- **Integração com APIs**: Validação de certidões em órgãos públicos (ex: Receita Federal).
- **Relatórios**: Exportação de dados para CSV/PDF.
- **Geração de Pasta Zip**: Download de documentos selecionados em formato ZIP.

---

## Fluxos de Trabalho

1. **Cadastro de Documentos**:
   - Upload de arquivos (PDF/JPG) com metadados.
   - Armazenamento no S3 e registro no PostgreSQL.

2. **Alertas de Validade**:
   - Script diário (node-cron) verifica data_validade.
   - Envia notificações se a validade estiver a 30 dias ou menos.

3. **Montagem de Pasta para Licitação**:
   - Usuário seleciona um edital.
   - Sistema lista documentos exigidos e gera um ZIP.

4. **Validação via API Externa**:
   - Consulta APIs de órgãos públicos para validar documentos.

---

## TODOS

- [ ] Abstract data tables
- [ ] Use Prisma types instead of manually created types
- [ ] Abstract document upload
- [ ] Extract document information for auto filling
