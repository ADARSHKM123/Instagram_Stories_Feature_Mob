import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Dimensions, Modal, Animated, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import GradientCircle from './GradientCircle';

interface Story {
  id: number;
  uri: string;
}

const App = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;
    const loadStories = async () => {
      try {
        const data = await require('./stories.json');
        if (isMounted) setStories(data.stories);
      } catch (error) {
        console.error('Failed to load stories:', error);
      }
    };
    loadStories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedIndex !== null) {
      Animated.timing(progress, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) handleNext();
      });
    }
  }, [selectedIndex]);

  const handleStoryPress = (index: number) => setSelectedIndex(index);
  const handleClose = () => setSelectedIndex(null);

  const handleNext = () => {
    if (selectedIndex === null) return;
    if (selectedIndex < stories.length - 1) {
      progress.setValue(0);
      setSelectedIndex(prev => (prev || 0) + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (selectedIndex === null || selectedIndex === 0) return;
    progress.setValue(0);
    setSelectedIndex(prev => (prev || 0) - 1);
  };

  const renderItem = ({ item, index }: { item: Story; index: number }) => (
    <TouchableOpacity
      onPress={() => handleStoryPress(index)}
      testID={`story-thumbnail-${index}`}
    >
      <GradientCircle>
        <Image
          source={{ uri: item.uri }}
          style={{ width: 74, height: 74, borderRadius: 37 }}
        />
      </GradientCircle>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Instagram</Text>
      </View>
      <FlatList
        data={stories}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <Modal visible={selectedIndex !== null} transparent testID="story-viewer">
        {selectedIndex !== null && (
          <View style={{ flex: 1, backgroundColor: 'black' }}>
            {/* Progress Bar */}
            <View style={{ flexDirection: 'row', padding: 10 }}>
              {stories.map((_, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: 2,
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    marginHorizontal: 2,
                  }}>
                  {i === selectedIndex && (
                    <Animated.View
                      style={{
                        flex: 1,
                        backgroundColor: 'white',
                        width: progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%'],
                        }),
                      }}
                    />
                  )}
                </View>
              ))}
            </View>
            <View style={{ position: 'absolute', top: 50, right: 20, zIndex: 1 }}>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Text style={styles.closeText}>×</Text>
              </TouchableOpacity>
            </View>
            <TouchableWithoutFeedback onPress={handleClose}>
              <Image
                source={{ uri: stories[selectedIndex].uri }}
                style={{
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height - 50,
                  resizeMode: 'contain',
                }}
              />
            </TouchableWithoutFeedback>

            <View style={{ position: 'absolute', flexDirection: 'row', top: 0, bottom: 0, left: 0, right: 0 }}>
              <TouchableWithoutFeedback onPress={handlePrev}>
                <View style={{ flex: 1 }} />
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={handleNext}>
                <View style={{ flex: 1 }} />
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 8,
    alignItems: 'left',
    fontFamily: 'InstagramSans',
  },
  headerText: {
    fontFamily: 'InstagramSans',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    margin: 8,
  },
  closeButton: {
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#949494',
    fontSize: 24,
    lineHeight: 26,
  },
});

export default App;
