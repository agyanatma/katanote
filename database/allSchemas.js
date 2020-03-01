export const BOARD_SCHEMA = 'board';
export const CATEGORY_SCHEMA = 'category';
export const PRODUCT_SCHEMA = 'product';
export const DETAIL_SCHEMA = 'detail';
export const NOTE_SCHEMA = 'note';
export const CHECKLIST_SCHEMA = 'checklist';

export const BoardSchema = {
    name: BOARD_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        description: 'string?',
        categories: { type: 'list', objectType: CATEGORY_SCHEMA } //category relation
    }
};

export const CategorySchema = {
    name: CATEGORY_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        products: { type: 'list', objectType: PRODUCT_SCHEMA } //product relation
    }
};

export const ProductSchema = {
    name: PRODUCT_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        description: 'string?',
        image: 'string?',
        details: { type: 'list', objectType: DETAIL_SCHEMA } //detail relation
    }
};

export const DetailSchema = {
    name: DETAIL_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        attribute: 'string',
        value: 'string',
        notes: { type: 'list', objectType: NOTE_SCHEMA }, //note relation
        checklists: { type: 'list', objectType: CHECKLIST_SCHEMA } //checklist relation
    }
};

export const NoteSchema = {
    name: NOTE_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        value: 'string',
        
    }
};

export const ChecklistSchema = {
    name: CHECKLIST_SCHEMA,
    primaryKey: 'id',
    properties: {
        id: 'int',
        value: 'string',
        
    }
};

export const databaseOptions = {
    path: 'katanote.realm',
    schema: [
        BoardSchema, CategorySchema, ProductSchema, DetailSchema, NoteSchema, ChecklistSchema
    ],
    schemaVersion: 1
};