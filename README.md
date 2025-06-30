# Roll for Me - FoundryVTT Module

A professional module for FoundryVTT v12+ that allows you to configure custom buttons with GURPS OTF commands and send them to chat in an elegant and efficient way.

## 🎯 Features

- ✅ **Configure custom buttons** with GURPS OTF commands
- ✅ **Send button sets to chat** when needed
- ✅ **Click buttons in chat** to execute GURPS commands automatically
- ✅ **Customize colors and icons** of buttons with intuitive interface
- ✅ **Professional configuration interface** with accordion system
- ✅ **Default button sets** loaded automatically
- ✅ **Button set selection system** for quick chat deployment
- ✅ **Full compatibility** with GURPS system for FoundryVTT
- ✅ **Modular architecture** with clear separation of responsibilities

## 🚀 How to Use

### 1. Button Configuration

#### Via Graphical Interface:
1. **Open configuration**:
   - Click the "Roll for Me" icon in the left sidebar
   - Click "Configure Button Sets" or use the configuration button
   - Or run macro: `game.rollForMe.openConfig()`

2. **Create button sets**:
   - Click "Add New Set" to create a new button set
   - Give it a descriptive name (e.g., "Basic Combat", "Attribute Tests")
   - Click the set header to expand/collapse it

3. **Add buttons to sets**:
   - Click "+" button next to the set name to add a new button
   - Configure each button:
     - **Label**: Name that will appear on the button
     - **Command**: GURPS OTF command (e.g., `[3d6]`, `[ST+2]`, `[DX-3]`)
     - **Color**: Button background color
     - **Icon**: FontAwesome icon (e.g., `fas fa-dice`, `fas fa-sword`)

4. **Save configuration**:
   - Click "Save Configuration" to apply changes
   - Settings are saved globally for all users in the world

#### Via Macro (Advanced):
```javascript
// Force reload default button sets
game.rollForMe.forceLoadDefaults();

// Clear all settings and reload defaults
game.rollForMe.clearSettings();
```

### 2. Using the Buttons

#### Method 1: Set Selector (Recommended)
1. Click "Send Button Set to Chat" in the sidebar
2. Choose which button set to send from the dialog
3. Buttons will appear in chat for all players to use

#### Method 2: Direct Macro
```javascript
// Send specific button set to chat (0 = first set, 1 = second set, etc.)
game.rollForMe.sendButtonSetToChat(0);

// Alternative function name
RollForMeChat.sendButtonsToChat(0);
```

#### Method 3: Via Macro Bar
Create macros with the following scripts:
```javascript
// Open set selector
game.rollForMe.showSetSelector();

// Send first button set directly
game.rollForMe.sendButtonsToChat(0);

// Open configuration
game.rollForMe.openConfig();
```

### 3. GURPS OTF Command Examples

The module supports all standard GURPS OTF (On The Fly) commands:

#### Basic Rolls
```
[3d6]                    // Roll 3d6 basic
[1d6]                    // Roll 1d6
[2d6+3]                  // Roll 2d6 with +3 modifier
```

#### Attribute Tests
```
[ST]                     // Strength test
[DX]                     // Dexterity test
[IQ]                     // Intelligence test
[HT]                     // Health test
```

#### Attribute Tests with Modifiers
```
[ST+2]                   // Strength test with +2 bonus
[DX-3]                   // Dexterity test with -3 penalty
[IQ+1]                   // Intelligence test with +1 bonus
```

#### Secondary Characteristics
```
[Per]                    // Perception test
[Will]                   // Will test
[Dodge]                  // Dodge test
[Parry]                  // Parry test
[Block]                  // Block test
```

#### Tests with Custom Messages
```
[Per-2 "Poor lighting"]  // Perception test with penalty and reason
[Will "Fear check"]      // Will test with custom description
[ST+3 "Adrenaline rush"] // Strength test with bonus and reason
```

#### Combat Commands
```
[attack]                 // Basic attack
[defense]                // Basic defense
[damage]                 // Damage roll
```

#### Skill Tests
```
[Sword-2]                // Sword skill with -2 penalty
[Guns+1]                 // Guns skill with +1 bonus
[Stealth-3 "Heavy armor"] // Stealth with penalty and reason
```

## 📦 Installation

### Method 1: Manual Installation
1. Download the module files
2. Extract to `Data/modules/roll-for-me/` folder
3. Enable the module in world settings
4. Restart the world

### Method 2: Via Foundry (when available)
1. Go to "Add-on Modules"
2. Click "Install Module"
3. Paste the manifest URL
4. Click "Install"

