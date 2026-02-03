/**
 * Dimensiones RIASEC (Holland): etiquetas y descripciones para gráficos y resultados.
 * R=Realista, I=Investigador, A=Artístico, S=Social, E=Emprendedor, C=Convencional
 */

export const RIASEC_ORDER = ["R", "I", "A", "S", "E", "C"] as const;

export const RIASEC_LABELS: Record<string, string> = {
  R: "Realista",
  I: "Investigador",
  A: "Artístico",
  S: "Social",
  E: "Emprendedor",
  C: "Convencional",
  // Por si el backend envía nombres completos o variantes
  Realista: "Realista",
  Investigador: "Investigador",
  Artístico: "Artístico",
  Social: "Social",
  Emprendedor: "Emprendedor",
  Convencional: "Convencional",
};

export const RIASEC_DESCRIPTIONS: Record<string, string> = {
  R: "Actividades prácticas, uso de herramientas y trabajo con objetos.",
  I: "Análisis, investigación y trabajo con ideas y datos.",
  A: "Creatividad, expresión y trabajo con formas y diseños.",
  S: "Ayuda a otros, enseñanza y trabajo con personas.",
  E: "Liderazgo, persuasión, ventas y gestión.",
  C: "Organización, datos y trabajo con números y registros.",
  Realista: "Actividades prácticas, uso de herramientas y trabajo con objetos.",
  Investigador: "Análisis, investigación y trabajo con ideas y datos.",
  Artístico: "Creatividad, expresión y trabajo con formas y diseños.",
  Social: "Ayuda a otros, enseñanza y trabajo con personas.",
  Emprendedor: "Liderazgo, persuasión, ventas y gestión.",
  Convencional: "Organización, datos y trabajo con números y registros.",
};

/** Índice para ordenar dimensiones (R=0, I=1, A=2, S=3, E=4, C=5) */
const RIASEC_ORDER_INDEX: Record<string, number> = {};
RIASEC_ORDER.forEach((letter, i) => {
  RIASEC_ORDER_INDEX[letter] = i;
  RIASEC_ORDER_INDEX[RIASEC_LABELS[letter]] = i;
});

export type DatoDimension = { dimension: string; puntuacion: number; nombreCompleto: string; descripcion: string };

/**
 * Ordena y enriquece los datos de puntuaciones por dimensión para gráficos RIASEC.
 * Devuelve array con dimension, puntuacion, nombreCompleto y descripcion.
 */
export function prepararDatosDimensiones(
  puntuaciones: Record<string, number> | Record<string, unknown> | undefined
): DatoDimension[] {
  if (!puntuaciones || typeof puntuaciones !== "object") return [];

  const entries = Object.entries(puntuaciones).map(([dim, val]) => {
    const key = dim.length === 1 ? dim.toUpperCase() : dim;
    const nombreCompleto = RIASEC_LABELS[key] ?? dim;
    const descripcion = RIASEC_DESCRIPTIONS[key] ?? "";
    return {
      dimension: key,
      puntuacion: Math.round(Number(val)),
      nombreCompleto,
      descripcion,
    };
  });

  return entries.sort((a, b) => {
    const ia = RIASEC_ORDER_INDEX[a.dimension] ?? RIASEC_ORDER_INDEX[a.nombreCompleto] ?? 999;
    const ib = RIASEC_ORDER_INDEX[b.dimension] ?? RIASEC_ORDER_INDEX[b.nombreCompleto] ?? 999;
    if (ia !== ib) return ia - ib;
    return a.dimension.localeCompare(b.dimension);
  });
}
