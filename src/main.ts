import * as core from '@actions/core'
import glob from '@actions/glob'
import {CoberturaParser} from './parser/CoberturaParser'

const types = ['cobertura']

async function run(): Promise<void> {
  try {
    const debug = core.getInput('debug') === '1'
    const paths = core.getInput('paths', {required: true, trimWhitespace: true})
    const type = core.getInput('type', {trimWhitespace: true})

    GuardCoverageType(type)

    const globber = await glob.create(paths)
    const parser = new CoberturaParser()
    let totalModuleCount = 0
    let totalLineCovered = 0.0
    let totalBranchCovered = 0.0
    for await (const file of globber.globGenerator()) {
      const coverage = parser.parse(file)
      if (coverage) {
        totalLineCovered += coverage.lineCovered
        totalBranchCovered += coverage.branchCovered * 100
      }
      totalModuleCount++
    }
    if (totalModuleCount > 0) {
      core.debug(
        `Total line covered ${(totalLineCovered / totalModuleCount) * 100}`
      )
      core.debug(
        `Total branch covered ${(totalBranchCovered / totalModuleCount) * 100}`
      )
    } else {
      core.setFailed('Coverage file does not found.')
    }

    core.debug(`Input path ${paths}`)
    core.debug(`Input debug mode ${debug}`)
  } catch (error) {
    core.setFailed(error.message)
  }
}

function GuardCoverageType(type: string): void {
  if (types.includes(type)) {
    core.setFailed('type input has invalid argument')
  }
}

run()
