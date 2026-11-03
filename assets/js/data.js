/* ============================================================
   បន្លា · BONLA — store data
   Edit this file to change shop details, products and prices.
   Khmer copy for the static page lives in index.html; English
   translations for it live in `en` below (same data-i18n keys).
   ============================================================ */
window.BONLA = {
  config: {
    shopName: { km: 'បន្លា', en: 'Bonla' },
    // Order channels. Leave empty to hide. Set at least one to receive orders:
    telegram: '',   // Telegram username without @, e.g. 'bonla_durian' → orders open a chat with it
    phone: '',      // e.g. '+855 12 345 678' → shown in Contact; orders fall back to SMS
    usdRate: 4100                        // riel per US dollar, for the ≈ USD hint
  },

  zones: [
    { id: 'pp',     fee: 5000,  name: { km: 'ភ្នំពេញ', en: 'Phnom Penh' },      eta: { km: 'ដល់ក្នុងថ្ងៃតែមួយ ពេលកុម្ម៉ង់មុនម៉ោង ១២ ថ្ងៃត្រង់', en: 'Same day when ordered before noon' } },
    { id: 'kampot', fee: 0,     name: { km: 'កំពត និងកែប', en: 'Kampot & Kep' }, eta: { km: 'ដឹកឥតគិតថ្លៃ ក្នុងថ្ងៃតែមួយ', en: 'Free, same day' } },
    { id: 'prov',   fee: 10000, name: { km: 'ខេត្តផ្សេងៗ', en: 'Other provinces' }, eta: { km: '១ ដល់ ២ ថ្ងៃ តាមឡានដឹកអីវ៉ាន់', en: '1 to 2 days by bus parcel' } }
  ],

  when: [
    { id: 'asap', km: 'ឆាប់បំផុត ថ្ងៃនេះ', en: 'As soon as possible today' },
    { id: 'am',   km: 'ព្រឹកស្អែក', en: 'Tomorrow morning' },
    { id: 'pm',   km: 'រសៀលស្អែក', en: 'Tomorrow afternoon' }
  ],

  tags: {
    creamy:      { km: 'ខ្លាញ់ស្រទន់', en: 'Creamy' },
    bittersweet: { km: 'ផ្អែមល្វីង', en: 'Bittersweet' },
    fragrant:    { km: 'ក្លិនក្រអូប', en: 'Fragrant' },
    sweet:       { km: 'ផ្អែមខ្លាំង', en: 'Very sweet' },
    thick:       { km: 'សាច់ក្រាស់', en: 'Thick flesh' },
    mild:        { km: 'ក្លិនស្រាល', en: 'Mild smell' },
    firm:        { km: 'សាច់រឹងល្មម', en: 'Firm' },
    ready:       { km: 'ញ៉ាំភ្លាម', en: 'Ready to eat' },
    coconut:     { km: 'ខ្ទិះដូង', en: 'Coconut cream' }
  },

  /* sweet / aroma / texture are 1–5 (texture: 1 = custard-soft, 5 = firm).
     price is in riel per unit. `photo` is a file prefix in assets/photos
     (each needs a -480.webp and -900.webp). Prices are placeholders. */
  products: [
    {
      id: 'kampot', kind: 'fruit', seasonal: true,
      keep: { km: 'ទុកផ្លែទាំងមូលនៅសីតុណ្ហភាពបន្ទប់ ហើយញ៉ាំក្នុងរយៈពេល ២ ទៅ ៣ ថ្ងៃ។ សាច់ដែលពុះហើយ ដាក់ក្នុងប្រអប់បិទជិត ហើយទុកក្នុងទូទឹកកកបានរហូតដល់ ៣ ថ្ងៃ។', en: 'Keep the whole fruit at room temperature and eat it within 2 to 3 days. Once opened, store the flesh in a sealed box in the fridge for up to 3 days.' },
      unit: 'kg', price: 45000, photo: 'kampot', ratio: [800, 534],
      name: { km: 'ទុរេនកំពត ពូជដើម', en: 'Kampot Heirloom' },
      origin: { km: 'កំពត', en: 'Kampot' },
      badge: { km: 'ពិសេស', en: 'Signature' },
      desc: {
        km: 'ពូជដើមរបស់កំពត។ សាច់ខ្លាញ់ទន់ រសផ្អែមល្វីងបន្តិច និងក្លិនក្រអូបខ្លាំង។',
        en: "Kampot's own seedling durian. Soft, rich flesh with a gentle bitter edge and a bold aroma."
      },
      tags: ['creamy', 'bittersweet', 'fragrant'],
      sweet: 3, aroma: 5, texture: 1
    },
    {
      id: 'monthong', kind: 'fruit', seasonal: true,
      keep: { km: 'ទុកផ្លែទាំងមូលនៅសីតុណ្ហភាពបន្ទប់ ហើយញ៉ាំក្នុងរយៈពេល ២ ទៅ ៣ ថ្ងៃ។ សាច់ដែលពុះហើយ ដាក់ក្នុងប្រអប់បិទជិត ហើយទុកក្នុងទូទឹកកកបានរហូតដល់ ៣ ថ្ងៃ។', en: 'Keep the whole fruit at room temperature and eat it within 2 to 3 days. Once opened, store the flesh in a sealed box in the fridge for up to 3 days.' },
      unit: 'kg', price: 35000, photo: 'monthong', ratio: [858, 498],
      name: { km: 'ម៉ុនថង', en: 'Monthong' },
      origin: { km: 'កំពត', en: 'Kampot' },
      desc: {
        km: 'សាច់ក្រាស់ គ្រាប់តូច ផ្អែមខ្លាំង ក្លិនស្រាល។ ល្អសម្រាប់អ្នកទើបចាប់ផ្តើមញ៉ាំ។',
        en: 'Thick flesh, small seeds, very sweet with a mild smell. A good first durian.'
      },
      tags: ['sweet', 'thick', 'mild'],
      sweet: 5, aroma: 2, texture: 4
    },
    {
      id: 'chanee', kind: 'fruit', seasonal: true,
      keep: { km: 'ទុកផ្លែទាំងមូលនៅសីតុណ្ហភាពបន្ទប់ ហើយញ៉ាំក្នុងរយៈពេល ២ ទៅ ៣ ថ្ងៃ។ សាច់ដែលពុះហើយ ដាក់ក្នុងប្រអប់បិទជិត ហើយទុកក្នុងទូទឹកកកបានរហូតដល់ ៣ ថ្ងៃ។', en: 'Keep the whole fruit at room temperature and eat it within 2 to 3 days. Once opened, store the flesh in a sealed box in the fridge for up to 3 days.' },
      unit: 'kg', price: 40000, photo: 'chanee', ratio: [800, 600],
      name: { km: 'ឆានី', en: 'Chanee' },
      origin: { km: 'កំពត', en: 'Kampot' },
      desc: {
        km: 'សាច់ពណ៌លឿងទុំ ទន់រលោង ផ្អែមខ្លាំង និងក្លិនក្រអូបពេញមាត់។',
        en: 'Deep golden flesh, smooth and soft, very sweet with a full aroma.'
      },
      tags: ['creamy', 'sweet', 'fragrant'],
      sweet: 4, aroma: 4, texture: 2
    },
    {
      id: 'kanyao', kind: 'fruit', seasonal: true,
      keep: { km: 'ទុកផ្លែទាំងមូលនៅសីតុណ្ហភាពបន្ទប់ ហើយញ៉ាំក្នុងរយៈពេល ២ ទៅ ៣ ថ្ងៃ។ សាច់ដែលពុះហើយ ដាក់ក្នុងប្រអប់បិទជិត ហើយទុកក្នុងទូទឹកកកបានរហូតដល់ ៣ ថ្ងៃ។', en: 'Keep the whole fruit at room temperature and eat it within 2 to 3 days. Once opened, store the flesh in a sealed box in the fridge for up to 3 days.' },
      unit: 'kg', price: 55000, photo: 'kanyao', ratio: [640, 600],
      name: { km: 'កានយ៉ាវ', en: 'Kan Yao' },
      origin: { km: 'កំពត', en: 'Kampot' },
      badge: { km: 'កម្រ', en: 'Rare' },
      desc: {
        km: 'ពូជទងវែង កម្ររក។ សាច់ក្រាស់ស្ងួតល្មម រសផ្អែមជ្រៅ និងក្លិនមិនខ្លាំងពេក។',
        en: 'A rare long-stemmed variety. Dense, slightly dry flesh with deep sweetness and a moderate aroma.'
      },
      tags: ['thick', 'firm', 'sweet'],
      sweet: 4, aroma: 3, texture: 4
    },
    {
      id: 'pulp', kind: 'treat',
      keep: { km: 'ទុកក្នុងទូកកបានរហូតដល់ ៣ ខែ។ រំលាយក្នុងទូទឹកកកប្រហែល ២ ម៉ោង មុនញ៉ាំ។', en: 'Keeps up to 3 months in the freezer. Thaw in the fridge for about 2 hours before eating.' },
      unit: 'box', price: 30000, photo: 'pulp', ratio: [800, 600],
      name: { km: 'សាច់ទុរេនបកស្រាប់', en: 'Peeled Pulp Box' },
      origin: { km: '៥០០ ក្រាម', en: '500 g' },
      desc: {
        km: 'សាច់ទុរេនកំពតបកស្រាប់ ៥០០ ក្រាម ត្រៀមញ៉ាំភ្លាម។ មានលក់ជាកកពេលក្រៅរដូវ។',
        en: '500 g of peeled Kampot durian, ready to eat. Sold frozen out of season.'
      },
      tags: ['ready', 'creamy'],
      sweet: 3, aroma: 5, texture: 1
    },
    {
      id: 'sticky', kind: 'treat',
      keep: { km: 'ញ៉ាំល្អបំផុតនៅថ្ងៃទទួល។ ទុកក្នុងទូទឹកកកបាន ១ ថ្ងៃ ហើយកំដៅបន្តិចមុនញ៉ាំ។', en: 'Best eaten the day it arrives. Keeps 1 day in the fridge; warm it slightly before eating.' },
      unit: 'box', price: 12000, photo: 'sticky', ratio: [900, 759],
      name: { km: 'បាយដំណើបទុរេន', en: 'Durian Sticky Rice' },
      origin: { km: 'បង្អែមខ្មែរ', en: 'Khmer dessert' },
      desc: {
        km: 'បាយដំណើបចំហុយ ស្រោចទឹកខ្ទិះដូងលាយសាច់ទុរេនកំពត។',
        en: 'Steamed sticky rice under a sauce of coconut cream and Kampot durian.'
      },
      tags: ['coconut', 'ready'],
      sweet: 4, aroma: 3, texture: 2
    }
  ],

  /* 0 = off season, 1 = early/late, 2 = peak. Index 0 = January. */
  season: [0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0, 0],
  months: {
    km: ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'],
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },

  /* Photo credits (Wikimedia Commons). Keep these while you use the photos;
     CC BY / BY-SA licenses require attribution. Replace with your own
     photos any time and remove the matching entries. */
  credits: [
    { use: 'Hero background', artist: 'G.Mannaerts', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Durian_fruit_singapore.jpg' },
    { use: 'Hero, opened durian', artist: 'Yun Huang Yong', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:D101_and_random_stock.jpg' },
    { use: 'Kampot Heirloom', artist: 'Yosri (ms.wikipedia)', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:YosriDis04DurianTerbuka.jpg' },
    { use: 'Monthong', artist: 'Royleeyy', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:D197_-_Durian.jpg' },
    { use: 'Chanee', artist: 'Royleeyy', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:D17_-_Durian.jpg' },
    { use: 'Kan Yao', artist: 'burgermac (Flickr)', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Durian,_le_fruit_qui_pue.jpg' },
    { use: 'Pulp box', artist: 'Royleeyy', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:D1_-_Durian.jpg' },
    { use: 'Sticky rice', artist: 'Taman Renyah', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Ketan_saus_durian.jpg' },
    { use: 'Durian Roundabout, Kampot', artist: 'Marcin Konsek', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:2016_Kampot,_Rondo_duriana_(05).jpg' },
    { use: 'Durian market, Cambodia', artist: 'Dmitry Makeev', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Fruit_of_Cambodia._img_01.jpg' },
    { use: 'Durians on a tree', artist: 'Yun Huang Yong', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Durians_on_a_tree.jpg' },
    { use: 'Durian orchard', artist: 'Sakurai Midori', license: 'Public domain', url: 'https://commons.wikimedia.org/wiki/File:Durian_Kamarung_(Durio_zibethinus).JPG' }
  ],

  /* strings built by script */
  ui: {
    km: {
      add: 'បន្ថែម', added: 'បានដាក់', perkg: '/ គីឡូក្រាម', perbox: '/ ប្រអប់', unitkg: 'គ.ក', unitbox: 'ប្រអប់',
      sweet: 'ផ្អែម', aroma: 'ក្លិន', texture: 'សាច់រឹង',
      best: 'ត្រូវនឹងរសជាតិរបស់អ្នក', also: 'ជម្រើសផ្សេងទៀត',
      now: 'ឥឡូវ', inSeason: 'ឥឡូវជាពេលពេញរដូវ!', edgeSeason: 'ឥឡូវជាដើម ឬចុងរដូវ',
      offSeason: 'ឥឡូវក្រៅរដូវ', offSub: 'សាច់ទុរេនកក និងបាយដំណើបទុរេន នៅតែមានលក់។', inSub: 'ផ្លែស្រស់ៗពីចំការរៀងរាល់ព្រឹក។',
      monthPrefix: 'ខែ',
      free: 'ឥតគិតថ្លៃ', inc: 'បន្ថែមមួយ', dec: 'ដកមួយ', remove: 'ដកចេញ',
      addedToast: '{n} ត្រូវបានដាក់ក្នុងកន្ត្រក', copied: 'បានចម្លងសារបញ្ជាទិញ', copyFail: 'ចម្លងមិនបាន សូមសាកម្តងទៀត',
      needInfo: 'សូមបំពេញឈ្មោះ និងលេខទូរស័ព្ទ', emptyCart: 'សូមដាក់ទុរេនក្នុងកន្ត្រកជាមុនសិន',
      msgHello: 'សួស្តី {shop}! ខ្ញុំចង់បញ្ជាទិញ៖', msgDelivery: 'ដឹកទៅ', msgWhen: 'ពេលទទួល', msgTotal: 'សរុបប្រហាក់ប្រហែល', msgName: 'ឈ្មោះ', msgPhone: 'ទូរស័ព្ទ', msgAddr: 'អាសយដ្ឋាន',
      tg: 'Telegram', phone: 'ទូរស័ព្ទ', photoBy: 'រូបថត', for: 'សម្រាប់',
      toDark: 'ប្តូរទៅពណ៌ងងឹត', toLight: 'ប្តូរទៅពណ៌ភ្លឺ',
      inStock: 'មានក្នុងស្តុក', preorder: 'កុម្ម៉ង់ទុកមុន · រដូវចាប់ផ្តើមខែឧសភា', frozenOk: 'មានលក់ពេញមួយឆ្នាំ', view: 'មើលលម្អិត',
      itemsN: '{n} មុខ', pdAdded: 'បានដាក់ក្នុងកន្ត្រក',
      locAdding: 'កំពុងរកទីតាំង…', locAdded: 'បានភ្ជាប់ទីតាំងរបស់អ្នក', locFail: 'រកទីតាំងមិនបាន សូមសរសេរអាសយដ្ឋាន', msgMap: 'ទីតាំង',
      ordEmpty: 'អ្នកមិនទាន់មានការកុម្ម៉ង់ទេ', ordEmptySub: 'ការកុម្ម៉ង់ដែលអ្នកផ្ញើ នឹងបង្ហាញនៅទីនេះ។', ordBrowse: 'ចាប់ផ្តើមកុម្ម៉ង់',
      ordNo: 'លេខកុម្ម៉ង់', ordSent: 'បានផ្ញើ', ordSaved: 'រក្សាទុក', ordAgain: 'កុម្ម៉ង់ម្តងទៀត', ordDetails: 'ព័ត៌មានការកុម្ម៉ង់', ordAll: 'ការកុម្ម៉ង់ទាំងអស់',
      step1: 'បានរៀបចំការកុម្ម៉ង់', step1d: 'លេខកុម្ម៉ង់ {id} ត្រូវបានរក្សាទុកលើឧបករណ៍របស់អ្នក។',
      step2: 'ផ្ញើទៅហាង', step2d: 'សារកុម្ម៉ង់ត្រូវបានបើកក្នុង {ch}។ សូមចុច “ផ្ញើ” ប្រសិនបើមិនទាន់ផ្ញើ។', step2copy: 'សារកុម្ម៉ង់ត្រូវបានចម្លងទុក។ ហាងនឹងបន្ថែមលេខទំនាក់ទំនងឆាប់ៗ។',
      step3: 'ហាងថ្លឹង និងផ្ញើ KHQR', step3d: 'ហាងនឹងប្រាប់តម្លៃពិត និងផ្ញើ KHQR ឲ្យអ្នកបង់ប្រាក់។',
      step4: 'ដឹកដល់ទ្វារផ្ទះ', step4d: '{zone} · {eta}',
      stepNote: 'ជំហានទី ៣ និងទី ៤ ហាងនឹងជូនដំណឹងអ្នកដោយផ្ទាល់។',
      sendVia: 'ផ្ញើការកុម្ម៉ង់តាម {ch}', sendCopy: 'ចម្លងសារកុម្ម៉ង់', noChannel: 'ហាងមិនទាន់បានភ្ជាប់ Telegram ឬលេខទូរស័ព្ទទេ។ សារកុម្ម៉ង់នឹងត្រូវចម្លងទុក ដើម្បីផ្ញើពេលក្រោយ។',
      sms: 'SMS', dark: 'ពណ៌ងងឹត', contact: 'ទាក់ទង', resend: 'ផ្ញើម្តងទៀត'
    },
    en: {
      add: 'Add', added: 'Added', perkg: '/ kg', perbox: '/ box', unitkg: 'kg', unitbox: 'box',
      sweet: 'Sweet', aroma: 'Aroma', texture: 'Firmness',
      best: 'Your best match', also: 'Also worth trying',
      now: 'Now', inSeason: "It's peak season!", edgeSeason: 'Early or late season',
      offSeason: 'Off season right now', offSub: 'Frozen pulp and durian sticky rice are still available.', inSub: 'Fresh fruit from the orchard every morning.',
      monthPrefix: '',
      free: 'Free', inc: 'Add one', dec: 'Remove one', remove: 'Remove',
      addedToast: '{n} added to your basket', copied: 'Order copied', copyFail: "Couldn't copy. Please try again.",
      needInfo: 'Please add your name and phone number', emptyCart: 'Add a durian to your basket first',
      msgHello: 'Hello {shop}! I would like to order:', msgDelivery: 'Deliver to', msgWhen: 'When', msgTotal: 'Estimated total', msgName: 'Name', msgPhone: 'Phone', msgAddr: 'Address',
      tg: 'Telegram', phone: 'Phone', photoBy: 'Photo', for: 'for',
      toDark: 'Switch to dark mode', toLight: 'Switch to light mode',
      inStock: 'In stock', preorder: 'Pre-order · season starts in May', frozenOk: 'Available all year', view: 'View details',
      itemsN: '{n} items', pdAdded: 'Added to your basket',
      locAdding: 'Finding your location…', locAdded: 'Your location is attached', locFail: "Couldn't get your location. Please type your address.", msgMap: 'Location',
      ordEmpty: 'No orders yet', ordEmptySub: 'Orders you send will show up here.', ordBrowse: 'Start an order',
      ordNo: 'Order no.', ordSent: 'Sent', ordSaved: 'Saved', ordAgain: 'Order again', ordDetails: 'Order details', ordAll: 'All orders',
      step1: 'Order prepared', step1d: 'Order {id} is saved on this device.',
      step2: 'Sent to the shop', step2d: 'Your order opened in {ch}. Tap Send there if you have not yet.', step2copy: 'Your order message was copied. The shop will add its contact details soon.',
      step3: 'Shop weighs it and sends KHQR', step3d: 'The shop confirms the exact price and sends a KHQR code for payment.',
      step4: 'Delivered to your door', step4d: '{zone} · {eta}',
      stepNote: 'The shop will update you directly on steps 3 and 4.',
      sendVia: 'Send order via {ch}', sendCopy: 'Copy order message', noChannel: 'The shop has not connected Telegram or a phone number yet. Your order message will be copied so you can send it later.',
      sms: 'SMS', dark: 'Dark mode', contact: 'Contact', resend: 'Send again'
    }
  },

  /* English for every data-i18n / data-i18n-alt / data-i18n-aria key in index.html */
  en: {
    'a11y.skip': 'Skip to varieties',
    'nav.varieties': 'Varieties', 'nav.finder': 'Flavor finder', 'nav.season': 'Season', 'nav.culture': 'Culture', 'nav.order': 'Order', 'nav.cart': 'Basket',
    'tab.home': 'Home', 'tab.orders': 'Orders', 'tab.cart': 'Basket', 'tab.more': 'More',
    'ui.back': 'Back', 'ui.inc': 'Add one', 'ui.dec': 'Remove one',
    'pd.about': 'About', 'pd.taste': 'Taste profile', 'pd.keep': 'How to keep it', 'pd.similar': 'Similar products', 'pd.add': 'Add to basket',
    'cart.deliver': 'Delivery details', 'cart.addrPh': 'House no., street, sangkat, khan', 'cart.loc': 'Attach my current location', 'cart.checkout': 'Checkout',
    'orders.title': 'My orders',
    'more.title': 'More', 'more.settings': 'Settings', 'more.dark': 'Dark mode', 'more.lang': 'Language', 'more.explore': 'Explore',
    'hero.eyebrow': 'Kampot province · grown by Khmer farmers',
    'hero.title': 'The king of fruits, from Kampot orchards to your door',
    'hero.sub': 'Tree-ripened durian, picked by hand every morning and delivered to Phnom Penh the same day.',
    'hero.cta1': 'Order now', 'hero.cta2': 'Find your flavor',
    'hero.alt': 'An opened durian with ripe golden flesh',
    'hero.cardK': 'From', 'hero.cardU': 'per kilogram',
    'facts.t1': 'Tree-ripened', 'facts.d1': 'Never picked green, no ripening agents',
    'facts.t2': 'Same-day delivery', 'facts.d2': 'Phnom Penh, Kampot and Kep',
    'facts.t3': 'Pay with KHQR', 'facts.d3': 'ABA, ACLEDA or cash on delivery',
    'statement.kicker': 'How we grow',
    'statement.text': 'We wait<span class="ci ci--tree" aria-hidden="true"></span>for every durian to ripen on the tree in Kampot<span class="ci ci--open" aria-hidden="true"></span> <span class="fade">then pick it, pack it and bring it to your hands.</span>',
    'band.alt': 'Piles of durian at a market in Cambodia',
    'band.title': 'From the Khmer market', 'band.sub': 'Hundreds of durians, chosen one by one',
    'band.t1': 'Kampot heirloom', 'band.t2': 'Monthong', 'band.t3': 'Chanee', 'band.t4': 'Kan Yao', 'band.t5': 'Durian sticky rice',
    'var.kicker': 'Varieties', 'var.title': 'Pick the durian that suits your taste',
    'var.all': 'All', 'var.fruit': 'Whole fruit', 'var.treat': 'Pulp & treats',
    'var.note': 'Whole fruit is priced per kilogram. One fruit weighs about 1.5 to 3 kg; we weigh it and confirm the exact price before delivery.',
    'finder.kicker': 'Flavor finder', 'finder.title': "Tell us your taste. We'll find your durian.",
    'finder.sub': 'Slide to set how sweet, fragrant and firm you like it.',
    'finder.sweet': 'Sweetness', 'finder.sweetLo': 'Bittersweet', 'finder.sweetHi': 'Very sweet',
    'finder.aroma': 'Aroma', 'finder.aromaLo': 'Mild', 'finder.aromaHi': 'Bold',
    'finder.texture': 'Texture', 'finder.textureLo': 'Custard-soft', 'finder.textureHi': 'Firm',
    'season.kicker': 'Harvest season', 'season.title': 'Kampot durian comes once a year',
    'season.sub': 'The harvest usually runs from May to July and shifts with the rains.',
    'season.alt': 'Durians hanging on the tree',
    'season.peak': 'Peak season', 'season.edge': 'Early or late season', 'season.off': 'Off season (frozen pulp)',
    'culture.kicker': 'Culture', 'culture.title': 'Durian and Kampot',
    'culture.c1alt': 'The giant durian statue at the Kampot town roundabout',
    'culture.c1t': 'The Durian Roundabout', 'culture.c1d': 'A giant durian statue stands in the center of Kampot town, a landmark that shows how much the province loves this fruit.',
    'culture.c2alt': 'A durian opened in two halves',
    'culture.c2t': 'Opened together', 'culture.c2d': 'Durian is rarely eaten alone. It is opened and shared at roadside stalls or at home with family.',
    'culture.c3alt': 'A durian tree in an orchard',
    'culture.c3t': 'Ripened on the tree', 'culture.c3d': 'Kampot growers let the fruit ripen on the branch, so the flesh turns rich, sweet and fully fragrant.',
    'choose.kicker': 'How to choose', 'choose.title': 'Choose a durian like a market seller',
    'choose.s1t': 'Smell it', 'choose.s1d': 'A strong sweet smell near the stem means the fruit is ripe.',
    'choose.s2t': 'Tap it', 'choose.s2d': 'Tap gently. A slightly hollow sound means soft flesh inside.',
    'choose.s3t': 'Check the stem', 'choose.s3d': 'A fresh stem that is not dry or black means it was picked recently.',
    'choose.s4t': 'Open along the seams', 'choose.s4d': 'Find the seam lines between the thorns, cut in a little, then pull it open by hand.',
    'order.kicker': 'Delivery & payment', 'order.title': 'Order today, eat today', 'order.cta': 'Open basket',
    'order.h1': 'Add durian to your basket', 'order.h2': 'Send your order to the shop',
    'order.h3': 'We weigh it and send you a KHQR code', 'order.h4': 'Fresh durian arrives at your door',
    'order.zones': 'Delivery areas', 'order.pay': 'Payment',
    'order.pay1': 'Scan KHQR (ABA, ACLEDA, Wing)', 'order.pay2': 'Cash on delivery', 'order.contact': 'Contact',
    'footer.about': 'Bonla is a Khmer durian shop bringing tree-ripened Kampot durian from the orchard to your home.',
    'footer.choose': 'How to choose', 'footer.credits': 'Photo credits',
    'footer.legal': '© 2026 Bonla · Made in Cambodia', 'footer.top': 'Back to top ↑',
    'cart.title': 'Your basket', 'cart.close': 'Close', 'cart.empty': 'Your basket is empty', 'cart.browse': 'Browse varieties',
    'cart.zone': 'Delivery area', 'cart.name': 'Name', 'cart.phone': 'Phone number', 'cart.addr': 'Address', 'cart.when': 'Delivery time',
    'cart.subtotal': 'Subtotal (estimate)', 'cart.delivery': 'Delivery', 'cart.total': 'Total amount',
    'cart.note': "We'll weigh your fruit and send the exact price with a KHQR code."
  }
};
