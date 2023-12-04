import { Card } from '../commons/Card'

export const uw_karn_control_text = `6 Plains
4 Hengegate Pathway
4 Hallowed Fountain
4 Seachrome Coast
3 Hall of Storm Giants
2 Adarkar Wastes
2 Field of Ruin
2 Inventors' Fair
1 Otawara, Soaring City
1 Island
4 Thraben Inspector
4 Static Net
4 Karn, the Great Creator
4 Disruption Protocol
4 Portable Hole
4 Jwari Disruption
4 Moonsnare Prototype
4 Reckoner Bankbuster
4 The Birth of Meletis
4 Metallic Rebuke
4 Prophetic Prism
3 The Mightstone and Weakstone
3 Supreme Verdict
1 Mazemind Tome
Sideboard
1 The Mightstone and Weakstone
1 Supreme Verdict
1 Tormod's Crypt
1 Cataclysmic Gearhulk
1 Negate
1 Damping Sphere
1 Glass Casket
1 Yorion, Sky Nomad
1 Lantern of the Lost
1 Unlicensed Hearse
1 The Stone Brain
1 Cityscape Leveler
2 Chrome Host Seedshark
1 Pithing Needle`

export const amalia_walker_text = `4 Tyvar, Jubilant Brawler
4 Chord of Calling
1 Selfless Spirit
1 Melira, the Living Cure
1 Haywire Mite
1 Selfless Savior
1 Dina, Soul Steeper
2 Prosperous Innkeeper
3 Skrelv, Defector Mite
3 Lunarch Veteran
3 Fauna Shaman
3 Cenote Scout
4 Amalia Benavides Aguirre
4 Wildgrowth Walker
4 Gilded Goose
1 Brushland
1 Forest
1 Blooming Marsh
1 Branchloft Pathway
2 Concealed Courtyard
3 Overgrown Tomb
4 Razorverge Thicket
4 Temple Garden
4 Godless Shrine
Sideboard
2 Scavenging Ooze
1 Elite Spellbinder
1 Plaguecrafter
1 Kambal, Consul of Allocation
2 Deep-Cavern Bat
2 Duress
2 Mortality Spear
2 Werefox Bodyguard
1 Yasharn, Implacable Earth
1 Haywire Mite`

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
    if (line === 'Sideboard') {
        return null
    }
    const [count, ...rest] = line.split(' ')
    const name = rest.join(' ')
    return { name, count: parseInt(count) }
  })

  const nullIndex = fullDeckList.indexOf(null);
  const sideboardCards = nullIndex === -1 ? [] : fullDeckList.slice(nullIndex + 1);
  const deckCards = nullIndex === -1 ? fullDeckList : fullDeckList.slice(0, nullIndex);
  const randomType = () => ['Creature', 'Land', 'Artifact', 'Enchantment', 'Instant', 'Sorcery'][Math.floor(Math.random() * 6)]

  const deck = []
  for (const card of deckCards) {
    for (let i = 0; i < card.count; i++) {
      deck.push(new Card(
        card.name,
        randomCost(),
        randomType(),
        "card text",
      ))
    }
  }
  
  const sideboard = []
  for (const card of sideboardCards) {
    for (let i = 0; i < card.count; i++) {
      sideboard.push(new Card(
        card.name,
        randomCost(),
        randomType(),
        "card text",
      ))
    }
  }
  
  return { deck, sideboard }
}