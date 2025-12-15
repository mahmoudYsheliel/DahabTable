import { Product } from './product.interface';

export function generateProducts(count: number): Product[] {
  const result: Product[] = [];
  const categories = ['Electronics', 'Furniture', 'Office', 'Kitchen', 'Toys'];
  const statuses = ['Pending', 'Completed', 'Rejected'];
  const suppliers = ['Amazon', 'Dell', 'HP', 'Ikea', 'Sony'];

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];

    result.push({
      id: i,
      code: 'P-' + (1000 + i),
      name: category + ' Product ' + i,
      price: +(Math.random() * 500).toFixed(2),
      category: {
        id: Math.floor(Math.random() * 100),
        name: category,
        parent: Math.random() > 0.7 ? 'General Goods' : undefined,
      },
      categoryType: category,
      quantity: Math.floor(Math.random() * 500),
      rating: +(Math.random() * 5).toFixed(1),
      isActive: Math.random() > 0.5,
      createdAt: new Date(Date.now() - Math.random() * 10000000000),
      tags: ['tag' + i, 'item', supplier.toLowerCase()],
      supplier: {
        name: supplier,
        email: supplier.toLowerCase() + '@supplier.com',
        phone: '+1-555-' + Math.floor(Math.random() * 9000 + 1000),
      },
      subTable: generateSubTable(i, statuses),
    });
  }

  return result;
}

function generateSubTable(parentId: number, statuses: string[]) {
  const rows = Math.floor(Math.random() * 6) + 1; // 1–6 sub rows
  const result = [];

  for (let x = 1; x <= rows; x++) {
    result.push({
      subId: parentId * 10 + x,
      description: 'Sub item ' + x + ' for product ' + parentId,
      amount: +(Math.random() * 100).toFixed(2),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      history: generateHistory(),
    });
  }

  return result;
}

function generateHistory() {
  const rows = Math.floor(Math.random() * 4) + 1; // 1–4 history entries
  const result = [];

  for (let i = 0; i < rows; i++) {
    result.push({
      changedAt: new Date(Date.now() - Math.random() * 5000000000),
      oldValue: 'old_' + i,
      newValue: 'new_' + i,
    });
  }

  return result;
}
