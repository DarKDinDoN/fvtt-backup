export class MagicOrResonanceDefinition {
    magic;
    resonance;
    useSpells;
    usePowers;
    constructor(magic = false, resonance = false, useSpells = false, usePowers = false) {
        this.magic = magic;
        this.resonance = resonance;
        this.useSpells = useSpells;
        this.usePowers = usePowers;
    }
}
export class SkillDefinition {
    attrib;
    useUntrained;
    constructor(attribute, useUntrained) {
        this.attrib = attribute;
        this.useUntrained = useUntrained;
    }
}
export class EdgeBoost {
    cost;
    id;
    when;
    constructor(cost, id, when) {
        this.cost = cost;
        this.id = id;
        this.when = when;
    }
}
export class EdgeAction {
    cost;
    id;
    cat;
    skill;
    constructor(cost, id, cat, skill = "") {
        this.cost = cost;
        this.id = id;
        this.cat = cat;
        this.skill = skill;
    }
}
export class MatrixAction {
    id;
    skill;
    spec;
    attrib;
    illegal;
    major;
    outsider;
    user;
    admin;
    opposedAttr1;
    opposedAttr2;
    threshold;
    constructor(id, skill, spec, attrib, illegal, major, outsider, user, admin, attr1, attr2, threshold = 0) {
        this.id = id;
        this.skill = skill;
        this.spec = spec;
        this.attrib = attrib;
        this.illegal = illegal;
        this.major = major;
        this.outsider = outsider;
        this.user = user;
        this.admin = admin;
        this.opposedAttr1 = attr1;
        this.opposedAttr2 = attr2;
        this.threshold = threshold;
    }
}
export class Program {
    id;
    type;
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
}
//# sourceMappingURL=DefinitionTypes.js.map