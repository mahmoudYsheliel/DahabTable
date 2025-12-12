import { MenuItem } from "primeng/api"

export type AggregationFunc = (data:any[])=>any
export type TableEditCellFunc = (event: { data: any, newValue: any, oldValue: any }) =>  { success: boolean, message: string } | void
export type TableContextMenu =  (rowData: any) => MenuItem[]
export type AlignFrozenDirection = 'left' | 'right'
export type TableFilterType ='text' | 'numeric' | 'boolean' | 'date' | 'custom'
export type TableSize = 'small' | 'large'
export type TableSortMode = 'single' | 'multiple'
export type TableSelectionMethod = 'checkbox'| 'radiobutton'