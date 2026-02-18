import { makeAutoObservable } from "mobx";
import { type TrackingObject } from "@shared/types";

const LOST_OBJECT_TTL_MS = 5 * 60 * 1000;
const LOST_OBJECTS = "lost_objects";

export class TrackingStore {
  trackingObjects: TrackingObject[] = [];
  lostObjectsList: TrackingObject[] = [];
  private lostRemovalTimers = new Map<string, ReturnType<typeof setTimeout>>();

  constructor() {
    makeAutoObservable(this);
  }

  private clearAllLostTimers() {
    for (const timer of this.lostRemovalTimers.values()) {
      clearTimeout(timer);
    }
    this.lostRemovalTimers.clear();
  }

  private clearLostTimer(id: string) {
    const existingTimer = this.lostRemovalTimers.get(id);
    if (!existingTimer) {
      return;
    }

    clearTimeout(existingTimer);
    this.lostRemovalTimers.delete(id);
  }

  private startLostTimer(id: string) {
    if (this.lostRemovalTimers.has(id)) {
      return;
    }

    const timer = setTimeout(() => {
      this.lostObjectsList = this.lostObjectsList.filter(
        (obj) => obj.id !== id,
      );
      this.lostRemovalTimers.delete(id);
    }, LOST_OBJECT_TTL_MS);

    this.lostRemovalTimers.set(id, timer);
  }

  private getLostObjectsFromLocalStorage() {
    const data = localStorage.getItem(LOST_OBJECTS);

    return data ? JSON.parse(data) : [];
  }

  private setLostObjectsToLocalStorage(lost: TrackingObject[]) {
    localStorage.setItem(LOST_OBJECTS, JSON.stringify(lost));
  }

  setInitialData(data: TrackingObject[]) {
    this.clearAllLostTimers();
    this.trackingObjects = data;
    this.lostObjectsList = this.getLostObjectsFromLocalStorage();
  }

  updateData(data: TrackingObject[]) {
    const previousActiveObjects = this.trackingObjects;
    const previosLostObjects = this.lostObjectsList;

    const nextActiveIds = new Set(data.map((obj) => obj.id));
    const lostIds = new Set(previosLostObjects.map((obj) => obj.id));

    const nextLostObjectsList = previosLostObjects.filter((lostObject) => {
      const isObjectBackOnline = nextActiveIds.has(lostObject.id);

      if (isObjectBackOnline) {
        this.clearLostTimer(lostObject.id);
      }

      return !isObjectBackOnline;
    });

    for (const activeObject of previousActiveObjects) {
      const disappeared = !nextActiveIds.has(activeObject.id);

      if (!disappeared || lostIds.has(activeObject.id)) {
        continue;
      }

      nextLostObjectsList.push({
        ...activeObject,
        status: "lost",
        lastUpdate: Date.now(),
      });

      this.startLostTimer(activeObject.id);
    }

    this.trackingObjects = data;
    this.lostObjectsList = nextLostObjectsList;
    this.setLostObjectsToLocalStorage(nextLostObjectsList);
  }

  reset() {
    this.clearAllLostTimers();
    this.trackingObjects = [];
    this.lostObjectsList = [];
    localStorage.removeItem(LOST_OBJECTS);
  }
}

export const trackingStore = new TrackingStore();
