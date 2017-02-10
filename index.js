const path = require("path")

function result({ specs, config, chalk, log }) {
  const totalTests = specs.flatSpecs.length
  const failedTests = specs.flatSpecs
    .filter(spec => spec.passTest === false)
    .length
  const totalComponents = specs.groupedSpecs.length
  const failedComponents = specs.groupedSpecs
    .filter(spec => spec.passTest === false)
    .length
  const badge = failedComponents === 0
    ? chalk.bgGreen.white(` PASSED ALL ${totalComponents} COMPONENTS `)
    : chalk.bgRed.white(` FAILED ${failedComponents} OF ${totalComponents} COMPONENTS `)

  log.log()
  log.log(badge)
  log.log(`Performed ${totalTests} tests, failed ${failedTests}` )
  log.log()
  log.info("Screenshots available")
  log.infoValue("   New", config.get("temp.screenshots.new"))
  log.infoValue("   Diff", config.get("temp.screenshots.diff"))
  log.infoValue("   Master", config.get("temp.screenshots.master"))

  return specs
}

function test({ specs, chalk, log }) {
  const badge = specs.passTest
    ? chalk.white.bgGreen(" PASS ")
    : chalk.white.bgRed(" FAIL ")
  const missMatch = specs.masterScreenshotExists
    ? `Mismatch %: ${chalk.bold(specs.misMatchPercentage)}`
    : "No master screenshot"
  const resolution = `${specs.resolution.width}x${specs.resolution.height}`

  log.log(`${badge}   ${specs.spec.id}`)
  log.log(`           ${specs.variantName} | ${specs.browser} | ${resolution} | ${missMatch}`)
}

module.exports = {
  result,
  test
}
