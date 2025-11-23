document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation for the detection box in hero section
    const detectionBox = document.querySelector('.detection-box');
    if (detectionBox) {
        // Simulate AI detection by moving the box randomly
        setInterval(() => {
            const randomX = Math.random() * 70;
            const randomY = Math.random() * 60;
            const randomWidth = 80 + Math.random() * 80;
            const randomHeight = 120 + Math.random() * 120;
            
            detectionBox.style.width = `${randomWidth}px`;
            detectionBox.style.height = `${randomHeight}px`;
            detectionBox.style.left = `${randomX}%`;
            detectionBox.style.top = `${randomY}%`;
        }, 2000);
    }
    
    // Add hover effect to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            if (!card.classList.contains('featured')) {
                card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('featured')) {
                card.style.boxShadow = 'none';
            }
        });
    });
    
    // Form submission handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
       
    }
    
    // Header scroll effect
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'var(--medium-gray)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        }
    });
});

// --- FADE-IN AO ROLAR A PÁGINA ---
const fadeElements = document.querySelectorAll('.fade-in');

const appearOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);

fadeElements.forEach(el => {
  appearOnScroll.observe(el);
});

// BOTÃO ABRIR/FECHAR CHAT
const chatButton = document.getElementById("chat-button");
const chatWindow = document.getElementById("chat-window");
const messagesDiv = document.getElementById("chat-messages");
const sendBtn = document.getElementById("send-btn");
const input = document.getElementById("chat-input");

chatButton.onclick = () => {
    chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
};


//Função das mensagens

function addMessage(text, sender) {
    const div = document.createElement("div");

    // Proteção contra HTML malicioso
    let safe = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // --- Renderização Markdown ---

    // Títulos
    safe = safe.replace(/^### (.*$)/gim, "<h3>$1</h3>");
    safe = safe.replace(/^## (.*$)/gim, "<h2>$1</h2>");
    safe = safe.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // Negrito
    safe = safe.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");

    // Itálico
    safe = safe.replace(/\*(.*?)\*/gim, "<em>$1</em>");

    // Código inline
    safe = safe.replace(/`([^`]+)`/gim, "<code>$1</code>");

    // Blocos de código
    safe = safe.replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>");

    // Listas com "-", "*", "•"
    safe = safe.replace(/^(?:-|\*|•) (.*)$/gim, "<li>$1</li>");
    safe = safe.replace(/(<li>.*<\/li>)/gims, "<ul>$1</ul>");

    // Quebras de linha
    safe = safe.replace(/\n/g, "<br>");

    div.innerHTML = safe;

    // --- Estilo visual ---
    div.style.margin = "8px 0";
    div.style.padding = "8px 10px";
    div.style.borderRadius = "7px";
    div.style.maxWidth = "85%";
    div.style.lineHeight = "1.4";
    div.style.fontSize = "15px";

    if (sender === "user") {
        div.style.background = "#332e2eff";
        div.style.marginLeft = "auto";
    } else {
        div.style.background = "#274083ff";
    }

    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// --- SYSTEM PROMPT DO ASSISTENTE VISIONCEL ---
const systemPrompt = `
Você é o Assistente VisionCel, um chatbot criado para explicar o TCC VisionCel.
Responda sempre de forma simples, direta, clara, sem textos longos.

Sobre o projeto:
- O sistema usa a tecnologia YOLO para reconhecer celulares em imagens e vídeos.
- Ele detecta apenas o aparelho celular, não o modelo, marca ou versão.
- Também pode reconhecer outros elementos, como incêndio e EPI.
- Foi criado para reduzir o uso de celulares em escolas e aumentar a segurança no trânsito.
- O projeto não monitora pessoas, apenas objetos.
- O objetivo é aumentar a segurança e evitar distrações.

Regras:
- Sempre responda como uma IA informativa do sistema VisionCel.
- Não invente funcionalidades que o sistema não possui.
- Não afirme que o sistema identifica rostos ou dados pessoais.
- Responda sempre de forma curta e acessível para leigos.
`;

async function sendToAI(message) {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message,
            systemPrompt: systemPrompt
        })
    });

    const data = await response.json();
    console.log("API RETURN:", data);

    if (data.error) {
        return "Erro da API: " + data.error;
    }

    try {
        if (data.reply) return data.reply;
        return "Erro: resposta vazia da IA.";
    } catch {
        return "Erro interno ao interpretar a resposta.";
    }
}

// EVENTO DE ENVIAR MENSAGEM
sendBtn.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    addMessage("Digitando...", "ai");

    const aiResponse = await sendToAI(text);

    messagesDiv.lastChild.remove();
    addMessage(aiResponse, "ai");
};