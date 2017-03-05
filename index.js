const path = require("path")

function result({ specs, config, log }) {
  const totalTests = specs.flatSpecs.length
  const failedTests = specs.flatSpecs
    .filter(spec => spec.passTest === false)
    .length
  const totalComponents = specs.groupedSpecs.length
  const failedComponents = specs.groupedSpecs
    .filter(spec => spec.passTest === false)
    .length
  const badge = failedComponents === 0
    ? log.format.badge.good(` PASSED ALL ${totalComponents} COMPONENTS `)
    : log.format.badge.bad(` FAILED ${failedComponents} OF ${totalComponents} COMPONENTS `)

  log.log()
  log.log(`${badge} Performed ${totalTests} tests, failed ${failedTests}`)
  log.log()
  log.info("Screenshots available")
  log.infoValue("   New", config.get("temp.screenshots.new"))
  log.infoValue("   Diff", config.get("temp.screenshots.diff"))
  log.infoValue("   Master", config.get("temp.screenshots.master"))

  return specs
}

function test({ specs, log }) {
  const badge = specs.passTest
    ? log.format.badge.good(" PASS ")
    : log.format.badge.bad(" FAIL ")
  const missMatch = specs.masterScreenshotExists
    ? `Mismatch %: ${specs.misMatchPercentage}`
    : "No master screenshot"
  const missMatchLabel = specs.passTest
    ? ""
    : ` | ${missMatch}`
  const resolution = `${specs.resolution.width}x${specs.resolution.height}`

  log.log(`${badge}   ${specs.spec.id}`)
  log.log(`           ${specs.variantName} | ${specs.browser} | ${resolution}${missMatchLabel}`)
}

module.exports = {
  result,
  test
}
