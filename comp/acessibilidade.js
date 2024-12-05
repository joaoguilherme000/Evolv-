// acessibilidade

// Usar isso
let speechQueue = null;
let isSpeechEnabled = localStorage.getItem('isSpeechEnabled') === 'true';

document.addEventListener('DOMContentLoaded', function() {
  const colorBlindnessSelect = document.getElementById('colorBlindness');
  const sideColorBlindnessSelect = document.getElementById('sideColorBlindness');
  const savedFilter = localStorage.getItem('selectedColorBlindnessFilter') || 'normal';

  colorBlindnessSelect.value = savedFilter;
  applyColorBlindnessFilter(savedFilter);

  function applyColorBlindnessFilter(selectedFilter) {
    document.body.className = ''; // Remove todas as classes existentes
    if (selectedFilter !== 'normal') {
      document.body.classList.add(selectedFilter); // Adiciona a nova classe
    }

    if (selectedFilter !== 'normal') {
      if (!isSpeechEnabled) {
        return;
      }

      const msg = new SpeechSynthesisUtterance(`Você selecionou o filtro ${selectedFilter}`);
      msg.onend = function () {
        speechQueue = null;
      };
      speechQueue = msg;
      window.speechSynthesis.speak(msg);
    }
  }

  colorBlindnessSelect.addEventListener('change', function() {
    const selectedFilter = colorBlindnessSelect.value;
    localStorage.setItem('selectedColorBlindnessFilter', selectedFilter);
    sideColorBlindnessSelect.value = selectedFilter; // Sincroniza com outro <select>
    applyColorBlindnessFilter(selectedFilter);
  });


  sideColorBlindnessSelect.addEventListener('change', function() {
    const selectedFilter = sideColorBlindnessSelect.value;
    localStorage.setItem('selectedColorBlindnessFilter', selectedFilter);
    colorBlindnessSelect.value = selectedFilter; // Sincroniza com o <select> principal
    applyColorBlindnessFilter(selectedFilter);
  });
  

  // cursor pointer pra não ler contéudo invisivel
  document.querySelectorAll('button, a, select, [aria-label], .valor-item').forEach(element => {
    const style = window.getComputedStyle(element);
    if (style.cursor === 'pointer') {
      element.addEventListener('click', readTextOnClick);
    }
  });

  const soundIcon = document.querySelector("#soundIcon img");
  const muteIcon = document.querySelector("li[style='display: none;'] img");

  soundIcon.addEventListener("click", () => {

    soundIcon.parentElement.style.display = "none";
    muteIcon.parentElement.style.display = "block";
  });

  muteIcon.addEventListener("click", () => {
    muteIcon.parentElement.style.display = "none";
    soundIcon.parentElement.style.display = "block";
  });
});

function readTextOnClick(event) {
  if (!isSpeechEnabled) {
    return; // Não faz nada se a fala estiver desativada
  }

  if (speechQueue) {
    window.speechSynthesis.cancel();
  }

  let textToRead = event.target.innerText || event.target.getAttribute('aria-label') || event.target.getAttribute('alt');

  const msg = new SpeechSynthesisUtterance(textToRead);

  // Define o que acontece quando a fala termina
  msg.onend = function () {
    speechQueue = null;
  };

  // não pode ser null
  speechQueue = textToRead;

  // Inicia a fala
  window.speechSynthesis.speak(msg);
}

// Nav container

// Inicializa a interface com base no estado do som salvo
if (isSpeechEnabled) {
  document.querySelector("#soundIcon").style.display = "flex";
  document.querySelector("#muteIcon").style.display = "none";
} else {
  document.querySelector("#soundIcon").style.display = "none";
  document.querySelector("#muteIcon").style.display = "flex";
}

// Evento de ativar/desativar som
document.querySelector("#soundIcon img").addEventListener("click", () => {
  isSpeechEnabled = false; // Desativa a fala
  window.speechSynthesis.cancel(); // Cancela qualquer fala em andamento
  
  // Salva o estado no localStorage
  localStorage.setItem('isSpeechEnabled', 'false');

  // Atualiza a interface
  document.querySelector(".side-images #soundIcon").style.display = "none";
  document.querySelector(".side-images #muteIcon").style.display = "flex";
  document.querySelector("#soundIcon img").style.display = "none";
  document.querySelector(".nav-container #muteIcon").style.display = "flex";
});

document.querySelector(".nav-container #muteIcon").addEventListener("click", () => {
  isSpeechEnabled = true; // Ativa a fala
  
  // Salva o estado no localStorage
  localStorage.setItem('isSpeechEnabled', 'true');

  // Atualiza a interface
  document.querySelector(".side-images #muteIcon").style.display = "none";
  document.querySelector(".side-images #soundIcon").style.display = "flex";
  document.querySelector(".nav-container #muteIcon").style.display = "none";
  document.querySelector("#soundIcon img").style.display = "flex";
});

// Repete para o outro conjunto de ícones (side-images)
document.querySelector(".side-images #soundIcon").addEventListener("click", () => {
  isSpeechEnabled = false; // Desativa a fala
  window.speechSynthesis.cancel(); // Cancela qualquer fala em andamento
  
  // Salva o estado no localStorage
  localStorage.setItem('isSpeechEnabled', 'false');

  // Atualiza a interface
  document.querySelector("#soundIcon img").style.display = "none";
  document.querySelector(".nav-container #muteIcon").style.display = "flex";
  document.querySelector(".side-images #soundIcon").style.display = "none";
  document.querySelector(".side-images #muteIcon").style.display = "flex";
});

document.querySelector(".side-images #muteIcon").addEventListener("click", () => {
  isSpeechEnabled = true; // Ativa a fala
  
  // Salva o estado no localStorage
  localStorage.setItem('isSpeechEnabled', 'true');

  // Atualiza a interface
  document.querySelector(".nav-container #muteIcon").style.display = "none";
  document.querySelector("#soundIcon img").style.display = "flex";
  document.querySelector(".side-images #muteIcon").style.display = "none";
  document.querySelector(".side-images #soundIcon").style.display = "flex";
});

document.addEventListener('keydown', (event) => {
  const focusedElement = document.activeElement; // Elemento atualmente em foco

  if (event.key === 'Enter') {
    if (focusedElement && typeof focusedElement.click === 'function') {
      event.preventDefault();
      focusedElement.click();
    }
  }
});