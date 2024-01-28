import { ReactNode, useState } from "react";
import {
    Accordion,
    AccordionDetails,
    Stack,
    useTheme
} from "@mui/material";
import AccordionSummaryDiv from "./AccordionSummaryDiv";

// ----------------------------------------------------------------------

type WorkbenchAccordionContainerType = {
    title: string;
    table_body: ReactNode | undefined;
};

export default function BYUAccordion({ title, table_body }: WorkbenchAccordionContainerType) {

    const theme = useTheme();
    const label_color = theme.palette.text.secondary;

    const [accordionOpen, setAccordionOpen] = useState<boolean>(false);

    const cell_sx = {
        color: label_color,
        backgroundColor: theme.palette.grey.default_canvas,
        '&:first-of-type': { boxShadow: 'none' },
        '&:last-of-type': { boxShadow: 'none' },
        backgroundImage: 'none'
    };

    return (
        <Stack width={'100%'}>
            <Accordion
                disableGutters={true}
                expanded={accordionOpen}
                sx={{ ...(accordionOpen && { bgcolor: 'transparent' }) }}
                TransitionProps={{ unmountOnExit: true }}
            >
                <AccordionSummaryDiv accordionOpen={accordionOpen} setAccordionOpen={setAccordionOpen} title={title} />
                <AccordionDetails sx={{ pt: 3 }}>
                    {table_body}
                </AccordionDetails>
            </Accordion>
        </Stack>
    );
}