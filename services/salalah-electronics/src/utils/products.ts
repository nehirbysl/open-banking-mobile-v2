export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  emoji: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'frankincense-set',
    name: 'Omani Frankincense Gift Set',
    nameAr: '\u0645\u062C\u0645\u0648\u0639\u0629 \u0647\u062F\u0627\u064A\u0627 \u0627\u0644\u0644\u0628\u0627\u0646 \u0627\u0644\u0639\u0645\u0627\u0646\u064A',
    price: 12.5,
    emoji: '\u{1F56F}\uFE0F',
    description: 'Premium Dhofar frankincense with traditional burner',
  },
  {
    id: 'khanjar-display',
    name: 'Khanjar Display Stand',
    nameAr: '\u062D\u0627\u0645\u0644 \u0639\u0631\u0636 \u0627\u0644\u062E\u0646\u062C\u0631',
    price: 85.0,
    emoji: '\u{1F5E1}\uFE0F',
    description: 'Handcrafted silver khanjar with wooden display',
  },
  {
    id: 'coffee-set',
    name: 'Omani Coffee Set with Dallah',
    nameAr: '\u0637\u0642\u0645 \u0627\u0644\u0642\u0647\u0648\u0629 \u0627\u0644\u0639\u0645\u0627\u0646\u064A\u0629 \u0645\u0639 \u0627\u0644\u062F\u0644\u0629',
    price: 45.0,
    emoji: '\u2615',
    description: 'Traditional brass dallah with 6 finjan cups',
  },
  {
    id: 'dhofar-honey',
    name: 'Dhofar Honey Premium (1kg)',
    nameAr: '\u0639\u0633\u0644 \u0638\u0641\u0627\u0631 \u0627\u0644\u0641\u0627\u062E\u0631',
    price: 28.0,
    emoji: '\u{1F36F}',
    description: 'Pure wild honey from the Dhofar mountains',
  },
  {
    id: 'dates-box',
    name: 'Muscat Dates Premium Box',
    nameAr: '\u062A\u0645\u0648\u0631 \u0645\u0633\u0642\u0637 \u0627\u0644\u0641\u0627\u062E\u0631\u0629',
    price: 18.5,
    emoji: '\u{1F334}',
    description: 'Assorted Omani dates in luxury gift packaging',
  },
  {
    id: 'bukhoor-set',
    name: 'Bukhoor Burner Set',
    nameAr: '\u0645\u062C\u0645\u0648\u0639\u0629 \u0645\u0628\u062E\u0631\u0629 \u0627\u0644\u0628\u062E\u0648\u0631',
    price: 35.0,
    emoji: '\u{1F525}',
    description: 'Electric bukhoor burner with premium oud chips',
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
