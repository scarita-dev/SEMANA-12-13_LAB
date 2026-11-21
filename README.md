# Laboratorio 12 — Ajax y Servicios Web

Esta rama contiene **únicamente** el Laboratorio 12: la API original del Laboratorio 8 (app `quiz`) con CORS configurado y un frontend React que consume los recursos con Axios.

## Estructura

- `Lab08_DRF-main/`: proyecto Django REST con `quiz` (`exams`, `questions`, `options`), `django-cors-headers` y los orígenes exactos permitidos.
- `cinemax-lab10-componentes-eventos-lab11-comunicacion-componentes/`: proyecto React del Laboratorio 11 más la vista `Exams API`, el cliente único de Axios y los tres estados de petición.

## Levantar el backend

```powershell
cd Lab08_DRF-main
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py check
python manage.py runserver 127.0.0.1:8000
```

Recurso consumido: `http://127.0.0.1:8000/api/exams/`.

CORS permitido (sin comodines): `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`, `http://127.0.0.1:3000`. Se puede sobrescribir con la variable `CORS_ALLOWED_ORIGINS` separada por comas.

## Levantar el frontend

```powershell
cd cinemax-lab10-componentes-eventos-lab11-comunicacion-componentes
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```

La base de la API se define en un solo lugar: `src/services/apiClient.js` (`import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'`). Ningún componente importa Axios ni escribe URLs.

## Capa de servicios y estados

- `src/services/apiClient.js`: instancia única de Axios y normalización de errores (red vs. API).
- `src/services/examService.js`: `getExams`, `getExamById`, `createExam`, `updateExam`, `deleteExam`.
- `src/hooks/useExams.js`: estado `loading` / `data` / `error`, reintento y borrado en memoria.
- `src/components/ExamSkeleton/`: esqueleto animado de carga.
- `src/components/ExamTable/`: tabla de datos con botón de eliminación.
- `src/components/RequestError/`: mensaje descriptivo y botón **Retry**.
- `src/pages/ExamListPage/` y `src/pages/ExamFormPage/`: listado y alta sobre `/api/exams/`.

## Cómo reproducir las capturas

1. **Error de CORS:** con React en `http://127.0.0.1:5173`, levanta Django con `$env:CORS_ALLOWED_ORIGINS='http://localhost:3000'; python manage.py runserver 127.0.0.1:8000`. Abre DevTools → Console/Network y recarga; aparece el bloqueo `No 'Access-Control-Allow-Origin' header`. Restaura la variable y reinicia Django.
2. **Validación HTTP 400:** en `Exams API` pulsa **New exam**, deja `Title` vacío, escribe una descripción y envía. La petición `POST /api/exams/` devuelve 400 y la interfaz muestra `This field may not be blank.` bajo el campo (no hay `required` HTML5).
3. **Servidor apagado con Retry:** con la lista de exámenes abierta, detén Django (Ctrl+C). La tabla se sustituye por el estado de error con **Retry**; vuelve a levantar Django y pulsa **Retry** sin recargar el navegador.
4. **Listar, crear y eliminar:** crea un examen, verifica que aparece en la tabla sin recargar y pulsa **Delete** en una fila; la fila desaparece inmediatamente.
