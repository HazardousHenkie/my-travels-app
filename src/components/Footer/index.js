import React from 'react'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import './Footer.scss'

import moment from 'moment'

const Footer = () => {
  return (
    <footer className="footer">
      <Container fixed>
        <Grid container justify="center" spacing={0}>
          <Grid xs={12} sm={8} item>
            <div className="footer_inner">
              <Grid container justify="center" spacing={0}>
                <Grid item>
                  <div className="footer_inner__copyright">
                    {`Kyle @${moment().format('YYYY')} - `}
                  </div>
                </Grid>
                <Grid item>
                  <a
                    className="footer_inner__image_copyright"
                    href="https://www.freepik.com/free-photos-vectors/background"
                  >
                    Background vector created by freepik - www.freepik.com
                  </a>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Container>
    </footer>
  )
}

export default Footer
