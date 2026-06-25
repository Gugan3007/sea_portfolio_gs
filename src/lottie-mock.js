// Mock/Stub for lottie-web used to resolve three-stdlib's unresolved import of lottie.js
const lottie = {
  loadAnimation: () => ({
    addEventListener: () => {},
    container: null,
  }),
};

export default lottie;
