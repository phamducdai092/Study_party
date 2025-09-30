import {create} from "zustand";
import type {Room, RoomState} from "@/types/group.type.ts";

export const useGroupStore = create<RoomState>(() => ({
        userRoomsJoined: [],
        userRoomsOwned: [],

        setRoomsUserJoined: (rooms: Room[]) => {
            useGroupStore.setState({userRoomsJoined: rooms});
        },
        setRoomUserOwned: (rooms: Room[]) => {
            useGroupStore.setState({userRoomsOwned: rooms})
        }
    })
);