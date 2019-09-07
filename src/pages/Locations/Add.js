import React, { useState } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'

import AddStep1 from './addStep1'
import AddStep2 from './addStep2'
import PreviewStep from './PreviewStep'

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%'
  },
  rootPaper: {
    padding: theme.spacing(3, 2)
  },
  button: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}))

const GetSteps = () => {
  return ['Where did you go?', 'Show us where you went!', 'Preview']
}

const HorizontalLinearStepper = () => {
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const [edit, setEdit] = useState(false)
  const [location, setLocation] = useState({
    id: '',
    title: '',
    description: '',
    imageURL: ''
  })
  const [initialSetup, setInitialSetup] = useState(true)
  const [uploadedFile, setLoadedFile] = useState('')
  const steps = GetSteps()

  const GetStepContent = step => {
    const step2Props = {
      uploadedFile,
      setLoadedFile,
      initialLocation: location,
      initialSetup,
      setInitialSetup
    }

    switch (step) {
      case 0:
        return (
          <AddStep1
            setEdit={setEdit}
            setLocation={setLocation}
            initialLocation={location}
          />
        )
      case 1:
        return <AddStep2 step2Props={step2Props} />
      case 2:
        return <PreviewStep location={location} uploadedFile={uploadedFile} />
      default:
        return 'Unknown step'
    }
  }

  const IsStepOptional = step => {
    return step === 1
  }

  const IsStepSkipped = step => {
    return skipped.has(step)
  }

  const HandleNext = () => {
    let newSkipped = skipped

    if (IsStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(newSkipped)
  }

  const HandleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const HandleSkip = () => {
    if (!IsStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.")
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values())

      newSkipped.add(activeStep)

      return newSkipped
    })
  }

  const HandleReset = () => {
    setActiveStep(0)
    setLocation({
      id: '',
      title: '',
      description: '',
      imageURL: ''
    })
    setLoadedFile('')
    setEdit(false)
    setInitialSetup(true)
  }

  return (
    <div className={classes.root}>
      <Paper className={`${classes.rootPaper} center-content`}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {}
            const labelProps = {}

            if (IsStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              )
            }

            if (IsStepSkipped(index)) {
              stepProps.completed = false
            }

            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            )
          })}
        </Stepper>

        <div>
          {activeStep === steps.length ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed - you&apos;re finished!
              </Typography>
              <Button onClick={HandleReset} className={classes.button}>
                Reset
              </Button>
            </div>
          ) : (
            <div>
              <div className={classes.instructions}>
                {GetStepContent(activeStep)}
              </div>
              <div>
                <Button
                  disabled={activeStep === 0}
                  onClick={HandleBack}
                  className={classes.button}
                >
                  Back
                </Button>
                {IsStepOptional(activeStep) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={HandleSkip}
                    className={classes.button}
                  >
                    Skip
                  </Button>
                )}

                <Button
                  disabled={!edit}
                  variant="contained"
                  color="primary"
                  onClick={HandleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Paper>
    </div>
  )
}

export default HorizontalLinearStepper
