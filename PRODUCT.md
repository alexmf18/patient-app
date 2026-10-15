# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Personal sanitario de un centro de salud (medicina de familia y enfermería). Trabajan con mucho volumen y poco tiempo por paciente: entre una consulta y la siguiente necesitan localizar a un paciente, ver lo crítico (alergias, diagnóstico, tratamiento) y registrar o actualizar datos en segundos. Usan la app tanto en el ordenador de la consulta como en tablet o móvil con el mismo peso.

## Product Purpose

PatientApp permite a cada profesional registrar, consultar y mantener la ficha clínica básica de sus pacientes: datos personales, contacto, grupo sanguíneo, alergias, diagnóstico, tratamiento, notas y estado (activo/inactivo). El éxito es que la información crítica esté a la vista sin buscarla y que dar de alta o editar a un paciente no interrumpa el ritmo de la consulta.

Ahora mismo es un proyecto de curso y portfolio: los datos son ficticios y la app debe demostrar oficio de producto y de diseño.

## Positioning

Una herramienta de cartera personal para el profesional, no un sistema hospitalario completo: cada usuario ve solo sus pacientes, con la seguridad clínica (alergias) en primer plano.

## Operating Context

- Consultas cortas y encadenadas en un centro de salud; interrupciones frecuentes.
- Escritorio y dispositivos táctiles con el mismo peso.
- Idioma: español (España). Identificación por DNI/NIE y número de la Seguridad Social.

## Capabilities and Constraints

- Frontend React 19 + Vite + Tailwind 4 + React Router 7; iconos lucide-react.
- API Express en `api/index.js` (Vercel serverless), autenticación JWT + bcrypt, base de datos libsql (SQLite local / Turso en producción).
- Funciones: registro e inicio de sesión, panel principal, lista paginada con búsqueda, alta, edición, ficha y eliminación de pacientes.
- No existen todavía: citas, historial de visitas, roles múltiples ni compartir pacientes entre profesionales.

## Brand Commitments

- Nombre: PatientApp.

## Evidence on Hand

- Datos de demostración ficticios en `server/database/seed.js` (usuario demo@hospital.com / password123).
- No hay testimonios, clientes ni métricas reales; no inventarlos.

## Product Principles

1. Lo crítico primero: las alergias y el estado del paciente nunca deben quedar escondidos.
2. Segundos, no minutos: cada flujo frecuente (buscar, abrir ficha, editar) debe resolverse con el mínimo de pasos.
3. Sin sorpresas: toda acción confirma su resultado y lo destructivo pide confirmación.
4. Funciona igual de bien con ratón que con el dedo.

## Accessibility & Inclusion

WCAG 2.1 AA como mínimo: contraste, navegación completa por teclado, foco visible y gestionado en modales y menús.
