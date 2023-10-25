import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import '@mantine/tiptap/styles.css';

import "./App.css";

import { AppShell, MantineProvider, createTheme, rem } from "@mantine/core";
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


import { Route, Switch } from 'wouter';

import { IconMenu2 } from "@tabler/icons-react";
import { VideoEditorPage } from "./pages/VideoEditorPage";
import { VideoGallery } from "./pages/VideoGalleryPage";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const queryClient = new QueryClient()




const App = () => {

  const pinned = useHeadroom({ fixedAt: 120 });

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);


  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen />
        <AppShell
          header={{ height: 60, collapsed: !pinned, offset: false }}
          padding="md"
          navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
          }}
          transitionDuration={500}
          transitionTimingFunction="ease"
        >
          <AppShell.Header>
            <IconMenu2 onClick={toggleDesktop} />
          </AppShell.Header>
          <AppShell.Navbar>
            <IconMenu2 onClick={toggleDesktop} />
          </AppShell.Navbar>
          <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>




            <Switch>
              <Route path="/editor/videos" component={VideoGallery} />
              <Route path="/editor/videos/:video_id" component={VideoEditorPage}>
              </Route>

            </Switch>



          </AppShell.Main>
        </AppShell>

      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
