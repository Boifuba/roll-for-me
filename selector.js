/**
 * GURPS Roll for Me - Set Selector Dialog
 * V2 Application for selecting which button set to send to chat
 * 
 * @author Boifubá
 * @version 0.5.8
 */
class RollForMeSetSelector extends foundry.applications.api.ApplicationV2 {
  
  constructor(options = {}) {
    super(options);
    this.blindButtons = new Set(); // Track which sets are marked as blind
  }
  
  static DEFAULT_OPTIONS = {
    id: "gurps-roll-for-me-selector",
    tag: "div",
    window: {
      title: "Roll for Me - Select Button Set",
      icon: "fas fa-dice"
    },
    position: {
      width: 420,
      height: "auto"
    },
    classes: ["gurps-roll-for-me-selector"]
  };

  /**
   * Prepare context data for rendering
   * @param {Object} options - Rendering options
   * @returns {Object} Context data with available button sets
   */
  async _prepareContext(options) {
    const buttonSets = game.settings.get('gurps-roll-for-me', 'buttonSets');
    return {
      buttonSets: buttonSets.filter(set => set.buttons && set.buttons.length > 0)
    };
  }

  /**
   * Render the selector dialog HTML
   * @param {Object} context - Template context
   * @param {Object} options - Rendering options
   * @returns {string} HTML content
   */
  async _renderHTML(context, options) {
    const html = `
      <style>
        .gurps-roll-for-me-selector {
          font-family: 'Roboto', sans-serif;
        }
        
        .selector-container {
          padding: 16px;
        }
        
        .selector-header {
          text-align: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(51, 51, 51, 0.2);
        }
        
        .selector-header h1 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .sets-list {
          margin-bottom: 24px;
        }
        
        .set-row {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin-bottom: 8px;
          border: 1px solid rgba(51, 51, 51, 0.2);
          border-radius: 8px;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
          background: rgba(51, 51, 51, 0.05);
        }
        
        .set-row:hover {
          border-color: rgba(51, 51, 51, 0.4);
          box-shadow: 0 2px 8px rgba(51, 51, 51, 0.1);
          transform: translateY(-1px);
        }
        
        .set-row:hover .plane-icon {
          opacity: 1;
          transform: translateX(2px);
        }
        
        .set-row:active {
          transform: translateY(0);
          box-shadow: 0 1px 4px rgba(51, 51, 51, 0.1);
        }
        
        .eye-toggle {
          width: 20px;
          height: 20px;
          margin-right: 16px;
          cursor: pointer;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s ease;
          font-size: 14px;
          opacity: 0.7;
        }
        
        .eye-toggle:hover {
          opacity: 1;
          transform: scale(1.1);
        }
        
        .eye-toggle.blind {
          opacity: 0.5;
        }
        
        .set-name {
          flex: 1;
          font-size: 15px;
          font-weight: 500;
          margin: 0;
          padding-right: 16px;
          cursor: pointer;
        }
        
        .plane-icon {
          font-size: 14px;
          opacity: 0.6;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        
        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }
        
        .empty-state i {
          font-size: 54px;
          margin-bottom: 20px;
          display: block;
          opacity: 0.4;
        }
        
        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 500;
        }
        
        .empty-state p {
          margin: 0;
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.4;
        }
        
        .selector-footer {
          border-top: 1px solid rgba(51, 51, 51, 0.2);
          padding-top: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .footer-button {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid rgba(51, 51, 51, 0.3);
          border-radius: 6px;
          background: rgba(51, 51, 51, 0.05);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .footer-button:hover {
          background: rgba(51, 51, 51, 0.1);
          border-color: rgba(51, 51, 51, 0.5);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(51, 51, 51, 0.1);
        }
        
        .footer-button:active {
          transform: translateY(0);
          box-shadow: inset 0 1px 3px rgba(51, 51, 51, 0.1);
        }
      </style>
      
      <div class="selector-container">
        <div class="selector-header">
          <h1>GURPS Roll for Me!</h1>
        </div>
        
        ${context.buttonSets.length > 0 ? `
          <div class="sets-list">
            ${context.buttonSets.map((set, index) => this._renderSetRow(set, index)).join('')}
          </div>
        ` : `
          <div class="empty-state">
            <i class="fas fa-dice"></i>
            <h3>No Button Sets Configured</h3>
            <p>Configure your button sets to start using Roll for Me.</p>
          </div>
        `}

        <div class="selector-footer">
          <button type="button" id="config-sets" class="footer-button">
            <i class="fas fa-cog"></i> Configure Sets
          </button>
          <button type="button" id="close-selector" class="footer-button">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    `;
    
    return html;
  }

  /**
   * Replace HTML content and activate listeners
   */
  async _replaceHTML(result, content, options) {
    content.innerHTML = result;
    this._activateListeners(content);
  }

  /**
   * Render a single set row for the selector
   * @param {Object} set - Button set configuration
   * @param {number} index - Set index
   * @returns {string} HTML for the set row
   */
  _renderSetRow(set, index) {
    return `
      <div class="set-row" data-set-index="${index}">
        <i class="eye-toggle fas fa-eye" data-set-index="${index}"></i>
        <p class="set-name">${set.name}</p>
        <i class="plane-icon fas fa-paper-plane"></i>
      </div>
    `;
  }

  /**
   * Activate event listeners for the selector interface
   * @param {HTMLElement} html - The HTML element containing the interface
   */
  _activateListeners(html) {
    // Handle eye toggle for blind/visible mode
    html.querySelectorAll('.eye-toggle').forEach(eye => {
      eye.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent row click
        
        const eyeIcon = event.currentTarget;
        const isBlind = eyeIcon.classList.contains('blind');
        
        if (isBlind) {
          // Switch to visible mode (open eye)
          eyeIcon.classList.remove('blind', 'fa-eye-slash');
          eyeIcon.classList.add('fa-eye');
        } else {
          // Switch to blind mode (closed eye)
          eyeIcon.classList.add('blind', 'fa-eye-slash');
          eyeIcon.classList.remove('fa-eye');
        }
      });
    });
    
    // Handle set row clicks to send buttons to chat
    html.querySelectorAll('.set-row').forEach(row => {
      row.addEventListener('click', (event) => {
        // Don't trigger if clicking the eye toggle
        if (event.target.closest('.eye-toggle')) {
          return;
        }
        
        const setIndex = parseInt(event.currentTarget.dataset.setIndex);
        this._onSendSet(setIndex);
      });
    });
    
    // Open configuration dialog
    html.querySelector('#config-sets')?.addEventListener('click', () => {
      new RollForMeConfig().render(true);
      this.close();
    });
    
    // Close selector
    html.querySelector('#close-selector')?.addEventListener('click', () => this.close());
  }

  /**
   * Handle sending a button set to chat
   * @param {number} setIndex - Index of the set to send
   */
  _onSendSet(setIndex) {
    // Check if set should be sent as blind rolls (eye is closed)
    const eyeIcon = this.element.querySelector(`.eye-toggle[data-set-index="${setIndex}"]`);
    const isBlind = eyeIcon && eyeIcon.classList.contains('blind');
    
    RollForMeChat.sendButtonSetToChat(setIndex, isBlind);
    this.close();
  }

  /**
   * Static method to show the selector dialog
   */
  static show() {
    new RollForMeSetSelector().render(true);
  }
}

// Expose class globally for access from main module
if (typeof window !== 'undefined') {
  window.RollForMeSetSelector = RollForMeSetSelector;
}