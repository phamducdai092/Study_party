import {useGroupStore} from "@/store/group.store.ts";
import {groupService} from "@/services/group.service.ts";

export async function bootstrapGroups() {
    const [joinedRes, ownedRes] = await Promise.all([
        groupService.getRoomsUserJoined({ page: 0, size: 4, sort: 'createdAt' }),
        groupService.getRoomsUserOwned({ page: 0, size: 4, sort: 'createdAt' }),
    ]);

    const { setRoomsUserJoined, setRoomsUserOwned } = useGroupStore.getState();

    // Lưu vào store để Dashboard dùng
    setRoomsUserJoined(joinedRes?.data ?? []);
    setRoomsUserOwned(ownedRes?.data ?? []);
}