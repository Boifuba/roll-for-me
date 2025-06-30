/**
 * Roll for Me Module for FoundryVTT
 * Main initialization script
 */

Hooks.once('init', () => {
  console.log('Roll for Me | Initializing module');
  
  // Register custom Handlebars helpers
  Handlebars.registerHelper('add', function(value, addition) {
    return value + addition;
  });
  
  // Register module settings
  game.settings.register('roll-for-me', 'buttonSets', {
    name: 'ROLLME.Settings.ButtonSets.Name',
    hint: 'ROLLME.Settings.ButtonSets.Hint',
    scope: 'world',
    config: false,
    type: Array,
    default: []
  });

  // Register the configuration menu
  game.settings.registerMenu('roll-for-me', 'configMenu', {
    name: 'ROLLME.Settings.ConfigMenu.Name',
    label: 'ROLLME.Settings.ConfigMenu.Label',
    hint: 'ROLLME.Settings.ConfigMenu.Hint',
    icon: 'fas fa-dice',
    type: RollForMeConfig,
    restricted: true
  });
});

Hooks.once('ready', () => {
  console.log('Roll for Me | Module ready');
  
  // Initialize default button sets if none exist
  // The defaults.js script should have loaded by now
  if (window.RollForMeDefaults) {
    const defaultsLoaded = window.RollForMeDefaults.initializeDefaultButtonSets();
    
    if (defaultsLoaded) {
      console.log('Roll for Me | Default button sets loaded successfully');
    } else {
      console.log('Roll for Me | Using existing button sets configuration');
    }
  } else {
    console.error('Roll for Me | Defaults script not loaded properly');
  }
  
  // Expose functions for macro access
  game.rollForMe = {
    showSetSelector: () => RollForMeSetSelector.showSetSelector(),
    openConfig: () => new RollForMeConfig().render(true),
    sendButtonSetToChat: (setIndex) => RollForMeChat.sendButtonSetToChat(setIndex),
    sendButtonsToChat: (setIndex) => RollForMeChat.sendButtonsToChat(setIndex),
    // Expose utility functions for debugging/admin
    forceLoadDefaults: () => {
      if (window.RollForMeDefaults) {
        window.RollForMeDefaults.forceLoadDefaults();
      } else {
        ui.notifications.error("Roll for Me: Defaults script not available");
      }
    },
    clearSettings: () => {
      game.settings.set('roll-for-me', 'buttonSets', []);
      ui.notifications.info("Roll for Me: Configurações limpas! Recarregue para aplicar os defaults.");
    }
  };
  
  // Also expose the class directly for backward compatibility
  window.RollForMeChat = RollForMeChat;
  
  console.log('Roll for Me | Functions exposed for macro use:');
  console.log('- game.rollForMe.showSetSelector() - Opens set selector dialog');
  console.log('- game.rollForMe.openConfig() - Opens configuration dialog');
  console.log('- game.rollForMe.sendButtonSetToChat(index) - Sends specific set to chat');
  console.log('- game.rollForMe.forceLoadDefaults() - Force reload default button sets');
  console.log('- game.rollForMe.clearSettings() - Clear all settings and reload defaults');
  console.log('- RollForMeChat.sendButtonsToChat(index) - Alternative function name');
});

// Handle chat button clicks
Hooks.on('renderChatMessage', (message, html, data) => {
  html.find('.roll-for-me-chat-button').click(RollForMeChat.handleButtonClick);
});