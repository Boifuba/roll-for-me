/**
 * GURPS Roll for Me - Chat Integration
 * Handles sending button sets to chat and processing button interactions
 * 
 * @author Boifubá
 * @version 0.5.8
 */
class RollForMeChat {
  
  /**
   * Escape HTML characters to prevent XSS attacks
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  static _escapeHtml(text) {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  
  /**
   * Send a button set to chat as clickable buttons
   * @param {number} setIndex - Index of the button set to send
   * @param {boolean} isBlind - Whether buttons should be executed as blind rolls
   */
  static async sendButtonSetToChat(setIndex, isBlind = false) {
    const buttonSets = game.settings.get('gurps-roll-for-me', 'buttonSets');
    const set = buttonSets[setIndex];
    
    if (!set || !set.buttons || set.buttons.length === 0) {
      ui.notifications.warn("Roll for Me: Button set not found or empty!");
      return;
    }
    
    // Create unique ID for this chat message
    const messageId = foundry.utils.randomID();
    
    // Prepare button data with blind flag
    const buttonData = set.buttons.map(button => ({
      ...button,
      isBlind: isBlind
    }));
    
    const chatData = {
      user: game.user.id,
      content: this._generateChatHtml(set, setIndex, messageId, isBlind),
      type: CONST.CHAT_MESSAGE_TYPES.OTHER,
      sound: CONFIG.sounds.notification,
      flags: {
        "gurps-roll-for-me": {
          isButtonMessage: true,
          setIndex: setIndex,
          messageId: messageId,
          buttonData: buttonData // Store button data in message flags
        }
      }
    };
    
    ChatMessage.create(chatData);
  }
  
  /**
   * Generate HTML content for chat message with buttons
   * @param {Object} set - Button set configuration
   * @param {number} setIndex - Set index
   * @param {string} messageId - Unique message identifier
   * @param {boolean} isBlind - Whether this is a blind roll set
   * @returns {string} HTML content
   */
  static _generateChatHtml(set, setIndex, messageId, isBlind = false) {
    const buttons = set.buttons.map((button, buttonIndex) => {
      const escapedLabel = this._escapeHtml(button.label);
      const buttonStyle = isBlind ? 'background: #f0f0f0; color: #666; margin: 2px;' : 'margin: 2px;';
      const buttonText = escapedLabel;
      const blindIcon = isBlind ? '<i class="fas fa-eye-slash" style="margin-right: 4px; opacity: 0.6;"></i>' : '';
      
      return `
        <button class="gurps-roll-for-me-chat-button" 
                data-message-id="${messageId}" 
                data-button-index="${buttonIndex}"
                title="${escapedLabel}"
                style="${buttonStyle}">
          ${blindIcon}${buttonText}
        </button>
      `;
    }).join('');
    
    const setIcon = isBlind ? 'fa-eye-slash' : 'fa-dice';
    const setTitle = isBlind ? `${set.name} (Blind Rolls)` : set.name;
    
    return `
      <div class="gurps-roll-for-me-chat-container" style="padding: 8px; margin: 4px 0;">
        <div class="gurps-roll-for-me-header" style="margin-bottom: 8px; padding-bottom: 4px;">
          <div class="icon-container" style="display: inline-block; margin-right: 8px;">
            <i class="fas ${setIcon}"></i>
          </div>
          <strong>${this._escapeHtml(setTitle)}</strong>
        </div>
        <div class="gurps-roll-for-me-buttons" style="display: flex; flex-wrap: wrap; gap: 4px;">
          ${buttons}
        </div>
      </div>
    `;
  }
  
  /**
   * Handle button click events from chat
   * @param {Event} event - Click event from chat button
   */
  static async handleButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const button = event.currentTarget;
    const messageId = button.dataset.messageId;
    const buttonIndex = parseInt(button.dataset.buttonIndex);
    
