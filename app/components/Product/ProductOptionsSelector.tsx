import type { MappedProductOptions } from "@shopify/hydrogen";
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import { useEffect } from "react";
import { Link, useNavigate } from 'react-router';
import ProductOptionDozen from "./ProductOptionDozen";
import ProductOptionsDefault from "./ProductOptionsDefault";

interface ProductOptionsProps {
  productOptions: MappedProductOptions[];
}




const ProductOptionsSelector = ({ productOptions }: ProductOptionsProps) => {

  useEffect(() => {
    console.log("productOptions ", productOptions)
  }, [productOptions])

  return (
    <div className="space-y-3">
      {productOptions.map((option, index) => {
        if (option.optionValues.length === 1) return null;
        if (option.name === 'Color') return null;
        if (option.name?.includes('pack size')) return <ProductOptionDozen key={index} option={option} />
        else return <ProductOptionsDefault key={index} option={option} />
      })}
    </div>
  )
}




export default ProductOptionsSelector