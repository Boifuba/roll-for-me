# GURPS Roll for Me!

A comprehensive FoundryVTT module for creating and managing custom GURPS roll button sets in chat. Streamline your GURPS games with quick-access buttons for common rolls, tests, and actions.

## Features

- **Custom Button Sets**: Create unlimited sets of roll buttons organized by category
- **Chat Integration**: Send button sets directly to chat for all players to use
- **Blind Roll Support**: Toggle visibility for secret GM rolls
- **GURPS Command Support**: Full compatibility with GURPS system commands
- **Easy Configuration**: Intuitive interface for managing button sets
- **Quick Access**: Token control bar integration for fast access
- **Macro Support**: Complete API for macro integration

## Default Button Sets

The module comes with three pre-configured button sets:

### Dodge
- Basic Dodge
- Dodge and Drop (with prone modifier)
- Acrobatic Dodge (skill-based)
- Feverish Defense (+2 dodge, costs FP)
- Retreating Dodge (+3 dodge)

### Perception
- Observation (uses skill if available, otherwise vision)
- Vision, Hearing, Touch, Taste, Smell rolls
- All with success/failure messages

### Lights
- Torch, Lantern, and Bullseye Lantern lighting
- Automatic light radius and angle settings
- Lights off command

## Usage

### Basic Usage
1. Click the dice icon in the token controls toolbar
2. Select a button set from the list
3. Toggle the eye icon for blind rolls (GM only)
4. Click a set name to send buttons to chat
5. Players click chat buttons to execute rolls

### Configuration
1. Access via Module Settings → "Configure Button Sets"
2. Create new sets with the "+ Add New Set" button
3. Add buttons to sets with the "+ Button" option
4. Configure button labels and GURPS commands
5. Save configuration when finished

### GURPS Commands
Use standard GURPS system commands in buttons:
- `[dodge]` - Basic dodge roll
- `[per]` - Perception roll
- `[vision]` - Vision roll with success/failure text
- `[SK:acrobatics]` - Skill roll
- `[/r 3d6]` - Raw dice roll
- `[/if condition true_result /else false_result]` - Conditional logic

## API Reference

The module exposes a global `game.rollForMe` API:

```javascript
// Show set selector dialog
game.rollForMe.showSetSelector();

// Open configuration dialog
game.rollForMe.openConfig();

// Send specific button set to chat
game.rollForMe.sendButtonSetToChat(setIndex);

// Reset to default button sets
game.rollForMe.forceLoadDefaults();

// Clear all settings
game.rollForMe.clearSettings();
```

## Macro Examples

### Quick Set Selector
```javascript
game.rollForMe.showSetSelector();
```

### Send Specific Set
```javascript
// Send the first button set (index 0) to chat
game.rollForMe.sendButtonSetToChat(0);
```

### Configuration Access
```javascript
game.rollForMe.openConfig();
```

## Technical Details

### Compatibility
- **FoundryVTT**: Version 13+
- **GURPS System**: Required for roll execution
- **Browser**: Modern browsers with ES6+ support

### File Structure
- `main.js` - Core module initialization and API
- `chat.js` - Chat message handling and button interactions
- `config.js` - Configuration dialog (ApplicationV2)
- `selector.js` - Set selection interface (ApplicationV2)
- `lang/en.json` - Localization strings

### Data Storage
Button sets are stored in world settings as JSON arrays. Each set contains:
- `name`: Display name for the set
- `buttons`: Array of button objects with `label` and `command` properties

### Security
- HTML content is properly escaped to prevent XSS
- Commands are validated before execution
- User permissions are respected for configuration access

## Troubleshooting

### Buttons Not Working
- Ensure GURPS system is active and loaded
- Check that button commands use valid GURPS syntax
- Verify a character is selected or token is controlled

### Configuration Not Saving
- Confirm you have GM permissions
- Check browser console for JavaScript errors
- Try refreshing and reconfiguring

### Missing Default Sets
Use the API to reload defaults:
```javascript
game.rollForMe.forceLoadDefaults();
```

## Contributing

This module uses FoundryVTT's ApplicationV2 framework for modern, responsive interfaces. When contributing:

1. Follow existing code style and documentation patterns
2. Test with multiple GURPS character types
3. Ensure compatibility with core GURPS system features
4. Update documentation for new features

## License

This module is provided under the MIT License. See the repository for full license details.

## Support

For issues, feature requests, or questions:
- GitHub Issues: Use the repository issue tracker
- Discord: Contact @boifuba
- FoundryVTT Community: GURPS channels

---

**Version**: 0.5.8  
**Author**: Boifubá  
**System**: GURPS for FoundryVTT