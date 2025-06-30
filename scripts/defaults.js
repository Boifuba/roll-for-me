/**
 * Default button sets for Roll for Me module
 */

const DEFAULT_BUTTON_SETS = [
  {
    name: "Dodge",
    buttons: [
      {
        label: "Dodge",
        command: "[dodge]",
        color: "#dc3545",
        icon: "fas fa-sword"
      },
      {
        label: "Dodge and drop",
        command: '[dodge+3 "Se joga no chão seu merda"]',
           color: "#dc3545",
        icon: "fas fa-sword"
        
      },
      {
        label: "Acrobatics Dodge",
        command: '["Acrobatic Dodge!" /if [S:Acrobatics] [Dodge +2] /else [Dodge -2]]',
           color: "#dc3545",
        icon: "fas fa-sword"
      },
      {
        label: "Feverish Defense ",
        command: '["Feverish Dodge"/r [Dodge+2 Feverish Defense *Cost 1FP]]',
           color: "#dc3545",
        icon: "fas fa-sword"
      },
        {
        label: "Retreating Dodge ",
        command: '["Retreating Dodge"/r [Dodge+3 Retreating]]',
           color: "#dc3545",
        icon: "fas fa-sword"
      }
    ]
  },
  {
    name: "Perception",
    buttons: [
      {
        label: "Observation",
        command: "/r [/if [?SK:observation] [Sk:observation] /else [vision]]",
           color: "#dc3545",
        icon: "fas fa-sword"
      },
      {
        label: "Vision",
        command: '[vision ? "Eu Acho que eu vi um gatinho" ,"Eu não vi nada"]',
           color: "#dc3545",
        icon: "fas fa-sword"
      },
      {
        label: "Perception",
        command: "[per]",
           color: "#dc3545",
        icon: "fas fa-sword"
      },
      {
        label: "Hearing",
        command: '[Hearing ? "Eu ouvi isso hein!" ,"Ahn?"]',
           color: "#dc3545",
        icon: "fas fa-sword"
      },
       {
        label: "Touch",
        command: '[Touch ? "Eu senti algo crescendo aqui" ,"Num to tintindo nada"]',
           color: "#dc3545",
        icon: "fas fa-sword"
      },
         {
        label: "Taste",
        command: '[Taste ? "Gostinho bom" ,"Que coisa mais sem sal."]',
           color: "#dc3545",
        icon: "fas fa-sword"
      },
      {
        label: "Smell",
        command: '[Smell ? "Tou sentindo esse cheiro" ,"Alguém peidou?"]',
           color: "#dc3545",
        icon: "fas fa-sword"
      }
    ]
  },
  {
    name: "Testes com Modificadores",
    buttons: [
      {
        label: "Percepção",
        command: "[Per]",
        color: "#9370db",
        icon: "fas fa-eye"
      },
      {
        label: "Percepção -2",
        command: '[Per-2 "Condições ruins"]',
        color: "#6f42c1",
        icon: "fas fa-eye-slash"
      },
      {
        label: "Vontade",
        command: "[Will]",
        color: "#ff1493",
        icon: "fas fa-brain"
      },
      {
        label: "Teste de Medo",
        command: '[Will "Teste de Medo"]',
        color: "#8b0000",
        icon: "fas fa-ghost"
      }
    ]
  },
  {
    name: "Rolagens Rápidas",
    buttons: [
      {
        label: "3d6",
        command: "[3d6]",
        color: "#6c757d",
        icon: "fas fa-dice"
      },
      {
        label: "1d6",
        command: "[1d6]",
        color: "#17a2b8",
        icon: "fas fa-dice-one"
      },
      {
        label: "2d6",
        command: "[2d6]",
        color: "#fd7e14",
        icon: "fas fa-dice-two"
      },
      {
        label: "Dano 1d6+2",
        command: '[1d6+2 "Dano de arma"]',
        color: "#dc3545",
        icon: "fas fa-bolt"
      }
    ]
  }
];

/**
 * Initialize default button sets if none exist
 */
function initializeDefaultButtonSets() {
  const existingButtonSets = game.settings.get('roll-for-me', 'buttonSets');
  
  if (!existingButtonSets || existingButtonSets.length === 0) {
    console.log('Roll for Me | Loading default button sets...');
    
    game.settings.set('roll-for-me', 'buttonSets', DEFAULT_BUTTON_SETS);
    ui.notifications.info("Roll for Me: Conjuntos de botões padrão carregados!");
    
    return true; // Indicates defaults were loaded
  }
  
  return false; // Indicates defaults were not needed
}

/**
 * Force reload default button sets (useful for debugging/resetting)
 */
function forceLoadDefaults() {
  console.log('Roll for Me | Force loading default button sets...');
  
  game.settings.set('roll-for-me', 'buttonSets', DEFAULT_BUTTON_SETS);
  ui.notifications.info("Roll for Me: Conjuntos de botões padrão recarregados!");
}

// Expose functions globally for use in other scripts
window.RollForMeDefaults = {
  DEFAULT_BUTTON_SETS,
  initializeDefaultButtonSets,
  forceLoadDefaults
};