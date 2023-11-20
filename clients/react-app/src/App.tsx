import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/tiptap/styles.css";

import "./App.css";

import { MantineProvider, createTheme } from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Route, Switch } from "wouter";

import { VideoEditorPage } from "@/pages/VideoEditorPage";
import { VideoGallery } from "@/pages/VideoGalleryPage";

const theme = createTheme({
  /** Put your mantine theme override here */
});

const queryClient = new QueryClient();

const App = () => {
  const pinned = useHeadroom({ fixedAt: 120 });

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
       
            <Switch>
              <Route path="/editor/videos" component={VideoGallery} />
              <Route
                path="/editor/videos/:video_id"
                component={VideoEditorPage}
              ></Route>
            </Switch>
        
      </QueryClientProvider>
    </MantineProvider>
  );
};

export default App;
