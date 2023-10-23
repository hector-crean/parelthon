import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";

import "./App.css";

import { VideoForm2 } from "./component/VideoForm2";

const theme = createTheme({
  /** Put your mantine theme override here */
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <div className="container">
        <VideoForm2 />
      </div>
    </MantineProvider>
  );
}

export default App;
