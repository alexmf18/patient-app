---
name: PatientApp
description: Gradilla de extracciones — cada paciente es un tubo etiquetado en la bandeja de hoy.
colors:
  tray: "#eef1ee"
  rail: "#e2e7e3"
  well: "#d7ddd9"
  label: "#ffffff"
  rule: "#cfd6d1"
  rule-strong: "#b4bdb7"
  ink: "#18201c"
  ink-2: "#46504b"
  ink-3: "#5b6560"
  cap-violet: "#6a48c7"
  violet-deep: "#5b3bb8"
  violet-ink: "#4a2fa0"
  violet-wash: "#efeafb"
  cap-red: "#cf3428"
  red-ink: "#a3241b"
  red-wash: "#fdecea"
  cap-green: "#2c8653"
  green-ink: "#1f6b41"
  green-wash: "#e3f2e9"
  cap-gray: "#9aa29d"
  warn-ink: "#9a4a00"
  warn-wash: "#fff3e3"
typography:
  headline:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.55
  body:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  label:
    fontFamily: "Atkinson Hyperlegible Next, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
  data:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    fontFeature: "tnum"
  data-xs:
    fontFamily: "Atkinson Hyperlegible Mono, ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    fontFeature: "tnum"
rounded:
  skeleton: "6px"
  control: "8px"
  surface: "12px"
  well: "16px"
  cap: "9999px"
spacing:
  gutter-mobile: "16px"
  gutter-tablet: "24px"
  gutter-desktop: "40px"
  panel: "20px"
  panel-lg: "24px"
  control-x: "18px"
  control-height: "44px"
components:
  button-primary:
    backgroundColor: "{colors.violet-deep}"
    textColor: "{colors.label}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.violet-ink}"
  button-secondary:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  button-quiet:
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  button-quiet-hover:
    backgroundColor: "{colors.rail}"
    textColor: "{colors.ink}"
  icon-button:
    textColor: "{colors.ink-3}"
    rounded: "{rounded.control}"
    size: "44px"
  field-input:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "8px 12px"
    height: "44px"
  field-input-invalid:
    backgroundColor: "{colors.warn-wash}"
    textColor: "{colors.ink}"
  choice-chip:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "44px"
  choice-chip-selected:
    backgroundColor: "{colors.violet-wash}"
    textColor: "{colors.violet-ink}"
  label-stock:
    backgroundColor: "{colors.label}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "20px"
  panel:
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "20px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.label}"
    rounded: "{rounded.control}"
---

# Design System: PatientApp

## Overview

**Creative North Star: "La gradilla de extracciones"**

Cada paciente es un tubo de extracción etiquetado y colocado en la gradilla de hoy. La interfaz es la bandeja del laboratorio: un fondo gris verdoso claro, alveolos hundidos que existen de verdad como estructura, tapones de color que dicen una sola cosa cada uno, y una etiqueta térmica blanca impresa en tinta casi negra donde vive la identidad del paciente. Nada se pinta para decorar; el color es un código y la tipografía está elegida para leerse rápido entre consulta y consulta.

La densidad es de herramienta, no de folleto: un contenedor compartido, paneles reglados con filete fino y sin relleno, y una única superficie elevada (la etiqueta). La profundidad sale del material (alveolos con sombra interior, tapón que se levanta) y no de tarjetas flotantes. El sistema rechaza el SaaS azul con barra degradada y tarjetas de métricas.

**Key Characteristics:**
- Bandeja gris verdosa (`tray`) como lienzo; todo lo demás se imprime encima o se hunde en ella.
- Tapones de color como código semántico exclusivo: verde activo, gris inactivo, rojo alergia, violeta acción.
- Etiqueta térmica blanca como única superficie con sombra.
- Atkinson Hyperlegible Next para la interfaz, Atkinson Hyperlegible Mono solo para datos de etiqueta.
- Un solo movimiento de autor: el tapón se levanta al recibir foco o hover.

## Colors

Paleta de laboratorio: neutros gris verdosos de bandeja y tinta, más cuatro colores de tapón que son señales, nunca adornos.

