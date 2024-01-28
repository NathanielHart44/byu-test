import {
    AppBar,
    Toolbar,
    useTheme
} from '@mui/material';
// components
import Logo from '../Logo';
import { NAVBAR } from 'src/config';

// ----------------------------------------------------------------------

export default function NavBar() {
    const theme = useTheme();

    return (
        <AppBar
            sx={{
                height: NAVBAR.BASE_HEIGHT,
                backgroundColor: '#202030',
            }}
        >
            <Toolbar 
              disableGutters={false}
              sx={{ 
                justifyContent: 'space-between', 
                px: theme.spacing(2)
              }}
            >
                <Logo />
            </Toolbar>
        </AppBar>
    );
};


// ----------------------------------------------------------------------

// interface Props {
//     window?: () => Window;
//     children: React.ReactElement;
// }

// function HideOnScroll(props: Props) {
//     const { children, window } = props;
//     const trigger = useScrollTrigger({
//         target: window ? window() : undefined,
//     });

//     return (
//         <Slide appear={false} direction="down" in={!trigger}>
//             {children}
//         </Slide>
//     );
// }