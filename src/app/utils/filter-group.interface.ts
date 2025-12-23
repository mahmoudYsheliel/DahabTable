import { Signal, WritableSignal } from "@angular/core"

export interface FilterGroup {
    header:string
    field:string
    value: WritableSignal<any>
    filterMethod:string
}