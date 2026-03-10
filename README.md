# NASA APOD Archive

Explora las maravillas del universo con esta aplicación web diseñada para consultar la **Imagen Astronómica del Día (APOD)** de la NASA. La aplicación permite navegar por el archivo histórico, ver imágenes en alta resolución y disfrutar de una galería con los descubrimientos más recientes.

## 🚀 Características

- **Exploración Histórica**: Selecciona cualquier fecha desde junio de 1995 para descubrir qué capturó la NASA ese día.
- **Galería Reciente**: Visualiza automáticamente los últimos 7 días de descubrimientos astronómicos.
- **Soporte Multimedia**: Manejo inteligente tanto de imágenes como de videos astronómicos.
- **Diseño Espacial Premium**: Interfaz moderna con temática de "espacio profundo", animaciones suaves y efectos visuales inmersivos.
- **Optimización Local**: Sistema de caché para una navegación rápida entre fechas ya consultadas.

## 🛠️ Tecnologías

- **Backend**: Python con [Flask](https://flask.palletsprojects.com/)
- **Frontend**: JavaScript (ES6+), HTML5 Semántico y CSS3 personalizado.
- **Herramientas de Construcción**: [Vite](https://vitejs.dev/) para la gestión de assets.
- **API**: [NASA Planetary APOD API](https://api.nasa.gov/).

## 📋 Requisitos Previos

- Python 3.8 o superior.
- Una clave de API de la NASA (puedes obtener una en [api.nasa.gov](https://api.nasa.gov/)).

## ⚙️ Configuración e Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd nasa-photo-project
   ```

2. **Crear y activar un entorno virtual**:
   ```bash
   python -m venv venv
   # En Windows:
   .\venv\Scripts\activate
   # En macOS/Linux:
   source venv/bin/activate
   ```

3. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   npm install
   ```

4. **Variables de Entorno**:
   Crea un archivo `.env` en la raíz del proyecto y añade tu clave de API:
   ```env
   NASA_KEY=tu_clave_aqui
   ```

## 🏃 Ejecución

### Modo Desarrollo (Flask)
Para ejecutar el servidor de backend:
```bash
python app.py
```
La aplicación estará disponible en `http://127.0.0.1:5000`.

### Modo Desarrollo (Vite Assets)
Si deseas realizar cambios en el CSS o JS con recarga en caliente:
```bash
npm run dev
```

---
*Desarrollado con ❤️ para los entusiastas del espacio.*
