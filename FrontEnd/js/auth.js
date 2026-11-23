// ==========================================
// AUTH - LOGIN E CADASTRO
// ==========================================


// ==========================================
// MODAIS
// ==========================================

function showModal(id) {

    const modal = document.getElementById(id);

    if (!modal) {
        console.error("❌ Modal não encontrado:", id);
        return;
    }

    modal.classList.add("open");

    console.log("✅ Modal aberto:", id);
}


function closeModal(id) {

    const modal = document.getElementById(id);

    if (!modal) {
        console.error("❌ Modal não encontrado:", id);
        return;
    }

    modal.classList.remove("open");
    modal.style.display = "";

    console.log("✅ Modal fechado:", id);
}


function closeAllModals() {

    document.querySelectorAll(".modal-overlay").forEach(modal => {
        modal.classList.remove("open");
        modal.style.display = "";
    });

}


// ==========================================
// ABRIR LOGIN
// ==========================================

function showLogin() {

    console.log("🔥 CLIQUEI EM ENTRAR!");

    closeAllModals();

    showModal("modal-login");
}


// ==========================================
// ABRIR CADASTRO
// ==========================================

function showRegister() {

    console.log("🔥 CLIQUEI EM CADASTRO!");

    closeAllModals();

    showModal("modal-register");
}


// ==========================================
// LOGIN
// ==========================================

