import {useGroupStore} from "@/store/group.store.ts";
import {getRoomsUserJoined, getRoomsUserOwned} from "@/services/group.service.ts";

export async function bootstrapGroups() {
    const userJoinedRooms = await getRoomsUserJoined();
    const userOwnedRooms = await getRoomsUserOwned();

    useGroupStore.getState().setRoomsUserJoined(userJoinedRooms);
    useGroupStore.getState().setRoomUserOwned(userOwnedRooms);

}