export const parseEditorData = (text: string) => {
  if (text.indexOf('{') === 0) {
    try {
      const parsedData = JSON.parse(text);
      if (parsedData.elements && parsedData.appState) {
        return parsedData;
      }
    } catch (e) {
      console.error(e);
    }
  }
};

export const createNewData = () => {
  return {
    elements: [],
    appState: {},
    scrollToContent: true
  };
};
