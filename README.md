# Almacen App API

API para gestionar un sistema de almacén, incluyendo productos, categorías, stock, usuarios y autenticación. Construido con Next.js y diseñado para ser desplegado en Vercel y conectado a una base de datos Supabase.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validación**: [Zod](https://zod.dev/)
- **Base de Datos**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Deployment**: [Vercel](https://vercel.com/)

---

## Arquitectura del Proyecto

La estructura de carpetas principal se organiza de la siguiente manera:

```
/
├── prisma/
│   └── schema.prisma       # Esquema de la base de datos
├── public/                 # Archivos estáticos
└── src/
    ├── app/
    │   ├── api/            # Directorio raíz para todas las rutas de la API
    │   │   ├── admin/
    │   │   ├── auth/
    │   │   └── empleado/
    │   └── lib/
    │       ├── Services/   # Lógica de negocio y acceso a datos
    │       └── db/         # Cliente e instancia de Prisma
    └── Components/         # Componentes de React (si aplica)
```

---

## Instalación y Despliegue

### 1. Configuración Local

1.  **Clonar el repositorio**:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```
2.  **Instalar dependencias**:
    ```bash
    npm install
    ```
3.  **Configurar variables de entorno**:
    Crea un archivo `.env` en la raíz del proyecto y añade la URL de conexión de tu base de datos Supabase.
    ```env
    DATABASE_URL="postgresql://..."
    ```
4.  **Ejecutar migraciones de Prisma**:
    ```bash
    npx prisma migrate dev
    ```
5.  **Generar el cliente de Prisma**:
    ```bash
    npx prisma generate
    ```
6.  **Iniciar el servidor de desarrollo**:
    ```bash
    npm run dev
    ```

### 2. Despliegue en Vercel

1.  Asegúrate de que tu proyecto esté en un repositorio de GitHub.
2.  Importa el repositorio en [Vercel](https://vercel.com/new).
3.  Vercel detectará automáticamente que es un proyecto de Next.js.
4.  **Añade la variable de entorno `DATABASE_URL`** en la configuración del proyecto en Vercel para conectar con Supabase.
5.  Despliega.

---

## Documentación de la API

### URL de Producción

Una vez desplegada la aplicación en Vercel, la URL base `http://localhost:3000` será reemplazada por la URL pública asignada por Vercel (o tu dominio personalizado).

- **Ejemplo Local**: `http://localhost:3000/api/empleado/producto`
- **Ejemplo Producción**: `https://almacen-app.vercel.app/api/empleado/producto` (asumiendo que el nombre del proyecto en Vercel es `almacen-app`)

A continuación se detallan todos los endpoints de la API.

### Autenticación

#### Iniciar Sesión
- **Método**: `POST`
- **Ruta**: `/api/auth/login`
- **Descripción**: Autentica a un usuario y devuelve un token.
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "contrasena": "password123"
  }
  ```

#### Cerrar Sesión
- **Método**: `POST`
- **Ruta**: `/api/auth/logout`
- **Descripción**: Cierra la sesión del usuario.

---

### Admin

#### Registrar Usuario
- **Método**: `POST`
- **Ruta**: `/api/admin/register`
- **Descripción**: Crea un nuevo usuario en el sistema.
- **Body**:
  ```json
  {
    "email": "newuser@example.com",
    "contrasena": "password123",
    "id_rol": 1
  }
  ```

#### Asignar Rol a Usuario
- **Método**: `POST`
- **Ruta**: `/api/admin/register/asignar`
- **Descripción**: Asigna o cambia el rol de un usuario existente.
- **Body**:
  ```json
  {
    "id_usuario": 1,
    "id_rol": 2
  }
  ```

#### Obtener todos los Usuarios
- **Método**: `GET`
- **Ruta**: `/api/admin/users`
- **Descripción**: Devuelve una lista de todos los usuarios.

#### Actualizar Usuario
- **Método**: `PUT`
- **Ruta**: `/api/admin/users`
- **Descripción**: Actualiza los datos de un usuario.
- **Body**:
  ```json
  {
    "id": 1,
    "email": "updateduser@example.com",
    "contrasena": "newpassword123"
  }
  ```

---

### Empleado

### Categorías

#### Obtener todas las Categorías
- **Método**: `GET`
- **Ruta**: `/api/empleado/categoria`
- **Descripción**: Devuelve una lista de todas las categorías de productos.

#### Crear Categoría
- **Método**: `POST`
- **Ruta**: `/api/empleado/categoria`
- **Descripción**: Crea una nueva categoría.
- **Body**:
  ```json
  {
    "nombre": "Nombre de la categoría (mín. 8 caracteres)"
  }
  ```

#### Actualizar Categoría
- **Método**: `PUT`
- **Ruta**: `/api/empleado/categoria`
- **Descripción**: Actualiza el nombre de una categoría existente.
- **Body**:
  ```json
  {
    "id": 1,
    "nombre": "Nuevo nombre (mín. 8 caracteres)"
  }
  ```

#### Eliminar Categoría
- **Método**: `DELETE`
- **Ruta**: `/api/empleado/categoria`
- **Descripción**: Elimina una categoría existente.
- **Body**:
  ```json
  {
    "id": 1
  }
  ```

### Productos

#### Obtener todos los Productos
- **Método**: `GET`
- **Ruta**: `/api/empleado/producto`
- **Descripción**: Devuelve una lista de todos los productos.

#### Crear Producto
- **Método**: `POST`
- **Ruta**: `/api/empleado/producto`
- **Descripción**: Crea un nuevo producto.
- **Body**:
  ```json
  {
    "id_categoria": 1,
    "nombre": "Nombre del producto (mín. 5)",
    "descripcion": "Descripción del producto (mín. 10, máx. 500)"
  }
  ```

#### Actualizar Producto
- **Método**: `PUT`
- **Ruta**: `/api/empleado/producto`
- **Descripción**: Actualiza los detalles de un producto.
- **Body**:
  ```json
  {
    "id_producto": 1,
    "nombre": "Nuevo nombre (mín. 5)",
    "descripcion": "Nueva descripción (mín. 10, máx. 500)",
    "id_categoria": 2
  }
  ```

#### Eliminar Producto
- **Método**: `DELETE`
- **Ruta**: `/api/empleado/producto`
- **Descripción**: Elimina un producto.
- **Body**:
  ```json
  {
    "id": 1
  }
  ```

### Stock

#### Obtener Stock General
- **Método**: `GET`
- **Ruta**: `/api/empleado/stock`
- **Descripción**: Devuelve una lista del stock.

#### Registrar Movimiento de Stock
- **Método**: `POST`
- **Ruta**: `/api/empleado/stock/movimientos`
- **Descripción**: Crea un registro de movimiento de stock (para auditoría).
- **Body**:
  ```json
  {
    "id_producto": 1,
    "id_ubicacion_origen": 1,
    "id_ubicacion_destino": 2,
    "cantidad": 10,
    "id_usuario": 1
  }
  ```

#### Obtener Ubicaciones
- **Método**: `GET`
- **Ruta**: `/api/empleado/stock/ubicaciones`
- **Descripción**: Devuelve todas las ubicaciones del almacén.

#### Crear Ubicación
- **Método**: `POST`
- **Ruta**: `/api/empleado/stock/ubicaciones`
- **Descripción**: Crea una nueva ubicación.
- **Body**:
  ```json
  {
    "nombre": "Nombre de la ubicación (mín. 5)"
  }
  ```

#### Actualizar Ubicación
- **Método**: `PUT`
- **Ruta**: `/api/empleado/stock/ubicaciones`
- **Descripción**: Actualiza el nombre de una ubicación.
- **Body**:
  ```json
  {
    "id": 1,
    "nombre": "Nuevo nombre de ubicación (mín. 5)"
  }
  ```

#### Asignar Stock a Ubicación
- **Método**: `POST`
- **Ruta**: `/api/empleado/stock/asignar-ubicacion`
- **Descripción**: Asigna una cantidad inicial de un producto a una ubicación.
- **Body**:
  ```json
  {
    "id_producto": 1,
    "id_ubicacion": 1,
    "cantidad": 100
  }
  ```

#### Actualizar Stock en Ubicación
- **Método**: `PUT`
- **Ruta**: `/api/empleado/stock/asignar-ubicacion`
- **Descripción**: Actualiza la cantidad de un producto en una ubicación.
- **Body**:
  ```json
  {
    "id": 1,
    "cantidad": 150
  }
  ```

#### Eliminar Stock de Ubicación
- **Método**: `DELETE`
- **Ruta**: `/api/empleado/stock/asignar-ubicacion`
- **Descripción**: Elimina un registro de stock en una ubicación.
- **Body**:
  ```json
  {
    "id": 1
  }
  ```