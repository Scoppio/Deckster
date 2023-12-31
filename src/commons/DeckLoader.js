import { Card } from '../commons/Card'

export const uw_shirokai_text = `1 Shorikai, Genesis Engine
1 Adarkar Wastes
1 An Offer You Can't Refuse
1 Ancient Tomb
1 Arcane Signet
1 Aven Mindcensor
1 Blind Obedience
1 Borne Upon a Wind
1 Cephalid Coliseum
1 Chrome Mox
1 City of Brass
1 City of Traitors
1 Command Tower
1 Counterbalance
1 Cyclonic Rift
1 Delay
1 Dig Through Time
1 Displacer Kitten
1 Dramatic Reversal
1 Drannith Magistrate
1 Dress Down
1 Enlightened Tutor
1 Esper Sentinel
1 Fellwar Stone
1 Fierce Guardianship
1 Flooded Strand
1 Flusterstorm
1 Forbidden Orchard
1 Force of Negation
1 Force of Will
1 Gemstone Caverns
1 Grafdigger's Cage
1 Grand Abolisher
1 Grim Monolith
1 Hallowed Fountain
1 Hullbreaker Horror
1 Humility
1 Imposter Mech
1 Intuition
1 Isochron Scepter
1 Jeweled Lotus
1 Long-Term Plans
1 Lotus Petal
1 Mana Confluence
1 Mana Crypt
1 Mana Drain
1 Mana Vault
1 Manifold Key
1 March of Otherworldly Light
1 March of Swirling Mist
1 Marsh Flats
1 Mental Misstep
1 Minamo, School at Water's Edge
1 Mindbreak Trap
1 Mirror of Fate
1 Misty Rainforest
1 Mox Diamond
1 Mox Opal
1 Muddle the Mixture
1 Mystic Remora
1 Mystic Sanctuary
1 Mystical Tutor
1 Oswald Fiddlebender
1 Otawara, Soaring City
1 Out of Time
1 Pact of Negation
1 Phyrexian Metamorph
1 Polluted Delta
1 Portable Hole
1 Ranger-Captain of Eos
1 Rhystic Study
1 Scalding Tarn
1 Sea of Clouds
1 Sevinne's Reclamation
1 Silence
1 Skullclamp
4 Snow-Covered Island
1 Snow-Covered Plains
1 Sol Ring
1 Sonic Screwdriver
1 Soul Partition
1 Step Through
1 Stern Scolding
1 Swan Song
1 Swords to Plowshares
1 Talisman of Progress
1 Teferi, Time Raveler
1 Tezzeret the Seeker
1 Thassa's Oracle
1 The One Ring
1 Transmute Artifact
1 Tundra
1 Unwinding Clock
1 Urza's Saga
1 Vanquish the Horde
1 Whir of Invention
1 Windswept Heath`

export const pirate_blender_text = `1 Dargo, the Shipwrecker
1 Ikra Shidiqi, the Usurper
1 Abrupt Decay
1 Ad Nauseam
1 Altar of Dementia
1 Ancient Tomb
1 Arcane Signet
1 Arid Mesa
1 Assassin's Trophy
1 Autumn's Veil
1 Badlands
1 Bayou
1 Beseech the Mirror
1 Birds of Paradise
1 Birgi, God of Storytelling
1 Birthing Pod
1 Blood Crypt
1 Bloodstained Mire
1 Boseiju, Who Endures
1 Burnt Offering
1 Cabal Ritual
1 Chain of Smog
1 Chrome Mox
1 City of Brass
1 City of Traitors
1 Command Tower
1 Culling Ritual
1 Culling the Weak
1 Dark Ritual
1 Deathrite Shaman
1 Defense Grid
1 Demonic Tutor
1 Diabolic Intent
1 Dockside Extortionist
1 Eldritch Evolution
1 Elves of Deep Shadow
1 Elvish Spirit Guide
1 Fellwar Stone
1 Final Fortune
1 Forbidden Orchard
1 Fyndhorn Elves
1 Gamble
1 Gemstone Caverns
1 Gemstone Mine
1 Gilded Goose
1 Greater Good
1 Grim Monolith
1 Guttural Response
1 Hope of Ghirapur
1 Ignoble Hierarch
1 Imperial Seal
1 Jeweled Lotus
1 Lightning Bolt
1 Lion's Eye Diamond
1 Lotus Petal
1 Luxury Suite
1 Mana Confluence
1 Mana Crypt
1 Mana Vault
1 Marsh Flats
1 Misty Rainforest
1 Mox Diamond
1 Mox Opal
1 Necropotence
1 Noxious Revival
1 Orcish Bowmasters
1 Orcish Lumberjack
1 Overgrown Tomb
1 Pattern of Rebirth
1 Polluted Delta
1 Praetor's Grasp
1 Pyroblast
1 Ragavan, Nimble Pilferer
1 Razaketh, the Foulblooded
1 Reanimate
1 Red Elemental Blast
1 Rite of Flame
1 Sacrifice
1 Scalding Tarn
1 Simian Spirit Guide
1 Sol Ring
1 Stomping Ground
1 Taiga
1 Tainted Pact
1 Talisman of Indulgence
1 Talisman of Resilience
1 The One Ring
1 Tinder Wall
1 Underworld Breach
1 Vampiric Tutor
1 Veil of Summer
1 Verdant Catacombs
1 Wheel of Fortune
1 Windswept Heath
1 Wishclaw Talisman
1 Witherbloom Apprentice
1 Wooded Foothills
1 Worldly Tutor
1 Xantid Swarm
1 Yawgmoth's Will`

function randomCost() {
  const costs = ['w', 'u', 'r', 'b', 'g'];
  const result = [];
  const colorlessCost = Math.floor(Math.random() * 4) + 1; // Generate colorless cost between 1 and 4
  result.push(`{${colorlessCost}}`);

  const colors = Math.floor(Math.random() * 2) + 1; // Generate number of colors (1, 2, or 3)
  for (let i = 0; i < colors; i++) {
    const colorIndex = Math.floor(Math.random() * 4); // Select random index for color
    result.push(`{${costs[colorIndex]}}`);
  }

  return result.join('');
}

export const convertTextToDeck = (text) => {
  const fullDeckList = text.split('\n').map((line) => {
    const [count, ...rest] = line.split(' ')
    const name = rest.join(' ')
    return { name, count: parseInt(count) }
  })

  const randomType = () => ['Creature', 'Land', 'Artifact', 'Enchantment', 'Instant', 'Sorcery'][Math.floor(Math.random() * 6)]
  const commanders = []
  const deck = []
  for (const card of fullDeckList) {
    for (let i = 0; i < card.count; i++) {
      deck.push(new Card(
        card.name,
        randomCost(),
        randomType(),
        "card text",
      ))
    }
  }
  
  return { deck, commanders }
}