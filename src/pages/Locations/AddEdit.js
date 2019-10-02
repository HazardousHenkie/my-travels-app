import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'

import { compose } from 'recompose'

import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'

import AddStep1 from '../../components/Locations/addStep1'
import AddStep2 from '../../components/Locations/addStep2'
import PreviewStep from '../../components/Locations/PreviewStep'

import * as routes from '../../constants/routes'

import SnackbarContext from '../../components/Snackbar/Context'

import { WithAuthorization } from '../../components/Authentication'
import { withFirebase } from '../../components/Firebase'

import history from '../../Helpers/History'

import './AddEdit.scss'

const useStyles = makeStyles(theme => ({
  rootPaper: {
    padding: theme.spacing(3, 2)
  },
  title: {
    flexGrow: 1
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

const HorizontalLinearStepper = ({ firebase, match, location }) => {
  const classes = useStyles()
  const { setSnackbarState } = useContext(SnackbarContext)
  const [activeStep, setActiveStep] = useState(0)
  const [skipped, setSkipped] = useState(new Set())
  const [edit, setEdit] = useState(false)

  const [locationLocal, setLocation] = useState({
    id: location && location.state ? location.state.location.id : '',
    title: location && location.state ? location.state.location.title : '',
    description:
      location && location.state ? location.state.location.description : '',
    imageURL: location && location.state ? location.state.location.image : ''
  })

  const [initialSetup, setInitialSetup] = useState(true)
  const [uploadedFile, setLoadedFile] = useState(
    location && location.state !== undefined
      ? location.state.location.image
      : ''
  )
  const { userId } = useSelector(state => state.user)
  const [finishedRequest, setFinishedRequest] = useState(false)
  const steps = GetSteps()

  useEffect(() => {
    if (match && match.params.id !== undefined && location === undefined) {
      const unsubscribe = firebase
        .locations()
        .child(userId)
        .child(match.params.id)
        .once('value', snapshot => {
          if (snapshot.val() !== null) {
            const locationObject = snapshot.val()

            setLocation({
              id: match.params.id,
              title: locationObject.location,
              description: locationObject.description,
              imageURL: locationObject.downloadURL
            })

            setLoadedFile(locationObject.downloadURL)
            setFinishedRequest(true)
          } else {
            history.push(routes.home)
          }
        })
        .catch(removeError => {
          setSnackbarState({ message: removeError.message, variant: 'error' })
        })
      return () => unsubscribe
    }
    setFinishedRequest(true)
    return () => null
  }, [firebase, setSnackbarState, userId, match, initialSetup, location])

  const GetStepContent = step => {
    const step2Props = {
      uploadedFile,
      setLoadedFile,
      initialLocation: locationLocal,
      initialSetup,
      setInitialSetup
    }

    switch (step) {
      case 0:
        return (
          finishedRequest && (
            <AddStep1
              setEdit={setEdit}
              setLocation={setLocation}
              initialLocation={locationLocal}
            />
          )
        )
      case 1:
        return <AddStep2 step2Props={step2Props} />
      case 2:
        return (
          <PreviewStep location={locationLocal} uploadedFile={uploadedFile} />
        )
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
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <div className="location_add">
          <header className="location_add__header">
            <Typography variant="h5" component="h2" className={classes.title}>
              Add/edit location
            </Typography>
          </header>
          <Paper className={`${classes.rootPaper} center-content`}>
            <Stepper alternativeLabel activeStep={activeStep}>
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

            {!finishedRequest && (
              <CircularProgress className="messageLoading" />
            )}

            <div>
              {activeStep === steps.length ? (
                <div>
                  <Typography className={classes.instructions}>
                    All steps completed - you&apos;re finished!
                  </Typography>
                  <Button onClick={HandleReset} className={classes.button}>
                    Reset
                  </Button>

                  <Button
                    component={Link}
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    to={routes.locations}
                  >
                    Locations
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
      </Grid>
    </Grid>
  )
}

export default compose(
  withFirebase,
  WithAuthorization
)(HorizontalLinearStepper)
