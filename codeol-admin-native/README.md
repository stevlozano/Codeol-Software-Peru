# CODEOL Admin Native App

Aplicación nativa de Android/iOS para administradores de CODEOL Software Perú.

## Características

- ✅ **Autenticación** - Login con Supabase Auth
- ✅ **Gestión de Pedidos** - Ver, filtrar y actualizar estado
- ✅ **Calendario de Ventas** - Visualización mensual
- ✅ **Estadísticas** - Ingresos y métricas
- ✅ **Notificaciones Push** - Firebase Cloud Messaging
- ✅ **Permisos Nativos** - Cámara, galería, micrófono, ubicación
- ✅ **Modo Oscuro** - Interfaz minimalista

## Requisitos

- Node.js >= 18
- React Native CLI
- Android Studio (para Android)
- Xcode (para iOS - solo Mac)
- Firebase Project

## Instalación

```bash
# Instalar dependencias
npm install

# Instalar pods (iOS - solo Mac)
cd ios && pod install && cd ..
```

## Configuración Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Agrega apps Android e iOS
3. Descarga `google-services.json` (Android) y `GoogleService-Info.plist` (iOS)
4. Coloca los archivos en:
   - Android: `android/app/google-services.json`
   - iOS: `ios/codeoladminnative/GoogleService-Info.plist`

## Ejecución

```bash
# Android
npm run android

# iOS (solo Mac)
npm run ios
```

## Construcción para Producción

### Android APK

```bash
cd android
./gradlew assembleRelease
```

El APK estará en: `android/app/build/outputs/apk/release/app-release.apk`

### Android Bundle (Play Store)

```bash
cd android
./gradlew bundleRelease
```

### iOS (solo Mac)

1. Abre `ios/codeoladminnative.xcworkspace` en Xcode
2. Selecciona "Any iOS Device" como destino
3. Product → Archive
4. Distribuir a App Store

## Estructura

```
src/
├── components/     # Componentes reutilizables
├── screens/        # Pantallas de la app
├── navigation/     # Configuración de navegación
├── lib/           # Configuración de Supabase
├── utils/         # Utilidades (notificaciones, permisos)
```

## Permisos Requeridos

La app solicita los siguientes permisos:

- **Cámara** - Para escanear documentos
- **Galería** - Para subir archivos
- **Micrófono** - Para notas de voz
- **Ubicación** - Para servicios locales
- **Notificaciones** - Push de nuevos pedidos
- **Almacenamiento** - Guardar archivos

## Notificaciones Push

Las notificaciones push se envían desde Supabase usando Firebase. Configura tu servidor para enviar notificaciones al topic "admin" o a tokens específicos.

## Soporte

Para soporte contacta: codeolsoftware@gmail.com
