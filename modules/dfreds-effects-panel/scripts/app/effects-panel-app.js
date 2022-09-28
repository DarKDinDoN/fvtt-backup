import Constants from '../constants.js';
import Settings from '../settings.js';

/**
 * Application class for handling the UI of the effects panel
 */
export default class EffectsPanelApp extends Application {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      popOut: false,
      template: 'modules/dfreds-effects-panel/templates/effects-panel.html',
    });
  }

  /**
   * Initializes the application and its dependencies
   */
  constructor() {
    super();
    this._settings = new Settings();
    /**
     * Debounce and slightly delayed request to re-render this panel. Necessary for situations where it is not possible
     * to properly wait for promises to resolve before refreshing the UI.
     */
    this.refresh = foundry.utils.debounce(this.render.bind(this), 100);
  }

  /** @override */
  getData(options) {
    const data = {
      ...super.getData(options),
      effects: [],
    };
    const actor = this._actor;

    if (!actor) return data;

    const effects = actor.effects
      .map((effect) => {
        const effectData = effect.clone({}, { keepId: true }).data;
        effectData.remainingSeconds = this._getSecondsRemaining(
          effectData.duration
        );
        effectData.turns = effectData.duration.turns;
        effectData.isTemporary = effect.isTemporary;
        effectData.isExpired = effectData.remainingSeconds < 0;
        return effectData;
      })
      .sort((a, b) => {
        if (a.isTemporary) return -1;
        if (b.isTemporary) return 1;
        return 0;
      })
      .filter((effectData) => {
        return (
          this._settings.showPassiveEffects || effectData.document.isTemporary
        );
      });

    data.enabledEffects = effects.filter((effectData) => !effectData.disabled);
    data.disabledEffects = effects.filter((effectData) => effectData.disabled);

    return data;
  }

  /** @override */
  activateListeners($html) {
    super.activateListeners($html);

    const $icons = $html.find('div[data-effect-id]');
    $icons.on('contextmenu', this._onIconRightClick.bind(this));
    $icons.on('click', this._onIconClick.bind(this));
    $icons.on('dblclick', this._onIconDoubleClick.bind(this));
  }

  /**
   * Handles when the sidebar expands
   */
  handleExpand() {
    this.element.animate({ right: '310px' }, 150, () => {
      this.element.css({ right: '' });
    });
  }

  /**
   * Handles when the sidebar collapses
   */
  handleCollapse() {
    this.element.delay(250).animate({ right: '50px' }, 150);
  }

  /** @inheritdoc */
  async _render(force = false, options = {}) {
    await super._render(force, options);
    if (ui.sidebar._collapsed) {
      this.element.css('right', '50px');
    }
  }

  // TODO consider handling rounds/seconds/turns based on whatever is defined for the effect rather than do conversions
  _getSecondsRemaining(duration) {
    if (duration.seconds || duration.rounds) {
      const seconds =
        duration.seconds ?? duration.rounds * (CONFIG.time?.roundTime ?? 6);
      return duration.startTime + seconds - game.time.worldTime;
    } else {
      return Infinity;
    }
  }

  async _onIconRightClick(event) {
    const $target = $(event.currentTarget);
    const actor = this._actor;
    const effect = actor?.effects.get($target.attr('data-effect-id') ?? '');

    if (!effect) return;

    const isEffectTemporary = effect.isTemporary;
    if (isEffectTemporary) {
      const shouldDisable =
        this._settings.temporaryEffectsRightClickBehavior ===
        Constants.RIGHT_CLICK_BEHAVIOR.DISABLE;
      await this._handleEffectChange(effect, shouldDisable);
    } else {
      const shouldDisable =
        this._settings.passiveEffectsRightClickBehavior ===
        Constants.RIGHT_CLICK_BEHAVIOR.DISABLE;
      await this._handleEffectChange(effect, shouldDisable);
    }
  }

  async _handleEffectChange(effect, shouldDisable) {
    if (shouldDisable) {
      return effect.update({ disabled: !effect.data.disabled });
    } else {
      // return this._deleteEffect(effect);
      await effect.delete();
      this.refresh();
    }
  }

  async _deleteEffect(effect) {
    return Dialog.confirm({
      title: 'Delete Effect',
      content: `<h4>Delete ${effect.data.label}?</h4>`,
      yes: async () => {
        await effect.delete();
        this.refresh();
      },
    });
  }

  async _onIconClick(event) {
    if (game.modules.get('combat-utility-belt').active && game.settings.get('combat-utility-belt', 'enableEnhancedConditions')) {
      const $target = $(event.currentTarget);
      const actor = this._actor;
      const effect = actor?.effects.get($target.attr('data-effect-id') ?? '');
      const cubCondition = game.cub.getCondition(effect.data.label)

      if (cubCondition?.referenceId && cubCondition.referenceId !== '') {
        if (cubCondition.referenceId.toLowerCase().startsWith('@compendium')) {
          const match = cubCondition.referenceId.match(/^@compendium\[(.+\..+)\.(.+)\]({.+})?$/i)
          const pack = game.packs.get(match[1]);
          const entry = await pack.getDocument(match[2]);
          if (entry) entry.sheet.render(true);
        } else if (cubCondition.referenceId.toLowerCase().startsWith('@journalentry')) {
          const match = cubCondition.referenceId.match(/^@journalentry\[(.+)\]{.+}$/i)
          console.warn(cubCondition.referenceId)
          console.warn(match)
          const entry = await game.journal.get(match[1]);
          if (entry) entry.sheet.render(true);
        }
      }
    }
  }

  _onIconDoubleClick(event) {
    if (!game.user.isGM) return

    const $target = $(event.currentTarget);
    const actor = this._actor;
    const effect = actor?.effects.get($target.attr('data-effect-id') ?? '');

    if (!effect) return;

    effect.sheet.render(true);
  }

  get _actor() {
    return canvas.tokens.controlled[0]?.actor ?? game.user?.character ?? null;
  }
}
