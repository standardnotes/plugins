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

export const isDarkTheme = () => {
  // Select the root element
  const root = document.querySelector(':root');

// Get the computed styles of the root element
  const computedStyles = getComputedStyle(root);

// Get the value of a specific CSS variable
  const backgroundColor = computedStyles.getPropertyValue('--sn-stylekit-background-color').trim();

// Convert the hex color to RGB
  const rgb = parseInt(backgroundColor.substring(1), 16);   // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff;  // extract red
  const g = (rgb >>  8) & 0xff;  // extract green
  const b = (rgb >>  0) & 0xff;  // extract blue

// Calculate the brightness of the color
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

// Determine whether the theme is light or dark based on the brightness of the color
  return brightness < 128;
}
