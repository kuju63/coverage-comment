import * as core from '@actions/core'
import * as glob from '@actions/glob'
import {CoberturaParser} from './parser/CoberturaParser'

const types = ['cobertura']

async function run(): Promise<void> {
  try {
    const debug = core.getInput('debug') === '1'
    const paths = core.getInput('paths', {trimWhitespace: true})
    const type = core.getInput('type', {trimWhitespace: true})
    const token = core.getInput('token')

    guardCoverageType(type)
    guardToken(token)

    const globber = await glob.create(paths)
    const parser = new CoberturaParser()
    let totalModuleCount = 0
    let totalLineRate = 0.0
    let totalBranchRate = 0.0
    for await (const file of globber.globGenerator()) {
      const coverage = parser.parse(file)
      if (coverage) {
        totalLineRate += coverage.lineRate
        totalBranchRate += coverage.branchRate
      }
      totalModuleCount++
    }
    if (totalModuleCount > 0) {
      core.debug(
        `Total line covered ${(totalLineRate / totalModuleCount) * 100}`
      )
      core.debug(
        `Total branch covered ${(totalBranchRate / totalModuleCount) * 100}`
      )
    } else {
      core.warning('Coverage file does not found.')
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

function guardCoverageType(type: string): void {
  if (!types.includes(type)) {
    core.setFailed('type input has invalid argument')
  }
}

function guardToken(token: string): void {
  if (!token) {
    core.setFailed('token is required')
  }
}

run()
