export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  emoji: string;
  description: string;
  descriptionAr: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'frankincense-gift',
    name: 'Omani Frankincense Gift Set',
    nameAr: 'طقم هدية لبان عماني',
    price: 12.5,
    emoji: '\u{1F56F}\uFE0F',
    description: 'Premium Dhofari frankincense in a handcrafted wooden box with brass burner.',
    descriptionAr: 'لبان ظفاري فاخر في صندوق خشبي مصنوع يدوياً مع مبخرة نحاسية.',
  },
  {
    id: 'khanjar-stand',
    name: 'Khanjar Display Stand',
    nameAr: 'حامل عرض الخنجر',
    price: 85.0,
    emoji: '\u{1F5E1}\uFE0F',
    description: 'Ornamental silver-plated khanjar with carved rosewood display stand.',
    descriptionAr: 'خنجر مطلي بالفضة مع حامل عرض من خشب الورد المنحوت.',
  },
  {
    id: 'coffee-set',
    name: 'Omani Coffee Set with Dallah',
    nameAr: 'طقم قهوة عمانية مع دلة',
    price: 45.0,
    emoji: '\u2615',
    description: 'Traditional brass dallah with six finjan cups and cardamom spice tin.',
    descriptionAr: 'دلة نحاسية تقليدية مع ست فناجين وعلبة هيل.',
  },
  {
    id: 'dhofar-honey',
    name: 'Dhofar Honey (1kg Premium)',
    nameAr: 'عسل ظفار (١ كجم فاخر)',
    price: 28.0,
    emoji: '\u{1F36F}',
    description: 'Pure wild honey harvested from the Dhofar mountains during khareef season.',
    descriptionAr: 'عسل بري نقي من جبال ظفار يُجنى في موسم الخريف.',
  },
  {
    id: 'dates-box',
    name: 'Muscat Dates Premium Box',
    nameAr: 'علبة تمور مسقط الفاخرة',
    price: 18.5,
    emoji: '\u{1F334}',
    description: 'Hand-selected Khalas dates in a luxury gift box with Omani saffron.',
    descriptionAr: 'تمور خلاص مختارة يدوياً في علبة هدية فاخرة مع زعفران عماني.',
  },
  {
    id: 'bukhoor-set',
    name: 'Bukhoor Burner Set',
    nameAr: 'طقم مبخرة بخور',
    price: 35.0,
    emoji: '\u{1F525}',
    description: 'Ceramic mabkhara with three premium bukhoor varieties and charcoal discs.',
    descriptionAr: 'مبخرة سيراميك مع ثلاثة أنواع بخور فاخر وأقراص فحم.',
  },
];

/**
 * Format an OMR amount with exactly 3 decimal places.
 */
export function formatOMR(amount: number): string {
  return `OMR ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })}`;
}
