# 🛒 Sistema de Gestão de Cestas Básicas (Cesta B)

> Uma aplicação web desenvolvida para organizar, centralizar e trazer transparência para a arrecadação de cestas básicas.

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-brightgreen)
![Tecnologias](https://img.shields.io/badge/tecnologias-HTML%2C%20CSS%2C%20JS%2C%20Firebase-blue)

---

## 📱 Sobre o Projeto

Este projeto foi criado pra facilitar a organização das doações, garantindo que os recursos sejam direcionados para as necessidades e visando potencializar a quantidade de cestas que podemos montar.

Muitas vezes, campanhas de doação sofrem com falta de organização: as pessoas não sabem o que ainda falta arrecadar, há excesso de alguns itens e escassez de outros. O **Cesta B** resolve isso com uma interface limpa, intuitiva e voltada para a acessibilidade, controlando o progresso de múltiplas cestas em sequência e sincronizando tudo em tempo real na nuvem.

---

## ✨ Funcionalidades Principais

* **Múltiplas Cestas em Sequência:** As cestas são desbloqueadas progressivamente conforme a anterior atinge 100% da meta.
* **Lista Completa de Itens:** 22 itens essenciais cadastrados por padrão em cada cesta (alimentos, limpeza e higiene).
* **Sincronização em Tempo Real:** Integrado com **Firebase Firestore**, garantindo que as doações apareçam instantaneamente para todos os usuários.
* **Painel Administrativo:** Área protegida por senha para que os organizadores possam gerenciar contribuições, remover itens errados ou resetar a cesta.
* **Feedback Visual:** Alertas personalizados orientando o doador a registrar o print da tela e conferir o progresso.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5 / CSS3 / JavaScript (ES6+ Modules):** Estrutura e lógica do front-end.
* **Firebase Firestore:** Banco de dados NoSQL em nuvem para persistência dos dados.
* **GitHub Pages:** Hospedagem da aplicação.

---

## 🚀 Como Rodar o Projeto Localmente

Se você quiser clonar o repositório e testar na sua máquina:

1. Clone o repositório:
   ```bash
   git clone [https://github.com/devrafae/Cestab.git](https://github.com/devrafae/Cestab.git)

   Abra a pasta do projeto no seu editor de código (como o VS Code).

Utilize uma extensão de servidor local (como o Live Server) para abrir o arquivo index.html.

---

## 🗺️ Próximos Passos (Roadmap)
As seguintes melhorias estão planejadas para as próximas versões do sistema:

[ ] Contador de Cestas Concluídas: Exibir um panorama geral de quantas cestas completas já foram finalizadas e entregues.

[ ] Seleção de Quantidade por Input: Permitir que o doador escolha o número exato de itens que está levando de uma só vez.

[ ] Refatoração Visual: Substituir os elementos atuais por ícones em SVG para dar uma estética mais profissional e minimalista (clean).

[ ] Painel de Gestão Dinâmico: Interface para que o administrador possa criar novas cestas e adicionar/remover produtos cadastrados direto pelo front-end.

[ ] Gráficos de Acompanhamento: Adicionar gráficos estatísticos para visualizar o progresso das arrecadações em tempo real.

👩‍💻 Autoria
Desenvolvido com carinho e propósito por Rafaela 💻✨
