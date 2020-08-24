import { Grid } from "@material-ui/core";
import Search from ".";
import { GetServerSideProps } from 'next';
import { getAsString } from '../utils/common';
import { Make, getMakes } from "../database/getMakes";
import { Model, getModels } from '../database/getModels';
import { CarModel } from '../../api/Car';

export interface CarListProps {
    makes: Make[];
    models: Model[];
    cars: CarModel[];
    totalPages: number;
}

export default function CarsList({makes, models, cars, totalPages}: CarListProps) {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={5} md={3} lg={2}>
                <Search singleColumn makes={makes} models={models} />
            </Grid>
            <Grid item xs={12} sm={7} md={9} lg={10}>
                Right
            </Grid>
        </Grid>
    );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const make = getAsString(ctx.query.make);
    // other way to wait models until finishes makes response
    const [makes, models] = await Promise.all([ getMakes(), getModels(make) ]);
    return { props: { makes, models } };
  };