export function guaranteeNumber(param: string, restrictions?: { minimum?: number, maximum?: number }): { value: number, error: string | null } {
  const intParam = parseInt(param);

  if (isNaN(intParam)) {
    return { value: -1, error: `Param "${param}" must be a number` }
  }

  if (restrictions) {
    if (restrictions.minimum && intParam < restrictions.minimum) {
      return { value: -1, error: `Param "${param}" must be greater than ${restrictions.minimum}` }
    }

    if (restrictions.maximum && intParam > restrictions.maximum) {
      return { value: -1, error: `Param "${param}" must be less than ${restrictions.maximum}` }
    }
  }

  return { value: intParam, error: null }
}