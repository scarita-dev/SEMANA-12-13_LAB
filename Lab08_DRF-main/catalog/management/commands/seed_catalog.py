from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from PIL import Image, ImageDraw

from catalog.models import Category, Product

CATEGORIES = [
    {
        'name': 'Electronics',
        'description': 'Devices, audio equipment and computer accessories.',
    },
    {
        'name': 'Home and Kitchen',
        'description': 'Appliances and tools for everyday home use.',
    },
    {
        'name': 'Sports and Outdoors',
        'description': 'Gear for fitness, hiking and outdoor activities.',
    },
]

PRODUCTS = [
    {
        'name': 'Wireless Headphones',
        'description': 'Over-ear headphones with noise cancellation.',
        'price': '89.90',
        'stock': 15,
        'category': 'Electronics',
        'color': (36, 82, 140),
    },
    {
        'name': 'Mechanical Keyboard',
        'description': 'Compact keyboard with tactile mechanical switches.',
        'price': '74.50',
        'stock': 9,
        'category': 'Electronics',
        'color': (58, 62, 78),
    },
    {
        'name': 'Portable Speaker',
        'description': 'Bluetooth speaker with deep bass and long battery life.',
        'price': '49.95',
        'stock': 22,
        'category': 'Electronics',
        'color': (24, 116, 110),
    },
    {
        'name': 'Espresso Machine',
        'description': 'Compact espresso maker with milk frother.',
        'price': '129.00',
        'stock': 6,
        'category': 'Home and Kitchen',
        'color': (122, 64, 42),
    },
    {
        'name': 'Ceramic Cookware Set',
        'description': 'Non-stick ceramic pots and pans, five pieces.',
        'price': '65.75',
        'stock': 12,
        'category': 'Home and Kitchen',
        'color': (156, 88, 52),
    },
    {
        'name': 'Air Purifier',
        'description': 'Quiet purifier with a washable pre-filter.',
        'price': '99.00',
        'stock': 8,
        'category': 'Home and Kitchen',
        'color': (70, 110, 138),
    },
    {
        'name': 'Trail Backpack',
        'description': 'Lightweight backpack with hydration support.',
        'price': '55.40',
        'stock': 18,
        'category': 'Sports and Outdoors',
        'color': (58, 112, 62),
    },
    {
        'name': 'Yoga Mat',
        'description': 'Non-slip exercise mat with carrying strap.',
        'price': '28.90',
        'stock': 30,
        'category': 'Sports and Outdoors',
        'color': (108, 72, 142),
    },
    {
        'name': 'Steel Water Bottle',
        'description': 'Insulated bottle that keeps drinks cold for hours.',
        'price': '22.50',
        'stock': 25,
        'category': 'Sports and Outdoors',
        'color': (40, 96, 122),
    },
]


class Command(BaseCommand):
    help = 'Create the demo catalog categories, products and local images.'

    def handle(self, *args, **options):
        image_directory = Path(settings.MEDIA_ROOT) / 'products'
        image_directory.mkdir(parents=True, exist_ok=True)

        for category_data in CATEGORIES:
            Category.objects.update_or_create(
                name=category_data['name'],
                defaults={'description': category_data['description']},
            )

        for product_data in PRODUCTS:
            category = Category.objects.get(name=product_data['category'])
            product, created = Product.objects.update_or_create(
                name=product_data['name'],
                defaults={
                    'description': product_data['description'],
                    'price': product_data['price'],
                    'stock': product_data['stock'],
                    'category': category,
                },
            )

            if not product.image:
                filename = f'{slugify(product.name)}.jpg'
                image_path = image_directory / filename
                self.create_image(image_path, product.name, product_data['color'])
                with image_path.open('rb') as image_file:
                    product.image.save(filename, File(image_file), save=True)

            action = 'Created' if created else 'Updated'
            self.stdout.write(f'{action} product: {product.name}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Catalog ready: {Category.objects.count()} categories and '
                f'{Product.objects.count()} products.'
            )
        )

    @staticmethod
    def create_image(image_path, title, color):
        image = Image.new('RGB', (480, 320), color)
        draw = ImageDraw.Draw(image)
        draw.rectangle((16, 16, 464, 304), outline='white', width=2)
        draw.text((30, 140), title, fill='white')
        image.save(image_path, 'JPEG')
