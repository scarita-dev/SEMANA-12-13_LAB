from urllib.parse import urlparse
from urllib.request import urlopen
from uuid import uuid4

from django.core.files.base import ContentFile
from rest_framework import serializers

from .models import Category, Product

CONTENT_TYPE_EXTENSIONS = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
}


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['created_at']


def download_image(image_url):
    parsed_url = urlparse(image_url)
    if parsed_url.scheme not in ('http', 'https') or not parsed_url.netloc:
        raise serializers.ValidationError(
            {'image_url': 'Only valid HTTP(S) image URLs are allowed.'}
        )

    try:
        with urlopen(image_url, timeout=10) as response:
            content_type = response.headers.get_content_type()
            if content_type not in CONTENT_TYPE_EXTENSIONS:
                raise serializers.ValidationError(
                    {'image_url': 'The URL must point to a supported image.'}
                )
            extension = CONTENT_TYPE_EXTENSIONS[content_type]
            return ContentFile(response.read(), name=f'product-{uuid4().hex}{extension}')
    except serializers.ValidationError:
        raise
    except Exception as exc:
        raise serializers.ValidationError(
            {'image_url': f'The image could not be downloaded: {exc}'}
        ) from exc


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
    )
    image_url = serializers.URLField(write_only=True, required=False)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
            'stock',
            'image',
            'image_url',
            'category',
            'category_id',
            'created_at',
        ]
        read_only_fields = ['created_at']

    def validate_image_url(self, value):
        download_image(value)
        return value

    def create(self, validated_data):
        image_url = validated_data.pop('image_url', None)
        if image_url:
            validated_data['image'] = download_image(image_url)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        image_url = validated_data.pop('image_url', None)
        if image_url:
            validated_data['image'] = download_image(image_url)
        return super().update(instance, validated_data)
