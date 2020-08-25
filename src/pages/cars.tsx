import Search from ".";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CarModel } from '../../api/Car';
import { GetServerSideProps } from 'next';
import { Grid } from "@material-ui/core";
import { ParsedUrlQuery } from 'querystring';
import { getAsString } from '../utils/common';
import { Make, getMakes } from "../database/getMakes";
import { Model, getModels } from '../database/getModels';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { PaginationRenderItemParams } from '@material-ui/lab';
import { getPaginatedCarsWithFilters } from "../database/getPaginatedCarsWithFilters";

export interface CarListProps {
    makes: Make[];
    models: Model[];
    cars: CarModel[];
    totalPages: number;
}

export default function CarsList({makes, models, cars, totalPages}: CarListProps) {
    
    const { query } = useRouter();
    
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={5} md={3} lg={2}>
                <Search singleColumn makes={makes} models={models} />
            </Grid>
            <Grid item xs={12} sm={7} md={9} lg={10}>
                <Pagination
                    page={parseInt(getAsString(query.page) || '1')}
                    count={totalPages}
                    renderItem={(item) => (
                    <PaginationItem
                        component={MaterialUiLink}
                        query={query}
                        item={item}
                        {...item}
                    />
                    )}
                />
                <pre>
                    {JSON.stringify({cars, totalPages}, null, 4)}
                </pre>
            </Grid>
        </Grid>
    );
}

export interface MaterialUiLinkProps {
    item: PaginationRenderItemParams;
    query: ParsedUrlQuery;
}
  
  export function MaterialUiLink({ item, query, ...props }: MaterialUiLinkProps) {
    return (
      <Link
        href={{
          pathname: '/cars',
          query: { ...query, page: item.page },
        }}
      >
        <a {...props}></a>
      </Link>
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