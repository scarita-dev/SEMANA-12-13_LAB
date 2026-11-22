# Laboratorio 13 — Estructura de una aplicación de comercio electrónico

Rama acumulativa: nace de `lab12-ajax-web-services` y añade el catálogo completo. Mantiene la vista `Exams API` del Laboratorio 12 y el proyecto de películas del Laboratorio 11.

## Arquitectura servidor / cliente

### Servidor (`Lab08_DRF-main/`)

- `config/settings.py`: `corsheaders`, orígenes exactos, `MEDIA_URL` / `MEDIA_ROOT` y variables de entorno para secretos.
- `config/urls.py`: `DefaultRouter` con `exams`, `questions`, `options`, `categories` y `products`, además del serve de media en desarrollo.
- `quiz/`: API original del Laboratorio 8.
- `catalog/`: app nueva del Laboratorio 13.
  - `models.py`: `Category` y `Product` (nombre, descripción, precio decimal, stock, imagen y FK protegida).
  - `migrations/0001_initial.py`: migración versionada.
  - `admin.py`: listados, filtros y búsqueda para ambos modelos.
  - `serializers.py`: `ProductSerializer` anida `category = CategorySerializer(read_only=True)` y acepta `category_id` de escritura; admite imagen por archivo o `image_url`.
  - `views.py`: `CategoryViewSet` y `ProductViewSet` con filtro `?category=<id>`.
  - `management/commands/seed_catalog.py`: genera 3 categorías, 9 productos y sus imágenes locales.

### Cliente (`cinemax-lab10-componentes-eventos-lab11-comunicacion-componentes/`)

- `src/services/apiClient.js`: instancia única de Axios y normalización de errores de red vs. API.
- `src/services/examService.js`: servicios del Laboratorio 12 sobre `/exams/`.
- `src/services/categoryService.js` y `src/services/productService.js`: servicios del catálogo.
- `src/hooks/useExams.js`, `src/hooks/useCatalog.js`, `src/hooks/useProductForm.js`: lógica de estados y peticiones.
- `src/pages/ExamListPage`, `ExamFormPage`, `CatalogPage`, `ProductFormPage`: vistas.
- `src/components/RequestError`, `ExamSkeleton`, `CatalogSkeleton`, `ProductCard`, `CategoryFilter`: UI de los tres estados.
- Ningún componente importa Axios ni escribe URLs: todo pasa por los servicios.

## Endpoints

| Recurso | URL | Filtrado |
| --- | --- | --- |
| Exámenes | `http://127.0.0.1:8000/api/exams/` | — |
| Categorías | `http://127.0.0.1:8000/api/categories/` | `?search=` |
| Productos | `http://127.0.0.1:8000/api/products/` | `?category=<id>`, `?search=` |
| Imágenes | `http://127.0.0.1:8000/media/products/<archivo>` | — |

`GET /api/products/` devuelve cada producto con el objeto `category` completo (`id`, `name`, `description`, `created_at`), sin exigir una segunda petición.

## Levantar ambos proyectos

```powershell
cd Lab08_DRF-main
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_catalog
python manage.py check
python manage.py runserver 127.0.0.1:8000
```

```powershell
cd cinemax-lab10-componentes-eventos-lab11-comunicacion-componentes
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

Base de la API en un solo sitio: `import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'`.

Orígenes CORS permitidos: `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`, `http://127.0.0.1:3000` (sin comodines).

## Datos de prueba

- 3 categorías: Electronics, Home and Kitchen, Sports and Outdoors.
- 9 productos con imagen local generada por la semilla (Wireless Headphones, Mechanical Keyboard, Portable Speaker, Espresso Machine, Ceramic Cookware Set, Air Purifier, Trail Backpack, Yoga Mat, Steel Water Bottle).

## Capturas sugeridas

- **Laboratorio 12:** cambia a la rama `lab12-ajax-web-services` y sigue su README: error de CORS, validación HTTP 400 en `Exams API` y estado de error con **Retry** al apagar Django.
- **Laboratorio 13:** en esta rama, abre `E-commerce catalog`; captura el filtrado por categoría (chips cargados desde la API), el alta con `New product`, la edición con `Edit` y la eliminación con `Delete`. Todas las operaciones refrescan la interfaz sin recargar y respetan skeleton / datos / error con **Retry**.
