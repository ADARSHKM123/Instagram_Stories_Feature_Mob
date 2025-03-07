jest.mock('react-native/Libraries/Interaction/InteractionManager', () => ({
    runAfterInteractions: (callback) => {
      if (!callback) return { then: () => {} };
      return { then: callback };
    },
  }));