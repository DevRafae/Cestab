// --- IMPORTAÇÕES DO FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// SUAS CONFIGURAÇÕES DO FIREBASE (Substitua pelos dados do seu projeto)
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Estado Global da Aplicação
let cestaAtualAtiva = 1;
let cestaVisualizadaAdmin = 1;

// Modelo padrão caso o banco esteja vazio
const modeloDadosCestas = {
    1: {
        itens: [
            { id: 'arroz', nome: 'Arroz tipo 1 - 5kg', atual: 0, meta: 2 },
            { id: 'feijao', nome: 'Feijão carioca - 1kg', atual: 0, meta: 3 },
            { id: 'macarrao', nome: 'Macarrão - 500g', atual: 0, meta: 2 }
        ],
        contribuicoes: []
    },
    2: {
        itens: [
            { id: 'acucar', nome: 'Açúcar refinado - 1kg', atual: 0, meta: 2 },
            { id: 'oleo', nome: 'Óleo de soja - 900ml', atual: 0, meta: 1 }
        ],
        contribuicoes: []
    },
    3: {
        itens: [
            { id: 'cafe', nome: 'Café - 500g', atual: 0, meta: 1 }
        ],
        contribuicoes: []
    }
};

let dadosCestas = JSON.parse(JSON.stringify(modeloDadosCestas));

// --- CARREGAR DO FIREBASE ---
async function carregarDadosDoBanco() {
    try {
        const docRef = doc(db, "sistema", "cestasData");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            dadosCestas = docSnap.data();
        } else {
            // Se não existir, salva o modelo inicial no Firebase
            await setDoc(docRef, modeloDadosCestas);
        }
    } catch (e) {
        console.warn("Erro ao carregar do Firebase, usando dados locais.", e);
    }
    atualizarStatusGeral();
}

// --- SALVAR NO FIREBASE ---
async function salvarDadosNoBanco() {
    try {
        await setDoc(doc(db, "sistema", "cestasData"), dadosCestas);
    } catch (e) {
        console.warn("Erro ao salvar no Firebase.", e);
    }
}

// Navegação entre Telas
function mudarTela(idTela) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const telaAlvo = document.getElementById(idTela);
    if (telaAlvo) telaAlvo.classList.add('active');
}

function voltarTela(num) {
    if(num === 1) mudarTela('tela1');
    if(num === 3) mudarTela('tela3');
    atualizarStatusGeral();
}

// Verificações de Status e Desbloqueio Sequencial
function verificarCestaCompleta(numCesta) {
    let itens = dadosCestas[numCesta].itens;
    return itens.every(item => item.atual >= item.meta);
}

function atualizarStatusGeral() {
    let c1Completa = verificarCestaCompleta(1);
    let c2Completa = verificarCestaCompleta(2);

    // Desbloqueio Cesta 2
    let card2 = document.getElementById('cardCesta2');
    let lock2 = document.getElementById('lockCesta2');
    let lockLista2 = document.getElementById('lockLista2');
    if(card2) {
        if(c1Completa) {
            card2.classList.remove('locked');
            if(lock2) lock2.style.display = 'none';
            if(lockLista2) lockLista2.style.display = 'none';
        } else {
            card2.classList.add('locked');
            if(lock2) lock2.style.display = 'inline';
            if(lockLista2) lockLista2.style.display = 'inline';
        }
    }

    // Desbloqueio Cesta 3
    let card3 = document.getElementById('cardCesta3');
    let lock3 = document.getElementById('lockCesta3');
    let lockLista3 = document.getElementById('lockLista3');
    if(card3) {
        if(c1Completa && c2Completa) {
            card3.classList.remove('locked');
            if(lock3) lock3.style.display = 'none';
            if(lockLista3) lockLista3.style.display = 'none';
        } else {
            card3.classList.add('locked');
            if(lock3) lock3.style.display = 'inline';
            if(lockLista3) lockLista3.style.display = 'inline';
        }
    }
}

window.abrirCesta = function(num) {
    if(num === 2 && !verificarCestaCompleta(1)) {
        alert('A Cesta 1 ainda não está completa!');
        return;
    }
    if(num === 3 && (!verificarCestaCompleta(1) || !verificarCestaCompleta(2))) {
        alert('A Cesta 2 ainda não está completa!');
        return;
    }
    cestaAtualAtiva = num;
    let titulo = document.getElementById('tituloCestaAtiva');
    if(titulo) titulo.innerText = `Cesta ${num}`;
    renderizarItensCestaAtiva();
    mudarTela('tela2');
};

// Renderização dos Itens na Tela 2
function renderizarItensCestaAtiva() {
    let container = document.getElementById('containerItensCesta');
    if(!container) return;
    container.innerHTML = '';
    
    let dados = dadosCestas[cestaAtualAtiva];
    let totalMeta = dados.itens.reduce((acc, i) => acc + i.meta, 0);
    let totalAtual = dados.itens.reduce((acc, i) => acc + i.atual, 0);
    let porc = totalMeta > 0 ? (totalAtual / totalMeta) * 100 : 0;
    
    let barra = document.getElementById('barraProgresso');
    if(barra) barra.style.width = `${porc}%`;

    dados.itens.forEach(item => {
        let completo = item.atual >= item.meta;
        let div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `
            <div class="item-row-top">
                <div class="item-info">
                    <input type="checkbox" class="check-item" value="${item.id}" ${completo ? 'disabled' : ''}>
                    <span>${item.nome}</span>
                </div>
                <span>${item.atual}/${item.meta}</span>
            </div>
            ${completo ? '<div class="item-status-msg">Já completamos a quantidade deste item! Você pode contribuir com outro item ou aguardar a abertura da próxima cesta.</div>' : ''}
        `;
        container.appendChild(div);
    });
}

