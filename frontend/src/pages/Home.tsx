import { Divider, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Page from "src/components/base/Page";
import { PATH_PAGE } from "src/routes/paths";
import { useContext, useEffect, useState } from "react";
import { MetadataContext } from "src/contexts/MetadataContext";
import { useApiCall } from "src/hooks/useApiCall";
import { processTokens } from "src/utils/jwt";
import { useSnackbar } from "notistack";
import { MAIN_API } from "src/config";

// ----------------------------------------------------------------------

export default function Home() {

    const navigate = useNavigate();
    const { currentUser, isIOS, isPWA } = useContext(MetadataContext);
    const { apiCall } = useApiCall();
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Page title="Home">
            <Stack spacing={6} width={'100%'} justifyContent={'center'} alignItems={'center'}>
            </Stack>
        </Page>
    );
};