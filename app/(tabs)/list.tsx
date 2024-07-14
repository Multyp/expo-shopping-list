import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Button,
  FlatList,
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import GroceryDatabase, { Item, List } from "@/database/Database";

const TabThreeScreen: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [newListName, setNewListName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    GroceryDatabase.init();
    loadLists();
  }, []);

  const loadLists = async () => {
    const fetchedLists = await GroceryDatabase.fetchLists();
    setLists(fetchedLists);
  };

  const handleAddList = async () => {
    if (newListName.trim()) {
      await GroceryDatabase.addList(newListName.trim());
      setNewListName("");
      loadLists();
    }
  };

  const handleDeleteList = async (id: number) => {
    await GroceryDatabase.deleteList(id);
    loadLists();
  };

  const handleSelectList = async (list: List) => {
    const fetchedItems = await GroceryDatabase.fetchItems(list.id);
    setSelectedList(list);
    setItems(fetchedItems);
    setModalVisible(true);
  };

  const handleAddItem = async () => {
    if (newItemText.trim() && selectedList) {
      await GroceryDatabase.addItem(selectedList.id, newItemText.trim());
      setNewItemText("");
      handleSelectList(selectedList); // Refresh the list
    }
  };

  const handleDeleteItem = async (id: number) => {
    await GroceryDatabase.deleteItem(id);
    if (selectedList) {
      handleSelectList(selectedList); // Refresh the list
    }
  };

  const handleToggleItemChecked = async (item: Item) => {
    await GroceryDatabase.updateItem(item.id, !item.checked);
    if (selectedList) {
      handleSelectList(selectedList); // Refresh the list
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#f5cb69", dark: "#353636" }}
      headerImage={
        <Ionicons
          name="cart"
          size={310}
          style={styles.headerImage}
        />
      }
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
        <Button
          title="Add List"
          onPress={handleAddList}
        />
      </ThemedView>
      <FlatList
        data={lists}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text
              style={styles.listText}
              onPress={() => handleSelectList(item)}
            >
              {item.name}
            </Text>
            <Button
              title="Delete"
              onPress={() => handleDeleteList(item.id)}
            />
          </View>
        )}
      />
      {selectedList && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <ParallaxScrollView
            headerBackgroundColor={{ light: "#94f28f", dark: "#353636" }}
            headerImage={
              <Ionicons
                name="pricetags"
                size={310}
                style={styles.modalImage}
              />
            }
          >
            <ThemedText type="title">{selectedList.name} - Items</ThemedText>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Add new item"
                value={newItemText}
                onChangeText={setNewItemText}
                style={styles.input}
              />
              <Button
                title="Add Item"
                onPress={handleAddItem}
              />
            </View>
            {items.map(item => (
              <View
                key={item.id}
                style={styles.itemContainer}
              >
                <TouchableOpacity onPress={() => handleToggleItemChecked(item)}>
                  <Ionicons
                    name={item.checked ? "checkbox" : "square-outline"}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
                <Text style={styles.itemText}>{item.text}</Text>
                <TouchableOpacity onPress={() => handleDeleteItem(item.id)}>
                  <Ionicons
                    name="trash-bin"
                    size={24}
                    color="red"
                  />
                </TouchableOpacity>
              </View>
            ))}
            <Button
              title="Close"
              onPress={() => setModalVisible(false)}
            />
          </ParallaxScrollView>
        </Modal>
      )}
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  headerImage: {
    color: "#b88716",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  modalImage: {
    color: "#44963f",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
  },
  listText: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  modalContent: {
    padding: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
  },
  itemText: {
    flex: 1,
    marginLeft: 10,
  },
});

export default TabThreeScreen;