async function doLogin() {

    const email = document.getElementById("login-email").value.trim();
    const senha = document.getElementById("login-senha").value;

      // Limpa qualquer estado da conta anterior
        window.meuInfluencerId = null;
        window.influencerSelecionado = null;
        window.propostasInfluencer = [];
        window.propostasRestaurante = [];


    // ==========================================
    // VERIFICAR CAMPOS
    // ==========================================

    if (!email || !senha) {

        showToast("❌ Preencha e-mail e senha");

        return;
    }


    console.log("════════════════════════════════");
    console.log("📤 TENTANDO LOGIN");
    console.log("📧 E-mail:", email);
    console.log("════════════════════════════════");


    try {

        const resposta = await fetch(
            "https://localhost:7111/api/Auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );


        const texto = await resposta.text();


        console.log(
            "📡 STATUS LOGIN:",
            resposta.status
        );

        console.log(
            "📥 RESPOSTA BRUTA LOGIN:",
            texto
        );


        // ==========================================
        // TRANSFORMAR RESPOSTA EM JSON
        // ==========================================

        let dados = null;


        if (texto) {

            try {

                dados = JSON.parse(texto);

            } catch (erro) {

                console.error(
                    "❌ Resposta não é JSON:",
                    texto
                );
            }
        }


        console.log(
            "📦 OBJETO RETORNADO PELO LOGIN:",
            dados
        );


        // ==========================================
        // LOGIN RECUSADO PELA API
        // ==========================================

        if (!resposta.ok) {

            const mensagem =
                dados?.message ||
                dados?.title ||
                dados?.error ||
                `Erro HTTP ${resposta.status}`;


            console.error(
                "❌ LOGIN RECUSADO:",
                dados
            );


            showToast(
                "❌ " + mensagem
            );


            return;
        }


        // ==========================================
        // PEGAR TOKEN
        // ==========================================

        const token =
            dados?.token ||
            dados?.accessToken ||
            dados?.access_token ||
            dados?.data?.token ||
            dados?.data?.accessToken ||
            dados?.user?.token ||
            dados?.usuario?.token;


        if (!token) {

            console.error(
                "❌ LOGIN FUNCIONOU, MAS NÃO ENCONTREI TOKEN."
            );

            console.error(
                "📦 RESPOSTA COMPLETA:",
                dados
            );


            showToast(
                "❌ A API aceitou o login, mas não retornou o token."
            );


            return;
        }


        // ==========================================
        // SALVAR TOKEN
        // ==========================================

        localStorage.setItem(
            "token",
            token
        );


        // Salva também a resposta completa

        localStorage.setItem(
            "usuario",
            JSON.stringify(dados)
        );


        console.log(
            "✅ TOKEN SALVO NO LOCALSTORAGE"
        );


        // ==========================================
        // FECHAR MODAL
        // ==========================================

        closeModal("modal-login");


        showToast(
            "✅ Login realizado com sucesso!"
        );


        // ==========================================
        // DESCOBRIR ROLE
        // ==========================================

        // O backend já retorna a role diretamente:
        // {
        //     "token": "...",
        //     "role": "Influencer"
        // }

        const role = dados?.role;

        console.log("🔎 RESPOSTA COMPLETA:", dados);
        console.log("🔎 ROLE:", dados?.role);
        console.log("🔎 TOKEN SALVO:", !!localStorage.getItem("token"));

        console.log(
            "👤 ROLE RECEBIDA DA API:",
            role
        );


        // ==========================================
        // NORMALIZAR ROLE
        // ==========================================

        const roleNormalizada =
            String(role)
                .trim()
                .toLowerCase();


        console.log(
            "👤 ROLE FINAL:",
            roleNormalizada
        );


            /// ==========================================
            // RESTAURANTE
            // ==========================================

            if (
                roleNormalizada === "1" ||
                roleNormalizada === "restaurante"
            ) {

                console.log("🏪 USUÁRIO É RESTAURANTE");

                if (typeof carregarMeuRestaurante === "function") {
                    await carregarMeuRestaurante();
                } else {
                    console.error("❌ Função carregarMeuRestaurante não encontrada.");
                }

                return;
            }

             // ==========================================
            // INFLUENCIADOR
            // ==========================================

            if (roleNormalizada === "2" ||
                roleNormalizada === "influencer" ||
                roleNormalizada === "influenciador") {

                showPage("page-influencer");

                if (typeof carregarRestaurantes === "function") {
                    await carregarRestaurantes();
                }

                if (typeof carregarMeuPerfil === "function") {
                    await carregarMeuPerfil();
                }

                return;
}

        // ==========================================
        // ROLE NÃO IDENTIFICADA
        // ==========================================

        console.error(
            "❌ NÃO CONSEGUI IDENTIFICAR A ROLE"
        );


        console.error(
            "📦 RESPOSTA DA API:",
            dados
        );


        showToast(
            "⚠️ Login realizado, mas não foi possível identificar o tipo de conta."
        );

    }


    catch (erro) {

        console.error(
            "🔥 ERRO NO LOGIN:",
            erro
        );


        showToast(
            "❌ Não foi possível conectar com a API"
        );
    }
}
async function carregarRestaurantes() {
    const grid = document.getElementById("restaurantes-grid-influencer");

    if (!grid) return;

    const token = localStorage.getItem("token");

    if (!token) {
        showToast("Sessão expirada. Faça login novamente.");
        return;
    }

    grid.innerHTML = `
        <div class="empty-restaurants influencer-loading">
            <div class="empty-icon">🍽️</div>
            <h3>Carregando restaurantes...</h3>
            <p>Aguarde enquanto buscamos os restaurantes disponíveis.</p>
        </div>
    `;

    try {
        const response = await fetch(
            "https://localhost:7111/api/Restaurante",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const restaurantes = await response.json();

        console.log("🍽️ RESTAURANTES RECEBIDOS:", restaurantes);

        // Guarda os restaurantes para usar no perfil
        restaurantesCache = restaurantes;

renderRestaurantesInfluencer(restaurantes);

    } catch (error) {
        console.error("❌ ERRO AO CARREGAR RESTAURANTES:", error);

        grid.innerHTML = `
            <div class="empty-restaurants influencer-loading">
                <div class="empty-icon">⚠️</div>
                <h3>Não foi possível carregar os restaurantes</h3>
                <p>Verifique se a API está funcionando.</p>
            </div>
        `;
    }
}

function renderRestaurantesInfluencer(restaurantes) {

    const grid = document.getElementById(
        "restaurantes-grid-influencer"
    );

    if (!grid) return;


    if (!restaurantes || restaurantes.length === 0) {

        grid.innerHTML = `
            <div class="empty-restaurants influencer-loading">
                <div class="empty-icon">🍽️</div>
                <h3>Nenhum restaurante encontrado</h3>
                <p>Ainda não existem restaurantes cadastrados.</p>
            </div>
        `;

        return;
    }


    grid.innerHTML = restaurantes.map(restaurante => {

        const foto = restaurante.fotoUrl
            ? `
                <img
                    src="${restaurante.fotoUrl}"
                    alt="Foto de ${restaurante.nome || "restaurante"}"
                    loading="lazy"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >

                <div
                    class="influencer-restaurant-photo-placeholder"
                    style="display: none;"
                >
                    <span>🍽️</span>
                    <small>Imagem indisponível</small>
                </div>
            `
            : `
                <div class="influencer-restaurant-photo-placeholder">
                    <span>🍽️</span>
                    <small>Sem foto cadastrada</small>
                </div>
            `;


        return `
            <article
                class="influencer-restaurant-card"
                data-restaurante-id="${restaurante.id}"
            >

                <div class="influencer-restaurant-photo">
                    ${foto}
                </div>


                <div class="influencer-restaurant-body">

                    <span class="influencer-restaurant-category">
                        ${restaurante.categoria || "Restaurante"}
                    </span>


                    <h3 class="influencer-restaurant-name">
                        ${restaurante.nome}
                    </h3>


                    <p class="influencer-restaurant-description">
                        ${restaurante.descricao || "Sem descrição disponível."}
                    </p>


                    <div class="influencer-restaurant-info">

                        <div class="influencer-restaurant-info-item">
                            📍
                            <span>
                                ${restaurante.endereco || "Endereço não informado"}
                            </span>
                        </div>


                        <div class="influencer-restaurant-info-item">
                            📞
                            <span>
                                ${restaurante.telefone || "Telefone não informado"}
                            </span>
                        </div>

                    </div>


                    <button
                        type="button"
                        class="btn btn-primary influencer-restaurant-button"
                        onclick="abrirPerfilRestaurante(${restaurante.id})"
                    >
                        Ver restaurante
                    </button>

                </div>

            </article>
        `;

    }).join("");
}
// ==========================================
// LOGOUT
// ==========================================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    // Limpa dados da conta anterior
    window.meuInfluencerId = null;
    window.influencerSelecionado = null;
    window.propostasInfluencer = [];
    window.propostasRestaurante = [];
    window.influencersCache = [];

    if (typeof restaurantesCache !== "undefined") {
        restaurantesCache = [];
    }

    if (typeof restauranteSelecionado !== "undefined") {
        restauranteSelecionado = null;
    }

    // Limpa o formulário de criação do perfil
    if (typeof limparFormularioInfluencer === "function") {
        limparFormularioInfluencer();
    }

    showPage("page-landing");

    showToast("👋 Você saiu da sua conta.");
}

// ==========================================
// CARREGAR MEU PERFIL - RESTAURANTE
// ==========================================


async function carregarMeuRestaurante() {

    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("⚠️ Token não encontrado.");
        return;
    }

    try {

        const response = await fetch(
            "https://localhost:7111/api/Restaurante/me",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        console.log("📡 STATUS MEU RESTAURANTE:", response.status);

        if (response.status === 404) {

            console.log("⚠️ Restaurante ainda não possui perfil.");

            window.meuRestauranteId = null;
            window.restauranteOriginal = null;

            limparFormularioRestaurante();

            showPage("page-completar-restaurante");

            return;
        }

        if (!response.ok) {

            const erro = await response.text();

            console.error("❌ ERRO AO BUSCAR RESTAURANTE:", erro);

            showToast("❌ Não foi possível carregar seu restaurante.");

            return;
        }

        const restaurante = await response.json();

        console.log("✅ RESTAURANTE CARREGADO:", restaurante);

        window.meuRestauranteId = restaurante.id;
        window.restauranteOriginal = restaurante;

        // ==========================================
        // PREENCHER PÁGINA MEU RESTAURANTE
        // ==========================================

        document.getElementById("meu-restaurante-nome").textContent =
            restaurante.nome || "Meu Restaurante";

        document.getElementById("meu-restaurante-categoria").textContent =
            restaurante.categoria || "Categoria";

        document.getElementById("meu-restaurante-descricao").textContent =
            restaurante.descricao || "A descrição do seu restaurante aparecerá aqui.";

        document.getElementById("meu-restaurante-endereco").textContent =
            restaurante.endereco || "Endereço não informado.";

        document.getElementById("meu-restaurante-telefone").textContent =
            restaurante.telefone || "Telefone não informado.";

        // ==========================================
        // PREENCHER FORMULÁRIO DE EDIÇÃO
        // ==========================================

        document.getElementById("restaurante-edit-nome").value =
            restaurante.nome || "";

        document.getElementById("restaurante-edit-categoria").value =
            restaurante.categoria || "";

        document.getElementById("restaurante-edit-endereco").value =
            restaurante.endereco || "";

        document.getElementById("restaurante-edit-telefone").value =
            restaurante.telefone || "";

        document.getElementById("restaurante-edit-foto").value =
            restaurante.fotoUrl || "";

        document.getElementById("restaurante-edit-descricao").value =
            restaurante.descricao || "";

        // ==========================================
        // ATUALIZAR AVATARES DO RESTAURANTE
        // ==========================================

        atualizarAvatar(
            restaurante.fotoUrl,
            restaurante.nome,
            "perfil-avatar-img-r",
            "perfil-avatar-placeholder-r"
        );

        atualizarAvatar(
            restaurante.fotoUrl,
            restaurante.nome,
            "nav-avatar-img-r",
            "nav-avatar-placeholder-r"
        );

        // ==========================================
        // CARREGAR DASHBOARD
        // ==========================================

        showPage("page-restaurante");

        await carregarInfluencers();

    } catch (error) {

        console.error("🔥 ERRO AO CARREGAR RESTAURANTE:", error);

        showToast("❌ Erro ao conectar com a API.");
    }
}

// ==========================================
// SALVER RESTAURANTE
// ==========================================


async function salvarMeuRestaurante() {

  const token = localStorage.getItem("token");
  const original = window.restauranteOriginal;

  if (!token || !original) {
    showToast("❌ Não foi possível identificar seu restaurante.");
    return;
  }

  const campos = {
    nome: "restaurante-edit-nome",
    descricao: "restaurante-edit-descricao",
    endereco: "restaurante-edit-endereco",
    categoria: "restaurante-edit-categoria",
    telefone: "restaurante-edit-telefone",
    fotoUrl: "restaurante-edit-foto"
  };

  const dados = {};

  for (const [campo, id] of Object.entries(campos)) {
    const elemento = document.getElementById(id);
    if (!elemento) continue;

    const valor = elemento.value.trim();
    const valorOriginal = original[campo] ?? "";

    dados[campo] = valor === valorOriginal ? null : valor;
  }

  console.log("📤 DADOS ALTERADOS:", dados);

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

    if (!response.ok) {
      const erro = await response.text();
      console.error("❌ ERRO DA API:", erro);
      showToast("❌ Não foi possível salvar as alterações.");
      return;
    }

    const atualizado = await response.json();

    window.restauranteOriginal = atualizado;

    showToast("✅ Restaurante atualizado com sucesso!");

    if (typeof carregarMeuRestaurante === "function") {
      await carregarMeuRestaurante();
    }

  } catch (error) {
    console.error("🔥 ERRO AO SALVAR:", error);
    showToast("❌ Erro ao conectar com a API.");
  }
}


