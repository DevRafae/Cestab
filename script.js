// Importa o Firebase via CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, doc, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuração do Firebase com as suas chaves
const firebaseConfig = {
    apiKey: "AIzaSyBEZG1_x1_DvaoE8DMm5Ni1r2ntl0cwnC0",
    authDomain: "cesta-b.firebaseapp.com",
    projectId: "cesta-b",
    storageBucket: "cesta-b.firebasestorage.app",
    messagingSenderId: "387760959485",
    appId: "1:387760959485:web:3a4c4fdef7964876edf394",
    measurementId: "G-1BRL7NELCE"
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Modelo padrão de itens para cada cesta
const modeloItens = [
    { id: 1, nome: "Arroz (5kg)", meta: 1, atual: 0 },
    { id: 2, nome: "Feijão (1kg)", meta: 2, atual: 0 },
    { id: 3, nome: "Macarrão (500g)", meta: 3, atual: 0 },
    { id: 4, nome: "Óleo de Soja", meta: 1, atual: 0 },
    { id: 5, nome: "Açúcar (1kg)", meta: 2, atual: 0 },
    { id: 6, nome: "Sal (1kg)", meta: 1, atual: 0 }
];

let cestas = [];
let cestaAtivaIndex = 0;
let cestaGerenciamentoIndex = 0;

// Função para carregar as cestas do Firestore
async function carregarDadosDoBanco() {
    try {
        const querySnapshot = await getDocs(collection(db, "cestas"));
        if (querySnapshot.empty) {
            // Se o banco estiver vazio, cria as 3 cestas iniciais no Firestore
            cestas = [
                { id: 1, itens: JSON.parse(JSON.stringify(modeloItens)) },
                { id: 2, itens: JSON.parse(JSON.stringify(modeloItens)) },
                { id: 3, itens: JSON.parse(JSON.stringify(modeloItens)) }
            ];
            for (let cesta of cestas) {
                await setDoc(doc(db, "cestas", String(cesta.id)), cesta);
            }
        } else {
            cestas = [];
            querySnapshot.forEach((docSnap) => {
                cestas.push(docSnap.data());
            });
            // Ordena pelo ID da cesta
            cestas.sort((a, b) => a.id - b.id);
        }
        renderizarTela1();
    } catch (error) {
        console.error("Erro ao carregar dados do Firebase: ", error);
        alert("Erro ao conectar com o banco de dados.");
    }
}

// Salva/Atualiza uma cesta específica no Firestore
async function salvarCestaNoBanco(cesta) {
    try {
        await setDoc(doc(db, "cestas", String(cesta.id)), cesta);
    } catch (error) {
        console.error("Erro ao salvar no Firebase: ", error);
        alert("Erro ao atualizar o banco de dados.");
    }
}

// Alternância entre telas
window.irParaTela = function(num) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`tela-${num}`).classList.add('active');
    
    if (num === 1) renderizarTela1();
    if (num === 3) renderizarTela3();
}

function cestaEstaCompleta(cesta) {
    return cesta.itens.every(item => item.atual >= item.meta);
}

// Renderiza a Tela 1
function renderizarTela1() {
    const container = document.getElementById('lista-cestas-container');
    container.innerHTML = '';

    cestas.forEach((cesta, index) => {
        let bloqueada = false;
        if (index > 0) {
            bloqueada = !cestaEstaCompleta(cestas[index - 1]);
        }

        const completa = cestaEstaCompleta(cesta);
        
        let iconeSvg = `<svg class="menu-icon-svg" viewBox="0 0 576 512"><path d="M253.3 35.1c6.1-11.8 18.3-19.1 31.7-19.1s25.6 7.3 31.7 19.1L522.4 430.3c5.4 10.6 4.3 23.3-2.9 32.7s-19.4 14.9-31.2 14.9L87.7 478.1c-11.8 0-24-5.5-31.2-14.9s-8.3-22.1-2.9-32.7L253.3 35.1z"/></svg>`;

        if (bloqueada) {
            iconeSvg = `<svg class="menu-icon-svg" viewBox="0 0 640 640"><path d="M528 320C528 434.9 434.9 528 320 528C205.1 528 112 434.9 112 320C112 205.1 205.1 112 320 112C434.9 112 528 205.1 528 320zM64 320C64 461.4 178.6 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320zM296 184L296 320C296 328 300 335.5 306.7 340L402.7 404C413.7 411.4 428.6 408.4 436 397.3C443.4 386.2 440.4 371.4 429.3 364L344 307.2L344 184C344 170.7 333.3 160 320 160C306.7 160 296 170.7 296 184z"/></svg>`;
        }

        const card = document.createElement('div');
        card.className = `menu-card ${bloqueada ? 'locked' : ''}`;

        const totalItensMeta = cesta.itens.reduce((acc, i) => acc + i.meta, 0);
        const totalItensAtual = cesta.itens.reduce((acc, i) => acc + Math.min(i.atual, i.meta), 0);
        const porcentagem = Math.round((totalItensAtual / totalItensMeta) * 100);

        card.innerHTML = `
            <div class="menu-card-left">
                ${iconeSvg}
                <div>
                    <div>Cesta ${cesta.id}</div>
                    <div style="font-size: 12px; color: var(--cinza-chumbo); font-weight: normal;">
                        ${bloqueada ? 'Aguardando cesta anterior' : (completa ? 'Completa' : `Progresso: ${porcentagem}%`)}
                    </div>
                </div>
            </div>
            <div style="font-size: 13px; color: var(--cinza-chumbo);">
                ${bloqueada ? '🔒' : '➔'}
            </div>
        `;

        if (!bloqueada) {
            card.onclick = () => abrirTela2(index);
        }
        container.appendChild(card);
    });
}

