import { Product } from '../utils/product.interface';

export function rowClass(product: Product) {
  if (product.id === 4) return 'bg-primary text-primary-contrast';
  return '';
}

export function rowStyle(product: Product) {
  if (product.id === 2) {
    return { fontWeight: 'bold', fontStyle: 'italic' };
  }
  return {};
}




