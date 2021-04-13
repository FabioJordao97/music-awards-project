import { Show, WeekDay, ShowOutputDTO } from "../business/entities/Show";
import { CustomError } from "../business/error/CustomError";
import { bandRouter } from "../controller/routes/bandRouter";
import { BaseDatabase } from "../data/BaseDatabase";

export class ShowDatabase extends BaseDatabase {
  public async createShow(show: Show): Promise<void> {
    try {
      await BaseDatabase.connection
        .insert(show)
        .into(this.tableNames.shows);
    } catch (error) {
      throw new CustomError(500, "An unexpected error ocurred");
    }
  }

  public async getShowsByTimes(
    week_day: WeekDay,
    start_time: number,
    end_time: number
  ): Promise<any> {
    const shows = await BaseDatabase.connection
      .select("*")
      .where("end_time", ">", `${start_time}`)
      .andWhere("start_time", "<", `${end_time}`)
      .from(this.tableNames.shows);

    return shows.map((show: any) => {
      return {
        id: show.id,
        band_id: show.band_id,
        start_time: show.start_time,
        end_time: show.end_time,
        week_day: show.week_day,
      };
    });
  }

  public async getShowByDay(day: WeekDay): Promise<ShowOutputDTO[]> {
    const shows = await BaseDatabase.connection
      .from(`${this.tableNames.shows} as show`)
      .join(`${this.tableNames.bands} as band`, "show.band_id", "band.id")
      .select("band.name", "band.music_genre")
      .where({ week_day: day })
      .orderBy("start_time");

    if (!shows.length) {
      throw new CustomError(404, `Unbale to found shows at ${day} `);
    }

    return (shows)
  }
}
