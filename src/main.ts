import * as core from '@actions/core'
import * as glob from '@actions/glob'
import * as github from '@actions/github'
import {CoberturaParser} from './parser/cobertura-parser'
import {MessageBuilder} from './message-builder'
import {MethodEntity, ObjectEntity} from './parser/coverage-parser'

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
    const builder = new MessageBuilder('## Coverage Report')
    let totalModuleCount = 0
    let totalLineRate = 0.0
    let totalBranchRate = 0.0
    for await (const file of globber.globGenerator()) {
      core.info(`load coverage file ${file}`)
      const coverage = parser.parse(file)
      if (coverage) {
        if (coverage.objectCoverages) {
          for (const obj of coverage.objectCoverages) {
            builder.appendCoverage(
              obj.name,
              '',
              '',
              obj.lineRate * 100,
              obj.branchRate * 100
            )
            appendClassCoverage(
              builder,
              obj.name,
              '',
              obj.objectCoverages,
              obj.methodCoverages
            )
          }
        }
        totalLineRate += coverage.lineRate
        totalBranchRate += coverage.branchRate
      }
      totalModuleCount++
    }
    if (totalModuleCount > 0) {
      const averageLineRate = (totalLineRate / totalModuleCount) * 100
      const averageBranchRate = (totalBranchRate / totalModuleCount) * 100
      core.debug(`Total line covered ${averageLineRate}`)
      core.debug(`Total branch covered ${averageBranchRate}`)

      builder.appendCoverage(
        'Total',
        '',
        '',
        averageLineRate,
        averageBranchRate
      )

      const pullRequest = github.context.payload['pull_request']
      if (pullRequest?.number) {
        const octokit = github.getOctokit(token)
        await octokit.rest.issues.createComment({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: pullRequest.number,
          body: builder.toString()
        })
      } else {
        if (!debug) {
          core.setFailed('Pull Request event only.')
        }
      }
    } else {
      core.warning('Coverage file does not found.')
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
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

function appendClassCoverage(
  builder: MessageBuilder,
  moduleName: string,
  className: string,
  objects: ObjectEntity[] | undefined,
  methods: MethodEntity[] | undefined
): void {
  if (methods) {
    for (const method of methods) {
      builder.appendCoverage(
        moduleName,
        className,
        method.name,
        method.lineRate * 100,
        method.branchRate * 100
      )
    }
  }
  if (objects) {
    for (const obj of objects) {
      builder.appendCoverage(
        moduleName,
        obj.name,
        '',
        obj.lineRate * 100,
        obj.branchRate * 100
      )
      appendClassCoverage(
        builder,
        moduleName,
        obj.name,
        obj.objectCoverages,
        obj.methodCoverages
      )
    }
  }
}

run()
