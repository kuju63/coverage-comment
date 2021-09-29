import fs from 'fs'
import parser from 'fast-xml-parser'
import {
  CoverageEntity,
  IParser,
  MethodEntity,
  ObjectEntity
} from './coverageParser'
import * as core from '@actions/core'

const nameAttr = '@_name'
const lineRateAttr = '@_line-rate'
const branchRateAttr = '@_branch-rate'
const linesCoveredAttr = '@_lines-covered'
const linesValidAttr = '@_lines-valid'
const branchesCoveredAttr = '@_branches-covered'
const branchesValidAttr = '@_branches-valid'
const complexityAttr = '@_complexity'
const signatureAttr = '@_signature'

export class CoberturaParser implements IParser {
  parse(path: string): CoverageEntity | undefined {
    if (!fs.existsSync(path)) {
      return
    }
    const coverageXml = parser.parse(fs.readFileSync(path).toString('utf-8'), {
      attributeNamePrefix: '@_',
      attrNodeName: 'attr',
      textNodeName: '#text',
      ignoreAttributes: false,
      parseNodeValue: true,
      parseAttributeValue: true,
      trimValues: true
    })
    coverageXml.coverage.packages
    const packages = this.parsePackage(coverageXml.coverage.packages.package)
    return {
      lineRate: coverageXml.coverage.attr[lineRateAttr],
      branchRate: coverageXml.coverage.attr[branchRateAttr],
      lineCovered: coverageXml.coverage.attr[linesCoveredAttr],
      lineValid: coverageXml.coverage.attr[linesValidAttr],
      branchCovered: coverageXml.coverage.attr[branchesCoveredAttr],
      branchValid: coverageXml.coverage.attr[branchesValidAttr],
      objectCoverages: packages
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parsePackage(coverage: any): ObjectEntity[] | undefined {
    if (coverage instanceof Array) {
      core.debug('Array')
      return coverage.map(v => {
        let classCoverage: ObjectEntity[] | undefined = undefined
        if (v.classes) {
          classCoverage = this.parseClass(v.classes.class)
        }
        return {
          name: v.attr[nameAttr],
          lineRate: v.attr[lineRateAttr],
          branchRate: v.attr[branchRateAttr],
          complexity: v.attr[complexityAttr],
          objectCoverages: classCoverage
        }
      })
    } else {
      core.debug('Object')
      return [
        {
          name: coverage.attr[nameAttr],
          lineRate: coverage.attr[lineRateAttr],
          branchRate: coverage.attr[branchRateAttr],
          complexity: coverage.attr[complexityAttr],
          objectCoverages: this.parseClass(coverage.classes.class)
        }
      ]
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseClass(coverage: any): ObjectEntity[] | undefined {
    if (coverage instanceof Array) {
      return coverage.map(v => {
        let methodEntities: MethodEntity[] | undefined = undefined
        if (v.methods) {
          methodEntities = this.parseMethod(v.methods.method)
        }
        return {
          name: v.attr[nameAttr],
          lineRate: v.attr[lineRateAttr],
          branchRate: v.attr[branchRateAttr],
          complexity: v.attr[complexityAttr],
          methodCoverages: methodEntities
        }
      })
    } else {
      let methodEntities: MethodEntity[] | undefined = undefined
      if (coverage.methods) {
        methodEntities = this.parseMethod(coverage.methods.method)
      }
      return [
        {
          name: coverage.attr[nameAttr],
          lineRate: coverage.attr[lineRateAttr],
          branchRate: coverage.attr[branchRateAttr],
          complexity: coverage.attr[complexityAttr],
          methodCoverages: methodEntities
        }
      ]
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseMethod(coverage: any): MethodEntity[] | undefined {
    if (coverage instanceof Array) {
      return coverage.map(v => {
        return {
          name: v.attr[nameAttr],
          signature: v.attr[signatureAttr],
          lineRate: v.attr[lineRateAttr],
          branchRate: v.attr[branchRateAttr],
          complexity: v.attr[complexityAttr]
        }
      })
    } else {
      return [
        {
          name: coverage.attr[nameAttr],
          signature: coverage.attr[signatureAttr],
          lineRate: coverage.attr[lineRateAttr],
          branchRate: coverage.attr[branchRateAttr],
          complexity: coverage.attr[complexityAttr]
        }
      ]
    }
  }
}