// Registrar Contribuição
window.registrarContribuicao = async function() {
    let inputNome = document.getElementById('nomeColaborador');
    let nome = inputNome ? inputNome.value.trim() : '';
    if(!nome) {
        alert('Por favor, digite o seu nome.');
        return;
    }

    let checks = document.querySelectorAll('.check-item:checked');
    if(checks.length === 0) {
        alert('Selecione pelo menos um item para contribuir.');
        return;
    }

    let itensFlegadosNomes = [];
    let dados = dadosCestas[cestaAtualAtiva];

    checks.forEach(chk => {
        let itemId = chk.value;
        let itemObj = dados.itens.find(i => i.id === itemId);
        if(itemObj && itemObj.atual < itemObj.meta) {
            itemObj.atual += 1;
            let contadorStr = `${itemObj.atual}/${itemObj.meta}`;
            let registroNomeItem = `${itemObj.nome.split('-')[0].trim()} - ${contadorStr}`;
            
            dados.contribuicoes.push({
                idUnico: Date.now() + Math.random(),
                nome: nome,
                item: registroNomeItem
            });
            itensFlegadosNomes.push(registroNomeItem);
        }
    });

    await salvarDadosNoBanco();

    if(inputNome) inputNome.value = '';
    renderizarItensCestaAtiva();
    atualizarStatusGeral();

    let mensagemPopup = `Não esqueça de tirar um print desta tela!<br><br>Itens escolhidos:<br><b>${itensFlegadosNomes.join('<br>')}</b><br><br>Leve os itens no dia informado pelo ministério. Deus abençoe!`;
    let msgTexto = document.getElementById('modalMensagemTexto');
    if(msgTexto) msgTexto.innerHTML = mensagemPopup;
    
    let modal = document.getElementById('modalPopup');
    if(modal) modal.style.display = 'flex';
};

window.fecharModal = function() {
    let modal = document.getElementById('modalPopup');
    if(modal) modal.style.display = 'none';
};

// Acesso Admin
window.tentarAdmin = function() {
    let senha = prompt('Digite a senha do Administrador:');
    if(senha === '1234') {
        atualizarStatusGeral();
        cestaVisualizadaAdmin = 1;
        mudarTela('tela3');
    } else if(senha !== null) {
        alert('Senha incorreta!');
    }
};

window.verDetalhesCestaAdmin = function(num) {
    if(num === 2 && !verificarCestaCompleta(1)) {
        alert('Cesta bloqueada.');
        return;
    }
    if(num === 3 && (!verificarCestaCompleta(1) || !verificarCestaCompleta(2))) {
        alert('Cesta bloqueada.');
        return;
    }
    cestaVisualizadaAdmin = num;
    let tituloT4 = document.getElementById('tituloTela4');
    if(tituloT4) tituloT4.innerText = `Gerenciamento - Cesta ${num}`;
    renderizarListaContribuicoesAdmin();
    mudarTela('tela4');
};

function renderizarListaContribuicoesAdmin() {
    let container = document.getElementById('containerContribuicoesLista');
    if(!container) return;
    container.innerHTML = '';

    let contribuicoes = dadosCestas[cestaVisualizadaAdmin].contribuicoes;
    if(contribuicoes.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--cinza-chumbo); margin-top:20px;">Nenhuma contribuição registrada nesta cesta ainda.</p>';
        return;
    }

    contribuicoes.forEach(c => {
        let div = document.createElement('div');
        div.className = 'contribution-list-item';
        div.innerHTML = `
            <span><b>${c.nome}</b> - ${c.item}</span>
            <button onclick="removerItemContribuicao(${c.idUnico})" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold; font-size: 16px;">❌</button>
        `;
        container.appendChild(div);
    });
}

window.removerItemContribuicao = async function(idUnico) {
    if(!confirm('Deseja remover este item da lista?')) return;
    
    let dados = dadosCestas[cestaVisualizadaAdmin];
    let index = dados.contribuicoes.findIndex(c => c.idUnico === idUnico);
    if(index !== -1) {
        let itemRemovido = dados.contribuicoes[index];
        let nomeItemBase = itemRemovido.item.split('-')[0].trim();
        let itemObj = dados.itens.find(i => i.nome.includes(nomeItemBase));
        if(itemObj && itemObj.atual > 0) {
            itemObj.atual -= 1;
        }
        dados.contribuicoes.splice(index, 1);
        await salvarDadosNoBanco();
        renderizarListaContribuicoesAdmin();
        atualizarStatusGeral();
    }
};

window.resetarCestaAtual = async function() {
    if(confirm('Tem certeza absoluta que deseja resetar todos os itens e contribuições desta cesta?')) {
        let dados = dadosCestas[cestaVisualizadaAdmin];
        dados.contribuicoes = [];
        dados.itens.forEach(i => i.atual = 0);
        await salvarDadosNoBanco();
        renderizarListaContribuicoesAdmin();
        atualizarStatusGeral();
        alert('Cesta resetada com sucesso!');
    }
};

// No HTML, certifique-se de carregar o script como type="module" para o Firebase funcionar:
// <script type="module" src="script.js"></script>
carregarDadosDoBanco();
