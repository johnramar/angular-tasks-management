/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Category {
    id?: string,
    title?: string,
    description?: string
}
export interface UserList {
    role: string,
    email: string,
    id?: string,
    name: string
}

export interface task {
    id: string,
    title: string,
    description: string,
    dueDate: string,
    priority: string,
    status: string,
    assignTo: string,
    categoryId: string
}

export interface deleteConfirmationDialogData {
    message: string;
    confirm: string;
}
export interface addEditTask {
    title: string;
    taskInfo?: any;
    isEditable: boolean;
}