/**
 * Builder of generate output message
 */
export class MessageBuilder {
  private msg: string[] = []

  /**
   * Initialize instance of MessageBuilder class.
   * @param header Message header
   */
  constructor(header: string) {
    this.msg.push(header)
    this.msg.push(
      '| Package Name | Class Name | Method Name | Line rate (avg) | Branch rate (avg) |'
    )
    this.msg.push(
      '| :---------- | ---------- | ------------ | --------------: | ----------------: |'
    )
  }

  /**
   * Append coverage info
   * @param name Module name
   * @param className Class name
   * @param methodName Method name
   * @param lineCoverage line coverage value
   * @param branchCoverage branch coverage value
   * @returns Builder object
   */
  appendCoverage(
    name: string,
    className: string,
    methodName: string,
    lineCoverage: number,
    branchCoverage: number
  ): MessageBuilder {
    const lineMsg: string[] = [
      name,
      className,
      methodName,
      lineCoverage.toString(),
      branchCoverage.toString()
    ]

    this.msg.push(`| ${lineMsg.join(' | ')} |`)

    return this
  }

  /**
   * Return message string
   * @returns Message string
   */
  toString(): string {
    return this.msg.join('\n')
  }
}
