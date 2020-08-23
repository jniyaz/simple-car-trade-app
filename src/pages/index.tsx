import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Field, Form, Formik } from 'formik';
import { getMakes, Make } from '../database/getMakes'
import { Paper, Grid, Select, FormControl, InputLabel, MenuItem, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 'auto',
    maxWidth: 600,
    padding: theme.spacing(3)
  }
}));

export interface HomeProps {
  makes: Make[];
}

export default function Home({makes} : HomeProps) {
  const classes = useStyles();
  const { query } = useRouter();

  const initialValues = {
    make: query.make || 'all',
    model: query.model || 'all',
    minprice: query.minprice || 'all',
    maxprice: query.maxprice || 'all'
  };

  const prices = [500, 1000, 5000, 15000, 25000, 50000, 100000];
  
  return (
    <Formik initialValues={initialValues} onSubmit={() => {}}>
      {({values}) => (
        <Form>
          <Paper elevation={5} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="search-make">Make</InputLabel>
                    <Field
                      name="make"
                      as={Select}
                      labelId="search-make"
                      label="Make"
                    >
                      <MenuItem value="all">
                        <em>All Makes</em>
                      </MenuItem>
                      {makes.map((make, index) => (
                        <MenuItem key={index} value={make.make}>
                          {`${make.make} (${make.count})`}
                        </MenuItem>
                      ))}
                    </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>Model</Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="min-price">Min Price</InputLabel>
                    <Field
                      name="minprice"
                      as={Select}
                      labelId="min-price"
                      label="Min Price"
                    >
                      <MenuItem value="all">
                        <em>No Min Price</em>
                      </MenuItem>
                      {prices.map((price, index) => (
                        <MenuItem key={index} value={price}>
                          {price}
                        </MenuItem>
                      ))}
                    </Field>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="max-price">Max Price</InputLabel>
                    <Field
                      name="maxprice"
                      as={Select}
                      labelId="max-price"
                      label="Max Price"
                    >
                      <MenuItem value="all">
                        <em>No Max Price</em>
                      </MenuItem>
                      {prices.map((price, index) => (
                        <MenuItem key={index} value={price}>
                          {price}
                        </MenuItem>
                      ))}
                    </Field>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const makes = await getMakes();
  return { props: { makes } };
};