### Primary
- **Violeta de tapón** (`cap-violet`): el color de la acción y la selección. Contorno de foco (`:focus-visible`, 2px, separación 2px), anillo de foco de campo, caret, tapón del logotipo y franja superior de la tarjeta de acceso.
- **Violeta profundo** (`violet-deep`): relleno del botón primario «Nuevo paciente», borde de la ficha de opción seleccionada, icono de la entrada activa de navegación, hover del alveolo vacío «+».
- **Violeta tinta** (`violet-ink`): hover del botón primario y texto sobre `violet-wash`.
- **Lavado violeta** (`violet-wash`): fondo de selección activa (fichas de opción y filtros seleccionados, `::selection`).

### Secondary
- **Verde de tapón** (`cap-green`): paciente activo. Tapón, franja superior de la etiqueta, punto de estado. Texto en `green-ink`.
- **Gris de tapón** (`cap-gray`): paciente inactivo. Mismos lugares que el verde; el texto inactivo usa `ink-3`.

### Tertiary
- **Rojo de tapón** (`cap-red`): alergias y nada más. Anillo alrededor del tapón en la gradilla, banda en el tubo de perfil, muestra de leyenda. El aviso de alergias de la etiqueta usa `red-wash` de fondo y `red-ink` de texto.
- **Ámbar de aviso** (`warn-ink`, `warn-wash`): errores de formulario y validación. Borde y fondo del campo inválido, mensaje de error bajo el campo.

### Neutral
- **Bandeja** (`tray`): fondo de toda la app y del buscador en reposo.
- **Raíl** (`rail`): barra lateral, cajón móvil, alveolo, hover de botones silenciosos.
- **Pozo** (`well`): fondo hundido de la gradilla.
- **Etiqueta** (`label`): blanco térmico; etiquetas, tarjeta de acceso, campos, cabecera superior, botón secundario.
- **Filete** (`rule`) y **filete fuerte** (`rule-strong`): divisores y bordes de etiqueta / bordes de panel, campo y botón secundario.
- **Tinta** (`ink`, `ink-2`, `ink-3`): texto principal, secundario y terciario (placeholders, metadatos, iconos en reposo).

### Named Rules
**La Regla del Tapón.** Cada color de tapón tiene un único significado: verde = activo, gris = inactivo, rojo = alergia (exclusivo), violeta = acción primaria, selección activa y foco (exclusivo). Ningún color aparece como decoración.

**La Regla del Ámbar.** Los errores de formulario son ámbar (`warn-*`), nunca rojo: el rojo está reservado a las alergias.

**La Regla del Enlace en Tinta.** Los enlaces de texto son tinta con subrayado (separación 3px), nunca violeta. Los títulos de fila enlazados (nombre del paciente en listas) se subrayan al hover.

## Typography

**Display Font:** Atkinson Hyperlegible Next (con ui-sans-serif, system-ui)
**Body Font:** Atkinson Hyperlegible Next (con ui-sans-serif, system-ui)
**Label/Mono Font:** Atkinson Hyperlegible Mono (con ui-monospace, SFMono-Regular, Consolas)

**Character:** Una pareja de la misma familia pensada para legibilidad clínica: la sans lleva la interfaz y la mono imprime los datos como lo haría una impresora de etiquetas.

### Hierarchy
- **Headline** (700, 1.5rem en móvil / 1.875rem desde 640px): título de página (saludo del panel, «Pacientes», formulario) y nombre en la etiqueta grande de la ficha.
- **Title** (700, 1.125rem): títulos de sección y de diálogo.
- **Body** (400, 0.9375rem; 16px en campos en móvil para evitar el zoom de iOS): texto general y campos.
- **Body pequeño** (400, 0.875rem): diagnósticos en filas, descripciones, cuerpo de diálogo.
- **Label** (600, 0.875rem): etiquetas de campo y leyendas; «(opcional)» en 400 y `ink-3`.
- **Data** (Mono 400, 0.875rem / 0.75rem, cifras tabulares): DNI, fechas, código corto, recuentos de leyenda, iniciales del tapón, atajos de teclado.

