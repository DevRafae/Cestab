// Lista completa padrão de itens com suas metas iniciais
let itensGlobais = JSON.parse(localStorage.getItem('cestas_itens_globais')) || [
    { id: 'biscoito_recheado', nome: 'Biscoito recheado - 200g' },
    { id: 'arroz', nome: 'Arroz tipo 1 - 5kg' },
    { id: 'feijao', nome: 'Feijão carioca - 1kg' },
    { id: 'acucar', nome: 'Açúcar refinado - 1kg' },
    { id: 'oleo', nome: 'Óleo de soja - 900ml' },
    { id: 'sal', nome: 'Sal refinado - 1kg' },
    { id: 'cafe', nome: 'Café - 500g' },
    { id: 'macarrao', nome: 'Macarrão - 500g' },
    { id: 'molho_tomate', nome: 'Molho de tomate - 300g' },
    { id: 'farinha_trigo', nome: 'Farinha de trigo - 1kg' },
    { id: 'farinha_mandioca', nome: 'Farinha de mandioca - 500g' },
    { id: 'leite_po', nome: 'Leite em pó - 400g' },
    { id: 'biscoito_salgado', nome: 'Biscoito salgado - 300g' },
    { id: 'sardinha', nome: 'Sardinha óleo - 125g' },
    { id: 'fuba', nome: 'Fubá - 500g' },
    { id: 'sabao_po', nome: 'Sabão em pó - 1kg' },
    { id: 'detergente', nome: 'Detergente líquido - 500ml' },
    { id: 'sabao_barra', nome: 'Sabão barra - 200g' },
    { id: 'esponja', nome: 'Esponja louça' },
    { id: 'papel_higienico', nome: 'Papel higiênico - 12 rolos' },
    { id: 'creme_dental', nome: 'Creme dental - 90g' },
    { id: 'sabonete', nome: 'Sabonete barra - 90g' }
];

let tiposCesta = JSON.parse(localStorage.getItem('cestas_tipos_globais')) || [
    {
        id: 'padrao',
        nome: 'Cesta Básica Padrão',
        itens: [
            { id: 'biscoito_recheado', nome: 'Biscoito recheado - 200g', atual: 0, meta: 1 },
            { id: 'arroz', nome: 'Arroz tipo 1 - 5kg', atual: 0, meta: 2 },
            { id: 'feijao', nome: 'Feijão carioca - 1kg', atual: 0, meta: 3 },
            { id: 'acucar', nome: 'Açúcar refinado - 1kg', atual: 0, meta: 3 },
            { id: 'oleo', nome: 'Óleo de soja - 900ml', atual: 0, meta: 2 },
            { id: 'sal', nome: 'Sal refinado - 1kg', atual: 0, meta: 1 },
            { id: 'cafe', nome: 'Café - 500g', atual: 0, meta: 1 },
            { id: 'macarrao', nome: 'Macarrão - 500g', atual: 0, meta: 2 },
            { id: 'molho_tomate', nome: 'Molho de tomate - 300g', atual: 0, meta: 2 },
            { id: 'farinha_trigo', nome: 'Farinha de trigo - 1kg', atual: 0, meta: 1 },
            { id: 'farinha_mandioca', nome: 'Farinha de mandioca - 500g', atual: 0, meta: 1 },
            { id: 'leite_po', nome: 'Leite em pó - 400g', atual: 0, meta: 2 },
            { id: 'biscoito_salgado', nome: 'Biscoito salgado - 300g', atual: 0, meta: 1 },
            { id: 'sardinha', nome: 'Sardinha óleo - 125g', atual: 0, meta: 2 },
            { id: 'fuba', nome: 'Fubá - 500g', atual: 0, meta: 1 },
            { id: 'sabao_po', nome: 'Sabão em pó - 1kg', atual: 0, meta: 1 },
            { id: 'detergente', nome: 'Detergente líquido - 500ml', atual: 0, meta: 1 },
            { id: 'sabao_barra', nome: 'Sabão barra - 200g', atual: 0, meta: 1 },
            { id: 'esponja', nome: 'Esponja louça', atual: 0, meta: 1 },
            { id: 'papel_higienico', nome: 'Papel higiênico - 12 rolos', atual: 0, meta: 1 },
            { id: 'creme_dental', nome: 'Creme dental - 90g', atual: 0, meta: 3 },
            { id: 'sabonete', nome: 'Sabonete barra - 90g', atual: 0, meta: 5 }
        ]
    }
];

