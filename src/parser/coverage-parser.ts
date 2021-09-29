export interface IParser {
  /**
   * Parse coverage file
   * @param path Coverage file path
   * @returns Coverage result
   */
  parse(path: string): CoverageEntity | undefined
}

export interface CoverageEntity {
  lineRate: number
  branchRate: number
  lineCovered: number
  lineValid: number
  branchCovered: number
  branchValid: number
  objectCoverages?: ObjectEntity[]
}

export interface ObjectEntity {
  name: string
  lineRate: number
  branchRate: number
  complexity: number
  objectCoverages?: ObjectEntity[]
  methodCoverages?: MethodEntity[]
}

export interface MethodEntity extends ObjectEntity {
  signature: string
}
