import { SYSTEM_NAME } from "./constants.js";
export default class Shadowrun6Combat extends Combat {
    /**
     * Define how the array of Combatants is sorted in the displayed list of the tracker.
     * This method can be overridden by a system or module which needs to display combatants in an alternative order.
     * By default sort by initiative, next falling back to name, lastly tie-breaking by combatant id.
     * @private
     */
    _sortCombatants(a, b) {
        console.log("_sortCombatants", a, b);
        let ia = Number.isNumeric(a.initiative) ? a.initiative : -9999;
        let ib = Number.isNumeric(b.initiative) ? b.initiative : -9999;
        if (!ia)
            ia = 0;
        if (!ib)
            ib = 0;
        let ci = ib - ia;
        if (ci !== 0)
            return Number(ci);
        let cn = a.name.localeCompare(b.name);
        if (cn !== 0)
            return cn;
        return 0;
    }
    getMaxEdgeGain(actor) {
        let max = game.settings.get(SYSTEM_NAME, "maxEdgePerRound");
        // If no combat started, max gain is always setting max
        if (!this.started) {
            console.log("getMaxEdgeGain: Combat not yet started - allow max");
            return max;
        }
        let comb = this.getCombatantByActor(actor.data._id);
        if (comb) {
            max -= Math.max(0, comb.edgeGained);
        }
        console.log("getMaxEdgeGain " + comb.name + " has already gained " + comb.edgeGained + " Edge which leaves " + max + " to gain");
        return max;
    }
    /** Begin the combat encounter, advancing to round 1 and turn 1 */
    startCombat() {
        console.log("startCombat");
        this.combatants.forEach((comb) => {
            let c6 = comb;
            c6.edgeGained = 0;
        });
        return super.startCombat();
    }
    /** Advance the combat to the next turn */
    nextRound() {
        console.log("nextRound");
        this.combatants.forEach((comb) => {
            let c6 = comb;
            c6.edgeGained = 0;
        });
        return super.nextRound();
    }
}
//# sourceMappingURL=Shadowrun6Combat.js.map