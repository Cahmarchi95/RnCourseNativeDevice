import * as SQLite from "expo-sqlite";
import { Place } from "../models/place";

const db = SQLite.openDatabaseSync("places");
export const init = async () => {
  await db.execAsync(`
        CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        imageUri TEXT NOT NULL,
        address TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL
        )
    `);
};

export const insertPlace = async (place) => {
  const result = await db.runAsync(
    "INSERT INTO places (title, imageUri, address, lat, lng) VALUES (?, ?, ?, ?, ?)",
    [
      place.title,
      place.imageUri,
      place.address,
      place.location.lat,
      place.location.lng,
    ]
  );
  return result;
};

export const fetchPlaces = async () => {
  const placesArray = [];
  const places = await db.getAllAsync("SELECT * FROM places");
  places.forEach((place) =>
    placesArray.push(
      new Place(
        place.title,
        place.imageUri,
        { address: place.address, latitude: place.lat, longitude: place.lng },
        place.id
      )
    )
  );
  return placesArray;
};

export const fetchPlaceDetails = async (id) => {
  const stmt = await db.prepareAsync("SELECT * FROM places WHERE id = $id");
  const result = await stmt.executeAsync({ $id: id });
  const firstRow = await result.getFirstAsync();
  await result.resetAsync();
  return firstRow;
};

// export const deletePlace = (id) => {
//   const promise = new Promise((resolve, reject) => {
//     database.transaction((tx) => {
//       tx.executeSql(
//         `delete from places where id = ?;`,
//         [id],
//         (_, result) => {
//           resolve(result);
//         },
//         (_, error) => {
//           reject(error);
//         }
//       );
//     });
//   });

//   return promise;
// };
