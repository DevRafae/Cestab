import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";

// Suas credenciais oficiais do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBEZG1_x1_DvaoE8DMm5Ni1r2ntl0cwnC0",
    authDomain: "cesta-b.firebaseapp.com",
    projectId: "cesta-b",
    storageBucket: "cesta-b.firebasestorage.app",
    messagingSenderId: "387760959485",
    appId: "1:387760959485:web:3a4c4fdef7964876edf394",
    measurementId: "G-1BRL7NELCE"
};

let db = null;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app); // Inicializa o banco de dados
    getAnalytics(app);      // Inicializa o analytics
} catch (e) {
    console.warn("Erro ao iniciar o Firebase:", e);
}

let cestaAtualAtiva = 1;
let cestaVisualizadaAdmin = 1;

const modeloDadosCestas = {
    1: {
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
        ],
        contribuicoes: []
    },
    2: {
        itens: [
            { id: 'cafe_c2', nome: 'Café - 500g', atual: 0, meta: 1 }
        ],
        contribuicoes: []
    },
    3: {
        itens: [
            { id: 'acucar_c3', nome: 'Açúcar refinado - 1kg', atual: 0, meta: 1 }
        ],
        contribuicoes: []
    }
};

let dadosCestas = JSON.parse(JSON.stringify(modeloDadosCestas));

async function carregarDadosDoBanco() {
    if (!db) return;
    try {
        const docRef = doc(db, "sistema", "cestasData");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            dadosCestas = docSnap.data();
        } else {
            await setDoc(docRef, modeloDadosCestas);
        }
    } catch (e) {
        console.warn("Erro ao carregar do Firebase.", e);
    }
    atualizarStatusGeral();
}

async function salvarDadosNoBanco() {
    if (!db) return;
    try {
        await setDoc(doc(db, "sistema", "cestasData"), dadosCestas);
    } catch (e) {
        console.warn("Erro ao salvar no Firebase.", e);
    }
}

function mudarTela(idTela) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const telaAlvo = document.getElementById(idTela);
    if (telaAlvo) telaAlvo.classList.add('active');
}

function verificarCestaCompleta(numCesta) {
    let itens = dadosCestas[numCesta].itens;
    return itens.every(item => item.atual >= item.meta);
}

function atualizarStatusGeral() {
    let c1Completa = verificarCestaCompleta(1);
    let c2Completa = verificarCestaCompleta(2);

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

function abrirCesta(num) {
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
}

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
        div.style.marginBottom = '10px';
        div.innerHTML = `
            <div class="item-row-top" style="display:flex; justify-content:space-between; align-items:center;">
                <div class="item-info" style="display:flex; align-items:center; gap:8px;">
                    <input type="checkbox" class="check-item" value="${item.id}" ${completo ? 'disabled' : ''}>
                    <span>${item.nome}</span>
                </div>
                <span>${item.atual}/${item.meta}</span>
            </div>
            ${completo ? '<div class="item-status-msg" style="font-size:12px; color:green;">Item já completado!</div>' : ''}
        `;
        container.appendChild(div);
    });
}

async function registrarContribuicao() {
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
}

function verDetalhesCestaAdmin(num) {
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
}

function renderizarListaContribuicoesAdmin() {
    let container = document.getElementById('containerContribuicoesLista');
    if(!container) return;
    container.innerHTML = '';

    let contribuicoes = dadosCestas[cestaVisualizadaAdmin].contribuicoes;
    if(contribuicoes.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#666; margin-top:20px;">Nenhuma contribuição registrada nesta cesta ainda.</p>';
        return;
    }

    contribuicoes.forEach(c => {
        let div = document.createElement('div');
        div.className = 'contribution-list-item';
        div.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:#f9f9f9; padding:8px; margin-bottom:5px; border-radius:5px;";
        div.innerHTML = `
            <span><b>${c.nome}</b> - ${c.item}</span>
            <button class="btn-remover" data-id="${c.idUnico}" style="background:none; border:none; color:red; cursor:pointer; font-weight:bold; font-size: 16px;">❌</button>
        `;
        container.appendChild(div);
    });

    container.querySelectorAll('.btn-remover').forEach(btn => {
        btn.addEventListener('click', async function() {
            let idUnico = Number(this.getAttribute('data-id'));
            if(!confirm('Deseja remover este item da lista?')) return;
            
            let dados = dadosCestas[cestaVisualizadaAdmin];
            let index = dados.contribuicoes.findIndex(item => item.idUnico === idUnico);
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
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    carregarDadosDoBanco();

    document.getElementById('btnCesta1')?.addEventListener('click', () => abrirCesta(1));
    document.getElementById('cardCesta2')?.addEventListener('click', () => abrirCesta(2));
    document.getElementById('cardCesta3')?.addEventListener('click', () => abrirCesta(3));

    document.getElementById('btnAdmin')?.addEventListener('click', () => {
        let senha = prompt('Digite a senha do Administrador:');
        if(senha === '1234') {
            atualizarStatusGeral();
            cestaVisualizadaAdmin = 1;
            mudarTela('tela3');
        } else if(senha !== null) {
            alert('Senha incorreta!');
        }
    });

    document.getElementById('btnRegistrar')?.addEventListener('click', registrarContribuicao);
    
    document.getElementById('btnVoltarTela2')?.addEventListener('click', () => mudarTela('tela1'));
    document.getElementById('btnVoltarTela3')?.addEventListener('click', () => mudarTela('tela1'));
    document.getElementById('btnVoltarTela4')?.addEventListener('click', () => mudarTela('tela3'));

    document.getElementById('btnAdminCesta1')?.addEventListener('click', () => verDetalhesCestaAdmin(1));
    document.getElementById('btnAdminCesta2')?.addEventListener('click', () => verDetalhesCestaAdmin(2));
    document.getElementById('btnAdminCesta3')?.addEventListener('click', () => verDetalhesCestaAdmin(3));

    document.getElementById('btnResetar')?.addEventListener('click', async () => {
        if(confirm('Tem certeza absoluta que deseja resetar todos os itens e contribuições desta cesta?')) {
            let dados = dadosCestas[cestaVisualizadaAdmin];
            dados.contribuicoes = [];
            dados.itens.forEach(i => i.atual = 0);
            await salvarDadosNoBanco();
            renderizarListaContribuicoesAdmin();
            atualizarStatusGeral();
            alert('Cesta resetada com sucesso!');
        }
    });

    document.getElementById('btnFecharModal')?.addEventListener('click', () => {
        let modal = document.getElementById('modalPopup');
        if(modal) modal.style.display = 'none';
        mudarTela('tela1');
    });
});
