/**
 * Chat functionality for Roll for Me
 */
class RollForMeChat {
  
  /**
   * Send configured button set to chat
   */
  static async sendButtonSetToChat(setIndex) {
    const buttonSets = game.settings.get('roll-for-me', 'buttonSets');
    
    if (!buttonSets[setIndex] || buttonSets[setIndex].buttons.length === 0) {
      ui.notifications.warn(game.i18n.localize("ROLLME.Notifications.NoButtons"));
      return;
    }

    const buttonSet = buttonSets[setIndex];

    // Create button HTML using a different approach - store data in a global registry
    const messageId = foundry.utils.randomID();
    
    // Store button data globally for this message
    if (!window.rollForMeButtonData) {
      window.rollForMeButtonData = {};
    }
    window.rollForMeButtonData[messageId] = buttonSet.buttons;

    const buttonsHtml = buttonSet.buttons.map((button, index) => {
      return `<button class="roll-for-me-chat-button" 
      style="background-color: ${button.color}; color: white;"
              data-message-id="${messageId}" 
              data-button-index="${index}">
         ${button.label}
      </button>`;
    }).join('');

    const content = `
      <div class="roll-for-me-chat-buttons">
<div class="icon-container">
  <i class="fas fa-dice icons"></i>
</div>        <h3> Roll for me!</h3>
        <div class="roll-for-me-buttons-container">
          ${buttonsHtml}
        </div>
      </div>
    `;

    // Create chat message
    const chatData = {
      user: game.user.id,
      speaker: {
        alias: game.user.name
      },
      content: content,
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      flags: {
        "roll-for-me": {
          isButtonMessage: true,
          setIndex: setIndex,
          messageId: messageId
        }
      }
    };

    await ChatMessage.create(chatData);
  }

  /**
   * Send buttons to chat - alias for macro compatibility
   */
  static async sendButtonsToChat(setIndex = 0) {
    return this.sendButtonSetToChat(setIndex);
  }

  /**
   * Handle button click in chat
   */
  static async handleButtonClick(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    const messageId = button.dataset.messageId;
    const buttonIndex = parseInt(button.dataset.buttonIndex);
    
    // Get button data from global registry
    if (!window.rollForMeButtonData || !window.rollForMeButtonData[messageId]) {
      ui.notifications.error("Roll for Me: Dados do botão não encontrados!");
      return;
    }
    
    const buttonData = window.rollForMeButtonData[messageId][buttonIndex];
    if (!buttonData) {
      ui.notifications.error("Roll for Me: Botão não encontrado!");
      return;
    }
    
    const command = buttonData.command;
    const label = buttonData.label;
    
    if (!command) {
      ui.notifications.error(game.i18n.localize("ROLLME.Notifications.NoCommand"));
      return;
    }

    try {
      // Check if GURPS system is available
      if (typeof GURPS === 'undefined') {
        ui.notifications.error(game.i18n.localize("ROLLME.Notifications.GurpsNotAvailable"));
        return;
      }

      console.log('Roll for Me | Executing command:', command);

      // Try different GURPS execution methods
      if (typeof GURPS.executeOTF === 'function') {
        // Method 1: Direct executeOTF
        await GURPS.executeOTF(command);
      } else if (typeof GURPS.performAction === 'function') {
        // Method 2: performAction
        await GURPS.performAction(command);
      } else if (typeof GURPS.roll === 'function') {
        // Method 3: Direct roll
        await GURPS.roll(command);
      } else {
        // Method 4: Try to execute as chat command
        const chatCommand = `/${command}`;
        const chatData = {
          user: game.user.id,
          speaker: ChatMessage.getSpeaker(),
          content: chatCommand
        };
        
        // Process the command through the chat system
        const processed = await game.chatCommands.process(chatCommand, chatData);
        if (!processed) {
          // If not processed as command, try as OTF directly
          ui.chat.processMessage(chatCommand);
        }
      }
      
      // Optional: Add feedback message
      ui.notifications.info(game.i18n.format("ROLLME.Notifications.CommandExecuted", {label: label}));
      
    } catch (error) {
      console.error('Roll for Me | Error executing command:', error);
      ui.notifications.error(game.i18n.format("ROLLME.Notifications.ExecutionError", {error: error.message}));
    }
  }
}

/**
 * Set selector dialog
 */
class RollForMeSetSelector extends Dialog {
  
  static async showSetSelector() {
    const buttonSets = game.settings.get('roll-for-me', 'buttonSets');
    
    if (buttonSets.length === 0) {
      ui.notifications.warn(game.i18n.localize("ROLLME.Notifications.NoSets"));
      return;
    }

    const content = `
      <div class="roll-for-me-set-selector">
        <p style="margin-bottom: 10px; font-size: 12px;">${game.i18n.localize("ROLLME.SetSelector.Instructions")}</p>
        <div class="roll-for-me-set-list">
          ${buttonSets.map((set, index) => `
            <div class="roll-for-me-set-item" data-set-index="${index}">
              <div class="roll-for-me-set-info">
                <h4>${set.name}</h4>
                <p>${set.buttons.length} ${game.i18n.localize("ROLLME.SetSelector.ButtonCount")}</p>
              </div>
              <button class="roll-for-me-select-set-btn" data-set-index="${index}">
                <i class="fas fa-paper-plane"></i> Send
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    new Dialog({
      title: game.i18n.localize("ROLLME.SetSelector.Title"),
      content: content,
      buttons: {},
      render: (html) => {
        html.find('.roll-for-me-select-set-btn').click((event) => {
          const setIndex = parseInt(event.currentTarget.dataset.setIndex);
          RollForMeChat.sendButtonSetToChat(setIndex);
          html.closest('.dialog').find('.header-button.close').click();
        });
      },
      default: ""
    }, {
      width: 350,
      height: "auto",
      resizable: false,
      classes: ["roll-for-me-set-selector-dialog"]
    }).render(true);
  }
}