function abrirTela2(index) {
    cestaAtivaIndex = index;
    document.getElementById('titulo-cesta-ativa').innerText = `Cesta ${cestas[index].id}`;
    document.getElementById('nome-colaborador').value = '';
    renderizarItensTela2();
    window.irParaTela(2);
}

function renderizarItensTela2() {
    const container = document.getElementById('itens-cesta-container');
    container.innerHTML = '';
    const cesta = cestas[cestaAtivaIndex];

    cesta.itens.forEach(item => {
        const completo = item.atual >= item.meta;
        const div = document.createElement('div');
        div.className = `item-row ${completo ? 'completed' : ''}`;
        
        div.innerHTML = `
            <div class="item-row-top">
                <div class="item-info">
                    <input type="checkbox" data-id="${item.id}" ${completo ? 'disabled'} style="width: 18px; height: 18px; cursor: pointer;">
                    <span><strong>${item.nome}</strong> (Meta: ${item.meta} | Arrecadado: ${item.atual})</span>
                </div>
            </div>
            ${completo ? '<div class="item-status-msg" style="color: #ef4444;">Item já completado! Não pode mais receber doações.</div>' : ''}
        `;
        container.appendChild(div);
    });
}

// Registrar contribuição e atualizar o Firebase
window.registrarContribuicao = async function() {
    const nome = document.getElementById('nome-colaborador').value.trim();
    if (!nome) {
        alert('Por favor, digite seu nome completo.');
        return;
    }

    const checkboxes = document.querySelectorAll('#itens-cesta-container input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert('Selecione pelo menos um item para contribuir.');
        return;
    }

    let itensSelecionadosNomes = [];
    const cesta = cestas[cestaAtivaIndex];

    checkboxes.forEach(cb => {
        const id = parseInt(cb.getAttribute('data-id'));
        const item = cesta.itens.find(i => i.id === id);
        if (item && item.atual < item.meta) {
            item.atual += 1;
            itensSelecionadosNomes.push(item.nome);
        }
    });

    await salvarCestaNoBanco(cesta);

    document.getElementById('texto-sucesso').innerText = `Obrigado, ${nome}! Sua contribuição foi registrada. Não esqueça de levar os itens: ${itensSelecionadosNomes.join(', ')} conforme orientado pelo ministério. Deus abençoe!`;
    document.getElementById('modal-sucesso').style.display = 'flex';
}

window.fecharModalSucesso = function() {
    document.getElementById('modal-sucesso').style.display = 'none';
    window.irParaTela(1);
}

function renderizarTela3() {
    const container = document.getElementById('cards-gerenciamento');
    container.innerHTML = '';
    
    cestas.forEach((cesta, index) => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <div class="menu-card-left">
                <div>Gerenciar Cesta ${cesta.id}</div>
            </div>
            <div style="font-size: 13px; color: var(--cinza-chumbo);">⚙️</div>
        `;
        card.onclick = () => abrirTela4(index);
        container.appendChild(card);
    });
}

function abrirTela4(index) {
    cestaGerenciamentoIndex = index;
    document.getElementById('titulo-tela-4').innerText = `Itens da Cesta ${cestas[index].id}`;
    renderizarDetalhesTela4();
    window.irParaTela(4);
}

function renderizarDetalhesTela4() {
    const container = document.getElementById('detalhe-itens-container');
    container.innerHTML = '';
    const cesta = cestas[cestaGerenciamentoIndex];

    cesta.itens.forEach((item, itemIndex) => {
        const div = document.createElement('div');
        div.className = 'item-row';
        div.innerHTML = `
            <div class="item-row-top">
                <span style="font-size: 14px;"><strong>${item.nome}</strong> (Qtd: ${item.atual} / Meta: ${item.meta})</span>
                <button onclick="removerItemUnico(${itemIndex})" class="btn-danger" style="width: auto; padding: 6px 12px; font-size: 12px;">Remover 1</button>
            </div>
        `;
        container.appendChild(div);
    });
}

window.removerItemUnico = async function(itemIndex) {
    const cesta = cestas[cestaGerenciamentoIndex];
    if (cesta.itens[itemIndex].atual > 0) {
        cesta.itens[itemIndex].atual -= 1;
        await salvarCestaNoBanco(cesta);
        renderizarDetalhesTela4();
    } else {
        alert('A quantidade deste item já está em zero.');
    }
}

window.resetarCestaAtual = async function() {
    if (confirm('Tem certeza absoluta que deseja zerar todos os itens desta cesta?')) {
        cestas[cestaGerenciamentoIndex].itens.forEach(i => i.atual = 0);
        await salvarCestaNoBanco(cestas[cestaGerenciamentoIndex]);
        renderizarDetalhesTela4();
    }
}

window.abrirModalAdmin = function() {
    document.getElementById('modal-admin').style.display = 'flex';
}

window.fecharModalAdmin = function() {
    document.getElementById('modal-admin').style.display = 'none';
    document.getElementById('senha-admin').value = '';
}

window.validarAdmin = function() {
    const senha = document.getElementById('senha-admin').value;
    if (senha === '1234') {
        window.fecharModalAdmin();
        window.irParaTela(3);
    } else {
        alert('Senha incorreta!');
    }
}

// Inicia o app carregando os dados do Firebase
carregarDadosDoBanco();
