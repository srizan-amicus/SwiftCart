export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  imagePath?: string;
  category?: string;
  categoryId?: number;
  rating?: number;
  originalPrice?: number;
  isNew?: boolean;
  brand?: string;
  brandId?: number;
}
