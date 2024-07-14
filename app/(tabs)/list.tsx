import React, { useEffect, useState } from 'react';
import { StyleSheet, Button, FlatList, View, Text, TextInput } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import GroceryDatabase, { List } from '@/database/Database';

const TabThreeScreen: React.FC = () => {
    const [lists, setLists] = useState<List[]>([]);
    const [newListName, setNewListName] = useState('');

    useEffect(() => {
        GroceryDatabase.init();
    }, []);

    const loadLists = async () => {
        try {
            const fetchedLists = await GroceryDatabase.fetchLists();
            setLists(fetchedLists);
        } catch (error) {
            console.error("Failed to fetch lists:", error);
        }
    };

    const handleAddList = async () => {
        if (newListName.trim()) {
            await GroceryDatabase.addList(newListName.trim());
            setNewListName('');
            loadLists();
        }
    };

    const handleDeleteList = async (id: number) => {
        await GroceryDatabase.deleteList(id);
        loadLists();
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#f5cb69', dark: '#353636' }}
            headerImage={<Ionicons name="cart" size={310} style={styles.headerImage} />}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Lists</ThemedText>
                </ThemedView>
                <ThemedView style={styles.inputContainer}>
                    <TextInput
                        placeholder="Add new list"
                        value={newListName}
                        onChangeText={setNewListName}
                        style={styles.input}
                    />
                    <Button title="Add List" onPress={handleAddList} />
            </ThemedView>
            <ThemedView>
            <FlatList
              data={lists}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.listText}>{item.name}</Text>
                  <Button title="Delete" onPress={() => handleDeleteList(item.id)} />
                </View>
              )}
            />
            </ThemedView>
        </ParallaxScrollView>
    );
};

const styles = StyleSheet.create({
    headerImage: {
        color: '#b88716',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    listText: {
        fontSize: 18,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        padding: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default TabThreeScreen;