// ==========================================
// CARREGAR MEU PERFIL - INFLUENCER
// ==========================================

async function carregarMeuPerfil() {

  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("⚠️ Token não encontrado.");
    return;
  }

  try {

    const response = await fetch(
      "https://localhost:7111/api/Influencer/me",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      }
    );

    console.log("📡 STATUS MEU PERFIL:", response.status);

    // ==========================================
    // INFLUENCER AINDA NÃO POSSUI PERFIL
    // ==========================================

    if (response.status === 404) {

    console.log("⚠️ Influencer ainda não possui perfil.");

    window.meuInfluencerId = null;

    // MUITO IMPORTANTE:
    // limpa os dados que poderiam pertencer ao usuário anterior
    if (typeof limparFormularioInfluencer === "function") {
        limparFormularioInfluencer();
    }

    showPage("page-completar-influencer");

    return;
    }

    // ==========================================
    // OUTRO ERRO DA API
    // ==========================================

    if (!response.ok) {

      const erro = await response.text();

      console.error(
        "❌ ERRO AO BUSCAR MEU PERFIL:",
        erro
      );

      showToast("❌ Não foi possível carregar seu perfil.");

      return;
    }

    // ==========================================
    // PERFIL EXISTE
    // ==========================================

    const influencer = await response.json();

    console.log(
      "👤 MEU PERFIL RECEBIDO:",
      influencer
    );

    window.meuInfluencerId = influencer.id;

    // ==========================================
    // PREENCHER PERFIL
    // ==========================================

    const nome = document.getElementById("perfil-nome-i");
    const instagram = document.getElementById("perfil-instagram-i");
    const seguidores = document.getElementById("perfil-seguidores-i");
    const descricao = document.getElementById("perfil-descricao-i");

    if (nome) {
      nome.textContent =
        influencer.nome || "Meu Perfil";
    }

    if (instagram) {
      instagram.textContent =
        influencer.instagram
          ? `@${influencer.instagram.replace("@", "")}`
          : "@instagram";
    }

    if (seguidores) {
      seguidores.textContent =
        influencer.seguidores ?? 0;
    }

    if (descricao) {
      descricao.textContent =
        influencer.descricao ||
        "Sua descrição aparecerá aqui.";
    }

    // ==========================================
    // PREENCHER CAMPOS DE EDIÇÃO
    // ==========================================

    const editNome =
      document.getElementById("perfil-edit-nome");

    const editInstagram =
      document.getElementById("perfil-edit-instagram");

    const editSeguidores =
      document.getElementById("perfil-edit-seguidores");

    const editTelefone =
      document.getElementById("perfil-edit-telefone");

    const editFoto =
      document.getElementById("perfil-edit-foto");

    const editDescricao =
      document.getElementById("perfil-edit-descricao");

    if (editNome) {
      editNome.value = influencer.nome || "";
    }

    if (editInstagram) {
      editInstagram.value = influencer.instagram || "";
    }

    if (editSeguidores) {
      editSeguidores.value =
        influencer.seguidores ?? 0;
    }

    if (editTelefone) {
      editTelefone.value =
        influencer.telefone || "";
    }

    if (editFoto) {
      editFoto.value =
        influencer.fotoUrl || "";
    }

    if (editDescricao) {
      editDescricao.value =
        influencer.descricao || "";
    }

    // ==========================================
    // ATUALIZAR AVATARES DO INFLUENCER
    // ==========================================

    // Avatar do perfil
    atualizarAvatar(
        influencer.fotoUrl,
        influencer.nome,
        "perfil-avatar-img-i",
        "perfil-avatar-placeholder-i"
    );

    // Avatar da home
    atualizarAvatar(
        influencer.fotoUrl,
        influencer.nome,
        "nav-avatar-img-i",
        "nav-avatar-placeholder-i"
    );

        // ==========================================
        // MOSTRAR PERFIL
        // ==========================================

    } catch (error) {

        console.error(
        "🔥 ERRO AO CARREGAR PERFIL:",
        error
        );

        showToast(
        "❌ Erro ao conectar com a API."
        );
    }
}
// ==========================================
// CARREGAR INFLUENCIADORES
// RESTAURANTE
// ==========================================

