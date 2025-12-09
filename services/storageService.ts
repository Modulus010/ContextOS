/**
 * 云存储服务客户端
 * 
 * 提供与后端云存储 API 交互的方法
 */

export interface StorageData {
    tasks: any[];
    focusSessions: any[];
    transactions: any[];
    journalEntries: any[];
}

export interface StorageSaveResult {
    success: boolean;
    storageId: string;
    timestamp: string;
    dataSize: number;
}

export interface StorageLoadResult {
    userId: string;
    storageId: string;
    data: StorageData;
    lastModified: string;
}

/**
 * 保存数据到云端
 */
export const saveToCloud = async (
    userId: string,
    data: StorageData
): Promise<StorageSaveResult> => {
    try {
        const response = await fetch('/api/storage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, data }),
        });

        if (!response.ok) {
            throw new Error('Failed to save to cloud');
        }

        return await response.json();
    } catch (error) {
        console.error('Save to cloud error:', error);
        throw error;
    }
};

/**
 * 从云端加载数据
 */
export const loadFromCloud = async (
    userId: string,
    storageId?: string
): Promise<StorageLoadResult> => {
    try {
        const params = new URLSearchParams({ userId });
        if (storageId) {
            params.append('storageId', storageId);
        }

        const response = await fetch(`/api/storage?${params.toString()}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error('Failed to load from cloud');
        }

        return await response.json();
    } catch (error) {
        console.error('Load from cloud error:', error);
        throw error;
    }
};

/**
 * 从云端删除数据
 */
export const deleteFromCloud = async (
    userId: string,
    storageId: string
): Promise<{ success: boolean; message: string }> => {
    try {
        const params = new URLSearchParams({ userId, storageId });

        const response = await fetch(`/api/storage?${params.toString()}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete from cloud');
        }

        return await response.json();
    } catch (error) {
        console.error('Delete from cloud error:', error);
        throw error;
    }
};

/**
 * 自动同步数据到云端（防抖）
 */
let syncTimeout: NodeJS.Timeout | null = null;

export const autoSyncToCloud = (
    userId: string,
    data: StorageData,
    delayMs: number = 5000
): void => {
    if (syncTimeout) {
        clearTimeout(syncTimeout);
    }

    syncTimeout = setTimeout(async () => {
        try {
            await saveToCloud(userId, data);
            console.log('Data auto-synced to cloud');
        } catch (error) {
            console.error('Auto-sync failed:', error);
        }
    }, delayMs);
};
