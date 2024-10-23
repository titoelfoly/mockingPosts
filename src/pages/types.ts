export interface Invoice {
  lineNo: number;
  productName: string;
  unit: {
    id: number;
    name: string;
  };
  unitNo: number;
  price: number;
  quantity: number;
  total: number;
  expiryDate: string;
}