### Named Rules
**La Regla de la Mono.** Atkinson Hyperlegible Mono solo para datos de etiqueta: DNI, fechas, códigos, recuentos, grupo sanguíneo. Nunca para títulos ni prosa.

**La Regla del Apellido.** El nombre del paciente se imprime como en una etiqueta: APELLIDO en mayúsculas, coma, nombre.

## Layout

La app es un marco de tres piezas: barra lateral fija de 256px en `rail` desde 1024px (cajón modal de 288px por debajo), cabecera blanca con el buscador global y el área principal sobre la bandeja. Todo el contenido vive en **un único contenedor compartido** (máx. 72rem / `max-w-6xl`, centrado) con márgenes de 16px en móvil, 24px desde 640px y 40px desde 1024px.

Los formularios usan una medida propia alineada a la izquierda (máx. 48rem / `max-w-3xl`) dentro de ese contenedor, con secciones apiladas a 24px. El panel principal reparte gradilla (2/3) y etiqueta enfocada (1/3) en escritorio. La gradilla tiene 8 alveolos por fila en escritorio y 4 en móvil, y siempre completa filas, dejando alveolos vacíos visibles. Todos los objetivos táctiles miden al menos 44px. Respeta `safe-area-inset` arriba y abajo.

## Elevation & Depth

Sistema plano por defecto con profundidad material. La bandeja es el plano base; los paneles son filetes impresos sobre ella sin relleno ni sombra; la gradilla y sus alveolos se hunden con sombra interior; la etiqueta térmica es la única superficie que flota en reposo.

### Shadow Vocabulary
- **Etiqueta** (`--shadow-label`): etiquetas de paciente y tarjeta de acceso.
- **Elevación** (`--shadow-lift`): tapón levantado, diálogos y avisos (toasts); solo para lo que está temporalmente por encima.
- **Hundido** (sombra interior): pozo de la gradilla y cada alveolo; el tapón en reposo lleva un filo interior inferior.

### Named Rules
**La Regla de la Etiqueta Única.** `.label-stock` (blanco, filete, sombra de etiqueta) se reserva para las etiquetas de paciente y la tarjeta de acceso. Todo lo demás es un panel: filete `rule-strong` de 1px, sin relleno, sin sombra, sobre la bandeja.

## Shapes

Esquinas suaves y funcionales: 8px en controles (botones, campos, fichas, avisos), 12px en superficies (etiqueta, panel, diálogo), 16px en el pozo de la gradilla, 6px en esqueletos y círculo completo en tapones y alveolos. Las etiquetas llevan una franja superior de 8px con el color de estado y un pie con filete discontinuo, código de barras derivado del id y fecha en mono. El alveolo vacío de alta usa borde discontinuo de 2px.

## Components

### Buttons
Firmes y táctiles, sin adorno.
- **Shape:** esquinas suaves (8px), altura mínima 44px, peso 600 a 0.9375rem.
- **Primary:** violeta profundo con texto blanco; una por pantalla («Nuevo paciente», «Guardar»). Hover a violeta tinta.
- **Secondary:** blanco con filete fuerte; hover oscurece el borde a `ink-3`.
- **Ink:** relleno tinta para la confirmación destructiva del diálogo; hover a negro.
- **Quiet:** solo texto `ink-2`, hover con fondo `rail`.
- **Icon:** 44×44px, icono `ink-3`, hover `rail` + tinta.
- **Estados:** transiciones de 150ms con ease-out expo; al pulsar baja 1px; deshabilitado al 55% de opacidad.

### Chips
- **Style:** fichas de opción (radio) blancas con filete fuerte, 44px de alto, texto `ink-2`.
- **State:** seleccionada en `violet-wash` con borde `violet-deep` y texto `violet-ink`; con error, borde `warn-ink`. El foco se dibuja como contorno violeta sobre la ficha. Los filtros de la lista usan el mismo tratamiento de selección.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** panel sin relleno (la bandeja se ve a través); etiqueta en blanco.
- **Shadow Strategy:** ver Elevation & Depth; solo la etiqueta.
- **Border:** panel 1px `rule-strong`; etiqueta 1px `rule`.
- **Internal Padding:** 20px, 24px desde 640px; etiqueta grande 28px.

