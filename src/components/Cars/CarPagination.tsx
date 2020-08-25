import Link from 'next/link';
import { forwardRef } from 'react';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { PaginationRenderItemParams } from '@material-ui/lab';
import { getAsString } from '../../utils/common';

export function CarPagination({totalPages}: { totalPages: number }) {
    const { query } = useRouter();
    return (
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
    );
}

export interface MaterialUiLinkProps {
    item: PaginationRenderItemParams;
    query: ParsedUrlQuery;
}
  
const MaterialUiLink = forwardRef<HTMLAnchorElement, MaterialUiLinkProps>(({ item, query, ...props }, ref) => (
    <Link
        href={{
        pathname: '/cars',
        query: { ...query, page: item.page },
        }}
    >
        <a ref={ref} {...props}></a>
    </Link>
));