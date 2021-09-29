import {mocked} from 'ts-jest/utils'
import {CoberturaParser} from '../src/parser/coberturaParser'
import fs from 'fs'
import * as core from '@actions/core'

jest.mock('fs')
jest.mock('@actions/core')

const fsExists = mocked(fs.existsSync)
const fsReadSync = mocked(fs.readFileSync)
const coreDebug = mocked(core.debug)
afterEach(() => {
  fsExists.mockClear()
  fsReadSync.mockClear()
  coreDebug.mockClear()
})

describe('Test CobeturaParser', () => {
  it('File does not exist return null', () => {
    fsExists.mockImplementation(_ => false)
    const target = new CoberturaParser()
    const actual = target.parse('sample.xml')
    expect(actual).toBeUndefined()
  })

  it('Multiple packages and many classes, methods', () => {
    fsExists.mockImplementation(_ => true)
    fsReadSync.mockImplementation(_path => {
      return Buffer.from(`<?xml version="1.0" encoding="utf-8"?>
      <coverage line-rate="0.8181" branch-rate="0.75" version="1.9" timestamp="1622395212" lines-covered="9" lines-valid="11" branches-covered="3" branches-valid="4">
        <sources>
          <source>/</source>
        </sources>
        <packages>
          <package name="Sample" line-rate="0.8181" branch-rate="0.75" complexity="4">
            <classes>
              <class name="Sample.Class1" filename="Users/kuriharajun/projects/github/coverage-comment-test/csharp/src/Sample/Class1.cs" line-rate="0.8181" branch-rate="0.75" complexity="4">
                <methods>
                  <method name="ToConvertInt" signature="(System.String)" line-rate="0.8181" branch-rate="0.75" complexity="4">
                    <lines>
                      <line number="6" hits="3" branch="False" />
                      <line number="7" hits="3" branch="True" condition-coverage="100% (2/2)">
                        <conditions>
                          <condition number="9" type="jump" coverage="100%" />
                        </conditions>
                      </line>
                    </lines>
                  </method>
                  <method name="ToConvertFloat" signature="(System.String)" line-rate="0.8181" branch-rate="0.75" complexity="4">
                    <lines>
                      <line number="6" hits="3" branch="False" />
                      <line number="7" hits="3" branch="True" condition-coverage="100% (2/2)">
                        <conditions>
                          <condition number="9" type="jump" coverage="100%" />
                        </conditions>
                      </line>
                    </lines>
                  </method>
                </methods>
              </class>
              <class name="Sample.Class2" filename="Users/kuriharajun/projects/github/coverage-comment-test/csharp/src/Sample/Class1.cs" line-rate="0.8181" branch-rate="0.75" complexity="4">
                <methods>
                  <method name="ToConvertInt" signature="(System.String)" line-rate="0.8181" branch-rate="0.75" complexity="4">
                    <lines>
                      <line number="6" hits="3" branch="False" />
                      <line number="7" hits="3" branch="True" condition-coverage="100% (2/2)">
                        <conditions>
                          <condition number="9" type="jump" coverage="100%" />
                        </conditions>
                      </line>
                    </lines>
                  </method>
                </methods>
              </class>
            </classes>
          </package>
          <package name="Sample.V2" line-rate="0.8181" branch-rate="0.75" complexity="4">
          </package>
        </packages>
      </coverage>`)
    })
    const target = new CoberturaParser()
    const actual = target.parse('sample.xml')
    expect(coreDebug.mock.calls[0]).toEqual(['Array'])
    expect(actual).toStrictEqual({
      lineRate: 0.8181,
      branchRate: 0.75,
      lineCovered: 9,
      lineValid: 11,
      branchCovered: 3,
      branchValid: 4,
      objectCoverages: [
        {
          name: 'Sample',
          lineRate: 0.8181,
          branchRate: 0.75,
          complexity: 4,
          objectCoverages: [
            {
              name: 'Sample.Class1',
              lineRate: 0.8181,
              branchRate: 0.75,
              complexity: 4,
              methodCoverages: [
                {
                  name: 'ToConvertInt',
                  signature: '(System.String)',
                  lineRate: 0.8181,
                  branchRate: 0.75,
                  complexity: 4
                },
                {
                  name: 'ToConvertFloat',
                  signature: '(System.String)',
                  lineRate: 0.8181,
                  branchRate: 0.75,
                  complexity: 4
                }
              ]
            },
            {
              name: 'Sample.Class2',
              lineRate: 0.8181,
              branchRate: 0.75,
              complexity: 4,
              methodCoverages: [
                {
                  name: 'ToConvertInt',
                  signature: '(System.String)',
                  lineRate: 0.8181,
                  branchRate: 0.75,
                  complexity: 4
                }
              ]
            }
          ]
        },
        {
          name: 'Sample.V2',
          lineRate: 0.8181,
          branchRate: 0.75,
          complexity: 4,
          objectCoverages: undefined
        }
      ]
    })
    console.log(coreDebug.mock.calls[1])
  })
  it('Single package and single class, method', () => {
    fsExists.mockImplementation(_ => true)
    fsReadSync.mockImplementation(_path => {
      return Buffer.from(`<?xml version="1.0" encoding="utf-8"?>
      <coverage line-rate="0.8181" branch-rate="0.75" version="1.9" timestamp="1622395212" lines-covered="9" lines-valid="11" branches-covered="3" branches-valid="4">
        <sources>
          <source>/</source>
        </sources>
        <packages>
          <package name="Sample" line-rate="0.8181" branch-rate="0.75" complexity="4">
            <classes>
              <class name="Sample.Class1" filename="Users/kuriharajun/projects/github/coverage-comment-test/csharp/src/Sample/Class1.cs" line-rate="0.8181" branch-rate="0.75" complexity="4">
                <methods>
                  <method name="ToConvertInt" signature="(System.String)" line-rate="0.8181" branch-rate="0.75" complexity="4">
                    <lines>
                      <line number="6" hits="3" branch="False" />
                      <line number="7" hits="3" branch="True" condition-coverage="100% (2/2)">
                        <conditions>
                          <condition number="9" type="jump" coverage="100%" />
                        </conditions>
                      </line>
                    </lines>
                  </method>
                </methods>
              </class>
            </classes>
          </package>
        </packages>
      </coverage>`)
    })
    const target = new CoberturaParser()
    const actual = target.parse('sample.xml')
    expect(coreDebug.mock.calls[0]).toEqual(['Object'])
    expect(actual).toStrictEqual({
      lineRate: 0.8181,
      branchRate: 0.75,
      lineCovered: 9,
      lineValid: 11,
      branchCovered: 3,
      branchValid: 4,
      objectCoverages: [
        {
          name: 'Sample',
          lineRate: 0.8181,
          branchRate: 0.75,
          complexity: 4,
          objectCoverages: [
            {
              name: 'Sample.Class1',
              lineRate: 0.8181,
              branchRate: 0.75,
              complexity: 4,
              methodCoverages: [
                {
                  name: 'ToConvertInt',
                  signature: '(System.String)',
                  lineRate: 0.8181,
                  branchRate: 0.75,
                  complexity: 4
                }
              ]
            }
          ]
        }
      ]
    })
    console.log(coreDebug.mock.calls[1])
  })
})
