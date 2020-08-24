import Head from 'next/head'
import { GetServerSideProps } from 'next';
import router, { useRouter } from 'next/router';
import { Field, Form, Formik, useField, useFormikContext } from 'formik';
import { getMakes, Make } from '../database/getMakes'
import { Paper, Grid, Select, FormControl, InputLabel, MenuItem, makeStyles, SelectProps, Button } from '@material-ui/core';
import { Model, getModels } from '../database/getModels';
import { getAsString } from '../utils/common';
import useSWR from 'swr';

const useStyles = makeStyles((theme) => ({
  paper: {
    margin: 'auto',
    maxWidth: 600,
    padding: theme.spacing(3)
  }
}));

export interface SearchProps {
  makes: Make[];
  models: Model[];
  singleColumn? :boolean;
}

export default function Search({makes, models, singleColumn} : SearchProps) {
  const classes = useStyles();
  const { query } = useRouter();
  const smValue = singleColumn ? 12 : 6;

  const initialValues = {
    make: getAsString(query.make) || 'all',
    model: getAsString(query.model) || 'all',
    minprice: getAsString(query.minprice) || 'all',
    maxprice: getAsString(query.maxprice) || 'all'
  };

  const prices = [500, 1000, 5000, 15000, 25000, 50000, 100000];

  const handleSubmit = (values) => {
    // Shallow Routing
    router.push({
        pathname: '/cars',
        query: { ...values, page: 1 },
      },
      undefined,
      { shallow: true }
    );
  }
  
  return (
    <div>
      <Head>
          <title>Search Cars | Car Trader</title>
      </Head>
      <Formik initialValues={initialValues} onSubmit={(values) => {handleSubmit(values)}}>
        {({values}) => (
          <Form>
            <Paper elevation={5} className={classes.paper}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={smValue}>
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
                <Grid item xs={12} sm={smValue}>
                  <ModelSelect name="model" make={values.make} models={models} />
                </Grid>
                <Grid item xs={12} sm={smValue}>
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
                <Grid item xs={12} sm={smValue}>
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

                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Search Cars
                  </Button>
                </Grid>

              </Grid>
            </Paper>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}

// Custom Model Component
export function ModelSelect ({ models, make, ...props }: ModelSelectProps) {
  const { setFieldValue } = useFormikContext()
  const [field] = useField({
    name: props.name
  });
  
  const { data } = useSWR<Model[]>('/api/models?make=' + make, {
    onSuccess: (newValues) => {
      if(!newValues.map(item => item.model).includes(field.value)) {
        // set field.value = all
        setFieldValue('model', 'all');
      }
    }
  });

  const newModels = data || models;

  return <FormControl fullWidth variant="outlined">
      <InputLabel id="search-model">Model</InputLabel>
      <Select
        name="model"
        labelId="search-model"
        label="Model"
        {...field}
        {...props}
      >
        <MenuItem value="all">
          <em>All Models</em>
        </MenuItem>
        {newModels.map((model, index) => (
          <MenuItem key={index} value={model.model}>
            {`${model.model} (${model.count})`}
          </MenuItem>
        ))}
      </Select>
    </FormControl>;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  // const makes = await getMakes();
  // const models = await getModels(make);
  
  // other way to wait models until finishes makes response
  const [makes, models] = await Promise.all([
    getMakes(), getModels(make)
  ]);

  return { props: { makes, models } };
};