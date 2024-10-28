
interface FilterProductData {
  productName: string
  delayTime: number;    
  filterNames: string[]
  limit: number; 
  discount: number     
}

export const filterProductData: FilterProductData = {
  productName: "shoes",
  delayTime: 200,
  filterNames: [
    "adidas"
  ],
  limit: 10,
  discount: 50
};
