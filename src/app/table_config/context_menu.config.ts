export function contextMenu(rowData: any) {
  return [
    {
      label: 'View',
      icon: 'pi pi-eye',
      command: () => viewProduct(rowData), 
    },
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => editProduct(rowData), 
    },
    {
      separator: true,
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => deleteProduct(rowData), 
    },
  ];
}

function viewProduct(product: any) {
  console.log('View product:', product);
  alert(`Viewing: ${product.name}`);
}

function editProduct(product: any) {
  console.log('Edit product:', product);
  alert(`Editing: ${product.name}`);
}

function deleteProduct(product: any) {
  console.log('Delete product:', product);
  if (confirm(`Delete ${product.name}?`)) {
    // Your delete logic
    console.log('Deleted:', product);
  }
}