async function carregarInfluencers() {

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("❌ Token não encontrado.");
        return;
    }

    try {

        console.log("📡 BUSCANDO INFLUENCIADORES...");

        const response = await fetch(
            "https://localhost:7111/api/Influencer",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        console.log(
            "📡 STATUS INFLUENCIADORES:",
            response.status
        );

        if (!response.ok) {

            const erro = await response.text();

            console.error(
                "❌ ERRO AO BUSCAR INFLUENCIADORES:",
                erro
            );

            throw new Error(
                "Não foi possível carregar os influenciadores."
            );
        }

        const influencers = await response.json();

            console.log(
                "👤 INFLUENCIADORES RECEBIDOS:",
                influencers
            );

            // Guarda os influenciadores para usar na solicitação de parceria
            window.influencersCache = influencers;

            renderInfluencers(influencers);

    } catch (error) {

        console.error(
            "🔥 ERRO AO CARREGAR INFLUENCIADORES:",
            error
        );

        const grid =
            document.getElementById("influencers-grid");

        if (grid) {

            grid.innerHTML = `
                <div class="empty-influencers">

                    <div class="empty-icon">
                        ⚠️
                    </div>

                    <h3>
                        Não foi possível carregar os influenciadores
                    </h3>

                    <p>
                        Verifique se a API está funcionando.
                    </p>

                </div>
            `;
        }
    }
}

