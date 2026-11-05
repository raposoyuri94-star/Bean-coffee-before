import { createOrderCatalog } from '../order.ts'
import type { MenuProduct } from '../order.ts'

// Prices are numbers in MT. Keep each id unchanged when editing a dish.
type MenuGroup = { name: string; items: MenuProduct[] }
type MenuCategory = { id: string; name: string; items?: MenuProduct[]; groups?: MenuGroup[] }

export const menuCategories: MenuCategory[] = [
  {
    id: 'pequeno-almoco',
    name: 'Pequeno-almoço',
    groups: [
      {
        name: 'Healthy toast',
        items: [
          {
            id: 'tostas-de-abacate',
            name: 'Tostas de abacate',
            description: 'Pão multigrãos tostado, abacate e rúcula',
            price: 430,
          },
          {
            id: 'tostas-de-abacate-e-ovos-de-codorniz',
            name: 'Tostas de abacate e ovos de codorniz',
            description: 'Pão multigrãos tostado, abacate, ovos de codorniz escalfados e rúcula',
            price: 530,
          },
          {
            id: 'tostas-de-abacate-e-frango',
            name: 'Tostas de abacate e frango',
            description: 'Pão multigrãos tostado, abacate, peito de frango, molho de iogurte e rúcula',
            price: 600,
          },
          {
            id: 'tostas-de-salmao-fumado-e-queijo-cottage',
            name: 'Tostas de salmão fumado e queijo cottage',
            description: 'Pão integral tostado, queijo cottage, salmão fumado e rúcula',
            price: 850,
          },
          {
            id: 'tostas-de-salmao-fumado-e-abacate',
            name: 'Tostas de salmão fumado e abacate',
            description: 'Pão integral tostado, abacate, salmão fumado e rúcula',
            price: 850,
          },
          { id: 'extra-ovo-escalfado', name: 'Extra ovo escalfado', description: '', price: 130 },
        ],
      },
      {
        name: 'Toasties e mais!',
        items: [
          {
            id: 'bean-grilled-cheese',
            name: 'Bean grilled cheese',
            description:
              'Pão caseiro tostado, cheddar branco, cheddar amarelo, parmesão, cebola caramelizada e tomate',
            price: 500,
          },
          {
            id: 'bean-grilled-cheese-com-chourico',
            name: 'Bean grilled cheese com chouriço',
            description:
              'Pão caseiro tostado, chouriço, cheddar branco, cheddar amarelo, parmesão, cebola caramelizada e tomate',
            price: 600,
          },
          {
            id: 'bean-tosta-mista',
            name: 'Bean tosta mista',
            description:
              'Pão caseiro tostado, fiambre e cheddar branco. Opção halal disponível com mortadela de peru.',
            price: 530,
          },
          {
            id: 'croissant-com-omelete',
            name: 'Croissant com omelete',
            description: 'Croissant francês com recheio de omelete e rúcula',
            price: 370,
          },
          {
            id: 'croissant-misto',
            name: 'Croissant misto',
            description:
              'Croissant francês com recheio de fiambre, queijo cheddar, tomate e rúcula. Pode ser servido prensado. Opção halal disponível com mortadela de peru.',
            price: 440,
          },
          {
            id: 'sandes-mista',
            name: 'Sandes mista',
            description:
              'Bola de avó com recheio de fiambre, queijo cheddar, tomate e alface. Opção halal disponível com mortadela de peru.',
            price: 250,
          },
          {
            id: 'sandes-caprese',
            name: 'Sandes caprese',
            description:
              'Bola de avó com recheio de peito de frango, molho pesto, tomate e mozzarella. Contém alho e castanha.',
            price: 350,
          },
          {
            id: 'prego-bean',
            name: 'Prego Bean',
            description:
              'O prego à maneira Bean! Filete de boi temperado, servido em pão de hot dog com molho de mostarda e vinho branco',
            price: 570,
          },
          { id: 'extra-chips-de-batata', name: 'Extra chips de batata', description: '', price: 80 },
        ],
      },
      {
        name: 'Egg lovers',
        items: [
          {
            id: 'french-omelete',
            name: 'French omelete',
            description: 'Omelete francesa simples',
            price: 350,
          },
          {
            id: 'omelete-de-vegetais',
            name: 'Omelete de vegetais',
            description: 'Omelete francesa com tomate, espinafre e feta',
            price: 450,
          },
          {
            id: 'omelete-mista',
            name: 'Omelete mista',
            description:
              'Omelete francesa com fiambre, cheddar branco e parmesão. Opção halal disponível com mortadela de peru.',
            price: 470,
          },
          {
            id: 'omelete-de-chourico-e-parmesao',
            name: 'Omelete de chouriço e parmesão',
            description: 'Omelete francesa com chouriço, cheddar branco e parmesão',
            price: 470,
          },
        ],
      },
      {
        name: 'Sweet',
        items: [
          {
            id: 'granola-bowl',
            name: 'Granola bowl',
            description:
              'Granola, iogurte double cream e frutas vermelhas. Contém amendoim e castanha de caju.',
            price: 550,
          },
          { id: 'croissant-frances', name: 'Croissant francês', description: '', price: 170 },
          {
            id: 'croissant-paris',
            name: 'Croissant Paris',
            description: 'Croissant francês, geleia de morango e manteiga',
            price: 300,
          },
          {
            id: 'crepes-suzette',
            name: 'Crêpes Suzette',
            description: 'Crêpes franceses com molho de laranja e manteiga',
            price: 450,
          },
          {
            id: 'crepes-de-nutella',
            name: 'Crêpes de Nutella',
            description: 'Crêpes franceses com recheio de Nutella',
            price: 450,
          },
          {
            id: 'salada-de-fruta',
            name: 'Salada de fruta',
            description: 'Maçã, banana, papaia, laranja, hortelã e mel',
            price: 400,
          },
          { id: 'banana-bread', name: 'Banana bread', description: 'Bolo de banana tostado', price: 250 },
          {
            id: 'brownie-bean',
            name: 'Brownie Bean',
            description: 'O verdadeiro brownie de chocolate duplo! Contém castanha de caju.',
            price: 280,
          },
          {
            id: 'tarte-de-limao',
            name: 'Tarte de limão',
            description: 'Tarte de limão francesa',
            price: 350,
          },
          {
            id: 'bolo-fundente-de-chocolate',
            name: 'Bolo fundente de chocolate',
            description: '',
            price: 400,
          },
          {
            id: 'mini-bolos',
            name: 'Mini bolos',
            description: 'Mini muffin de chocolate e manteiga de amendoim',
            price: 100,
          },
          { id: 'cookies', name: 'Cookies', description: 'Cookies com chocolate 70% de cacau', price: 100 },
          {
            id: 'healthy-apple-cake',
            name: 'Healthy apple cake',
            description: 'Bolo de maçã saudável',
            price: 250,
          },
          {
            id: 'cake-de-limao',
            name: 'Cake de limão',
            description: 'Bolo de limão servido com queijo creme',
            price: 300,
          },
        ],
      },
    ],
  },
  {
    id: 'almoco',
    name: 'Almoço',
    groups: [
      {
        name: 'Entradas',
        items: [
          {
            id: 'ceviche-de-atum',
            name: 'Ceviche de atum',
            description:
              'Atum cru temperado em molho de azeite e limão, leite de coco, abacate, pepino, cenoura e ervas frescas',
            price: 750,
          },
          {
            id: 'salada-de-caranguejo',
            name: 'Salada de caranguejo',
            description:
              'Caranguejo desfiado, molho de leite de coco, azeite e limão, abacate, pepino e ervas frescas',
            price: 750,
          },
          {
            id: 'guacamole',
            name: 'Guacamole',
            description: 'Puré de abacate com temperos, nachos, palitos de cenoura e pepino',
            price: 400,
          },
          {
            id: 'humus',
            name: 'Húmus',
            description: 'Pasta de grão-de-bico, tostas de pão árabe, palitos de pepino e cenoura',
            price: 400,
          },
        ],
      },
      {
        name: 'Saladas keto',
        items: [
          {
            id: 'salada-de-salmao-fumado',
            name: 'Salada de salmão fumado',
            description:
              'Salada de alface e rúcula, salmão fumado, abacate, tomate, pepino, molho de vinagre balsâmico e azeite',
            price: 900,
          },
          {
            id: 'salada-de-frango',
            name: 'Salada de frango',
            description:
              'Salada de alface e rúcula, peito de frango, ovo cozido malpassado, abacate, tomate, pepino, molho vinagrete, molho de iogurte e sementes',
            price: 700,
          },
          {
            id: 'salada-de-vegetais-com-humus-ou-feta',
            name: 'Salada de vegetais com húmus ou feta',
            description:
              'Salada de alface e rúcula, abóbora assada, tomate-cereja assado, abacate, tomate, pepino, molho vinagrete, sementes e escolha de húmus ou feta',
            price: 700,
          },
        ],
      },
      {
        name: 'Bread',
        items: [
          {
            id: 'chicken-ole-ole',
            name: 'Chicken olé olé',
            description:
              'Pão pita tostado e recheado com peito de frango, salada de tomate e pepino, molho de iogurte, pimento assado, cebola caramelizada, abacate e ervas frescas',
            price: 750,
          },
          {
            id: 'vegan-luckystar',
            name: 'Vegan Luckystar',
            description:
              'Pão pita tostado recheado com abóbora assada, pimento assado, tomate-cereja assado, húmus, rúcula e cebola caramelizada',
            price: 700,
          },
        ],
      },
      {
        name: 'Nourishing bowls',
        items: [
          {
            id: 'tuna-poke-bowl',
            name: 'Tuna poke bowl',
            description:
              'Sushi bowl composto de atum cru, arroz branco, pepino, abacate, algas e molho de soja',
            price: 900,
          },
          {
            id: 'crab-poke-bowl',
            name: 'Crab poke bowl',
            description:
              'Sushi bowl composto de caranguejo desfiado, arroz branco, pepino, abacate, papaia, algas e molho de soja',
            price: 900,
          },
          {
            id: 'chicken-pasta-salad',
            name: 'Chicken pasta salad',
            description:
              'Salada fria de massa orzo (massa grega), peito de frango, molho pesto (contém alho e castanha de caju), tomate, pimento assado, feta e azeitonas',
            price: 760,
          },
          {
            id: 'salada-balinesa-de-frango',
            name: 'Salada balinesa de frango',
            description:
              'Salada de massa de arroz e peito de frango desfiado, raspa de cenoura, molho de limão e coentro. Contém óleo de coco.',
            price: 700,
          },
          {
            id: 'salada-balinesa-de-caranguejo',
            name: 'Salada balinesa de caranguejo',
            description:
              'Salada de massa de arroz e caranguejo, raspa de cenoura, molho de limão e coentro. Contém óleo de coco.',
            price: 900,
          },
          {
            id: 'ole-bowl',
            name: 'Olé bowl',
            description:
              'Bowl composto de peito de frango, arroz branco, salada de tomate, pimento assado, abacate e crème fraîche',
            price: 700,
          },
          {
            id: 'quinoa-bowl',
            name: 'Quinoa bowl',
            description: 'Salada de quinoa, tomate, pepino, ervas frescas, húmus de pimento assado e rúcula',
            price: 760,
          },
          {
            id: 'mil-folhas-de-lentilhas',
            name: 'Mil-folhas de lentilhas',
            description: 'Salada de lentilhas, tomate e abacate, tostas de batata-doce e creme de queijo',
            price: 670,
          },
        ],
      },
      {
        name: 'Sugestão de tapas',
        items: [
          {
            id: 'nachos-de-atum',
            name: 'Nachos de atum',
            description: 'Chips de tortilha com topping de tártaro de atum asiático e abacate',
            price: 750,
          },
          {
            id: 'nachos-de-caranguejo',
            name: 'Nachos de caranguejo',
            description: 'Chips de tortilha com topping de caranguejo desfiado e abacate',
            price: 750,
          },
          {
            id: 'salmon-bites',
            name: 'Salmon bites',
            description: 'Mini torradas de salmão fumado e queijo cottage (5 peças)',
            price: 750,
          },
          {
            id: 'presunto-e-torradas',
            name: 'Presunto e torradas',
            description: 'Presunto fatiado acompanhado de torradas de pão e puré de tomate. Contém alho.',
            price: 500,
          },
          {
            id: 'tacos-de-frango',
            name: 'Tacos de frango',
            description:
              'Cestinho com recheio de frango desfiado, pimento assado, abacate, tomate, cebola caramelizada e molho de iogurte (4 peças)',
            price: 500,
          },
          {
            id: 'humus',
            name: 'Húmus',
            description: 'Pasta de grão-de-bico, tostas de pão árabe, palitos de pepino e cenoura',
            price: 400,
          },
          {
            id: 'guacamole',
            name: 'Guacamole',
            description: 'Puré de abacate com temperos, nachos, palitos de cenoura e pepino',
            price: 400,
          },
        ],
      },
    ],
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    groups: [
      {
        name: 'Café',
        items: [
          { id: 'americano', name: 'Americano', description: 'Expresso duplo com água quente', price: 200 },
          {
            id: 'hot-chocolate',
            name: 'Hot chocolate',
            description: 'chocolate preto com creme de leite e chantilly',
            price: 200,
          },
          { id: 'expresso', name: 'Expresso', description: 'Blend Brasil/Uganda 100% arábica', price: 260 },
          {
            id: 'expresso-descafeinado',
            name: 'Expresso descafeinado',
            description: 'Opção sem cafeína',
            price: 130,
          },
          {
            id: 'cappuccino',
            name: 'Cappuccino',
            description: 'Expresso duplo com 1/2 creme de leite',
            price: 250,
          },
          {
            id: 'macchiato',
            name: 'Macchiato',
            description: 'Expresso simples com creme de leite',
            price: 150,
          },
          {
            id: 'flat-white',
            name: 'Flat white',
            description: 'Expresso duplo com 1/3 creme de leite',
            price: 190,
          },
          {
            id: 'cafe-latte',
            name: 'Café latte',
            description: 'Expresso simples com creme de leite',
            price: 250,
          },
        ],
      },
      {
        name: 'Chá natural',
        items: [
          { id: 'balacate', name: 'Balacate', description: '', price: 180 },
          { id: 'menta', name: 'Menta', description: '', price: 180 },
          { id: 'matcha', name: 'Matcha', description: '', price: 200 },
          { id: 'ginger', name: 'Ginger', description: '', price: 200 },
        ],
      },
      {
        name: 'Chá de saqueta',
        items: [
          { id: 'rooibos', name: 'Rooibos', description: '', price: 120 },
          { id: 'verde', name: 'Verde', description: '', price: 180 },
          { id: 'frutos-vermelhos', name: 'Frutos vermelhos', description: '', price: 200 },
        ],
      },
      {
        name: 'Bebidas frias',
        items: [
          { id: 'agua-pequena', name: 'Água pequena', description: '', price: 100 },
          { id: 'agua-das-pedras', name: 'Água das pedras', description: '', price: 150 },
          {
            id: 'agua-das-pedras-sabores',
            name: 'Água das pedras',
            description: 'Tangerina, frutos vermelhos, limão',
            price: 150,
          },
        ],
      },
      {
        name: 'Soft drinks',
        items: [
          { id: 'tonica-zero', name: 'Tónica zero', description: '', price: 100 },
          { id: 'sprite-zero', name: 'Sprite zero', description: '', price: 120 },
          { id: 'coca-cola-zero', name: 'Coca-Cola Zero', description: '', price: 120 },
        ],
      },
    ],
  },
]

export const orderCatalog = createOrderCatalog(
  menuCategories.flatMap((category) =>
    category.groups ? category.groups.flatMap((group) => group.items) : (category.items ?? [])
  )
)
