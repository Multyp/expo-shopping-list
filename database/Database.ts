import * as SQLite from 'expo-sqlite';

export interface List {
    id: number, name: string
}

/**
 * Manages database operations for a grocery application, including managing lists
 * and items within those lists.
 */
class GroceryDatabase {
    private db: SQLite.SQLiteDatabase | null = null;

    /**
     * Initializes the database, creates necessary tables if they do not already exist,
     * and sets up foreign keys with cascade delete options to maintain integrity.
     * 
     * @throws {Error} Throws an error if database initialization fails.
     */
    async init(): Promise<void> {
        try {
            this.db = await SQLite.openDatabaseAsync('grocery.db');
            await this.db.execAsync(`
                PRAGMA foreign_keys = ON;
                CREATE TABLE IF NOT EXISTS lists (
                    id INTEGER PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS items (
                    id INTEGER PRIMARY KEY NOT NULL,
                    listId INTEGER,
                    text TEXT NOT NULL,
                    checked INTEGER DEFAULT 0,
                    FOREIGN KEY (listId) REFERENCES lists(id) ON DELETE CASCADE
                );
            `);
        } catch (error) {
            console.error('SQLite Error: ', error);
            throw new Error('Failed to initialize database');
        }
    }

    /**
     * Adds a new list to the database with the given name.
     * 
     * @param {string} name - The name of the list to be added.
     * @throws {Error} Throws an error if the list could not be added.
     */
    async addList(name: string): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        try {
            await this.db.runAsync('INSERT INTO lists (name) VALUES (?);', [name]);
        } catch (error) {
            console.error('Error adding list: ', error);
            throw error;
        }
    }

    /**
     * Adds an item to the specified list.
     * 
     * @param {number} listId - The ID of the list to which the item will be added.
     * @param {string} text - The text description of the item.
     * @throws {Error} Throws an error if the item could not be added.
     */
    async addItem(listId: number, text: string): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        try {
            await this.db.runAsync('INSERT INTO items (listId, text) VALUES (?, ?);', [listId, text]);
        } catch (error) {
            console.error('Error adding item: ', error);
            throw error;
        }
    }

    /**
     * Updates the checked status of a specified item.
     * 
     * @param {number} id - The ID of the item to update.
     * @param {boolean} checked - The new checked status of the item.
     * @throws {Error} Throws an error if the item's status could not be updated.
     */
    async updateItem(id: number, checked: boolean): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        try {
            await this.db.runAsync('UPDATE items SET checked = ? WHERE id = ?;', [checked ? 1 : 0, id]);
        } catch (error) {
            console.error('Error updating item: ', error);
            throw error;
        }
    }

    /**
     * Fetches all items associated with a specified list ID.
     * 
     * @param {number} listId - The ID of the list whose items are to be fetched.
     * @returns {Promise<Array<{id: number, listId: number, text: string, checked: number}>>} A promise that resolves to an array of items.
     * @throws {Error} Throws an error if the items could not be fetched.
     */
    async fetchItems(listId: number): Promise<Array<{id: number, listId: number, text: string, checked: number}>> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        try {
            return await this.db.getAllAsync<{id: number, listId: number, text: string, checked: number}>('SELECT * FROM items WHERE listId = ?;', [listId]);
        } catch (error) {
            console.error('Error fetching items: ', error);
            throw error;
        }
    }

    /**
     * Fetches all lists from the database.
     * 
     * This method retrieves all the lists stored in the database, providing the ID and name
     * for each list. It can be used to display a summary of all available lists or to select
     * a list to view or edit its items.
     * 
     * @returns {Promise<Array<{id: number, name: string}>>} A promise that resolves to an array of lists.
     * @throws {Error} Throws an error if the lists could not be fetched or if the database has not been initialized.
     */
    async fetchLists(): Promise<Array<{id: number, name: string}>> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        try {
            return await this.db.getAllAsync<{id: number, name: string}>('SELECT id, name FROM lists;');
        } catch (error) {
            console.error('Error fetching lists: ', error);
            throw error;
        }
    }

    /**
     * Deletes an item from the database based on its ID.
     * 
     * @param {number} id - The ID of the item to delete.
     * @throws {Error} Throws an error if the item could not be deleted.
     */
    async deleteItem(id: number): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        try {
            await this.db.runAsync('DELETE FROM items WHERE id = ?;', [id]);
        } catch (error) {
            console.error('Error deleting item: ', error);
            throw error;
        }
    }

    /**
     * Deletes a list and all associated items from the database.
     * 
     * @param {number} listId - The ID of the list to delete.
     * @throws {Error} Throws an error if the list could not be deleted.
     */
    async deleteList(listId: number): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }
        try {
            await this.db.runAsync('DELETE FROM lists WHERE id = ?;', [listId]);
        } catch (error) {
            console.error('Error deleting list: ', error);
            throw error;
        }
    }
}

export default new GroceryDatabase();