### Inputs / Fields
- **Style:** blanco, filete fuerte de 1px, 8px de radio, 44px de alto; placeholder `ink-3`. El buscador global reposa en `tray` y pasa a blanco al enfocar.
- **Focus:** borde violeta y anillo de 3px violeta al 18%.
- **Error / Disabled:** borde `warn-ink`, fondo `warn-wash`, anillo ámbar al enfocar; mensaje en `warn-ink` 600 bajo el campo y resumen enlazado al inicio del formulario.

### Navigation
- **Style:** barra lateral `rail` con entradas de 44px, 0.9375rem peso 500 en `ink-2`.
- **Active:** fondo blanco, texto tinta e icono violeta profundo. Hover: blanco al 60%.
- **Mobile:** cajón modal nativo `<dialog>` que entra desde la izquierda (220ms); en la cabecera, botón de menú y acceso directo violeta a «Nuevo paciente». Atajos de teclado visibles en mono («/», «N»).

### Gradilla (componente firma)
Pozo hundido en `well` con alveolos circulares en `rail`. Cada paciente es un tapón visto desde arriba con sus iniciales en mono blanco; verde o gris según estado y anillo rojo de 3px si tiene alergias. Al recibir foco o hover, el tapón se levanta 4px con la sombra de elevación (200ms, ease-out expo) y la etiqueta de la derecha cambia al paciente. Navegable con flechas. El primer alveolo libre es el alta: borde discontinuo y «+». En filas y cabeceras se usa el tubo de perfil (tapón de color, banda roja si hay alergias). Las alergias se detectan ignorando valores como «ninguna conocida», «no», «sin alergias», «NKDA» o «n/a».

### Etiqueta de paciente (componente firma)
Superficie térmica: franja de estado, APELLIDO, nombre en negrita, línea mono con DNI · edad · sexo, grupo sanguíneo enmarcado en tinta, estado con punto de color, bloque de alergias (rojo si las hay, bandeja atenuada si no) y pie con código de barras.

### Avisos y diálogos
Avisos en tinta con texto blanco, abajo a la derecha (centrados en móvil), máx. 3, entrada de 220ms, acción «Deshacer» cuando procede. Diálogos de confirmación sobre `<dialog>` nativo: blanco, 12px, sombra de elevación, entrada de 200ms, foco inicial en «Cancelar», fondo tinta al 45%.

## Do's and Don'ts

### Do:
- **Do** usar el color solo como señal: verde activo, gris inactivo, rojo alergia, violeta acción/selección/foco, ámbar error de formulario.
- **Do** reservar la etiqueta térmica (blanco + sombra de etiqueta) para etiquetas de paciente y la tarjeta de acceso; todo lo demás es un panel reglado sin relleno.
- **Do** imprimir DNI, fechas, códigos y recuentos en Atkinson Hyperlegible Mono con cifras tabulares.
- **Do** colocar todo el contenido en el contenedor compartido (72rem) y los formularios en la medida izquierda de 48rem.
- **Do** mantener objetivos táctiles de al menos 44px y el contorno de foco violeta visible.
- **Do** limitar el movimiento a transiciones de estado de 150ms, el levantamiento del tapón (200ms), avisos y diálogos (200–220ms), todo con ease-out expo y anulado con `prefers-reduced-motion`.

### Don't:
- **Don't** usar rojo para nada que no sea una alergia, ni para errores de formulario.
- **Don't** usar violeta como decoración, en enlaces de texto o en estados que no sean acción, selección o foco.
- **Don't** añadir sombras a paneles, filas o tarjetas: la etiqueta es la única superficie elevada en reposo.
- **Don't** usar la mono para títulos, botones o prosa.
- **Don't** construir barras degradadas, tarjetas de métricas ni el azul SaaS genérico.
- **Don't** añadir animaciones de entrada a páginas o listas: el único movimiento de autor es el tapón que se levanta.
