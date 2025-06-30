/**
 * Configuration dialog for Roll for Me button sets
 */
class RollForMeConfig extends FormApplication {
  
  constructor(...args) {
    super(...args);
    this.expandedSets = new Set(); // Track which sets are expanded
  }
  
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "roll-for-me-config",
      classes: ["sheet", "roll-for-me-config"],
      title: game.i18n.localize("ROLLME.Config.Title"),
      template: "modules/roll-for-me/templates/config.html",
      width: 700,
      height: "auto",
      resizable: true,
      closeOnSubmit: false,
      submitOnChange: false
    });
  }

  getData() {
    const buttonSets = game.settings.get('roll-for-me', 'buttonSets');
    return {
      buttonSets: buttonSets.map((set, index) => ({
        ...set,
        index: index,
        expanded: this.expandedSets.has(index)
      }))
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    
    // Close button functionality
    html.find('.roll-for-me-close-btn').click(() => {
      this.close();
    });
    
    // Accordion functionality - toggle set expansion
    html.find('.roll-for-me-set-header').click((event) => {
      // Don't toggle if clicking on buttons or inputs (but allow clicking on icon and name field area)
      if (event.target.matches('button') || event.target.closest('button')) {
        return;
      }
      
      const setConfig = event.currentTarget.closest('.roll-for-me-set-config');
      const setIndex = parseInt(setConfig.dataset.setIndex);
      const contentElement = $(setConfig).find('.set-content');
      const toggleIcon = $(setConfig).find('.toggle-icon');
      
      if (this.expandedSets.has(setIndex)) {
        // Collapse
        this.expandedSets.delete(setIndex);
        $(setConfig).removeClass('expanded');
        contentElement.slideUp(200);
        toggleIcon.removeClass('fa-chevron-down').addClass('fa-chevron-right');
      } else {
        // Expand
        this.expandedSets.add(setIndex);
        $(setConfig).addClass('expanded');
        contentElement.slideDown(200);
        toggleIcon.removeClass('fa-chevron-right').addClass('fa-chevron-down');
      }
    });
    
    // Add new set
    html.find('#add-set').click(this._onAddSet.bind(this));
    
    // Delete set
    html.find('.delete-set').click(this._onDeleteSet.bind(this));
    
    // Add button to set
    html.find('.add-button').click(this._onAddButton.bind(this));
    
    // Delete button
    html.find('.delete-button').click(this._onDeleteButton.bind(this));
  }

  async _onAddSet(event) {
    event.preventDefault();
    
    const buttonSets = game.settings.get('roll-for-me', 'buttonSets');
    const newIndex = buttonSets.length;
    buttonSets.push({
      name: game.i18n.localize("ROLLME.Config.NewSet"),
      buttons: []
    });
    
    // Expand the new set by default
    this.expandedSets.add(newIndex);
    
    await game.settings.set('roll-for-me', 'buttonSets', buttonSets);
    this.render();
  }

  async _onDeleteSet(event) {
    event.preventDefault();
    event.stopPropagation(); // Prevent accordion toggle
    
    const setIndex = parseInt(event.currentTarget.dataset.setIndex);
    const buttonSets = game.settings.get('roll-for-me', 'buttonSets');
    
    buttonSets.splice(setIndex, 1);
    
    // Update expanded sets tracking
    const newExpandedSets = new Set();
    for (let expandedIndex of this.expandedSets) {
      if (expandedIndex < setIndex) {
        newExpandedSets.add(expandedIndex);
      } else if (expandedIndex > setIndex) {
        newExpandedSets.add(expandedIndex - 1);
      }
    }
    this.expandedSets = newExpandedSets;
    
    await game.settings.set('roll-for-me', 'buttonSets', buttonSets);
    this.render();
  }

  async _onAddButton(event) {
    event.preventDefault();
    event.stopPropagation(); // Prevent accordion toggle
    
    const setIndex = parseInt(event.currentTarget.dataset.setIndex);
    const buttonSets = game.settings.get('roll-for-me', 'buttonSets');
    
    buttonSets[setIndex].buttons.push({
      label: game.i18n.localize("ROLLME.Config.NewButton"),
      command: ""
    });
    
    // Ensure the set is expanded when adding a button
    this.expandedSets.add(setIndex);
    
    await game.settings.set('roll-for-me', 'buttonSets', buttonSets);
    this.render();
  }

  async _onDeleteButton(event) {
    event.preventDefault();
    event.stopPropagation(); // Prevent accordion toggle
    
    const setIndex = parseInt(event.currentTarget.dataset.setIndex);
    const buttonIndex = parseInt(event.currentTarget.dataset.buttonIndex);
    const buttonSets = game.settings.get('roll-for-me', 'buttonSets');
    
    buttonSets[setIndex].buttons.splice(buttonIndex, 1);
    await game.settings.set('roll-for-me', 'buttonSets', buttonSets);
    this.render();
  }

  async _updateObject(event, formData) {
    const buttonSets = [];
    
    // Process form data
    const expanded = foundry.utils.expandObject(formData);
    
    if (expanded.buttonSets) {
      for (let setKey in expanded.buttonSets) {
        const setData = expanded.buttonSets[setKey];
        const buttonSet = {
          name: setData.name || "Unnamed Set",
          buttons: []
        };
        
        if (setData.buttons) {
          for (let buttonKey in setData.buttons) {
            const button = setData.buttons[buttonKey];
            if (button.label && button.command) {
              buttonSet.buttons.push({
                label: button.label,
                command: button.command
              });
            }
          }
        }
        
        buttonSets.push(buttonSet);
      }
    }
    
    await game.settings.set('roll-for-me', 'buttonSets', buttonSets);
    ui.notifications.info(game.i18n.localize("ROLLME.Notifications.ConfigSaved"));
  }
}