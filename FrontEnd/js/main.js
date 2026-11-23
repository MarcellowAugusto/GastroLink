// ==========================================
// FUNÇÕES GERAIS DO SITE
// ==========================================


// ==========================================
// NAVEGAÇÃO
// ==========================================

function showPage(pageId) {

    console.log(
        "📄 Mudando para página:",
        pageId
    );


    const page =
        document.getElementById(pageId);


    if (!page) {

        console.error(
            "❌ Página não encontrada:",
            pageId
        );

        return;
    }


    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove("active");

        });


    page.classList.add("active");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    console.log(
        "✅ Página aberta:",
        pageId
    );


    // ==========================================
    // NOTIFICAÇÕES DO RESTAURANTE
    // ==========================================

    if (
        pageId === "page-notif-restaurante" &&
        typeof carregarNotificacoesRestaurante === "function"
    ) {

        console.log(
            "🔔 CARREGANDO NOTIFICAÇÕES DO RESTAURANTE..."
        );

        carregarNotificacoesRestaurante();
    }
    if (
            pageId === "page-notif-influencer" &&
            typeof carregarNotificacoesInfluencer === "function"
        ) {

            console.log(
                "🔔 CARREGANDO NOTIFICAÇÕES DO INFLUENCER..."
            );

            carregarNotificacoesInfluencer();
        }
}
async function carregarNotificacoesInfluencer() {

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("❌ Token não encontrado.");
        return;
    }

    const container = document.getElementById(
        "notificacoes-influencer"
    );

    if (!container) {
        console.error(
            "❌ Container #notificacoes-influencer não encontrado."
        );
        return;
    }

    // ==========================================
    // CARREGANDO
    // ==========================================

    container.innerHTML = `
        <div class="notif-item">

            <div class="notif-icon">
                ⏳
            </div>

            <div class="notif-body">

                <strong>
                    Carregando notificações...
                </strong>

                <p>
                    Buscando suas propostas.
                </p>

            </div>

        </div>
    `;

    try {

        const response = await fetch(
            "https://localhost:7111/api/Proposta/me/influencer",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        console.log(
            "📡 STATUS NOTIFICAÇÕES INFLUENCER:",
            response.status
        );

        // ==========================================
        // ERRO DA API
        // ==========================================

        if (!response.ok) {

            const erro = await response.text();

            console.error(
                "❌ ERRO AO BUSCAR NOTIFICAÇÕES:",
                erro
            );

            container.innerHTML = `
                <div class="notif-item">

                    <div class="notif-icon">
                        ⚠️
                    </div>

                    <div class="notif-body">

                        <strong>
                            Erro ao carregar notificações
                        </strong>

                        <p>
                            Não foi possível buscar suas propostas.
                        </p>

                    </div>

                </div>
            `;

            return;
        }

        const propostas = await response.json();
        
        propostas.sort(
            (a, b) =>
                new Date(b.dataCriacao) - new Date(a.dataCriacao)
        );

        console.log(
            "🔔 PROPOSTAS DO INFLUENCER:",
            propostas
        );

        // Guarda as propostas para usarmos depois
        window.propostasInfluencer = propostas;

        // ==========================================
        // NENHUMA PROPOSTA
        // ==========================================

        if (!propostas || propostas.length === 0) {

            container.innerHTML = `
                <div class="notif-item">

                    <div class="notif-icon">
                        📭
                    </div>

                    <div class="notif-body">

                        <strong>
                            Nenhuma proposta encontrada
                        </strong>

                        <p>
                            Quando houver uma proposta,
                            ela aparecerá aqui.
                        </p>

                    </div>

                </div>
            `;

            return;
        }

        // ==========================================
        // RENDERIZAR
        // ==========================================

        container.innerHTML = propostas
            .map(proposta => {

                console.log(
                    "🎨 Renderizando proposta:",
                    proposta.id
                );

                const status = proposta.status;
                const solicitante = proposta.solicitante;

                let icone = "📩";
                let titulo = "";
                let mensagem = "";
                let statusTexto = "Desconhecido";
                let statusClasse = "";
                let acao = "";

                // ==========================================
                // INFLUENCER ENVIOU A PROPOSTA
                // ==========================================

                if (solicitante === 1) {

                    if (status === 1) {

                        icone = "📤";

                        titulo =
                            `Você enviou uma proposta para ${proposta.nomeRestaurante}.`;

                        mensagem = `
                            Sua proposta está aguardando
                            uma resposta do restaurante.
                        `;

                        statusTexto = "Pendente";
                        statusClasse = "status-pending";

                    }
                    else if (status === 2) {

                        icone = "📤";

                        titulo =
                            `Você enviou uma proposta para ${proposta.nomeRestaurante}.`;

                        mensagem = `
                            Sua proposta foi aceita! ✅
                        `;

                        statusTexto = "Aceita";
                        statusClasse = "status-accepted";

                        acao = `
                            <div style="margin-top:0.9rem">

                                📧
                                <strong>
                                    Entre em contato com o restaurante
                                </strong>

                                <br>

                                <span>
                                    E-mail:
                                </span>

                                <a
                                    href="mailto:${proposta.emailRestaurante}"
                                    style="color:var(--accent)"
                                >
                                    ${proposta.emailRestaurante}
                                </a>

                            </div>
                        `;
                    }
                    else if (status === 3) {

                        icone = "📤";

                        titulo =
                            `Você enviou uma proposta para ${proposta.nomeRestaurante}.`;

                        mensagem = `
                            Sua proposta foi recusada. ❌
                        `;

                        statusTexto = "Recusada";
                        statusClasse = "status-rejected";
                    }
                }

                // ==========================================
                // RESTAURANTE ENVIOU A PROPOSTA
                // ==========================================

                else if (solicitante === 2) {

                    if (status === 1) {

                        icone = "📩";

                        titulo =
                            "Nova proposta de parceria";

                        mensagem = `
                            <strong>
                                ${proposta.nomeRestaurante}
                            </strong>
                            enviou uma proposta para você.
                        `;

                        statusTexto = "Pendente";
                        statusClasse = "status-pending";

                        acao = `
                            <a
                                href="#"
                                onclick="abrirPropostaInfluencer(${proposta.id}); return false;"
                                style="color:var(--accent)"
                            >
                                Ver proposta →
                            </a>
                        `;
                    }
                    else if (status === 2) {

                        icone = "📩";

                        titulo =
                            `Você aceitou a proposta de ${proposta.nomeRestaurante}.`;

                        mensagem = `
                            Sua parceria com
                            <strong>${proposta.nomeRestaurante}</strong>
                            foi aceita! ✅
                        `;

                        statusTexto = "Aceita";
                        statusClasse = "status-accepted";

                        acao = `
                            <div style="margin-top:0.9rem">

                                📧
                                <strong>
                                    Entre em contato com o restaurante
                                </strong>

                                <br>

                                <span>
                                    E-mail:
                                </span>

                                <a
                                    href="mailto:${proposta.emailRestaurante}"
                                    style="color:var(--accent)"
                                >
                                    ${proposta.emailRestaurante}
                                </a>

                            </div>
                        `;
                    }
                    else if (status === 3) {

                        icone = "📩";

                        titulo =
                            `Você recusou a proposta de ${proposta.nomeRestaurante}.`;

                        mensagem = `
                            Essa proposta foi recusada. ❌
                        `;

                        statusTexto = "Recusada";
                        statusClasse = "status-rejected";
                    }
                }

                // ==========================================
                // REGISTROS ANTIGOS
                // solicitante = 0
                // ==========================================

                else {

                    icone = "📩";

                    titulo =
                        "Proposta de parceria";

                    mensagem = `
                        Proposta relacionada ao restaurante
                        <strong>${proposta.nomeRestaurante}</strong>.
                    `;

                    statusTexto =
                        status === 1 ? "Pendente" :
                        status === 2 ? "Aceita" :
                        status === 3 ? "Recusada" :
                        "Desconhecido";

                    statusClasse =
                        status === 1 ? "status-pending" :
                        status === 2 ? "status-accepted" :
                        status === 3 ? "status-rejected" :
                        "";
                }

                // ==========================================
                // DESCRIÇÃO
                // ==========================================

                const descricao = proposta.descricao
                    ? `
                        <div
                            style="
                                margin-top:0.8rem;
                                padding:0.8rem;
                                border-radius:8px;
                                background:rgba(255,255,255,0.04);
                            "
                        >
                            <strong>
                                Proposta:
                            </strong>

                            <div style="margin-top:0.3rem">
                                ${proposta.descricao}
                            </div>
                        </div>
                    `
                    : "";

                // ==========================================
                // CARD
                // ==========================================

                return `
                    <div
                        class="notif-item ${
                            status === 1 ? "unread" : ""
                        }"
                    >

                        <div class="notif-icon">
                            ${icone}
                        </div>

                        <div class="notif-body">

                            <strong>
                                ${titulo}
                            </strong>

                            <p>
                                ${mensagem}
                            </p>

                            ${descricao}

                            ${acao}

                           <div class="notif-time">

                            ${new Date(
                                proposta.dataCriacao + "Z"
                            ).toLocaleString("pt-BR")}

                        </div>

                        </div>

                        <span class="status ${statusClasse}">
                            ${statusTexto}
                        </span>

                    </div>
                `;
            })
            .join("");

        console.log(
            "✅ NOTIFICAÇÕES DO INFLUENCER RENDERIZADAS."
        );

    }
    catch (error) {

        console.error(
            "🔥 ERRO AO CARREGAR NOTIFICAÇÕES:",
            error
        );

        container.innerHTML = `
            <div class="notif-item">

                <div class="notif-icon">
                    ⚠️
                </div>

                <div class="notif-body">

                    <strong>
                        Erro ao carregar notificações
                    </strong>

                    <p>
                        Não foi possível conectar com a API.
                    </p>

                </div>

            </div>
        `;
    }
}

