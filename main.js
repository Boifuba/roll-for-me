/**
 * GURPS Roll for Me - Main Module
 * A FoundryVTT module for creating and managing custom GURPS roll button sets in chat
 * 
 * @author Boifubá
 * @version 0.5.8
 */

Hooks.once('init', () => {
  // Register module settings for button sets storage
  game.settings.register('gurps-roll-for-me', 'buttonSets', {
    name: 'ROLLME.Settings.ButtonSets.Name',
    hint: 'ROLLME.Settings.ButtonSets.Hint',
    scope: 'world',
    config: false,
    type: Array,
    default: []
  });

  // Register the configuration menu in settings
  game.settings.registerMenu('gurps-roll-for-me', 'configMenu', {
    name: 'ROLLME.Settings.ConfigMenu.Name',
    label: 'ROLLME.Settings.ConfigMenu.Label',
    hint: 'ROLLME.Settings.ConfigMenu.Hint',
    icon: 'fas fa-dice',
    type: RollForMeConfig,
    restricted: true
  });
});

Hooks.once('ready', () => {
  // Initialize default button sets if none exist
  initializeDefaultButtonSets();
  
  // Expose API functions for macro access and external use
  game.rollForMe = {
    showSetSelector: () => {
      if (typeof RollForMeSetSelector !== 'undefined') {
        return new RollForMeSetSelector().render(true);
      } else {
        ui.notifications.error("Roll for Me: Set Selector is not available!");
      }
    },
    openConfig: () => {
      if (typeof RollForMeConfig !== 'undefined') {
        return new RollForMeConfig().render(true);
      } else {
        ui.notifications.error("Roll for Me: Configuration dialog is not available!");
      }
    },
    sendButtonSetToChat: (setIndex) => RollForMeChat.sendButtonSetToChat(setIndex),
    sendButtonsToChat: (setIndex) => RollForMeChat.sendButtonsToChat(setIndex),
    forceLoadDefaults: () => forceLoadDefaults(),
    clearSettings: () => {
      game.settings.set('gurps-roll-for-me', 'buttonSets', []);
      ui.notifications.info("Roll for Me: Settings cleared! Reload to apply defaults.");
    }
  };
  
  // Add quick access button to token controls
  Hooks.on('getSceneControlButtons', (controls) => {
    const tokenTools = controls.find(c => c.name === 'token');
    if (tokenTools) {
      tokenTools.tools.push({
        name: 'roll-for-me',
        title: 'Roll for Me',
        icon: 'fas fa-dice',
        button: true,
        onClick: () => {
          if (game.rollForMe && game.rollForMe.showSetSelector) {
            game.rollForMe.showSetSelector();
          } else {
            ui.notifications.error("Roll for Me: Module is not ready!");
          }
        }
      });
    }
  });
});

// Handle chat button interactions
Hooks.on('renderChatMessage', (message, html, data) => {
  html.find('.gurps-roll-for-me-chat-button').click(RollForMeChat.handleButtonClick);
});

/**
 * Default button sets provided with the module
 * These serve as examples and basic functionality for GURPS games
 */
const DEFAULT_BUTTON_SETS = [
  {
    name: "Dodge",
    buttons: [
      { label: "Dodge", command: "[dodge]" },
      { label: "Dodge and Drop", command: '[dodge+3 "Drop Prone"]' },
      { label: "Acrobatic Dodge", command: '["Acrobatic Dodge!" /if [S:Acrobatics] [Dodge +2] /else [Dodge -2]]' },
      { label: "Feverish Defense", command: '["Feverish Dodge" /r [Dodge+2 Feverish Defense *Cost 1FP]]' },
      { label: "Retreating Dodge", command: '["Retreating Dodge" /r [Dodge+3 Retreating]]' }
    ]
  },
  {
    name: "Perception",
    buttons: [
      { label: "Observation", command: "/r [/if [?SK:observation] [Sk:observation] /else [vision]]" },
      { label: "Vision", command: '[Vision ? "I saw something" , "I saw nothing"]' },
      { label: "Perception", command: "[PER]" },
      { label: "Hearing", command: '[Hearing ? "I heard that!" ,"I heard nothing"]' },
      { label: "Touch", command: '[Touch ? "I felt something" , "I felt nothing"]' },
      { label: "Taste", command: '[Taste ? "Good taste" , "No taste"]' },
      { label: "Smell", command: '[Smell ? "I smell it" , "No smell"]' }
    ]
  },
  {
    name: "Lights",
    buttons: [
      { label: "Torches", command: '["Use Torch"/li 6 2 360]' },
      { label: "Lantern", command: '["Use Lantern"/li 6 2 360]' },
      { label: "Bullseye Lantern", command: `["Use Bull's Eye Lantern" /li 3 10 15]` },
      { label: "Lights Off", command: '["Lights Off"/li off]' }
    ]
  }
];

/**
 * Initialize default button sets if no configuration exists
 * @returns {boolean} True if defaults were loaded, false if sets already exist
 */
function initializeDefaultButtonSets() {
  const existingButtonSets = game.settings.get('gurps-roll-for-me', 'buttonSets');
  
  if (!existingButtonSets || existingButtonSets.length === 0) {
    game.settings.set('gurps-roll-for-me', 'buttonSets', DEFAULT_BUTTON_SETS);
    ui.notifications.info("Roll for Me: Default button sets loaded!");
    return true;
  }
  
  return false;
}

/**
 * Force reload default button sets (replaces existing configuration)
 * Useful for resetting to factory defaults or updating default sets
 */
function forceLoadDefaults() {
  game.settings.set('gurps-roll-for-me', 'buttonSets', DEFAULT_BUTTON_SETS);
  ui.notifications.info("Roll for Me: Default button sets reloaded!");
}