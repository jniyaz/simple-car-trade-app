import Search from ".";
import useSWR from 'swr';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { CarModel } from '../../api/Car';
import { GetServerSideProps } from 'next';
import { Grid } from "@material-ui/core";
import { getAsString } from '../utils/common';
import { Make, getMakes } from "../database/getMakes";
import { Model, getModels } from '../database/getModels';
import deepEqual from 'fast-deep-equal';
import { stringify } from 'querystring';
import { CarPagination } from '../components/Cars/CarPagination';
import { CarCard } from '../components/Cars/CarCard';
import { getPaginatedCarsWithFilters } from "../database/getPaginatedCarsWithFilters";

export interface CarListProps {
    makes: Make[];
    models: Model[];
    cars: CarModel[];
    totalPages: number;
}

export default function CarsList({makes, models, cars, totalPages}: CarListProps) {
    
    const { query } = useRouter();
    const [serverQuery] = useState(query);

    const { data } = useSWR('/api/cars?' + stringify(query), {
        dedupingInterval: 20000,
        initialData: deepEqual(query, serverQuery)
          ? { cars, totalPages }
          : undefined,
      });
    
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={5} md={3} lg={2}>
                <Search singleColumn makes={makes} models={models} />
            </Grid>
            <Grid container item xs={12} sm={7} md={9} lg={10} spacing={3}>
                <Grid item xs={12}>
                <CarPagination totalPages={data?.totalPages} />
                </Grid>
                {(data?.cars || []).map((car) => (
                <Grid key={car.id} item xs={12} sm={6}>
                    <CarCard car={car} />
                </Grid>
                ))}
                <Grid item xs={12}>
                <CarPagination totalPages={data?.totalPages} />
                </Grid>
            </Grid>
        </Grid>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const make = getAsString(ctx.query.make);
    // other way to wait models until finishes makes response
    const [makes, models, pagination] = await Promise.all([ getMakes(), getModels(make), getPaginatedCarsWithFilters(ctx.query) ]);
    return { props: { 
        makes, 
        models,  
        cars: pagination.cars,
        totalPages: pagination.totalPages
    } };
  };