const modeloDadosCestasIniciais = [
    { id: 1, nome: "Cesta 1", tipoId: 'padrao', itens: JSON.parse(JSON.stringify(tiposCesta[0].itens)), contribuicoes: [] },
    { id: 2, nome: "Cesta 2", tipoId: 'padrao', itens: JSON.parse(JSON.stringify(tiposCesta[0].itens)), contribuicoes: [] },
    { id: 3, nome: "Cesta 3", tipoId: 'padrao', itens: JSON.parse(JSON.stringify(tiposCesta[0].itens)), contribuicoes: [] }
];

let dadosCestas = JSON.parse(localStorage.getItem('cestas_dados_app')) || modeloDadosCestasIniciais;
let cestaAtualAtiva = 1;
let cestaVisualizadaAdmin = 1;

function salvarLocal() {
    localStorage.setItem('cestas_dados_app', JSON.stringify(dadosCestas));
    localStorage.setItem('cestas_itens_globais', JSON.stringify(itensGlobais));
    localStorage.setItem('cestas_tipos_globais', JSON.stringify(tiposCesta));
}

function mudarTela(idTela) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const alvo = document.getElementById(idTela);
    if (alvo) alvo.classList.add('active');
}

function verificarCestaCompletaPorIndex(index) {
    if (!dadosCestas[index]) return true;
    return dadosCestas[index].itens.every(i => i.atual >= i.meta);
}

function renderizarTela1() {
    const container = document.getElementById('bandejaCestas');
    if (!container) return;
    container.innerHTML = '';

    if (dadosCestas.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; padding: 10px;">Nenhuma cesta cadastrada na bandeja.</p>';
        return;
    }

    dadosCestas.forEach((cesta, index) => {
        let isLocked = false;
        if (index > 0) {
            isLocked = !verificarCestaCompletaPorIndex(index - 1);
        }

        const card = document.createElement('div');
        card.className = `menu-card ${isLocked ? 'locked' : ''}`;
        
        card.onclick = () => {
            if (isLocked) {
                mostrarAviso("Cesta Bloqueada", "A cesta anterior ainda não está totalmente preenchida!");
                return;
            }
            abrirCesta(cesta.id);
        };

        card.innerHTML = `
            <div class="menu-card-left">
                <span class="menu-icon">📦</span>
                <span style="font-weight: 600;">${cesta.nome}</span>
            </div>
            <div>
                ${isLocked ? '<span>⏱️</span>' : '<span style="font-size: 12px; color: var(--cinza-medio);">Disponível ➔</span>'}
            </div>
        `;
        container.appendChild(card);
    });
}

function abrirCesta(idCesta) {
    let index = dadosCestas.findIndex(c => c.id === idCesta);
    if (index === -1) return;

    if (index > 0 && !verificarCestaCompletaPorIndex(index - 1)) {
        mostrarAviso("Cesta Bloqueada", "Conclua a cesta anterior para desbloquear esta.");
        return;
    }

    cestaAtualAtiva = idCesta;
    let titulo = document.getElementById('tituloCestaAtiva');
    if(titulo) titulo.innerText = dadosCestas[index].nome;
    renderizarItensCestaAtiva();
    mudarTela('tela2');
}

function renderizarItensCestaAtiva() {
    let container = document.getElementById('containerItensCesta');
    if(!container) return;
    container.innerHTML = '';
    
    let dados = dadosCestas.find(c => c.id === cestaAtualAtiva);
    if (!dados) return;

    let totalMeta = dados.itens.reduce((acc, i) => acc + i.meta, 0);
    let totalAtual = dados.itens.reduce((acc, i) => acc + i.atual, 0);
    let porc = totalMeta > 0 ? (totalAtual / totalMeta) * 100 : 0;
    
    let barra = document.getElementById('barraProgresso');
    if(barra) barra.style.width = `${porc}%`;

    dados.itens.forEach(item => {
        let completo = item.atual >= item.meta;
        let restante = item.meta - item.atual;
        
        let optionsHtml = '';
        for (let i = 0; i <= restante; i++) {
            optionsHtml += `<option value="${i}">${i}</option>`;
        }

        let div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `
            <div>
                <span style="font-weight: 500; font-size: 0.95rem; display:block;">${item.nome}</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Progresso: ${item.atual}/${item.meta}</span>
            </div>
            <div>
                ${completo ? '<span style="font-size: 0.85rem; color: var(--success); font-weight: bold;">Concluído</span>' : `
                    <select class="qtd-item" data-id="${item.id}" style="padding: 4px 8px; border-radius: 4px; border: 1px solid #ccc;">
                        ${optionsHtml}
                    </select>
                `}
            </div>
        `;
        container.appendChild(div);
    });
}