async function enviarParceriaRestaurante() {

    const token = localStorage.getItem("token");

    if (!token) {
        showToast("❌ Sessão expirada. Faça login novamente.");
        return;
    }

    const influencer = window.influencerSelecionado;

    if (!influencer) {
        showToast("❌ Nenhum influenciador selecionado.");
        console.error("❌ INFLUENCIADOR NÃO SELECIONADO.");
        return;
    }

    const descricao =
        document.getElementById("parceria-descricao")
            .value
            .trim();

    if (!descricao) {
        showToast("❌ Escreva uma descrição para a proposta.");
        return;
    }

    const payload = {
        descricao: descricao,
        influencerId: influencer.id
    };

    console.log("📤 ENVIANDO PROPOSTA:");
    console.log("👤 Influenciador:", influencer);
    console.log("📦 Payload:", payload);

    try {

        const response = await fetch(
            "https://localhost:7111/api/Proposta/Restaurante",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify(payload)
            }
        );

        const texto = await response.text();

        console.log(
            "📡 STATUS PROPOSTA:",
            response.status
        );

        console.log(
            "📥 RESPOSTA PROPOSTA:",
            texto
        );

        let dados = null;

        if (texto) {

            try {
                dados = JSON.parse(texto);
            } catch {
                dados = null;
            }
        }

        if (!response.ok) {

            console.error(
                "❌ ERRO AO ENVIAR PROPOSTA:",
                dados || texto
            );

            showToast(
                "❌ Não foi possível enviar a proposta."
            );

            return;
        }

        console.log(
            "✅ PROPOSTA ENVIADA COM SUCESSO:",
            dados
        );

        closeModal(
            "modal-parceria-restaurante"
        );

        document.getElementById(
            "parceria-descricao"
        ).value = "";

        window.influencerSelecionado = null;

        showToast(
            "✅ Proposta enviada! O influenciador será notificado."
        );

    } catch (error) {

        console.error(
            "🔥 ERRO AO ENVIAR PROPOSTA:",
            error
        );

        showToast(
            "❌ Não foi possível conectar com a API."
        );
    }
}


function atualizarBolinhaNotificacaoRestaurante(propostas) {

    const bolinha = document.getElementById(
        "notification-dot-restaurante"
    );

    if (!bolinha) return;

    const chave = `notificacoesRestauranteVistas_${window.meuRestauranteId || "conta"}`;

    const vistas = JSON.parse(
        localStorage.getItem(chave) || "[]"
    );

    const novas = propostas.filter(proposta =>
        proposta.solicitante === 1 &&
        proposta.status === 1 &&
        !vistas.includes(proposta.id)
    );

    bolinha.style.display = novas.length > 0
        ? "block"
        : "none";
}


function abrirNotificacoesRestaurante() {

    const chave = `notificacoesRestauranteVistas_${window.meuRestauranteId || "conta"}`;

    const propostas = window.propostasRestaurante || [];

    const vistas = propostas
        .filter(proposta =>
            proposta.solicitante === 1 &&
            proposta.status === 1
        )
        .map(proposta => proposta.id);

    localStorage.setItem(
        chave,
        JSON.stringify(vistas)
    );

    const bolinha = document.getElementById(
        "notification-dot-restaurante"
    );

    if (bolinha) {
        bolinha.style.display = "none";
    }

    showPage("page-notif-restaurante");

    carregarNotificacoesRestaurante();
}

