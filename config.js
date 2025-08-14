/**
 * GURPS Roll for Me - Configuration Dialog
 * V2 Application for managing button sets and their configurations
 * 
 * @author Boifubá
 * @version 0.5.8
 */
class RollForMeConfig extends foundry.applications.api.ApplicationV2 {
  
  constructor(options = {}) {
    super(options);
    this.expandedSets = new Set(); // Track which sets are expanded in UI
  }
  
  static DEFAULT_OPTIONS = {
    id: "gurps-roll-for-me-config",
    tag: "form",
    form: {
      handler: RollForMeConfig.formHandler,
      submitOnChange: false,
      closeOnSubmit: false
    },
    window: {
      title: "Roll for Me Configuration",
      icon: "fas fa-dice",
      resizable: true
    },
    position: {
      width: 500,
      height: 600
    },
    classes: ["gurps-roll-for-me-config"]
  };

  /**
   * Prepare context data for template rendering
   * @param {Object} options - Rendering options
   * @returns {Object} Context data
   */
  async _prepareContext(options) {
    const buttonSets = game.settings.get('gurps-roll-for-me', 'buttonSets');
    return {
      buttonSets: buttonSets.map((set, index) => ({
        ...set,
        index: index,
        expanded: this.expandedSets.has(index)
      }))
    };
  }