// ==========================================
// TOAST
// ==========================================

function showToast(msg) {

    const toast =
        document.getElementById("toast");


    if (!toast) {

        console.error(
            "❌ Elemento #toast não encontrado."
        );

        return;
    }


    toast.textContent = msg;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);
}
// ==========================================
// FILTROS DOS INFLUENCIADORES
// HOME DO RESTAURANTE
// ==========================================

function applyFilter() {

    // Garante que temos os influencers carregados
    if (!Array.isArray(INFLUENCERS)) {
        console.error("❌ Lista de influencers não encontrada.");
        return;
    }

    // ==========================================
    // FILTRO DE SEGUIDORES
    // ==========================================

    const filtroSeguidores =
        document.getElementById("filtro-seguidores");

    const minimoSeguidores =
        Number(filtroSeguidores?.value || 0);


    // ==========================================
    // ORDENAÇÃO
    // ==========================================

    const filtroOrdenacao =
        document.getElementById("filtro-ordenacao");

    const ordenacao =
        filtroOrdenacao?.value || "padrao";


    // ==========================================
    // COPIA DA LISTA ORIGINAL
    // ==========================================

    let filtrados = [...INFLUENCERS];


    // ==========================================
    // APLICA SEGUIDORES MÍNIMOS
    // ==========================================

    if (minimoSeguidores > 0) {

        filtrados = filtrados.filter(influencer => {

            const seguidores =
                Number(influencer.seguidores || 0);

            return seguidores >= minimoSeguidores;

        });

    }


    // ==========================================
    // ORDENAÇÃO
    // ==========================================

    switch (ordenacao) {

        case "seguidores-desc":

            filtrados.sort((a, b) =>
                Number(b.seguidores || 0) -
                Number(a.seguidores || 0)
            );

            break;


        case "seguidores-asc":

            filtrados.sort((a, b) =>
                Number(a.seguidores || 0) -
                Number(b.seguidores || 0)
            );

            break;


        case "nome-asc":

            filtrados.sort((a, b) =>
                (a.nome || "").localeCompare(
                    b.nome || "",
                    "pt-BR"
                )
            );

            break;


        case "nome-desc":

            filtrados.sort((a, b) =>
                (b.nome || "").localeCompare(
                    a.nome || "",
                    "pt-BR"
                )
            );

            break;

    }


    // ==========================================
    // ATUALIZA OS CARDS
    // ==========================================

    renderInfluencers(filtrados);


    console.log(
        "🔎 FILTRO APLICADO:",
        filtrados
    );
}