### Method 3: Via Manifest URL
```
https://github.com/yourusername/roll-for-me/releases/latest/download/module.json
```

## ⚙️ Requirements

- **FoundryVTT v12+** (minimum version 12, verified on 12.331)
- **GURPS System** for FoundryVTT (for OTF command functionality)
- **Modern browser** with JavaScript enabled

## 🏗️ File Structure

```
roll-for-me/
├── module.json           # Module manifest
├── README.md            # This file
├── scripts/
│   ├── main.js          # Main initialization script
│   ├── defaults.js      # Default button sets configuration
│   ├── config.js        # Button configuration interface
│   └── chat.js          # Chat functionality and button handling
├── styles/
│   └── module.css       # Module styling
├── templates/
│   └── config.html      # Configuration dialog template
└── lang/
    └── en.json          # English translations
```

## 🔧 Configuration Details

### Button Set Structure
Each button set contains:
- **Name**: Display name for the set
- **Buttons**: Array of button configurations

### Button Configuration
Each button contains:
- **Label**: Display text on the button
- **Command**: GURPS OTF command to execute
- **Color**: Background color (hex code)
- **Icon**: FontAwesome icon class

### Default Button Sets
The module comes with 4 pre-configured button sets:
1. **Basic Combat** - Attack, Defense, Dodge commands
2. **Attribute Tests** - ST, DX, IQ, HT tests
3. **Modified Tests** - Perception, Will tests with modifiers
4. **Quick Rolls** - Basic dice rolls and damage

## 🎮 Usage Tips

### For Game Masters
- Configure button sets before the session
- Create themed sets for different scenarios (combat, exploration, social)
- Use descriptive names and appropriate colors for easy identification
- Test commands before using them in-game

### For Players
- Click buttons in chat to execute commands automatically
- No need to remember complex OTF syntax
- Buttons work for all players once sent to chat
- Results appear as normal GURPS rolls

### Best Practices
- Use consistent color coding (red for attacks, blue for defense, etc.)
- Include modifier reasons in quotes for clarity
- Group related commands in the same set
- Test new commands in the configuration dialog first

## 🔍 Troubleshooting

### Common Issues

**"Cannot read properties of undefined (reading 'openConfig')"**
- Solution: Make sure the module is fully loaded before running macros
- Wait for the "ready" hook or check `game.rollForMe` exists

**"GURPS system not available"**
- Solution: Install and enable the GURPS system for FoundryVTT
- Ensure GURPS system is active in the world

**"No button sets configured"**
- Solution: Default sets should load automatically
- If not, run `game.rollForMe.forceLoadDefaults()` in console

**Buttons not appearing in chat**
- Solution: Check if button set has any buttons configured
- Verify the set index is correct (starts from 0)

**Commands not executing**
- Solution: Verify GURPS OTF command syntax
- Check browser console for error messages
- Ensure GURPS system is properly installed

### Debug Commands
```javascript
// Check if module is loaded
console.log(game.rollForMe);

// Check current button sets
console.log(game.settings.get('roll-for-me', 'buttonSets'));

// Force reload defaults
game.rollForMe.forceLoadDefaults();

// Clear all settings
game.rollForMe.clearSettings();
```

## 🤝 Development

### Architecture
- **Modular design** with separate files for different functionality
- **Event-driven** using FoundryVTT hooks system
- **Settings-based** configuration storage
- **Template-based** UI rendering

### Key Classes
- `RollForMeConfig`: Configuration dialog interface
- `RollForMeChat`: Chat functionality and button handling
- `RollForMeSetSelector`: Set selection dialog
- `RollForMeDefaults`: Default configuration management

### Extending the Module
The module exposes several functions for macro and API use:
```javascript
// Available functions
game.rollForMe.showSetSelector()      // Open set selector
game.rollForMe.openConfig()           // Open configuration
game.rollForMe.sendButtonSetToChat(index) // Send set to chat
game.rollForMe.forceLoadDefaults()    // Reload defaults
game.rollForMe.clearSettings()        // Clear settings
```

## 📄 License

This module is distributed under the MIT License.

## 🆘 Support

For issues, feature requests, or contributions:
1. Check the troubleshooting section above
2. Search existing issues on the repository
3. Create a new issue with detailed information
4. Include browser console errors if applicable

## 🔄 Version History

### v1.0.0
- Initial release
- Basic button configuration
- Chat integration
- Default button sets
- GURPS OTF command support
- Professional UI design