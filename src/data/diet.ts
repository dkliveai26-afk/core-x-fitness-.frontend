export interface DietPlate {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
  micronutrients: string[];
}

export interface GlassCardInfo {
  id: string;
  phase: string;
  tag: string;
  title: string;
  description: string;
  macroRatio: string;
  highlight: string;
  timing: string;
}

export const signaturePlates: DietPlate[] = [
  {
    id: 'flame-fish',
    title: 'Herb-Seared Sea Bass',
    category: 'Rapid Amino Influx',
    description: 'Whole flame-grilled sea bass infused with fresh dill, charred lemon, and sea salt. Ultra-fast gastric clearance for rapid post-session recovery.',
    image: '/dietpage/fishfordite.png',
    calories: 520,
    protein: '46g',
    carbs: '12g',
    fats: '14g',
    micronutrients: ['Iodine', 'Selenium', 'Potassium', 'Omega-3'],
  },
  {
    id: 'salmon-power',
    title: 'Atlantic Salmon & Greens',
    category: 'Cell Membrane Integrity',
    description: 'Crisp pan-seared wild salmon fillets resting on organic tender field greens and cherry tomatoes. Essential anti-inflammatory EPA/DHA fatty acids.',
    image: '/dietpage/boulchickenfordite.png',
    calories: 640,
    protein: '48g',
    carbs: '14g',
    fats: '28g',
    micronutrients: ['EPA / DHA', 'Vitamin D3', 'Magnesium', 'Folate'],
  },
  {
    id: 'turkey-sweetpotato',
    title: 'Glazed Turkey & Roasted Yams',
    category: 'Sustained Glycogen Resynthesis',
    description: 'Thick hand-sliced roasted turkey breast accompanied by spiced roasted yams, whipped parsnip puree, and antioxidant cranberry reduction.',
    image: '/dietpage/breadchatnifordite.png',
    calories: 710,
    protein: '54g',
    carbs: '68g',
    fats: '16g',
    micronutrients: ['Beta-Carotene', 'Vitamin B6', 'Zinc', 'Polyphenols'],
  },
];

export const glassNutritionCards: GlassCardInfo[] = [
  {
    id: 'pre-workout',
    phase: 'PHASE 01',
    tag: 'PRE-WORKOUT',
    title: 'Anabolic Vasodilation',
    description: 'Fast-acting low-glycemic carbohydrates combined with free-form amino acids to prime ATP synthesis and maximize intra-muscular blood volume.',
    macroRatio: '30P / 55C / 15F',
    highlight: '60-90m Prior to Peak Output',
    timing: 'Pre-Training',
  },
  {
    id: 'post-workout',
    phase: 'PHASE 02',
    tag: 'POST-WORKOUT',
    title: 'Glycogen & Myofibrillar Repair',
    description: 'High-leucine hydrolyzed proteins paired with rapid dextrose polymers to trigger immediate mTOR phosphorylation and halt exercise-induced catabolism.',
    macroRatio: '45P / 45C / 10F',
    highlight: '< 45m Post Barbell Protocol',
    timing: 'Post-Training',
  },
  {
    id: 'daily-fuel',
    phase: 'PHASE 03',
    tag: 'DAILY MATRIX',
    title: 'Micronutrient Density',
    description: 'Whole-food organic matrix prioritizing bioavailable iron, magnesium glycinate, and cellular electrolytes to maintain hormonal homeostasis.',
    macroRatio: '40P / 35C / 25F',
    highlight: 'Continuous Metabolic Drive',
    timing: 'Day Routine',
  },
  {
    id: 'cellular-rest',
    phase: 'PHASE 04',
    tag: 'NIGHT REPAIR',
    title: 'Deep Tissue Regeneration',
    description: 'Slow-digesting native micellar protein complexes and anti-inflammatory lipids designed for sustained overnight growth hormone support.',
    macroRatio: '50P / 15C / 35F',
    highlight: 'Overnight Recovery Arc',
    timing: 'Pre-Sleep',
  },
];

export const nutritionPillars = [
  {
    number: '01',
    label: 'PURE BIOAVAILABILITY',
    detail: 'Zero synthetic preservatives or industrial fillers. 100% human-grade pasture-raised and wild-caught sources.',
  },
  {
    number: '02',
    label: 'BIO-CALIBRATED TARGETS',
    detail: 'Calibrated down to the gram by CORE X sports nutrition specialists in lockstep with your barbell output metrics.',
  },
  {
    number: '03',
    label: 'MICRONUTRIENT BALANCE',
    detail: 'Formulated to reduce systemic inflammation, optimize androgen synthesis, and expedite nervous system recovery.',
  },
];