    // Find the chat message by looking for the message ID in the DOM
    const chatMessage = button.closest('.message');
    if (!chatMessage) {
      ui.notifications.error("Roll for Me: Could not find chat message!");
      return;
    }
    
    // Get message ID from the chat message element
    const foundryMessageId = chatMessage.dataset.messageId;
    if (!foundryMessageId) {
      ui.notifications.error("Roll for Me: Could not identify chat message!");
      return;
    }
    
    // Retrieve the ChatMessage object
    const message = game.messages.get(foundryMessageId);
    if (!message) {
      ui.notifications.error("Roll for Me: Chat message not found!");
      return;
    }
    
    // Get button data from message flags
    const buttonData = message.flags?.["gurps-roll-for-me"]?.buttonData;
    if (!buttonData || !buttonData[buttonIndex]) {
      ui.notifications.error("Roll for Me: Button configuration not found!");
      return;
    }
    
    const buttonConfig = buttonData[buttonIndex];
    let command = buttonConfig.command;
    const label = buttonConfig.label;
    const isBlind = buttonConfig.isBlind;
    
    // Add blind modifier to command if needed
    if (isBlind && command.includes('[') && !command.includes('[!')) {
      command = command.replace('[', '[!');
    }
    
    if (!command) {
      ui.notifications.warn("Roll for Me: No command configured for this button!");
      return;
    }
    
    try {
      // Verify GURPS system availability
      if (typeof GURPS === 'undefined') {
        ui.notifications.error("Roll for Me: GURPS system not available!");
        return;
      }
      
      // First, auto-select the player's own token
      if (typeof GURPS.executeOTF === 'function') {
        try {
          await GURPS.executeOTF('!/select @self');
        } catch (error) {
          console.warn("Roll for Me: Could not auto-select token:", error);
        }
      }
      
      // Primary method: Use GURPS.executeOTF directly
      if (typeof GURPS.executeOTF === 'function') {
        await GURPS.executeOTF(command);
        return;
      }
      
      // Fallback 1: Use GURPS.parselink if available
      if (GURPS.parselink && typeof GURPS.parselink === 'function') {
        // Try to find an actor in order of preference:
        // 1. User's assigned character
        // 2. Currently selected token's actor
        // 3. Any actor the user owns
        let actor = game.user.character || canvas.tokens.controlled[0]?.actor;
        
        // If no actor found yet, search for any owned actor
        if (!actor) {
          actor = game.actors.find(a => a.isOwner);
        }
        
        if (!actor) {
          ui.notifications.warn("Roll for Me: No character selected!");
          return;
        }
        await GURPS.parselink(command, actor);
        return;
      }
      
      // Fallback 2: Try other GURPS methods
      if (typeof GURPS.performAction === 'function') {
        await GURPS.performAction(command);
        ui.notifications.info(`Roll for Me: Executed - ${label}`);
        return;
      }
      
      // Fallback 3: Send command as chat message
      await ChatMessage.create({
        user: game.user.id,
        content: command,
        type: CONST.CHAT_MESSAGE_TYPES.OTHER
      });
      ui.notifications.info(`Roll for Me: Command sent to chat - ${label}`);
      
    } catch (error) {
      console.error("Roll for Me: Command execution error", error);
      ui.notifications.error(`Roll for Me: Error executing command: ${error.message}`);
    }
  }
  
  /**
   * Alternative method for sending buttons to chat (alias for compatibility)
   * @param {number} setIndex - Index of the button set
   */
  static async sendButtonsToChat(setIndex) {
    return this.sendButtonSetToChat(setIndex);
  }
}

// Expose class globally for access from other modules
if (typeof window !== 'undefined') {
  window.RollForMeChat = RollForMeChat;
}

// Global event listener for chat button clicks
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('gurps-roll-for-me-chat-button')) {
    RollForMeChat.handleButtonClick(event);
  }
});

// Initialize when FoundryVTT is ready
Hooks.once('ready', () => {
  console.log("Roll for Me: Chat integration ready");
});