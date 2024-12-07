import CracoLessPlugin from "craco-less";

export const plugins = [
  {
    plugin: CracoLessPlugin,
    options: {
      lessLoaderOptions: {
        lessOptions: {
          modifyVars: {
            "@menu-dark-color": "#000", // Change text color
            "@menu-dark-highlight-color": "#333", // Optional hover color
          },
          javascriptEnabled: true,
        },
      },
    },
  },
];