async function registrarContribuicao() {
    let inputNome = document.getElementById('nomeColaborador');
    let nome = inputNome ? inputNome.value.trim() : '';
    if(!nome) {
        mostrarAviso("Atenção", "Por favor, digite o seu nome e sobrenome.");
        return;
    }

    let selects = document.querySelectorAll('.qtd-item');
    let itensFlegadosNomes = [];
    let dados = dadosCestas.find(c => c.id === cestaAtualAtiva);
    if (!dados) return;

    let totalAdicionado = 0;

    selects.forEach(sel => {
        let qtdDesejada = parseInt(sel.value) || 0;
        if(qtdDesejada > 0) {
            let itemId = sel.getAttribute('data-id');
            let itemObj = dados.itens.find(i => i.id === itemId);
            
            if(itemObj) {
                totalAdicionado += qtdDesejada;
                itemObj.atual += qtdDesejada;

                let resumoItem = `${itemObj.nome.split('-')[0].trim()} (${qtdDesejada}x)`;
                dados.contribuicoes.push({
                    idUnico: Date.now() + Math.random(),
                    nome: nome,
                    item: `${resumoItem} - ${itemObj.atual}/${itemObj.meta}`
                });
                itensFlegadosNomes.push(resumoItem);
            }
        }
    });

    if(totalAdicionado === 0) {
        mostrarAviso("Atenção", "Selecione a quantidade de pelo menos um item.");
        return;
    }

    salvarLocal();
    if(inputNome) inputNome.value = '';
    renderizarItensCestaAtiva();
    renderizarTela1();

    let msgPopup = `Obrigado, <b>${nome}</b>!<br><br>Itens doados:<br><b>${itensFlegadosNomes.join('<br>')}</b><br><br>Não se esqueça de tirar um print desta tela para comprovação!`;
    document.getElementById('modalMensagemTexto').innerHTML = msgPopup;
    document.getElementById('modalPopup').style.display = 'flex';
}

function renderizarAdminCestasList() {
    const container = document.getElementById('containerAdminCestas');
    if (!container) return;
    container.innerHTML = '';

    if (dadosCestas.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; padding: 10px;">Nenhuma cesta cadastrada.</p>';
        return;
    }

    dadosCestas.forEach((cesta, index) => {
        let isLocked = index > 0 && !verificarCestaCompletaPorIndex(index - 1);
        
        let card = document.createElement('div');
        card.className = "menu-card";
        card.style.padding = "10px 14px";
        card.innerHTML = `
            <div class="menu-card-left">
                <span class="menu-icon">📦</span>
                <span>${cesta.nome} ${isLocked ? '(Bloqueada)' : ''}</span>
            </div>
            <button class="btn" style="padding: 4px 10px; font-size: 0.8rem;" onclick="verDetalhesAdmin(${cesta.id})">Gerenciar</button>
        `;
        container.appendChild(card);
    });
}

function verDetalhesAdmin(idCesta) {
    let index = dadosCestas.findIndex(c => c.id === idCesta);
    if (index === -1) return;

    cestaVisualizadaAdmin = idCesta;
    document.getElementById('tituloTela4').innerText = `Gerenciamento - ${dadosCestas[index].nome}`;
    renderizarListaContribuicoesAdmin();
    mudarTela('tela4');
}

function renderizarListaContribuicoesAdmin() {
    let container = document.getElementById('containerContribuicoesLista');
    if(!container) return;
    container.innerHTML = '';

    let dados = dadosCestas.find(c => c.id === cestaVisualizadaAdmin);
    if (!dados || dados.contribuicoes.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; padding: 10px;">Nenhuma contribuição registrada ainda.</p>';
        return;
    }

    dados.contribuicoes.forEach(c => {
        let div = document.createElement('div');
        div.className = 'contribution-item';
        div.innerHTML = `
            <span><b>${c.nome}</b>: ${c.item}</span>
            <button class="btn btn-danger" style="padding: 2px 8px; font-size: 0.8rem;" onclick="removerContribuicaoAdmin(${c.idUnico})">❌</button>
        `;
        container.appendChild(div);
    });
}

