import React, { useEffect } from 'react'
import clsx from 'clsx'
import Select from 'react-select'
import { emphasize, makeStyles, useTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import NoSsr from '@material-ui/core/NoSsr'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Chip from '@material-ui/core/Chip'
import MenuItem from '@material-ui/core/MenuItem'
import CancelIcon from '@material-ui/icons/Cancel'
import axios from 'axios'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    minWidth: 290
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: '16px'
  },
  input: {
    display: 'flex',
    height: 'auto'
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden'
  },
  chip: {
    margin: theme.spacing(0.5, 0.25)
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light'
        ? theme.palette.grey[300]
        : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2)
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: 'absolute',
    left: 16,
    bottom: 24.5,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing(2)
  }
}))

const NoOptionsMessage = props => {
  const { selectProps, innerProps, children } = props
  return (
    <Typography
      color="textSecondary"
      className={selectProps.classes.noOptionsMessage}
      {...innerProps}
    >
      {children}
    </Typography>
  )
}

const inputComponent = ({ inputRef, ...props }) => {
  return <div ref={inputRef} {...props} />
}

const Control = props => {
  const {
    children,
    innerProps,
    innerRef,
    selectProps: { classes, TextFieldProps }
  } = props

  return (
    <TextField
      fullWidth
      variant="outlined"
      className={classes.textField}
      InputProps={{
        inputComponent,
        inputProps: {
          className: classes.input,
          ref: innerRef,
          children,
          ...innerProps
        }
      }}
      {...TextFieldProps}
    />
  )
}

const Option = props => {
  const { innerRef, isFocused, isSelected, innerProps, children } = props
  return (
    <MenuItem
      ref={innerRef}
      selected={isFocused}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
      {...innerProps}
    >
      {children}
    </MenuItem>
  )
}

const Placeholder = props => {
  const { selectProps, innerProps = {}, children } = props
  return (
    <Typography
      color="textSecondary"
      className={selectProps.classes.placeholder}
      {...innerProps}
    >
      {children}
    </Typography>
  )
}

function ValueContainer(props) {
  const { selectProps, children } = props
  return <div className={selectProps.classes.valueContainer}>{children}</div>
}

const MultiValue = props => {
  const { children, selectProps, isFocused, removeProps } = props
  return (
    <Chip
      tabIndex={-1}
      label={children}
      className={clsx(selectProps.classes.chip, {
        [selectProps.classes.chipFocused]: isFocused
      })}
      onDelete={removeProps.onClick}
      deleteIcon={<CancelIcon {...removeProps} />}
    />
  )
}

const Menu = props => {
  const { selectProps, innerProps, children } = props
  return (
    <Paper square className={selectProps.classes.paper} {...innerProps}>
      {children}
    </Paper>
  )
}

const IntegrationReactSelect = ({ multi, handleChangeMulti }) => {
  const components = {
    Control,
    Menu,
    MultiValue,
    NoOptionsMessage,
    Option,
    Placeholder,
    ValueContainer
  }

  const classes = useStyles()
  const theme = useTheme()

  const selectStyles = {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      '& input': {
        font: 'inherit'
      }
    })
  }

  const [suggestions, setSuggestions] = React.useState(null)

  useEffect(() => {
    async function fetchCountries() {
      const response = await axios.get('https://restcountries.eu/rest/v2/all')
      const suggestionsResponse = response.data.map(suggestion => ({
        value: suggestion.name,
        label: suggestion.name
      }))

      setSuggestions(suggestionsResponse)
    }
    fetchCountries()
  }, [])

  return (
    <div className={classes.root}>
      <NoSsr>
        <Select
          classes={classes}
          styles={selectStyles}
          inputId="react-select-multiple"
          TextFieldProps={{
            label: 'Countries',
            InputLabelProps: {
              htmlFor: 'react-select-multiple',
              shrink: true
            }
          }}
          placeholder="Select multiple countries"
          options={suggestions}
          components={components}
          value={multi}
          onChange={handleChangeMulti}
          isMulti
        />
      </NoSsr>
    </div>
  )
}

export default IntegrationReactSelect
