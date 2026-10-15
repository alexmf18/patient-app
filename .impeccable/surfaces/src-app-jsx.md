---
version: 1
slug: "src-app-jsx"
primary_target: "src/App.jsx"
related_targets: ["src/pages","src/components"]
---

# PatientApp — app autenticada y acceso

Scope: toda la app (acceso, panel, lista, ficha, formulario). Mode: Operate.
Audiencia y tarea: personal de centro de salud; localizar paciente, ver lo crítico, registrar o editar en segundos, en escritorio y táctil.
Restricciones: datos ficticios (demo@hospital.com); WCAG AA; español.

## Direction contract

THESIS: Cada paciente es un tubo de extracción etiquetado en la gradilla de hoy. Rechaza el SaaS azul con barra degradada y tarjetas de métricas.

OWN-WORLD: Bandeja gris verdosa clara como fondo, etiqueta térmica blanca como única superficie, tinta casi negra verdosa. Tapones de color como código semántico y nunca como decoración: verde = activo, gris = inactivo, rojo = alergia (exclusivo), violeta = acción primaria y selección activa (exclusivo). Atkinson Hyperlegible Next para la interfaz, Atkinson Hyperlegible Mono para los datos de etiqueta (DNI, fechas, códigos). Retícula de alveolos visible como estructura real. Código de barras derivado del id en cada etiqueta.

STORY: El sanitario ve de un vistazo su gradilla: quién está activo y quién tiene alergias. Busca con «/», abre la etiqueta y edita sin perder el ritmo; cada acción confirma con un aviso y lo destructivo se puede deshacer.

FIRST VIEWPORT: Panel: a la izquierda (2/3) la gradilla vista desde arriba, un alveolo por paciente con su tapón de color y anillo rojo si tiene alergias, y los alveolos vacíos visibles; a la derecha (1/3) la etiqueta térmica del paciente enfocado. Encima, el saludo y la fecha en mono; la acción primaria violeta «Nuevo paciente» arriba a la derecha. Leyenda de tapones con recuentos bajo la gradilla.

FORM: Gradilla de extracciones, candidato 4 de 7 en mi lista ordenada; seed key af35cf76. Raises: tinta reservada (mapa de orientación) y retícula visible como estructura (Crouwel). Firma: el foco o hover sobre un tapón levanta el tubo y cambia la etiqueta de la derecha (150–200 ms).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