window.removerContribuicaoAdmin = function(idUnico) {
    let dadosCesta = dadosCestas.find(c => c.id === cestaVisualizadaAdmin);
    if (!dadosCesta) return;

    let index = dadosCesta.contribuicoes.findIndex(item => item.idUnico === idUnico);
    if(index !== -1) {
        let itemRemovido = dadosCesta.contribuicoes[index];
        let matchQtd = itemRemovido.item.match(/\((\d+)x\)/);
        let qtdRemover = matchQtd ? parseInt(matchQtd[1]) : 1;
        let nomeItemBase = itemRemovido.item.split('(')[0].trim();

        let itemObj = dadosCesta.itens.find(i => i.nome.includes(nomeItemBase));
        if(itemObj) {
            itemObj.atual = Math.max(0, itemObj.atual - qtdRemover);
        }

        dadosCesta.contribuicoes.splice(index, 1);
        salvarLocal();
        renderizarListaContribuicoesAdmin();
        renderizarTela1();
        mostrarAviso("Sucesso", "Contribuição removida e estoque recalculado.");
    }
}

function renderizarCheckboxesCriarTipo() {
    let container = document.getElementById('containerCheckboxesItens');
    if (!container) return;
    container.innerHTML = '';

    itensGlobais.forEach(item => {
        let div = document.createElement('div');
        div.style.cssText = "display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 0.9rem;";
        div.innerHTML = `
            <input type="checkbox" class="check-item-tipo" value="${item.id}" id="chk_${item.id}">
            <label for="chk_${item.id}">${item.nome}</label>
        `;
        container.appendChild(div);
    });
}

