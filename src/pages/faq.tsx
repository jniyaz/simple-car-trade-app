import Head from 'next/head'
import { GetStaticProps } from "next"
import { openDB } from "../openDB"
import { FaqModel } from '../../api/Faq';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface FaqProps {
    faq: FaqModel[];
}

export default function Faq({faq}: FaqProps) {
    return <div>
        <Head>
            <title>FAQ | Car Trader</title>
        </Head>
        <div>
            <Typography variant="h4">FAQ</Typography>
            {faq.map(f => 
                <Accordion key={f.id}>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                    >
                    <Typography>{f.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Typography>
                        {f.answer}
                    </Typography>
                    </AccordionDetails>
                </Accordion>
            )}
        </div>
    </div>
}

export const getStaticProps: GetStaticProps = async () => {
    const db = await openDB();
    const faq = await db.all('SELECT * FROM FAQ ORDER BY createDate DESC');
    return { props: { faq } };
}