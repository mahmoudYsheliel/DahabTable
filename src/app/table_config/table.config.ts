import { TableConfig } from '../utils/table.interface';
import { ColumnConfig } from '../utils/column.interface';
import { contextMenu } from './context_menu.config';
import { TemplateRef } from '@angular/core';
import { rowClass, rowStyle } from './styles.config';
import { AGGREGATION_CONFIG } from './aggregation.config';

export function getInitialTableConfig(
  cols: ColumnConfig[],
  simulateAPI: Function,
  captionActionTemplate?: TemplateRef<any> | undefined,
  rowExpanssionTemp?: TemplateRef<any> | undefined,
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
    showGridlines: true,
    stripedRows: true,
    isLoading: true,
    rowStyle: rowStyle,
    rowClass: rowClass,
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
    selectionMethod: 'checkbox',
    onRowSelect,
    onRowUnselect,

    expandable: true,
    expandedRowTempelate: rowExpanssionTemp,
    onCollapse,
    onExpansion,

    showCaption: true,
    showFooter: true,

    scrollable: true,
    scrollHeight: '500px',

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
      csv: true,
      excel: true,
      pdf: true,
    },

    contextMenu: true,
    contextMenuItems: contextMenu,
  };
}