  /**
   * Render the HTML content for the configuration dialog
   * @param {Object} context - Template context
   * @param {Object} options - Rendering options
   * @returns {string} HTML content
   */
  async _renderHTML(context, options) {
    const html = `
      <style>
        .gurps-roll-for-me-config {
          font-family: 'Roboto', sans-serif;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .config-container {
          flex: 1;
          overflow-y: auto;
          max-height: 500px;
        }
        
        .config-header {
          margin-bottom: 20px;
          padding-bottom: 15px;
        }
        
        .config-header p {
          margin: 0;
          font-size: 14px;
        }
        
        .set-config {
          overflow: hidden;
          margin-bottom: 10px;
          border-radius: 4px;
        }
        
        .set-header {
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: all 0.2s ease;
          padding: 8px 12px;
        }
        
        .toggle-icon {
          margin-right: 12px;
          transition: transform 0.2s ease;
        }
        
        .toggle-icon.expanded {
          transform: rotate(90deg);
        }
        
        .set-name {
          flex: 1;
          margin-right: 10px;
          padding: 4px 8px;
        }
        
        .set-actions {
          display: flex;
          gap: 8px;
        }
        
        .btn {
          padding: 4px 8px;
          font-size: 12px;
        }
        
        .set-content {
          display: none;
        }
        
        .set-content.expanded {
          display: block;
        }
        
        .button-config {
          margin-bottom: 12px;
          padding: 8px;
          border-radius: 4px;
        }
        
        .button-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        
        .button-label {
          flex: 1;
          padding: 6px 10px;
          font-size: 13px;
        }
        
        .button-command {
          width: 100%;
          padding: 8px 10px;
          resize: vertical;
          min-height: 60px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
        }
        
        .add-set-btn {
          width: 100%;
          margin: 10px 0;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
          padding: 8px;
        }
        
        .config-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 10px;
        }
        
        .btn-lg {
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 600;
        }
      </style>
      
      <div class="config-container">
        <div id="button-sets-container">
          ${context.buttonSets.map(set => this._renderSetHtml(set)).join('')}
        </div>
        
        <button type="button" id="add-set" class="add-set-btn">
          <i class="fas fa-plus"></i> Add New Set
        </button>
      </div>
      
      <div class="config-footer">
        <button type="button" id="save-config" class="btn btn-lg">
          <i class="fas fa-save"></i> Save Configuration
        </button>
        <button type="button" id="close-config" class="btn btn-lg">
          <i class="fas fa-times"></i> Close
        </button>
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
   * Activate event listeners for the configuration interface
   * @param {HTMLElement} html - The HTML element containing the interface
   */
  _activateListeners(html) {
    // Toggle set expansion/collapse
    html.querySelectorAll('.set-header').forEach(header => {
      header.addEventListener('click', (event) => {
        if (event.target.closest('button') || event.target.closest('input')) return;
        
        const setElement = event.currentTarget.closest('.set-config');
        const setIndex = parseInt(setElement.dataset.setIndex);
        const contentElement = setElement.querySelector('.set-content');
        const toggleIcon = setElement.querySelector('.toggle-icon');
        
        if (this.expandedSets.has(setIndex)) {
          this.expandedSets.delete(setIndex);
          contentElement.classList.remove('expanded');
          toggleIcon.classList.remove('expanded');
        } else {
          this.expandedSets.add(setIndex);
          contentElement.classList.add('expanded');
          toggleIcon.classList.add('expanded');
        }
      });
    });
    
    // Add new button set
    html.querySelector('#add-set')?.addEventListener('click', () => this._onAddSet());
    
    // Delete button set
    html.querySelectorAll('.delete-set').forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const setIndex = parseInt(event.currentTarget.dataset.setIndex);
        this._onDeleteSet(setIndex);
      });
    });
    
    // Add button to set
    html.querySelectorAll('.add-button').forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const setIndex = parseInt(event.currentTarget.dataset.setIndex);
        this._onAddButton(setIndex);
      });
    });
    
    // Delete individual button
    html.querySelectorAll('.delete-button').forEach(btn => {
      btn.addEventListener('click', (event) => {
        const setIndex = parseInt(event.currentTarget.dataset.setIndex);
        const buttonIndex = parseInt(event.currentTarget.dataset.buttonIndex);
        this._onDeleteButton(setIndex, buttonIndex);
      });
    });
    
    // Save configuration
    html.querySelector('#save-config')?.addEventListener('click', () => this._onSave());
    
    // Close dialog
    html.querySelector('#close-config')?.addEventListener('click', () => this.close());
  }

  /**
   * Render HTML for a button set configuration section
   * @param {Object} set - Button set data
   * @returns {string} HTML for the set
   */
  _renderSetHtml(set) {
    const expandedClass = set.expanded ? 'expanded' : '';
    const contentClass = set.expanded ? 'expanded' : '';
    
    return `
      <div class="set-config" data-set-index="${set.index}">
        <div class="set-header">
          <i class="toggle-icon fas fa-chevron-right ${expandedClass}"></i>
          <input type="text" class="set-name" value="${set.name}" placeholder="Set Name" onclick="event.stopPropagation();">
          <div class="set-actions">
            <button type="button" class="btn add-button" data-set-index="${set.index}">
              <i class="fas fa-plus"></i> Button
            </button>
            <button type="button" class="btn delete-set" data-set-index="${set.index}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        <div class="set-content ${contentClass}">
          ${set.buttons.map((button, buttonIndex) => this._renderButtonHtml(button, set.index, buttonIndex)).join('')}
          ${set.buttons.length === 0 ? '<p style="text-align: center; margin: 20px 0;">No buttons configured. Click "+ Button" to add.</p>' : ''}
        </div>
      </div>
    `;
  }

  /**
   * Render HTML for an individual button configuration
   * @param {Object} button - Button data
   * @param {number} setIndex - Parent set index
   * @param {number} buttonIndex - Button index within set
   * @returns {string} HTML for the button
   */
  _renderButtonHtml(button, setIndex, buttonIndex) {
    return `
      <div class="button-config" data-set-index="${setIndex}" data-button-index="${buttonIndex}">
        <div class="button-header">
          <input type="text" class="button-label" value="${button.label}" placeholder="Button Name">
          <button type="button" class="btn delete-button" data-set-index="${setIndex}" data-button-index="${buttonIndex}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
        <textarea class="button-command" placeholder="GURPS Command (ex: [dodge], [per])">${button.command}</textarea>
      </div>
    `;
  }

  /**
   * Handle adding a new button set
   */
  async _onAddSet() {
    const buttonSets = game.settings.get('gurps-roll-for-me', 'buttonSets');
    const newIndex = buttonSets.length;
    buttonSets.push({
      name: "New Set",
      buttons: []
    });
    
    this.expandedSets.add(newIndex);
    await game.settings.set('gurps-roll-for-me', 'buttonSets', buttonSets);
    this.render();
  }

  /**
   * Handle deleting a button set
   * @param {number} setIndex - Index of set to delete
   */
  async _onDeleteSet(setIndex) {
    const buttonSets = game.settings.get('gurps-roll-for-me', 'buttonSets');
    buttonSets.splice(setIndex, 1);
    
    // Update expanded sets tracking after deletion
    const newExpandedSets = new Set();
    for (let expandedIndex of this.expandedSets) {
      if (expandedIndex < setIndex) {
        newExpandedSets.add(expandedIndex);
      } else if (expandedIndex > setIndex) {
        newExpandedSets.add(expandedIndex - 1);
      }
    }
    this.expandedSets = newExpandedSets;
    
    await game.settings.set('gurps-roll-for-me', 'buttonSets', buttonSets);
    this.render();
  }

  /**
   * Handle adding a button to a set
   * @param {number} setIndex - Index of set to add button to
   */
  async _onAddButton(setIndex) {
    const buttonSets = game.settings.get('gurps-roll-for-me', 'buttonSets');
    buttonSets[setIndex].buttons.push({
      label: "New Button",
      command: ""
    });
    
    this.expandedSets.add(setIndex);
    await game.settings.set('gurps-roll-for-me', 'buttonSets', buttonSets);
    this.render();
  }

  /**
   * Handle deleting a button from a set
   * @param {number} setIndex - Index of parent set
   * @param {number} buttonIndex - Index of button to delete
   */
  async _onDeleteButton(setIndex, buttonIndex) {
    const buttonSets = game.settings.get('gurps-roll-for-me', 'buttonSets');
    buttonSets[setIndex].buttons.splice(buttonIndex, 1);
    await game.settings.set('gurps-roll-for-me', 'buttonSets', buttonSets);
    this.render();
  }

  /**
   * Handle saving the complete configuration
   */
  async _onSave() {
    const html = this.element;
    const buttonSets = [];
    
    html.querySelectorAll('.set-config').forEach((setElement) => {
      const setName = setElement.querySelector('.set-name').value || "Unnamed Set";
      const buttons = [];
      
      setElement.querySelectorAll('.button-config').forEach((buttonElement) => {
        const label = buttonElement.querySelector('.button-label').value;
        const command = buttonElement.querySelector('.button-command').value;
        
        if (label && command) {
          buttons.push({ label, command });
        }
      });
      
      buttonSets.push({ name: setName, buttons });
    });
    
    await game.settings.set('gurps-roll-for-me', 'buttonSets', buttonSets);
    ui.notifications.info("Roll for Me: Configuration saved successfully!");
    this.close();
  }

  /**
   * Form handler for V2 Application (currently unused but required)
   */
  static async formHandler(event, form, formData) {
    // Handle form submission if needed in future versions
  }
}

// Expose class globally for access from main module
if (typeof window !== 'undefined') {
  window.RollForMeConfig = RollForMeConfig;
}