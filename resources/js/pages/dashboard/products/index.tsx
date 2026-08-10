import { products } from '@/routes';

export default function ProductsList() {
  return (
    <div>ProductsList</div>
  )
}

ProductsList.layout = {
    breadcrumbs: [
        {
            title: 'Product Management',
            href: products(),
        },
    ],
};