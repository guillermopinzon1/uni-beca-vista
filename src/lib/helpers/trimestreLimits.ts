/**
 * Helpers para gestión de límites de trimestres de becarios
 * Basado en FRONTEND_INTEGRATION_CAMBIO_TRIMESTRE.md
 */

export type TipoBecaLimite =
  | 'Ayudantía'
  | 'Impacto'
  | 'Excelencia'
  | 'Exoneración de Pago'
  | 'Formación Docente';

/**
 * Límites de trimestres por tipo de beca
 */
const LIMITES_TRIMESTRES: Record<TipoBecaLimite, number | null> = {
  'Ayudantía': 6,
  'Impacto': 4,
  'Excelencia': 8,
  'Exoneración de Pago': null, // Sin límite
  'Formación Docente': null,   // Sin límite
};

/**
 * Obtiene el límite de trimestres para un tipo de beca
 * @param tipoBeca - Tipo de beca
 * @returns Número de trimestres máximo o null si no tiene límite
 */
export function getLimiteTrimestres(tipoBeca: string): number | null {
  return LIMITES_TRIMESTRES[tipoBeca as TipoBecaLimite] ?? null;
}

/**
 * Formatea el progreso de trimestres como "X/Y" o "X trimestre(s)"
 * @param trimestresCursados - Trimestres cursados por el becario
 * @param tipoBeca - Tipo de beca
 * @returns String formateado, ej: "2/6" o "3 trimestres"
 */
export function formatTrimestresProgress(
  trimestresCursados: number,
  tipoBeca: string
): string {
  const limite = getLimiteTrimestres(tipoBeca);

  if (limite === null) {
    // Sin límite, mostrar solo trimestres cursados
    return `${trimestresCursados} trimestre${trimestresCursados !== 1 ? 's' : ''}`;
  }

  // Con límite, mostrar progreso
  return `${trimestresCursados}/${limite}`;
}

/**
 * Verifica si un becario ha alcanzado el límite de trimestres
 * @param trimestresCursados - Trimestres cursados
 * @param tipoBeca - Tipo de beca
 * @returns true si alcanzó el límite, false si no
 */
export function hasReachedLimit(
  trimestresCursados: number,
  tipoBeca: string
): boolean {
  const limite = getLimiteTrimestres(tipoBeca);

  if (limite === null) {
    return false; // Sin límite
  }

  return trimestresCursados >= limite;
}

/**
 * Verifica si un becario puede ser renovado
 * @param estado - Estado actual del becario
 * @param trimestresCursados - Trimestres cursados
 * @param tipoBeca - Tipo de beca
 * @returns true si puede renovarse, false si no
 */
export function canRenewBecario(
  estado: string,
  trimestresCursados: number,
  tipoBeca: string
): boolean {
  // Solo Culminada o Incompleta pueden renovarse
  const estadoValido = estado === 'Culminada' || estado === 'Incompleta';

  if (!estadoValido) {
    return false;
  }

  // Verificar límite de trimestres
  return !hasReachedLimit(trimestresCursados, tipoBeca);
}

/**
 * Obtiene el color del badge según el progreso
 * @param trimestresCursados - Trimestres cursados
 * @param tipoBeca - Tipo de beca
 * @returns Clase de color para el badge
 */
export function getTrimestresBadgeColor(
  trimestresCursados: number,
  tipoBeca: string
): string {
  const limite = getLimiteTrimestres(tipoBeca);

  if (limite === null) {
    return 'bg-blue-100 text-blue-800 border-blue-200';
  }

  const percentage = (trimestresCursados / limite) * 100;

  if (percentage >= 100) {
    // Límite alcanzado
    return 'bg-red-100 text-red-800 border-red-200';
  } else if (percentage >= 75) {
    // Cerca del límite
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  } else {
    // Progreso normal
    return 'bg-green-100 text-green-800 border-green-200';
  }
}

/**
 * Obtiene mensaje de advertencia si está cerca del límite
 * @param trimestresCursados - Trimestres cursados
 * @param tipoBeca - Tipo de beca
 * @returns Mensaje de advertencia o null
 */
export function getWarningMessage(
  trimestresCursados: number,
  tipoBeca: string
): string | null {
  const limite = getLimiteTrimestres(tipoBeca);

  if (limite === null) {
    return null;
  }

  if (trimestresCursados >= limite) {
    return `Ha alcanzado el límite de ${limite} trimestres para ${tipoBeca}`;
  }

  const trimestresRestantes = limite - trimestresCursados;

  if (trimestresRestantes === 1) {
    return `Solo resta 1 trimestre antes de alcanzar el límite`;
  } else if (trimestresRestantes === 2) {
    return `Restan 2 trimestres antes de alcanzar el límite`;
  }

  return null;
}
