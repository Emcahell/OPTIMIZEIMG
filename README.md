# OPTIMIZEIMG

**Herramienta de optimización de imágenes 100% local y privada**

## ¿Qué es OPTIMIZEIMG?

OPTIMIZEIMG es una aplicación web moderna que permite comprimir y convertir imágenes al formato WebP de manera eficiente y segura. Todo el procesamiento se realiza directamente en el navegador.

## Características Principales

- 🔄 **Conversión a WebP**: Transforma imágenes JPEG, PNG y otros formatos a WebP
- 📉 **Reducción de tamaño**: Comprime imágenes hasta un 70% sin pérdida visible de calidad
- 🔒 **100% Privado**: Las imágenes nunca salen de tu navegador
- ⚡ **Procesamiento local**: Sin servidores, sin APIs externas, sin esperas
- 📱 **Responsive**: Funciona perfectamente en desktop y móviles
- 🎯 **Inteligente**: Mantiene el archivo original si la compresión no reduce el tamaño

## ¿Por qué optimizar imágenes?

Las imágenes representan más del 50% del peso total de las páginas web. Optimizarlas mejora:

- **Velocidad de carga**: Sitios más rápidos
- **Experiencia de usuario**: Mejor rendimiento
- **SEO**: Google favorece sitios rápidos
- **Ancho de banda**: Menor consumo de datos
- **Costos de hosting**: Menos almacenamiento necesario

## Privacidad y Seguridad

- ✅ Sin subida a servidores
- ✅ Sin almacenamiento en la nube
- ✅ Sin tracking de imágenes
- ✅ Procesamiento 100% local
- ✅ Archivos eliminados al cerrar la pestaña

## Tecnologías Utilizadas

### Frontend Framework
- **Next.js 16.1.2**: Framework React para aplicaciones web modernas
- **React 19.2.3**: Biblioteca para construir interfaces de usuario
- **TypeScript 5**: Tipado estático para mayor robustez

### Estilos y UI
- **TailwindCSS 4**: Framework CSS para diseño rápido y responsive
- **Lucide Icons**: Iconos modernos y consistentes

### Procesamiento de Imágenes
- **browser-image-compression 2.0.2**: Librería principal para compresión
- **FileReader API**: Lectura local de archivos

### Manejo de Archivos
- **File-Saver 2.0.5**: Descarga de archivos procesados
- **JSZip 3.10.1**: Creación de archivos ZIP para descargas masivas
- **React-Dropzone 14.3.8**: Componente para arrastrar y soltar archivos

### Utilidades
- **clsx 2.1.1**: Utilidades para clases condicionales
- **tailwind-merge 3.4.0**: Fusión inteligente de clases Tailwind

## Formatos Soportados

### Entrada
- JPEG/JPG
- PNG
- WebP
- BMP

### Salida
- WebP (formato moderno con excelente compresión)
- Original (si la compresión no es beneficiosa)

## Características Técnicas

### Compresión Inteligente
- Comparación automática de tamaños
- Mantención del original si WebP es más grande
- Calidad ajustable (0.8 por defecto)

### Diagnóstico
- Verificación de soporte WebP
- Pruebas de descarga múltiples
- Validación de archivos

## Instalación y Uso

### Desarrollo
```bash
npm install
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## Acceso

La aplicación está disponible en: https://optimizeimg.vercel.app

## Licencia

MIT License - Libre para uso comercial y personal

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor abre un issue para sugerencias o reportes de bugs.

---

**OPTIMIZEIMG** - Optimización de imágenes simple, segura y eficiente.