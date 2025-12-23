import { TableConfig } from '../utils/table.interface';
import { ColumnConfig } from '../utils/column.interface';
import { contextMenu } from './context_menu.config';
import { Signal, TemplateRef } from '@angular/core';
import { rowClass, rowStyle } from './styles.config';
import { AGGREGATION_CONFIG } from './aggregation.config';
import { FilterGroup } from '../utils/filter-group.interface';

export function getInitialTableConfig(
  cols: ColumnConfig[],
  simulateAPI: Function,
  captionActionTemplate?: TemplateRef<any> | undefined,
  rowExpanssionTemp?: TemplateRef<any> | undefined,
  filterTemplate?: TemplateRef<any> | undefined,
  onRowSelect?: (event: any) => void,
  onRowUnselect?: (event: any) => void,
  onCollapse?: (event: any) => void,
  onExpansion?: (event: any) => void,
  onFilter?: (event: any) => void,
  onSort?: (event: any) => void,
  onPage?: (event: any) => void

): TableConfig {
  return {
    tableStyle: { 'min-width': '800px' },
    dataKey: 'id',
    columns: cols,
    size: 'small',
    showGridlines: false,
    stripedRows: true,
    isLoading: true,
    paginator: true,
    rows: 100,
    rowsPerPageOptions: [5, 10, 20, 50, 100, 200],

    showCurrentPageReport: true,
    currentPageReportTemplate: '{first} - {last} of {totalRecords}',
    lazy: false,
    onLazyLoading: (event: any) => {
      simulateAPI(event);
    },
    sortMode: 'multiple',
    clearFilters: true,
    selectionMethod: 'radiobutton',
    onRowSelect,
    onRowUnselect,

    expandable: true,
    expandedRowTempelate: rowExpanssionTemp,
    onCollapse,
    onExpansion,

    showCaption: true,
    showFooter: true,

    scrollable: true,
    scrollHeight: '1000px',

    onFilter,
    onSort,
    onPage,

    aggregationFuncs: AGGREGATION_CONFIG,

    reorderableColumns: true,

    captionTitle: 'Products',
    showCaptionFilter: true,
    showfilterChips: true,
    showInputSearch: true,
    globalFilterFields: ['id', 'code', 'name'],
    captionActionTemplate: captionActionTemplate,

    freezeExpansion: true,
    freezeSelection: true,

    exportFilename: 'products',
    exportButtons: {
      csv: false,
      excel: false,
      pdf: false,
    },
    importable:false,

    contextMenu: true,
    contextMenuItems: contextMenu,

    grouping: {
      enabled: false,
      groupableColumns: ['categoryType', 'name', 'code'] // Only these columns available in dropdown
    },
    filterTemplate,
  };
}
