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
    this.msg.push('| Module Name | Line rate (avg) | Branch rate (avg) |')
    this.msg.push('| :---------- | --------------: | ----------------: |')
  }

  /**
   * Append coverage info
   * @param name Module name
   * @param lineCoverage line coverage value
   * @param branchCoverage branch coverage value
   * @returns Builder object
   */
  appendCoverage(
    name: string,
    lineCoverage: number,
    branchCoverage: number
  ): MessageBuilder {
    const lineMsg: string[] = []
    lineMsg.push(name, lineCoverage.toString(), branchCoverage.toString())

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
