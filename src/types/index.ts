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
export interface Post {
  title: string;
  body: string;
  id: number;
  onDelete: (id: number) => void;
  onEdit: ({
    title,
    body,
    id,
  }: {
    title: string;
    body: string;
    id?: number;
  }) => void;
}
export interface Comment {
  postId: number;
  id: number;
  name: string;
  body: string;
  email: string;
}