async function carregarNotificacoesRestaurante() {

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("❌ Token não encontrado.");
        return;
    }

    const container = document.getElementById(
        "notificacoes-restaurante"
    );

    if (!container) {
        console.error(
            "❌ Container #notificacoes-restaurante não encontrado."
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
                    Buscando propostas.
                </p>

            </div>

        </div>
    `;

    try {

        const response = await fetch(
            "https://localhost:7111/api/Proposta/me/restaurante",
            {
                method: "GET",

                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            }
        );

        console.log(
            "📡 STATUS NOTIFICAÇÕES RESTAURANTE:",
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
            "🔔 PROPOSTAS DO RESTAURANTE:",
            propostas
        );

        // Guarda para o modal
        window.propostasRestaurante = propostas;

        atualizarBolinhaNotificacaoRestaurante(propostas);

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
        // RENDERIZAR PROPOSTAS
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
                // PROPOSTA ENVIADA PELO INFLUENCER
                // ==========================================

                if (solicitante === 1) {

                    // ------------------------------------------
                    // PENDENTE
                    // ------------------------------------------

                    if (status === 1) {

                        icone = "📩";

                        titulo =
                            "Nova solicitação de parceria";

                        mensagem = `
                            <strong>
                                ${proposta.nomeInfluencer}
                            </strong>
                            enviou uma proposta para seu restaurante.
                        `;

                        statusTexto = "Pendente";
                        statusClasse = "status-pending";

                        acao = `
                            <a
                                href="#"
                                onclick="abrirPropostaRestaurante(${proposta.id}); return false;"
                                style="color:var(--accent)"
                            >
                                Ver proposta →
                            </a>
                        `;
                    }

                    // ------------------------------------------
                    // ACEITA
                    // ------------------------------------------

                    else if (status === 2) {

                        icone = "📤";

                        titulo =
                            `Você aceitou uma proposta de ${proposta.nomeInfluencer}.`;

                        mensagem = `
                            Sua parceria com
                            <strong>${proposta.nomeInfluencer}</strong>
                            foi aceita! ✅
                        `;

                        statusTexto = "Aceita";
                        statusClasse = "status-accepted";

                        acao = `
                            <div style="margin-top:0.9rem">

                                📧
                                <strong>
                                    Entre em contato com a influencer
                                </strong>

                                <br>

                                <span>
                                    E-mail:
                                </span>

                                <a
                                    href="mailto:${proposta.emailInfluencer}"
                                    style="color:var(--accent)"
                                >
                                    ${proposta.emailInfluencer}
                                </a>

                            </div>
                        `;
                    }

                    // ------------------------------------------
                    // RECUSADA
                    // ------------------------------------------

                    else if (status === 3) {

                        icone = "📤";

                        titulo =
                            `Você recusou uma proposta de ${proposta.nomeInfluencer}.`;

                        mensagem = `
                            Essa proposta foi recusada. ❌
                        `;

                        statusTexto = "Recusada";
                        statusClasse = "status-rejected";
                    }
                }

                // ==========================================
                // PROPOSTA ENVIADA PELO RESTAURANTE
                // ==========================================

                else if (solicitante === 2) {

                    // ------------------------------------------
                    // PENDENTE
                    // ------------------------------------------

                    if (status === 1) {

                        icone = "📤";

                        titulo =
                            `Você enviou uma proposta para ${proposta.nomeInfluencer}.`;

                        mensagem = `
                            Sua proposta está aguardando
                            uma resposta.
                        `;

                        statusTexto = "Pendente";
                        statusClasse = "status-pending";
                    }

                    // ------------------------------------------
                    // ACEITA
                    // ------------------------------------------

                    else if (status === 2) {

                        icone = "📤";

                        titulo =
                            `Você enviou uma proposta para ${proposta.nomeInfluencer}.`;

                        mensagem = `
                            Sua proposta foi aceita! ✅
                        `;

                        statusTexto = "Aceita";
                        statusClasse = "status-accepted";

                        acao = `
                            <div style="margin-top:0.9rem">

                                📧
                                <strong>
                                    Entre em contato com a influencer
                                </strong>

                                <br>

                                <span>
                                    E-mail:
                                </span>

                                <a
                                    href="mailto:${proposta.emailInfluencer}"
                                    style="color:var(--accent)"
                                >
                                    ${proposta.emailInfluencer}
                                </a>

                            </div>
                        `;
                    }

                    // ------------------------------------------
                    // RECUSADA
                    // ------------------------------------------

                    else if (status === 3) {

                        icone = "📤";

                        titulo =
                            `Você enviou uma proposta para ${proposta.nomeInfluencer}.`;

                        mensagem = `
                            Sua proposta foi recusada. ❌
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
                        "Solicitação de parceria";

                    mensagem = `
                        <strong>
                            ${proposta.nomeInfluencer}
                        </strong>
                        enviou uma proposta para seu restaurante.
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

                    // Só permite abrir se ainda estiver pendente
                    if (status === 1) {

                        acao = `
                            <a
                                href="#"
                                onclick="abrirPropostaRestaurante(${proposta.id}); return false;"
                                style="color:var(--accent)"
                            >
                                Ver proposta →
                            </a>
                        `;
                    }
                }

                // ==========================================
                // DESCRIÇÃO DA PROPOSTA
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
                                    proposta.dataCriacao + "z"
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
            "✅ NOTIFICAÇÕES DO RESTAURANTE RENDERIZADAS."
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
function abrirPropostaRestaurante(id) {

    console.log("📩 Abrindo proposta:", id);

    const proposta = window.propostasRestaurante?.find(
        p => p.id === id
    );

    if (!proposta) {
        console.error(
            "❌ Proposta não encontrada:",
            id
        );

        return;
    }

    console.log(
        "✅ Proposta encontrada:",
        proposta
    );

    // Guarda a proposta atualmente aberta
    window.propostaSelecionada = proposta;

    // Elementos do modal
    const modal = document.getElementById("modal-parceria-r");

    if (!modal) {
        console.error(
            "❌ Modal #modal-parceria-r não encontrado."
        );
        return;
    }

    // Procura os elementos que vamos preencher
    const titulo = modal.querySelector("h2");
    const alert = modal.querySelector(".alert");
    const paragrafos = modal.querySelectorAll("p");

    if (titulo) {
        titulo.textContent = "Solicitação de Parceria";
    }

    if (alert) {
        alert.innerHTML = `
            <strong>${proposta.nomeInfluencer}</strong>
            quer fechar parceria com você.
        `;
    }

    if (paragrafos[0]) {
        paragrafos[0].innerHTML = `
            <strong>Proposta:</strong>
            ${proposta.descricao}
        `;
    }

    if (paragrafos[1]) {
            paragrafos[1].innerHTML = `
                <strong>Data:</strong>
                ${new Date(
                    proposta.dataCriacao + "Z"
                ).toLocaleString("pt-BR")}
            `;
        }

    if (paragrafos[2]) {
        paragrafos[2].innerHTML = `
            <strong>Status:</strong>
            ${proposta.status === 1 ? "Pendente" :
              proposta.status === 2 ? "Aceita" :
              proposta.status === 3 ? "Recusada" :
              "Desconhecido"}
        `;
    }

    // Abre o modal
    showModal("modal-parceria-r");
}

async function responderParceria(acao) {

    const proposta = window.propostaSelecionada;

    if (!proposta) {
        console.error("❌ Nenhuma proposta selecionada.");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        console.error("❌ Token não encontrado.");
        return;
    }

    let novoStatus;

    if (acao === "aceitar") {
        novoStatus = 2;
    }
    else if (acao === "recusar") {
        novoStatus = 3;
    }
    else {
        console.error("❌ Ação inválida:", acao);
        return;
    }

    console.log(
        "📤 Atualizando proposta:",
        proposta.id,
        "para status:",
        novoStatus
    );

    try {

        const response = await fetch(
            `https://localhost:7111/api/Proposta/${proposta.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: novoStatus
                })
            }
        );

        console.log(
            "📡 STATUS DO PUT:",
            response.status
        );

        if (!response.ok) {

            const erro = await response.text();

            console.error(
                "❌ ERRO AO ATUALIZAR PROPOSTA:",
                erro
            );

            showToast(
                "Não foi possível atualizar a proposta."
            );

            return;
        }

        const propostaAtualizada = await response.json();

        console.log(
            "✅ PROPOSTA ATUALIZADA:",
            propostaAtualizada
        );

        // Atualiza a proposta selecionada
        window.propostaSelecionada = propostaAtualizada;

        // Atualiza também a proposta dentro do cache
        if (window.propostasRestaurante) {

            const index =
                window.propostasRestaurante.findIndex(
                    p => p.id === propostaAtualizada.id
                );

            if (index !== -1) {
                window.propostasRestaurante[index] =
                    propostaAtualizada;
            }
        }

        // Fecha o modal
        closeModal("modal-parceria-r");

        // Mensagem para o usuário
        if (novoStatus === 2) {
            showToast("✅ Proposta aceita!");
        }
        else {
            showToast("❌ Proposta recusada.");
        }

        // Recarrega as notificações
        await carregarNotificacoesRestaurante();

    }
    catch (error) {

        console.error(
            "🔥 ERRO AO ATUALIZAR PROPOSTA:",
            error
        );

        showToast(
            "Erro ao conectar com a API."
        );
    }
}
function abrirPropostaInfluencer(id) {

    console.log(
        "📩 Abrindo proposta para influencer:",
        id
    );

    const proposta =
        window.propostasInfluencer?.find(
            p => p.id === id
        );

    if (!proposta) {

        console.error(
            "❌ Proposta não encontrada:",
            id
        );

        return;
    }

    console.log(
        "✅ Proposta encontrada:",
        proposta
    );

    // Guarda a proposta atualmente selecionada
    window.propostaSelecionadaInfluencer =
        proposta;

    const modal =
        document.getElementById(
            "modal-responder-influencer"
        );

    if (!modal) {

        console.error(
            "❌ Modal #modal-responder-influencer não encontrado."
        );

        return;
    }

    const titulo =
        modal.querySelector("h2");

    const alert =
        modal.querySelector(".alert");

    const paragrafos =
        modal.querySelectorAll("p");

    // ==========================================
    // TÍTULO
    // ==========================================

    if (titulo) {

        titulo.textContent =
            "Proposta Recebida";
    }

    // ==========================================
    // RESTAURANTE
    // ==========================================

    if (alert) {

        alert.innerHTML = `
            <strong>
                ${proposta.nomeRestaurante}
            </strong>
            enviou uma proposta para você.
        `;
    }

    // ==========================================
    // DESCRIÇÃO
    // ==========================================

    if (paragrafos[0]) {

        paragrafos[0].innerHTML = `
            <strong>Proposta:</strong>
            ${proposta.descricao}
        `;
    }

    // ==========================================
    // DATA
    // ==========================================

    if (paragrafos[1]) {

        paragrafos[1].innerHTML = `
            <strong>Data:</strong>
            ${new Date(
                proposta.dataCriacao + "Z"
            ).toLocaleString("pt-BR")}
        `;
    }

    // ==========================================
    // STATUS
    // ==========================================

    if (paragrafos[2]) {

        const statusTexto =
            proposta.status === 1 ? "Pendente" :
            proposta.status === 2 ? "Aceita" :
            proposta.status === 3 ? "Recusada" :
            "Desconhecido";

        paragrafos[2].innerHTML = `
            <strong>Status:</strong>
            ${statusTexto}
        `;
    }

    // ==========================================
    // ABRIR MODAL
    // ==========================================

    showModal(
        "modal-responder-influencer"
    );
}
async function responderInfluencer(acao) {

    const proposta =
        window.propostaSelecionadaInfluencer;

    if (!proposta) {
        console.error(
            "❌ Nenhuma proposta selecionada."
        );
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {
        console.error(
            "❌ Token não encontrado."
        );
        return;
    }

    let novoStatus;

    if (acao === "aceitar") {
        novoStatus = 2;
    }
    else if (acao === "recusar") {
        novoStatus = 3;
    }
    else {
        console.error(
            "❌ Ação inválida:",
            acao
        );
        return;
    }

    console.log(
        "📤 Atualizando proposta:",
        proposta.id,
        "para status:",
        novoStatus
    );

    try {

        const response = await fetch(
            `https://localhost:7111/api/Proposta/${proposta.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    status: novoStatus
                })
            }
        );

        console.log(
            "📡 STATUS DO PUT:",
            response.status
        );

        if (!response.ok) {

            const erro =
                await response.text();

            console.error(
                "❌ ERRO AO ATUALIZAR PROPOSTA:",
                erro
            );

            showToast(
                "Não foi possível atualizar a proposta."
            );

            return;
        }

        const propostaAtualizada =
            await response.json();

        console.log(
            "✅ PROPOSTA ATUALIZADA:",
            propostaAtualizada
        );

        // Atualiza a proposta selecionada
        window.propostaSelecionadaInfluencer =
            propostaAtualizada;

        // Atualiza a lista em memória
        if (window.propostasInfluencer) {

            const index =
                window.propostasInfluencer.findIndex(
                    p => p.id === propostaAtualizada.id
                );

            if (index !== -1) {

                window.propostasInfluencer[index] =
                    propostaAtualizada;
            }
        }

        // Fecha o modal
        closeModal(
            "modal-responder-influencer"
        );

        // Mensagem
        if (novoStatus === 2) {

            showToast(
                "✅ Proposta aceita!"
            );

        }
        else {

            showToast(
                "❌ Proposta recusada."
            );
        }

        // Recarrega as notificações
        await carregarNotificacoesInfluencer();

    }
    catch (error) {

        console.error(
            "🔥 ERRO AO ATUALIZAR PROPOSTA:",
            error
        );

        showToast(
            "Erro ao conectar com a API."
        );
    }
}
document.addEventListener("DOMContentLoaded", () => {

    const textarea = document.getElementById("parceria-descricao");
    const contador = document.getElementById("parceria-contador");

    if (!textarea || !contador) {
        return;
    }

    textarea.addEventListener("input", () => {

        contador.textContent =
            `${textarea.value.length} / 500`;

    });

});
// ==========================================
// LIMPAR FORMULÁRIO RESTAURANTE
// ==========================================

function limparFormularioRestaurante() {

    const campos = [
        "restaurante-setup-nome",
        "restaurante-setup-categoria",
        "restaurante-setup-telefone",
        "restaurante-setup-endereco",
        "restaurante-setup-foto",
        "restaurante-setup-descricao"
    ];

    campos.forEach(id => {
        const campo = document.getElementById(id);

        if (campo) {
            campo.value = "";
        }
    });

    // Limpar prévia da foto
    const preview = document.getElementById("restaurante-setup-preview");
    const placeholder = document.getElementById("restaurante-setup-placeholder");

    if (preview) {
        preview.src = "";
        preview.style.display = "none";
    }

    if (placeholder) {
        placeholder.style.display = "flex";
    }

    // Limpar contador da descrição
    const contador = document.getElementById("restaurante-descricao-contador");

    if (contador) {
        contador.textContent = "0 / 500";
    }
}

     // ==========================================
    // LIMPAR FORMULARIO INFLUENCER
    // ==========================================


function limparFormularioInfluencer() {

    const nome = document.getElementById("perfil-nome");
    const instagram = document.getElementById("perfil-instagram");
    const seguidores = document.getElementById("perfil-seguidores");
    const telefone = document.getElementById("perfil-telefone");
    const foto = document.getElementById("perfil-foto");
    const descricao = document.getElementById("perfil-descricao");

    if (nome) nome.value = "";
    if (instagram) instagram.value = "";
    if (seguidores) seguidores.value = "";
    if (telefone) telefone.value = "";
    if (foto) foto.value = "";
    if (descricao) descricao.value = "";

    const preview = document.getElementById("perfil-setup-preview");
    const placeholder =
        document.getElementById("perfil-setup-placeholder");

    if (preview) {
        preview.src = "";
        preview.style.display = "none";
    }

    if (placeholder) {
        placeholder.style.display = "flex";
    }

    const contador =
        document.getElementById("perfil-descricao-contador");

    if (contador) {
        contador.textContent = "0 / 500";
    }
}

    // ==========================================
    // criarPerfilRestaurante
    // ==========================================

async function criarPerfilRestaurante() {

  const token = localStorage.getItem("token");

  if (!token) {
    showToast("❌ Você precisa estar logado.");
    return;
  }

  const nome = document.getElementById("restaurante-setup-nome").value.trim();
  const categoria = document.getElementById("restaurante-setup-categoria").value.trim();
  const telefone = document.getElementById("restaurante-setup-telefone").value.trim();
  const endereco = document.getElementById("restaurante-setup-endereco").value.trim();
  const fotoUrl = document.getElementById("restaurante-setup-foto").value.trim();
  const descricao = document.getElementById("restaurante-setup-descricao").value.trim();

  // Validações dos campos obrigatórios

  if (!nome) {
    showToast("❌ Informe o nome do restaurante.");
    return;
  }

  if (!categoria) {
    showToast("❌ Informe a categoria.");
    return;
  }

  if (!telefone) {
    showToast("❌ Informe o telefone.");
    return;
  }

  if (!endereco) {
    showToast("❌ Informe o endereço.");
    return;
  }

  if (!descricao) {
    showToast("❌ Informe a descrição.");
    return;
  }

  const dados = {
    nome: nome,
    descricao: descricao,
    endereco: endereco,
    categoria: categoria,
    telefone: telefone,
    fotoUrl: fotoUrl || null
  };

  console.log("📤 CRIANDO PERFIL RESTAURANTE:", dados);

  try {

    const response = await fetch(
      "https://localhost:7111/api/Restaurante",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(dados)
      }
    );

    console.log("📡 STATUS CRIAR RESTAURANTE:", response.status);

    if (!response.ok) {

      const erro = await response.text();

      console.error("❌ ERRO AO CRIAR RESTAURANTE:", erro);

      showToast("❌ Não foi possível criar seu perfil.");
      return;
    }

    const restaurante = await response.json();

    console.log("✅ PERFIL RESTAURANTE CRIADO:", restaurante);

    window.meuRestauranteId = restaurante.id;

    showToast("✅ Perfil do restaurante criado com sucesso!");

    await carregarMeuRestaurante();

  } catch (error) {

    console.error("🔥 ERRO AO CRIAR PERFIL RESTAURANTE:", error);

    showToast("❌ Erro ao conectar com a API.");
  }
}
function configurarPreviewFotoRestaurante() {

    const foto = document.getElementById("restaurante-setup-foto");
    const preview = document.getElementById("restaurante-setup-preview");
    const placeholder = document.getElementById("restaurante-setup-placeholder");

    if (!foto || !preview || !placeholder) {
        return;
    }

    foto.addEventListener("input", () => {

        const url = foto.value.trim();

        if (!url) {
            preview.src = "";
            preview.style.display = "none";
            placeholder.style.display = "flex";
            return;
        }

        preview.onload = () => {
            preview.style.display = "block";
            placeholder.style.display = "none";
        };

        preview.onerror = () => {
            preview.src = "";
            preview.style.display = "none";
            placeholder.style.display = "flex";
        };

        preview.src = url;
    });
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
