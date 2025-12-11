import { TableLazyLoadEvent } from "primeng/table";

export function retrieveData(data: any[] | undefined, rules: TableLazyLoadEvent) {
    if (!data) return;
    let result = [...data];

    if (rules.filters) {
      for (const field in rules.filters) {
        const filterArr = rules.filters[field];
        if (!Array.isArray(filterArr) || !filterArr.length) continue;

        const { value } = filterArr[0];
        if (value == null || value === '') continue;

        const v = value.toString().toLowerCase();

        result = result.filter((row) => {
          const cell = row[field];
          if (cell == null) return false;
          return cell.toString().toLowerCase().includes(v);
        });
      }
    }
    if (typeof rules.sortField == 'string') {
      const field = rules.sortField;
      const order = rules.sortOrder ?? 1; // asc = 1, desc = -1

      result.sort((a, b) => {
        const x = a[field];
        const y = b[field];

        if (x == null && y != null) return -1 * order;
        if (x != null && y == null) return 1 * order;

        return x < y ? -1 * order : x > y ? 1 * order : 0;
      });
    }

    const totalItems = result.length;
    const size = rules.rows ?? totalItems;
    const first = rules.first ?? 0;

    const page = Math.floor(first / size) + 1; // convert offset → page number
    const totalPages = Math.ceil(totalItems / size);

    const pagedData = result.slice(first, first + size);

    return {
      data: pagedData,
      page,
      size,
      totalPages,
      totalItems,
    };
  }