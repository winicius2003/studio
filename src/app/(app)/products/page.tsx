import ProductManagement from '@/components/products/product-management';

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Products & Services</h1>
        <p className="text-muted-foreground">
          Manage your reusable products and services here.
        </p>
      </div>
      <ProductManagement />
    </div>
  );
}