function carregarSelectTiposCesta() {
    let select = document.getElementById('selectTipoCestaModelo');
    if (!select) return;
    select.innerHTML = '';

    tiposCesta.forEach(tipo => {
        let opt = document.createElement('option');
        opt.value = tipo.id;
        opt.innerText = tipo.nome;
        select.appendChild(opt);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarTela1();

    document.getElementById('btnAdmin')?.addEventListener('click', () => {
        let senha = prompt('Digite a senha do Administrador:');
        if(senha === '1234') {
            renderizarAdminCestasList();
            mudarTela('tela3');
        } else if(senha !== null) {
            mostrarAviso("Acesso Negado", "Senha incorreta!");
        }
    });

    document.getElementById('navCriarNovoItem')?.addEventListener('click', () => {
        document.getElementById('inputNomeNovoItem').value = '';
        mudarTela('telaCriarItem');
    });

    document.getElementById('navCriarNovoTipoCesta')?.addEventListener('click', () => {
        document.getElementById('inputNomeNovoTipo').value = '';
        renderizarCheckboxesCriarTipo();
        mudarTela('telaCriarTipoCesta');
    });

    document.getElementById('navCriarNovaCesta')?.addEventListener('click', () => {
        document.getElementById('inputNomeNovaCestaInstancia').value = '';
        carregarSelectTiposCesta();
        mudarTela('telaCriarCesta');
    });

    document.getElementById('btnSalvarNovoItem')?.addEventListener('click', () => {
        let nomeItem = document.getElementById('inputNomeNovoItem').value.trim();
        if(!nomeItem) {
            mostrarAviso("Atenção", "Digite o nome do item.");
            return;
        }

        let novoId = 'item_' + Date.now();
        itensGlobais.push({ id: novoId, nome: nomeItem });
        salvarLocal();
        mostrarAviso("Sucesso", "Novo item cadastrado com sucesso!");
        mudarTela('tela3');
        renderizarAdminCestasList();
    });

    document.getElementById('btnSalvarNovoTipoCesta')?.addEventListener('click', () => {
        let nomeTipo = document.getElementById('inputNomeNovoTipo').value.trim();
        if(!nomeTipo) {
            mostrarAviso("Atenção", "Digite o nome do tipo de cesta.");
            return;
        }

        let checkboxes = document.querySelectorAll('.check-item-tipo:checked');
        if(checkboxes.length === 0) {
            mostrarAviso("Atenção", "Selecione pelo menos um item para compor este tipo de cesta.");
            return;
        }

        let itensDoTipo = [];
        checkboxes.forEach(chk => {
            let itemId = chk.value;
            let itemGlobal = itensGlobais.find(i => i.id === itemId);
            if(itemGlobal) {
                itensDoTipo.push({
                    id: itemGlobal.id,
                    nome: itemGlobal.nome,
                    atual: 0,
                    meta: 1
                });
            }
        });

        let novoTipoId = 'tipo_' + Date.now();
        tiposCesta.push({
            id: novoTipoId,
            nome: nomeTipo,
            itens: itensDoTipo
        });

        salvarLocal();
        mostrarAviso("Sucesso", "Novo tipo de cesta cadastrado com sucesso!");
        mudarTela('tela3');
        renderizarAdminCestasList();
    });

    document.getElementById('btnSalvarNovaCestaInstancia')?.addEventListener('click', () => {
        let nomeCesta = document.getElementById('inputNomeNovaCestaInstancia').value.trim();
        let tipoIdSelecionado = document.getElementById('selectTipoCestaModelo').value;

        if(!nomeCesta) {
            mostrarAviso("Atenção", "Digite o nome da cesta.");
            return;
        }

        let tipoModelo = tiposCesta.find(t => t.id === tipoIdSelecionado);
        if(!tipoModelo) {
            mostrarAviso("Erro", "Tipo de cesta selecionado inválido.");
            return;
        }

        let novoId = dadosCestas.length > 0 ? Math.max(...dadosCestas.map(c => c.id)) + 1 : 1;
        dadosCestas.push({
            id: novoId,
            nome: nomeCesta,
            tipoId: tipoModelo.id,
            itens: JSON.parse(JSON.stringify(tipoModelo.itens)),
            contribuicoes: []
        });

        salvarLocal();
        renderizarAdminCestasList();
        renderizarTela1();
        mostrarAviso("Sucesso", `${nomeCesta} criada e adicionada à bandeja!`);
        mudarTela('tela3');
    });

    document.getElementById('btnRegistrar')?.addEventListener('click', registrarContribuicao);
    
    document.getElementById('btnVoltarTela2')?.addEventListener('click', () => { renderizarTela1(); mudarTela('tela1'); });
    document.getElementById('btnVoltarTela3')?.addEventListener('click', () => { renderizarTela1(); mudarTela('tela1'); });
    document.getElementById('btnVoltarTela4')?.addEventListener('click', () => { renderizarAdminCestasList(); mudarTela('tela3'); });
    document.getElementById('btnVoltarTelaItem')?.addEventListener('click', () => mudarTela('tela3'));
    document.getElementById('btnVoltarTelaTipoCesta')?.addEventListener('click', () => mudarTela('tela3'));
    document.getElementById('btnVoltarTelaCriarCesta')?.addEventListener('click', () => mudarTela('tela3'));

    document.getElementById('btnResetar')?.addEventListener('click', () => {
        if(confirm("Tem certeza absoluta que deseja resetar esta cesta?")) {
            let dados = dadosCestas.find(c => c.id === cestaVisualizadaAdmin);
            if(dados) {
                dados.contribuicoes = [];
                dados.itens.forEach(i => i.atual = 0);
                salvarLocal();
                renderizarListaContribuicoesAdmin();
                renderizarTela1();
                mostrarAviso("Sucesso", "Cesta resetada!");
            }
        }
    });

    document.getElementById('btnExcluirCesta')?.addEventListener('click', () => {
        if(confirm("Tem certeza que deseja excluir esta cesta permanentemente da bandeja?")) {
            dadosCestas = dadosCestas.filter(c => c.id !== cestaVisualizadaAdmin);
            salvarLocal();
            renderizarAdminCestasList();
            renderizarTela1();
            mostrarAviso("Sucesso", "Cesta excluída com sucesso!");
            mudarTela('tela3');
        }
    });

    document.getElementById('btnFecharModal')?.addEventListener('click', () => {
        document.getElementById('modalPopup').style.display = 'none';
        renderizarTela1();
        mudarTela('tela1');
    });
});

function mostrarAviso(titulo, mensagem) {
    document.getElementById('customAlertTitle').innerText = titulo;
    document.getElementById('customAlertMessage').innerText = mensagem;
    let modal = document.getElementById('customAlertModal');
    modal.style.display = 'flex';
    
    document.getElementById('customAlertBtn').onclick = () => {
        modal.style.display = 'none';
    };
}
