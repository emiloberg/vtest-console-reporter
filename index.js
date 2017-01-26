const path = require("path")

function log(str = "") {
  console.log(`   ${str}`)
}

function report({ specs, config, chalk }) {
  let failedComponents = 0
  log()

  specs.groupedSpecs.forEach(component => {
    log(`${component.passTest ? chalk.white.bgGreen(" PASS ") : chalk.white.bgRed(" FAIL ")}   ${component.id}`)

    if (!component.passTest) {
      failedComponents += 1
      component.variants.forEach(variant => {
        const passVariant = variant.resolutions.every(resolution => (
          resolution.screenshots.every(screenshot => screenshot.passTest)
        ))

        if (!passVariant) {
          log(`           Props variant: ${variant.id}`)
          variant.resolutions.forEach(resolution => {
            resolution.screenshots.forEach(screenshot => {
              if (!screenshot.passTest) {
                log(`             ${screenshot.browser}`
                  + ` - ${screenshot.resolution.width}x${screenshot.resolution.height}`)
                log(`               Mismatch %: ${chalk.bold(screenshot.misMatchPercentage)}`)
                if (screenshot.masterScreenshotExists) {
                  log(`               Diff: ${
                    chalk.bold(
                      path.join(config.temp.screenshots.diff, screenshot.screenshotFilename)
                    )}`)
                } else {
                  log(`               ${chalk.bold(
                    "Screenshot to compare against does not exist!"
                  )}`)
                }
              }
            })
          })
        }
      })
    }
  })

  log()
  if (failedComponents === 0) {
    log(chalk.bgGreen.white(` PASSED ALL ${specs.groupedSpecs.length} TESTS `))
  } else {
    log(
      chalk.bgRed.white(
        ` FAILED ${failedComponents} OF ${specs.groupedSpecs.length} COMPONENTS `
      )
    )
  }
  log()

  console.log()
  console.log(chalk.blue("   Screenshots available"))
  console.log(chalk.blue("      New: ") + config.temp.screenshots.new)
  console.log(chalk.blue("      Diff: ") + config.temp.screenshots.diff)
  console.log(chalk.blue("      Master: ") + config.temp.screenshots.master)
  console.log()

  return specs
}

module.exports = report
