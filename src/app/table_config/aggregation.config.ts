import { AggCell } from "../utils/table.interface";
import { Product } from "../utils/product.interface";

export const  AGGREGATION_CONFIG:AggCell[][] = [
    [
      {
        func: () => {
          return 'Sum';
        },
        colSpan: 3,
        isFrozen:true,
        alignFrozen:'left'
      },
      {
        func:()=>{},
        colSpan:2
      },
      {
        func: aggSum,
        colSpan: 2,
        isFrozen:true,
        alignFrozen: 'right'
      },
    ],

    [
      {
        func: () => {
          return 'Av';
        },
        colSpan: 3,
        isFrozen:true,
        alignFrozen:'left'
      },
      {
        func:()=>{},
        colSpan:2
      },
      {
        func: aggAv,
        colSpan: 2,
        isFrozen:true,
        alignFrozen:'right'
      },
    ],
  ];

  
 function   aggSum(data: Product[]) {
      return data.reduce((sum, prod) => {
        return sum + Number(prod.price);
      }, 0);
    }


  function    aggAv(data: Product[]) {
    if (data.length < 1) return 0;
    return (
      data.reduce((sum, prod) => {
        return sum + Number(prod.price);
      }, 0) / data.length
    );
  }