async function salvarMeuRestaurante() {

  const token = localStorage.getItem("token");

  // ==========================================
  // VERIFICAR SESSÃO
  // ==========================================

  if (!token) {
    showToast("❌ Sessão expirada. Faça login novamente.");
    return;
  }

  // ==========================================
  // PEGAR VALORES DOS CAMPOS
  // ==========================================

  const nome = document
    .getElementById("restaurante-edit-nome").value.trim();

  const categoria = document
    .getElementById("restaurante-edit-categoria").value.trim();

  const endereco = document
    .getElementById("restaurante-edit-endereco").value.trim();

  const telefone = document
    .getElementById("restaurante-edit-telefone").value.trim();

  const fotoUrl = document
    .getElementById("restaurante-edit-foto").value.trim();

  const descricao = document
    .getElementById("restaurante-edit-descricao").value.trim();

  // ==========================================
  // MONTAR OBJETO
  // ==========================================

  const dados = {
    nome: nome,
    descricao: descricao,
    endereco: endereco,
    categoria: categoria,
    telefone: telefone,
    fotoUrl: fotoUrl
  };

  console.log("📤 ENVIANDO ATUALIZAÇÃO DO RESTAURANTE:");
  console.log("📦 Dados:", dados);

  // ==========================================
  // ENVIAR PUT PARA A API
  // ==========================================

  try {

    const response = await fetch(
      "https://localhost:7111/api/Restaurante/me",
      {
        method: "PUT",

        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },

        body: JSON.stringify(dados)
      }
    );

    console.log("📡 STATUS ATUALIZAÇÃO:", response.status);

    if (!response.ok) {

      const erro = await response.text();

      console.error("❌ ERRO DA API:", erro);

      throw new Error("Não foi possível atualizar o restaurante.");
    }

    const resultado = await response.json();

    console.log("✅ RESTAURANTE ATUALIZADO:", resultado);

    showToast("✅ Restaurante atualizado com sucesso!");

    // Atualizar informações exibidas na página
    if (typeof carregarMeuRestaurante === "function") {
      await carregarMeuRestaurante();
    }

  } catch (error) {

    console.error("🔥 ERRO AO SALVAR RESTAURANTE:", error);

    showToast("❌ Não foi possível salvar as alterações.");
  }
}

function atualizarAvatar(fotoUrl, nome, imgId, placeholderId) {
    const img = document.getElementById(imgId);
    const placeholder = document.getElementById(placeholderId);

    if (!img || !placeholder) return;

    const inicial = (nome || "?").trim().charAt(0).toUpperCase() || "?";

    placeholder.textContent = inicial;

    if (fotoUrl && fotoUrl.trim()) {
        img.onerror = () => {
            img.style.display = "none";
            img.removeAttribute("src");
            placeholder.style.display = "flex";
        };

        img.src = fotoUrl;
        img.style.display = "block";
        placeholder.style.display = "none";
    } else {
        img.onerror = null;
        img.removeAttribute("src");
        img.style.display = "none";
        placeholder.style.display = "flex";
    }
}
